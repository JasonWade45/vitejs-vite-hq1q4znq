// ============================================================================
// /api/quotes — same-origin Vercel serverless quote proxy.
// The browser calls `/api/quotes?symbols=A,B,…` on THIS deployment, so:
//   • no CORS (same origin)          • no third-party proxy in the middle
//   • no API keys                    • no crumb (spark/v8/stooq are auth-free)
// Tier order: Yahoo spark (query1 → query2) → Yahoo v8 per symbol
//   (query1 → query2) → stooq.com CSV batch (best-effort for US/LSE/EGX).
// Hardening: strict symbol charset, max 30 symbols, 7s upstream timeout,
// 15s shared edge cache (s-maxage) to protect upstreams from rate-limiting.
// ============================================================================

const ALLOWED_SYMBOL = /^[A-Za-z0-9.^\-=_]{1,15}$/;
const TIMEOUT_MS = 7000;
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

async function fetchText(url) {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { 'User-Agent': UA, Accept: 'application/json, text/plain, */*' }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function fetchJson(url) {
  return JSON.parse(await fetchText(url));
}

// ── spark batch parser ───────────────────────────────────────────────────────
function parseSpark(data) {
  const quotes = [];
  const result = data?.spark?.result;
  if (!Array.isArray(result)) return quotes;
  for (const r of result) {
    const meta = r?.response?.[0]?.meta;
    const price = Number(meta?.regularMarketPrice);
    if (!r?.symbol || !Number.isFinite(price) || price <= 0) continue;
    const tsArr = r?.response?.[0]?.timestamp;
    const time = Number(meta?.regularMarketTime)
      ? Number(meta.regularMarketTime) * 1000
      : Array.isArray(tsArr) && tsArr.length
        ? Number(tsArr[tsArr.length - 1]) * 1000
        : Date.now();
    quotes.push({ symbol: r.symbol, price, time, marketState: meta?.marketState || null });
  }
  return quotes;
}

async function fetchSparkBatch(tickers, host) {
  const url = `https://${host}.finance.yahoo.com/v7/finance/spark?symbols=${encodeURIComponent(
    tickers.join(',')
  )}&range=1d`;
  return parseSpark(await fetchJson(url));
}

// ── v8 chart parser ──────────────────────────────────────────────────────────
async function fetchV8One(ticker, host) {
  const data = await fetchJson(
    `https://${host}.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      ticker
    )}?range=1d&interval=1d`
  );
  const meta = data?.chart?.result?.[0]?.meta;
  const price = Number(meta?.regularMarketPrice);
  if (!Number.isFinite(price) || price <= 0) return null;
  return {
    symbol: ticker,
    price,
    time: Number(meta?.regularMarketTime) ? Number(meta.regularMarketTime) * 1000 : Date.now(),
    marketState: meta?.marketState || null
  };
}

// ── stooq.com CSV (US/LSE/EGX best-effort) ──────────────────────────────────
// Yahoo suffix → stooq suffix. Unverified mappings may simply miss — those
// symbols will be absent from the result, never fabricated.
function toStooqSymbol(ticker) {
  const t = ticker.toLowerCase();
  if (/^[a-z][a-z0-9.-]*$/.test(t) && !t.includes('.')) return `${t}.us`;
  if (t.endsWith('.l')) return `${t.slice(0, -2)}.uk`;
  if (t.endsWith('.ca')) return `${t.slice(0, -3)}.eg`;   // EGX — best effort
  if (t.endsWith('.de')) return `${t.slice(0, -3)}.de`;
  if (t.endsWith('.pa')) return `${t.slice(0, -3)}.fr`;
  if (t.endsWith('.as')) return `${t.slice(0, -3)}.nl`;
  if (t.endsWith('.mi')) return `${t.slice(0, -3)}.it`;
  if (t.startsWith('^')) return null; // indices not mapped
  return null;
}

function fromStooqSymbol(s) {
  const t = s.toLowerCase();
  if (t.endsWith('.us')) return t.slice(0, -3).toUpperCase();
  if (t.endsWith('.uk')) return `${t.slice(0, -3).toUpperCase()}.L`;
  if (t.endsWith('.eg')) return `${t.slice(0, -3).toUpperCase()}.CA`;
  if (t.endsWith('.de')) return `${t.slice(0, -3).toUpperCase()}.DE`;
  if (t.endsWith('.fr')) return `${t.slice(0, -3).toUpperCase()}.PA`;
  if (t.endsWith('.nl')) return `${t.slice(0, -3).toUpperCase()}.AS`;
  if (t.endsWith('.it')) return `${t.slice(0, -3).toUpperCase()}.MI`;
  return null;
}

async function fetchStooqBatch(tickers) {
  const map = [];
  for (const t of tickers) {
    const s = toStooqSymbol(t);
    if (s) map.push({ yahoo: t, stooq: s });
  }
  if (!map.length) return [];
  const url = `https://stooq.com/q/l/?s=${map.map((m) => m.stooq).join(',')}&f=sd2t2ohlcv&h&e=csv`;
  const csv = await fetchText(url);
  const lines = csv.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const header = lines[0].toLowerCase().split(',');
  const idx = {
    symbol: header.indexOf('symbol'),
    date: header.indexOf('date'),
    time: header.indexOf('time'),
    close: header.indexOf('close')
  };
  const quotes = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    const close = Number(cols[idx.close]);
    const stooqSym = cols[idx.symbol];
    const yahooSym = fromStooqSymbol(stooqSym || '');
    if (!yahooSym || !Number.isFinite(close) || close <= 0) continue;
    const time = Date.parse(`${cols[idx.date]}T${cols[idx.time] || '00:00:00'}Z`);
    quotes.push({
      symbol: yahooSym,
      price: close,
      time: Number.isFinite(time) ? time : Date.now(),
      marketState: null
    });
  }
  return quotes;
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=30');
  try {
    const raw = String(req.query?.symbols || '');
    const tickers = [
      ...new Set(raw.split(',').map((t) => t.trim()).filter((t) => ALLOWED_SYMBOL.test(t)))
    ].slice(0, 30);
    if (!tickers.length) {
      res.status(400).json({ ok: false, error: 'invalid or missing symbols' });
      return;
    }
    const t0 = Date.now();

    // Tier 1 — spark batch (query1, then query2)
    for (const host of ['query1', 'query2']) {
      try {
        const quotes = await fetchSparkBatch(tickers, host);
        if (quotes.length > 0) {
          res.status(200).json({ ok: true, tier: `spark-${host}`, quotes, ms: Date.now() - t0 });
          return;
        }
      } catch {
        /* try next host */
      }
    }

    // Tier 2 — v8 chart per symbol, all in parallel (query1, then query2)
    for (const host of ['query1', 'query2']) {
      try {
        const settled = await Promise.allSettled(tickers.map((t) => fetchV8One(t, host)));
        const quotes = settled
          .filter((s) => s.status === 'fulfilled' && s.value)
          .map((s) => s.value);
        if (quotes.length > 0) {
          res.status(200).json({ ok: true, tier: `v8-${host}`, quotes, ms: Date.now() - t0 });
          return;
        }
      } catch {
        /* try next host */
      }
    }

    // Tier 3 — stooq.com CSV (best-effort, no auth)
    try {
      const quotes = await fetchStooqBatch(tickers);
      if (quotes.length > 0) {
        res.status(200).json({ ok: true, tier: 'stooq', quotes, ms: Date.now() - t0 });
        return;
      }
    } catch {
      /* fall through */
    }

    res.status(502).json({ ok: false, error: 'all upstream quote sources unreachable' });
  } catch {
    res.status(500).json({ ok: false, error: 'internal' });
  }
}
