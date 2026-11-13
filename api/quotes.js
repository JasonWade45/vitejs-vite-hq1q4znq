// ============================================================================
// /api/quotes — same-origin Vercel serverless quote proxy for Yahoo Finance.
// The browser calls `/api/quotes?symbols=A,B,…` on THIS deployment, so:
//   • no CORS (same origin)          • no third-party proxy in the middle
//   • no API keys                    • no crumb (spark/v8 are auth-free paths)
// Hardening: strict symbol charset, max 30 symbols, 7s upstream timeout,
// 15s shared edge cache (s-maxage) to protect Yahoo from rate-limiting.
// ============================================================================

const ALLOWED_SYMBOL = /^[A-Za-z0-9.^\-=_]{1,15}$/;
const TIMEOUT_MS = 7000;

async function fetchJson(url) {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      Accept: 'application/json'
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

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

async function fetchV8One(ticker) {
  const data = await fetchJson(
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
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

    // Tier 1 — spark batch (one call, no auth)
    try {
      const sparkUrl = `https://query1.finance.yahoo.com/v7/finance/spark?symbols=${encodeURIComponent(
        tickers.join(',')
      )}&range=1d`;
      const quotes = parseSpark(await fetchJson(sparkUrl));
      if (quotes.length > 0) {
        res.status(200).json({ ok: true, tier: 'spark', quotes, ms: Date.now() - t0 });
        return;
      }
    } catch {
      /* fall through to per-symbol v8 */
    }

    // Tier 2 — v8 chart per symbol, all in parallel
    const settled = await Promise.allSettled(tickers.map(fetchV8One));
    const quotes = settled
      .filter((s) => s.status === 'fulfilled' && s.value)
      .map((s) => s.value);
    if (quotes.length > 0) {
      res.status(200).json({ ok: true, tier: 'v8', quotes, ms: Date.now() - t0 });
      return;
    }
    res.status(502).json({ ok: false, error: 'yahoo unreachable from server' });
  } catch {
    res.status(500).json({ ok: false, error: 'internal' });
  }
}
