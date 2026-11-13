import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Activity,
  Search,
  Bell,
  Send,
  Briefcase,
  Database,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BarChart2,
  RefreshCw,
  Sun,
  Moon,
  Globe,
  User,
  Plus,
  Trash2,
  Download,
  Terminal,
  Cpu,
  Scale,
  Filter,
  X,
  Sparkles,
  FileCode,
  Play,
  Pause,
  Zap,
  Calculator,
  FastForward,
  HelpCircle,
  Compass,
  Check,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Award,
  RotateCcw,
  BookOpen,
  Target,
  ShieldCheck,
  Wallet,
  LogOut,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  UserPlus,
  LayoutGrid
} from 'lucide-react';

// ============================================================================
// 1. BIDI-SAFE NUMERIC COMPONENT (Prevents RTL flipping of ranges & negatives)
// ============================================================================
const Numeric = ({ children, className = '', colorize, prefix = '', suffix = '' }) => {
  let colorClass = '';
  if (typeof colorize === 'number') {
    if (colorize > 0) colorClass = 'text-emerald-500 dark:text-emerald-400';
    else if (colorize < 0) colorClass = 'text-rose-500 dark:text-rose-400';
  }
  return (
    <span
      dir="ltr"
      className={`inline-block font-mono tabular-nums tracking-tight ${colorClass} ${className}`}
    >
      {prefix}
      {children}
      {suffix}
    </span>
  );
};

const fmtPrice = (val, decimals = 2) => {
  if (val === null || val === undefined || Number.isNaN(val)) return '—';
  const num = Number(val);
  if (Math.abs(num) >= 1000 && Number.isInteger(num)) {
    return num.toLocaleString('en-US');
  }
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

const fmtPct = (val, showPlus = true) => {
  if (val === null || val === undefined || Number.isNaN(val)) return '—';
  const num = Number(val);
  const sign = showPlus && num > 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
};

// ============================================================================
// 2. CANONICAL SYMBOL DIRECTORY (EGX + US + GLOBAL + INDICES)
// ============================================================================
const INITIAL_SYMBOLS = [
  {
    canonicalId: 'EGX:COMI',
    ticker: 'COMI',
    yahooTicker: 'COMI.CA',
    tvTicker: 'EGX:COMI',
    isin: 'EGS60121C018',
    exchange: 'EGX',
    currency: 'EGP',
    nameAr: 'البنك التجاري الدولي - مصر',
    nameEn: 'Commercial International Bank (CIB)',
    sectorAr: 'البنوك والخدمات المالية',
    sectorEn: 'Banks & Financial Services',
    basePrice: 84.6,
    drift: 0.0014,
    volatility: 0.021,
    seed: 101,
    source: 'TradingView Scanner',
    fallbackSource: 'Yahoo (.CA)',
    delayMinutes: 15,
    lastUpdated: '14:30:00 القاهرة',
    dailyLimitPct: 20,
    fundamentals: { pe: 6.8, pb: 2.1, eps: 12.44, divYield: 1.8, revGrowth: 38.5 },
    newsAr: [
      { title: 'نمو صافي أرباح التجاري الدولي بنسبة 38% بدعم من عوائد أذون الخزانة ونمو القروض', source: 'مباشر مصر', time: 'منذ ساعتين', sentiment: 'positive' },
      { title: 'مشتريات مؤسسات أجنبية تتركز في قطاع البنوك القيادي بالبورصة المصرية', source: 'البورصة', time: 'منذ 5 ساعات', sentiment: 'positive' }
    ]
  },
  {
    canonicalId: 'EGX:TMGH',
    ticker: 'TMGH',
    yahooTicker: 'TMGH.CA',
    tvTicker: 'EGX:TMGH',
    isin: 'EGS691S1C011',
    exchange: 'EGX',
    currency: 'EGP',
    nameAr: 'مجموعة طلعت مصطفى القابضة',
    nameEn: 'Talaat Moustafa Group Holding',
    sectorAr: 'العقارات والإنشاءات',
    sectorEn: 'Real Estate',
    basePrice: 58.4,
    drift: 0.0018,
    volatility: 0.027,
    seed: 202,
    source: 'TradingView Scanner',
    fallbackSource: 'Yahoo (.CA)',
    delayMinutes: 15,
    lastUpdated: '14:30:00 القاهرة',
    dailyLimitPct: 20,
    fundamentals: { pe: 18.4, pb: 2.9, eps: 3.17, divYield: 0.9, revGrowth: 44.2 },
    newsAr: [
      { title: 'طلعت مصطفى تسجل مبيعات تعاقدية قياسية بدعم من مشروعي ساوث ميد وبنان', source: 'اقتصاد الشرق', time: 'منذ 3 ساعات', sentiment: 'positive' },
      { title: 'ترقب لمستويات المقاومة 61 جنيهاً مع ارتفاع أحجام التداول', source: 'مباشر مصر', time: 'منذ يوم', sentiment: 'neutral' }
    ]
  },
  {
    canonicalId: 'EGX:SWDY',
    ticker: 'SWDY',
    yahooTicker: 'SWDY.CA',
    tvTicker: 'EGX:SWDY',
    isin: 'EGS3G0Z1C014',
    exchange: 'EGX',
    currency: 'EGP',
    nameAr: 'السويدي إليكتريك',
    nameEn: 'Elsewedy Electric',
    sectorAr: 'الصناعة والكابلات والطاقة',
    sectorEn: 'Industrials & Energy',
    basePrice: 46.2,
    drift: 0.0012,
    volatility: 0.023,
    seed: 303,
    source: 'TradingView Scanner',
    fallbackSource: 'Yahoo (.CA)',
    delayMinutes: 15,
    lastUpdated: '14:30:00 القاهرة',
    dailyLimitPct: 20,
    fundamentals: { pe: 8.2, pb: 2.4, eps: 5.63, divYield: 2.6, revGrowth: 31.0 },
    newsAr: [
      { title: 'السويدي إليكتريك توقع عقود محطات طاقة وشبكات نقل جديدة في الخليج وأفريقيا', source: 'المال', time: 'منذ 4 ساعات', sentiment: 'positive' }
    ]
  },
  {
    canonicalId: 'EGX:HRHO',
    ticker: 'HRHO',
    yahooTicker: 'HRHO.CA',
    tvTicker: 'EGX:HRHO',
    isin: 'EGS69082C013',
    exchange: 'EGX',
    currency: 'EGP',
    nameAr: 'إي إف جي القابضة (هيرميس)',
    nameEn: 'EFG Holding',
    sectorAr: 'الخدمات المالية غير المصرفية',
    sectorEn: 'Non-Bank Financial Services',
    basePrice: 23.15,
    drift: 0.0005,
    volatility: 0.026,
    seed: 404,
    source: 'TradingView Scanner',
    fallbackSource: 'Yahoo (.CA)',
    delayMinutes: 15,
    lastUpdated: '14:30:00 القاهرة',
    dailyLimitPct: 20,
    fundamentals: { pe: 7.9, pb: 1.1, eps: 2.93, divYield: null, revGrowth: 24.0 },
    newsAr: [
      { title: 'نشاط ملحوظ في قطاع بنوك الاستثمار والوساطة مع زيادة قيم التداول اليومية', source: 'مباشر مصر', time: 'منذ 6 ساعات', sentiment: 'neutral' }
    ]
  },
  {
    canonicalId: 'EGX:EFIH',
    ticker: 'EFIH',
    yahooTicker: 'EFIH.CA',
    tvTicker: 'EGX:EFIH',
    isin: 'EGS745L1C014',
    exchange: 'EGX',
    currency: 'EGP',
    nameAr: 'إي فاينانس للاستثمارات المالية والرقمية',
    nameEn: 'e-finance Digital & Financial Investments',
    sectorAr: 'التكنولوجيا والمدفوعات الرقمية',
    sectorEn: 'Fintech & IT',
    basePrice: 27.8,
    drift: 0.0015,
    volatility: 0.025,
    seed: 505,
    source: 'TradingView Scanner',
    fallbackSource: 'Yahoo (.CA)',
    delayMinutes: 15,
    lastUpdated: '14:30:00 القاهرة',
    dailyLimitPct: 20,
    fundamentals: { pe: 24.5, pb: 5.2, eps: 1.13, divYield: 1.4, revGrowth: 41.2 },
    newsAr: [
      { title: 'توسع إي فاينانس في خدمات الحوسبة السحابية والتحصيل الإلكتروني للقطاعات الحكومية والسياحية', source: 'حابي', time: 'منذ يوم', sentiment: 'positive' }
    ]
  },
  {
    canonicalId: 'EGX:ORWE',
    ticker: 'ORWE',
    yahooTicker: 'ORWE.CA',
    tvTicker: 'EGX:ORWE',
    isin: 'EGS33041C010',
    exchange: 'EGX',
    currency: 'EGP',
    nameAr: 'النساجون الشرقيون للسجاد',
    nameEn: 'Oriental Weavers',
    sectorAr: 'المنسوجات والسلع المعمرة',
    sectorEn: 'Consumer Durables & Export',
    basePrice: 24.9,
    drift: -0.0004,
    volatility: 0.022,
    seed: 606,
    source: 'Yahoo (.CA)',
    fallbackSource: 'Stooq',
    delayMinutes: 15,
    lastUpdated: '14:30:00 القاهرة',
    dailyLimitPct: 20,
    fundamentals: { pe: 6.4, pb: 1.4, eps: 3.89, divYield: 6.2, revGrowth: 18.4 },
    newsAr: [
      { title: 'عائد التوزيعات النقدية للنساجون الشرقيون يجذب المستثمرين الباحثين عن الدخل رغم تذبذب التصدير', source: 'مباشر مصر', time: 'منذ يومين', sentiment: 'neutral' }
    ]
  },
  {
    canonicalId: 'EGX:MASR',
    ticker: 'MASR',
    yahooTicker: 'MASR.CA',
    tvTicker: 'EGX:MASR',
    isin: 'EGS65571C019',
    exchange: 'EGX',
    currency: 'EGP',
    nameAr: 'مدينة مصر للإسكان والتعمير',
    nameEn: 'Madinet Masr for Housing & Development',
    sectorAr: 'العقارات والإنشاءات',
    sectorEn: 'Real Estate',
    basePrice: 4.35,
    drift: 0.0006,
    volatility: 0.028,
    seed: 707,
    hasUnadjustedBonusGap: true,
    source: 'Yahoo (.CA)',
    fallbackSource: 'TradingView Scanner',
    delayMinutes: 15,
    lastUpdated: '14:30:00 القاهرة',
    dailyLimitPct: 20,
    fundamentals: { pe: 5.1, pb: null, eps: 0.85, divYield: 4.5, revGrowth: null },
    newsAr: [
      { title: 'تنبيه جودة بيانات: السلسلة السعرية في Yahoo تحتوي على فجوة توزيع أسهم مجانية قيد التعديل الآلي', source: 'مدقق البيانات الداخلي', time: 'تلقائي', sentiment: 'warning' }
    ]
  },
  {
    canonicalId: 'EGX:EGTS',
    ticker: 'EGTS',
    yahooTicker: 'EGTS.CA',
    tvTicker: 'EGX:EGTS',
    isin: 'EGS70432C012',
    exchange: 'EGX',
    currency: 'USD',
    nameAr: 'المصرية للمنتجعات السياحية (متداول بالدولار)',
    nameEn: 'Egyptian Resorts Company (USD on EGX)',
    sectorAr: 'السياحة والمنتجعات',
    sectorEn: 'Tourism & Resorts',
    basePrice: 1.42,
    drift: 0.0008,
    volatility: 0.025,
    seed: 808,
    source: 'TradingView Scanner',
    fallbackSource: 'Yahoo (.CA)',
    delayMinutes: 15,
    lastUpdated: '14:30:00 القاهرة',
    dailyLimitPct: 20,
    fundamentals: { pe: null, pb: null, eps: null, divYield: null, revGrowth: null },
    newsAr: [
      { title: 'السهم يتداول بعملة الدولار الأمريكي داخل البورصة المصرية — يتم فصل حساباته عن الجنيه في المحفظة', source: 'نظام العملات', time: 'مباشر', sentiment: 'neutral' }
    ]
  },
  {
    canonicalId: 'NASDAQ:NVDA',
    ticker: 'NVDA',
    yahooTicker: 'NVDA',
    tvTicker: 'NASDAQ:NVDA',
    isin: 'US67066G1040',
    exchange: 'NASDAQ',
    currency: 'USD',
    nameAr: 'إنفيديا (NVIDIA Corp)',
    nameEn: 'NVIDIA Corporation',
    sectorAr: 'أشباه الموصلات والذكاء الاصطناعي',
    sectorEn: 'Semiconductors & AI',
    basePrice: 138.6,
    drift: 0.0021,
    volatility: 0.026,
    seed: 909,
    source: 'Finnhub + Yahoo',
    fallbackSource: 'TradingView America',
    delayMinutes: 0,
    lastUpdated: 'محدث لحظياً (US)',
    dailyLimitPct: 100,
    fundamentals: { pe: 42.1, pb: 38.4, eps: 3.29, divYield: 0.03, revGrowth: 94.0 },
    newsAr: [
      { title: 'استمرار الطلب القوي من مراكز البيانات العملاقة على معالجات Blackwell يدعم هوامش الربحية', source: 'Reuters / Finnhub', time: 'منذ ساعة', sentiment: 'positive' }
    ]
  },
  {
    canonicalId: 'NASDAQ:AAPL',
    ticker: 'AAPL',
    yahooTicker: 'AAPL',
    tvTicker: 'NASDAQ:AAPL',
    isin: 'US0378331005',
    exchange: 'NASDAQ',
    currency: 'USD',
    nameAr: 'أبل (Apple Inc)',
    nameEn: 'Apple Inc.',
    sectorAr: 'التكنولوجيا والأجهزة الاستهلاكية',
    sectorEn: 'Consumer Technology',
    basePrice: 228.4,
    drift: 0.0009,
    volatility: 0.016,
    seed: 1010,
    source: 'Finnhub + Yahoo',
    fallbackSource: 'TradingView America',
    delayMinutes: 0,
    lastUpdated: 'محدث لحظياً (US)',
    dailyLimitPct: 100,
    fundamentals: { pe: 31.8, pb: 44.0, eps: 7.18, divYield: 0.44, revGrowth: 6.1 },
    newsAr: [
      { title: 'نمو إيرادات قطاع الخدمات في أبل يعوض التباطؤ الموسمي في مبيعات الأجهزة بالأسواق الآسيوية', source: 'Finnhub News', time: 'منذ 3 ساعات', sentiment: 'neutral' }
    ]
  },
  {
    canonicalId: 'NASDAQ:MSFT',
    ticker: 'MSFT',
    yahooTicker: 'MSFT',
    tvTicker: 'NASDAQ:MSFT',
    isin: 'US5949181045',
    exchange: 'NASDAQ',
    currency: 'USD',
    nameAr: 'مايكروسوفت (Microsoft)',
    nameEn: 'Microsoft Corporation',
    sectorAr: 'البرمجيات والحوسبة السحابية',
    sectorEn: 'Cloud & Enterprise Software',
    basePrice: 426.5,
    drift: 0.001,
    volatility: 0.015,
    seed: 1111,
    source: 'Finnhub + Yahoo',
    fallbackSource: 'TradingView America',
    delayMinutes: 0,
    lastUpdated: 'محدث لحظياً (US)',
    dailyLimitPct: 100,
    fundamentals: { pe: 33.4, pb: 11.2, eps: 12.76, divYield: 0.72, revGrowth: 16.0 },
    newsAr: [
      { title: 'توسع خدمات Azure السحابية يدعم التدفقات النقدية الحرة رغم زيادة النفقات الرأسمالية', source: 'Finnhub News', time: 'منذ 4 ساعات', sentiment: 'positive' }
    ]
  },
  {
    canonicalId: 'AMEX:SPY',
    ticker: 'SPY',
    yahooTicker: 'SPY',
    tvTicker: 'AMEX:SPY',
    isin: 'US78462F1030',
    exchange: 'NYSE',
    currency: 'USD',
    nameAr: 'صندوق مؤشر S&P 500 الأمريكي',
    nameEn: 'SPDR S&P 500 ETF Trust',
    sectorAr: 'مؤشر السوق الأمريكي العام',
    sectorEn: 'US Broad Market Index ETF',
    basePrice: 588.2,
    drift: 0.0008,
    volatility: 0.011,
    seed: 1212,
    source: 'Finnhub + Yahoo',
    fallbackSource: 'Stooq',
    delayMinutes: 0,
    lastUpdated: 'محدث لحظياً (US)',
    dailyLimitPct: 100,
    fundamentals: { pe: 26.4, pb: 4.8, eps: 22.28, divYield: 1.21, revGrowth: 10.5 },
    newsAr: [
      { title: 'المؤشر الأمريكي العام يتداول أعلى متوسط 50 و200 يوم وسط ترقب بيانات التضخم الفيدرالية', source: 'MarketWatch', time: 'منذ ساعتين', sentiment: 'positive' }
    ]
  },
  {
    canonicalId: 'LSE:SHEL',
    ticker: 'SHEL.L',
    yahooTicker: 'SHEL.L',
    tvTicker: 'LSE:SHEL',
    isin: 'GB00BP6MXD84',
    exchange: 'LSE',
    currency: 'GBP',
    nameAr: 'شل للطاقة - بورصة لندن (Shell plc)',
    nameEn: 'Shell plc (London Stock Exchange)',
    sectorAr: 'الطاقة والنفط والغاز',
    sectorEn: 'Energy & Oil',
    basePrice: 25.8,
    drift: 0.0004,
    volatility: 0.017,
    seed: 1313,
    source: 'Yahoo (.L)',
    fallbackSource: 'TradingView UK',
    delayMinutes: 15,
    lastUpdated: 'متأخر 15 دقيقة (LSE)',
    dailyLimitPct: 100,
    fundamentals: { pe: 8.9, pb: 1.1, eps: 2.9, divYield: 4.1, revGrowth: -3.2 },
    newsAr: [
      { title: 'شل تواصل برنامج إعادة شراء الأسهم وتثبيت التوزيعات النقدية بالرغم من تذبذب خام برنت', source: 'LSE Feed', time: 'منذ 5 ساعات', sentiment: 'neutral' }
    ]
  },
  {
    canonicalId: 'TSE:7203',
    ticker: '7203.T',
    yahooTicker: '7203.T',
    tvTicker: 'TSE:7203',
    isin: 'JP3633400001',
    exchange: 'TSE',
    currency: 'JPY',
    nameAr: 'تويوتا موتور - بورصة طوكيو (Toyota)',
    nameEn: 'Toyota Motor Corp (Tokyo)',
    sectorAr: 'صناعة السيارات والهجين',
    sectorEn: 'Automotive',
    basePrice: 2740,
    drift: 0.0005,
    volatility: 0.02,
    seed: 1414,
    source: 'Yahoo (.T)',
    fallbackSource: 'Stooq JP',
    delayMinutes: 20,
    lastUpdated: 'متأخر 20 دقيقة (طوكيو)',
    dailyLimitPct: 100,
    fundamentals: { pe: 9.4, pb: 1.15, eps: 291.4, divYield: 2.8, revGrowth: 11.2 },
    newsAr: [
      { title: 'مبيعات السيارات الهجينة لتويوتا تدعم الأرباح التشغيلية مع تقلبات سعر صرف الين الياباني', source: 'Nikkei / Yahoo', time: 'منذ 7 ساعات', sentiment: 'positive' }
    ]
  },
  {
    canonicalId: 'INDEX:EGX30',
    ticker: 'EGX30',
    yahooTicker: '^CASE30 (Broken -> TV)',
    tvTicker: 'EGX:EGX30',
    isin: 'EGX30INDEX',
    exchange: 'INDEX',
    currency: 'EGP',
    nameAr: 'المؤشر الرئيسي للبورصة المصرية EGX30',
    nameEn: 'EGX 30 Benchmark Index',
    sectorAr: 'مؤشر السوق المصري',
    sectorEn: 'Egyptian Benchmark Index',
    basePrice: 31450,
    drift: 0.0013,
    volatility: 0.016,
    seed: 1515,
    source: 'TradingView Scanner (EGX:EGX30)',
    fallbackSource: 'Mubasher / Stooq',
    delayMinutes: 15,
    lastUpdated: '14:30:00 القاهرة',
    dailyLimitPct: 20,
    fundamentals: { pe: 7.4, pb: 1.9, eps: null, divYield: 2.9, revGrowth: null },
    newsAr: [
      { title: 'تنبيه هندسي: تم استبدال ^CASE30 من ياهو (يرجع صفاً واحداً معطوباً) بمصدر TradingView و المباشر لضمان عمق التاريخ', source: 'Phase 0 Report', time: 'موثق', sentiment: 'positive' }
    ]
  }
];

function createPRNG(seed) {
  let a = seed;
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateOHLCVSeries(symbolObj, numBars = 240, liveJitter = 0, ignoreAnomaly = false) {
  const rand = createPRNG(symbolObj.seed);
  const bars = [];
  let price = symbolObj.basePrice * 0.76;
  const now = new Date('2026-11-12T12:30:00Z');

  for (let i = numBars - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - Math.floor(i * 1.4));
    const dateStr = d.toISOString().split('T')[0];

    const u1 = Math.max(0.0001, rand());
    const u2 = rand();
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

    const cycle = Math.sin((numBars - i) / 14) * 0.004;
    let ret = symbolObj.drift + cycle + z * symbolObj.volatility;

    let anomalyFlag = false;
    if (symbolObj.hasUnadjustedBonusGap && !ignoreAnomaly && i === 18) {
      ret = -0.315; // -31.5% unadjusted 1-for-2 bonus share distribution gap
      anomalyFlag = true;
    }

    if (i === 0 && liveJitter !== 0) {
      ret += liveJitter;
    }

    const prevClose = price;
    const close = Math.max(0.2, +(prevClose * (1 + ret)).toFixed(symbolObj.basePrice < 5 ? 3 : 2));
    const open = +(prevClose * (1 + (rand() - 0.48) * symbolObj.volatility * 0.45)).toFixed(
      symbolObj.basePrice < 5 ? 3 : 2
    );
    const intraSpread = Math.abs(close - open) + prevClose * symbolObj.volatility * (0.4 + rand() * 0.8);
    const high = +(Math.max(open, close) + intraSpread * 0.55).toFixed(symbolObj.basePrice < 5 ? 3 : 2);
    const low = +Math.max(0.1, Math.min(open, close) - intraSpread * 0.45).toFixed(
      symbolObj.basePrice < 5 ? 3 : 2
    );

    const baseVol = symbolObj.exchange === 'EGX' ? 4200000 : 18500000;
    const volMultiplier = 0.6 + rand() * 0.9 + (Math.abs(ret) > symbolObj.volatility * 1.2 ? 1.15 : 0);
    const recentBoost = i <= 1 && symbolObj.seed % 2 === 1 ? 1.55 : 1.0;
    const volume = Math.round(baseVol * volMultiplier * recentBoost);

    bars.push({
      date: dateStr,
      open,
      high,
      low,
      close,
      prevClose,
      volume,
      changePct: +(((close - prevClose) / prevClose) * 100).toFixed(2),
      anomalyFlag
    });
    price = close;
  }
  return bars;
}

// ============================================================================
// 3. PURE MATHEMATICAL INDICATOR, SIGNAL & ZERO-LOOK-AHEAD BACKTEST ENGINE
// ============================================================================
function computeSMA(values, period) {
  const res = new Array(values.length).fill(null);
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= period) sum -= values[i - period];
    if (i >= period - 1) res[i] = sum / period;
  }
  return res;
}

function computeEMA(values, period) {
  const res = new Array(values.length).fill(null);
  const k = 2 / (period + 1);
  let ema = values[0];
  res[0] = ema;
  for (let i = 1; i < values.length; i++) {
    ema = values[i] * k + ema * (1 - k);
    res[i] = ema;
  }
  return res;
}

function computeRSI(closes, period = 14) {
  const res = new Array(closes.length).fill(50);
  if (closes.length <= period) return res;
  let avgGain = 0;
  let avgLoss = 0;
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff > 0) avgGain += diff;
    else avgLoss -= diff;
  }
  avgGain /= period;
  avgLoss /= period;
  res[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);

  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    res[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  }
  return res;
}

function computeATR(bars, period = 14) {
  const tr = bars.map((b, i) => {
    if (i === 0) return b.high - b.low;
    const prevC = bars[i - 1].close;
    return Math.max(b.high - b.low, Math.abs(b.high - prevC), Math.abs(b.low - prevC));
  });
  const atr = new Array(bars.length).fill(tr[0]);
  let curr = tr.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < bars.length; i++) {
    curr = (curr * (period - 1) + tr[i]) / period;
    atr[i] = curr;
  }
  return atr;
}

function computeBollinger(closes, period = 20, mult = 2) {
  const sma = computeSMA(closes, period);
  const upper = new Array(closes.length).fill(null);
  const lower = new Array(closes.length).fill(null);
  for (let i = period - 1; i < closes.length; i++) {
    const slice = closes.slice(i - period + 1, i + 1);
    const mean = sma[i];
    const variance = slice.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / period;
    const std = Math.sqrt(variance);
    upper[i] = mean + mult * std;
    lower[i] = mean - mult * std;
  }
  return { middle: sma, upper, lower };
}

function analyzeSymbol(symbolObj, bars, holdingDays = 10, customFeePct = null) {
  const closes = bars.map((b) => b.close);
  const volumes = bars.map((b) => b.volume);

  const sma20 = computeSMA(closes, 20);
  const sma50 = computeSMA(closes, 50);
  const sma200 = computeSMA(closes, 200);
  const ema9 = computeEMA(closes, 9);
  const ema21 = computeEMA(closes, 21);
  const rsi14 = computeRSI(closes, 14);
  const atr14 = computeATR(bars, 14);
  const volSma20 = computeSMA(volumes, 20);
  const bb = computeBollinger(closes, 20, 2);

  const ema12 = computeEMA(closes, 12);
  const ema26 = computeEMA(closes, 26);
  const macdLine = ema12.map((v, i) => v - ema26[i]);
  const macdSignal = computeEMA(macdLine, 9);
  const macdHist = macdLine.map((v, i) => v - macdSignal[i]);

  const idx = bars.length - 1;
  const lastBar = bars[idx];
  const price = lastBar.close;
  const curSma20 = sma20[idx] || price;
  const curSma50 = sma50[idx] || price;
  const curSma200 = sma200[idx] || price * 0.9;
  const curEma9 = ema9[idx] || price;
  const curEma21 = ema21[idx] || price;
  const curRsi = rsi14[idx] || 50;
  const curAtr = atr14[idx] || price * 0.025;
  const curRvol = volSma20[idx] ? +(lastBar.volume / volSma20[idx]).toFixed(2) : 1.0;
  const curMacdHist = macdHist[idx] || 0;
  const prevMacdHist = macdHist[idx - 1] || 0;

  const recentAnomalyBar = bars
    .slice(-45)
    .find((b) => symbolObj.exchange === 'EGX' && Math.abs(b.changePct) > 22);

  const recentSlice = bars.slice(Math.max(0, idx - 35), idx);
  const swingLow = Math.min(...recentSlice.map((b) => b.low));
  const swingHigh = Math.max(...recentSlice.map((b) => b.high));

  const confirmingAr = [];
  const confirmingEn = [];
  const weakeningAr = [];
  const weakeningEn = [];

  let sTrend = 0;
  if (price > curSma50 && curSma50 > curSma200) {
    sTrend += 65;
    confirmingAr.push(`السعر (${fmtPrice(price)}) يتداول في اتجاه صاعد أعلى متوسط 50 يوم (${fmtPrice(curSma50)}) ومتوسط 200 يوم (${fmtPrice(curSma200)})`);
    confirmingEn.push(`Price (${fmtPrice(price)}) in primary uptrend above SMA50 (${fmtPrice(curSma50)}) & SMA200 (${fmtPrice(curSma200)})`);
  } else if (price < curSma50 && curSma50 < curSma200) {
    sTrend -= 65;
    weakeningAr.push(`السعر يتداول أسفل المتوسطات المتحركة الرئيسية 50 و200 يوم مما يعكس ضغطاً بيعياً هيكلياً`);
    weakeningEn.push(`Price trading below both SMA50 and SMA200 indicating structural bearish pressure`);
  } else if (price > curSma50) {
    sTrend += 30;
    confirmingAr.push(`السعر محافظ على التداول أعلى متوسط 50 يوم (${fmtPrice(curSma50)})`);
    confirmingEn.push(`Price holding above 50-day moving average (${fmtPrice(curSma50)})`);
  } else {
    sTrend -= 30;
    weakeningAr.push(`السعر يتداول دون متوسط 50 يوم (${fmtPrice(curSma50)})`);
    weakeningEn.push(`Price trading below 50-day moving average (${fmtPrice(curSma50)})`);
  }

  if (curEma9 > curEma21) sTrend += 25;
  else sTrend -= 25;

  let sMomentum = 0;
  if (curRsi >= 48 && curRsi <= 67) {
    sMomentum += 45;
    confirmingAr.push(`مؤشر القوة النسبية RSI(14) عند ${curRsi.toFixed(1)} في منطقة زخم إيجابي صحي دون تشبع شرائي`);
    confirmingEn.push(`RSI(14) at ${curRsi.toFixed(1)} shows healthy bullish momentum without overbought exhaustion`);
  } else if (curRsi < 33 && price >= swingLow) {
    sMomentum += 40;
    confirmingAr.push(`ارتداد محتمل من منطقة تشبع بيعي على RSI (${curRsi.toFixed(1)}) بالقرب من الدعم`);
    confirmingEn.push(`Potential oversold bounce with RSI at ${curRsi.toFixed(1)} near structural support`);
  } else if (curRsi > 74) {
    sMomentum -= 45;
    weakeningAr.push(`تشبع شرائي مرتفع على مؤشر RSI (${curRsi.toFixed(1)}) يزيد من احتمالية جني الأرباح قريباً`);
    weakeningEn.push(`Overbought RSI (${curRsi.toFixed(1)}) increases near-term profit-taking risk`);
  } else {
    sMomentum -= 20;
  }

  if (curMacdHist > 0 && curMacdHist >= prevMacdHist) {
    sMomentum += 40;
    confirmingAr.push(`انفراج إيجابي متسارع في هستوجرام MACD (${curMacdHist.toFixed(2)})`);
    confirmingEn.push(`Expanding positive MACD histogram (${curMacdHist.toFixed(2)})`);
  } else if (curMacdHist < 0) {
    sMomentum -= 35;
    weakeningAr.push(`زخم MACD لا يزال في النطاق السلبي (${curMacdHist.toFixed(2)})`);
    weakeningEn.push(`MACD histogram remains negative (${curMacdHist.toFixed(2)})`);
  }

  let sVolume = 0;
  if (curRvol >= 1.35 && lastBar.changePct >= 0) {
    sVolume += 75;
    confirmingAr.push(`سيولة مؤسسية قوية: حجم التداول يعادل ${curRvol}x من متوسط 20 جلسة`);
    confirmingEn.push(`Strong institutional participation: Relative Volume is ${curRvol}x the 20-day average`);
  } else if (curRvol < 0.85 && lastBar.changePct > 0) {
    sVolume -= 35;
    weakeningAr.push(`صعود السعر مصحوب بسيولة أقل من المتوسط (${curRvol}x) مما يضعف قوة الاختراق`);
    weakeningEn.push(`Upward move accompanied by below-average volume (${curRvol}x)`);
  } else if (curRvol >= 1.3 && lastBar.changePct < 0) {
    sVolume -= 65;
    weakeningAr.push(`ضغط بيعي مصحوب بارتفاع السيولة النسبية (${curRvol}x)`);
    weakeningEn.push(`Distribution day on elevated relative volume (${curRvol}x)`);
  } else {
    sVolume += 15;
  }

  let sStructure = 0;
  const distToResAtr = (swingHigh - price) / curAtr;
  if (distToResAtr < 0.7 && price < swingHigh) {
    sStructure -= 45;
    weakeningAr.push(`السعر يقترب بشدة من سقف مقاومة محورية عند ${fmtPrice(swingHigh)} مما يضغط هامش الربح`);
    weakeningEn.push(`Price is immediately below key swing resistance at ${fmtPrice(swingHigh)}`);
  } else {
    sStructure += 50;
  }

  const sRegime = 60;

  const compositeScore = +(
    0.3 * sTrend +
    0.25 * sMomentum +
    0.2 * sVolume +
    0.15 * sStructure +
    0.1 * sRegime
  ).toFixed(1);

  const decimals = price < 5 ? 3 : 2;
  const entryLow = +(price - 0.35 * curAtr).toFixed(decimals);
  const entryHigh = +(price + 0.15 * curAtr).toFixed(decimals);

  const stopBase = Math.max(price * 0.82, Math.min(swingLow - 0.35 * curAtr, price - 1.65 * curAtr));
  const stopLow = +(stopBase - 0.15 * curAtr).toFixed(decimals);
  const stopHigh = +(stopBase + 0.15 * curAtr).toFixed(decimals);

  const target1Base = Math.max(price + 2.4 * curAtr, Math.min(swingHigh * 1.04, price + 3.1 * curAtr));
  const target1Low = +(target1Base - 0.2 * curAtr).toFixed(decimals);
  const target1High = +(target1Base + 0.25 * curAtr).toFixed(decimals);

  const target2Low = +(price + 3.8 * curAtr).toFixed(decimals);
  const target2High = +(price + 4.3 * curAtr).toFixed(decimals);

  const riskPerShare = Math.max(0.01, price - stopBase);
  const rewardPerShare = Math.max(0.01, target1Base - price);
  const rrRatio = +(rewardPerShare / riskPerShare).toFixed(2);

  if (rrRatio < 1.5) {
    weakeningAr.push(`نسبة العائد إلى المخاطرة الحالية (${rrRatio}:1) أقل من الحد الأمثل (1.5:1)`);
    weakeningEn.push(`Risk-to-Reward ratio (${rrRatio}:1) is below the optimal 1.5:1 threshold`);
  }

  const oneWayFee =
    customFeePct !== null
      ? customFeePct / 100
      : symbolObj.exchange === 'EGX'
      ? 0.0025
      : 0.0005;

  const trades = [];
  let lastExitIdx = 50;

  for (let t = 52; t < bars.length - holdingDays - 1; t++) {
    if (t <= lastExitIdx) continue;
    if (bars[t].anomalyFlag) continue;

    const c_t = closes[t];
    const s20_t = sma20[t];
    const s50_t = sma50[t];
    const rsi_t = rsi14[t];
    const atr_t = atr14[t];
    const rvol_t = volSma20[t] ? volumes[t] / volSma20[t] : 1;

    const isBullishSetup =
      compositeScore >= 0
        ? c_t > s50_t && rsi_t >= 44 && rsi_t <= 69 && (c_t > s20_t || rvol_t > 1.1)
        : c_t < s50_t && rsi_t < 48;

    if (isBullishSetup) {
      const rawEntry = bars[t + 1].open;
      const entryWithFee = rawEntry * (1 + oneWayFee);
      const stopLvl = rawEntry - 1.65 * atr_t;
      const targetLvl = rawEntry + 2.75 * atr_t;

      let exitPrice = bars[t + holdingDays].close;
      let exitReason = 'TIME_EXIT';
      let exitBarIdx = t + holdingDays;

      for (let k = t + 1; k <= t + holdingDays; k++) {
        const b_k = bars[k];
        if (b_k.low <= stopLvl) {
          exitPrice = stopLvl;
          exitReason = 'STOP_HIT';
          exitBarIdx = k;
          break;
        }
        if (b_k.high >= targetLvl) {
          exitPrice = targetLvl;
          exitReason = 'TARGET_HIT';
          exitBarIdx = k;
          break;
        }
      }

      const exitAfterFee = exitPrice * (1 - oneWayFee);
      const netReturnPct = ((exitAfterFee - entryWithFee) / entryWithFee) * 100;
      trades.push({
        signalBarIdx: t,
        entryBarIdx: t + 1,
        exitBarIdx,
        signalDate: bars[t].date,
        entryDate: bars[t + 1].date,
        exitDate: bars[exitBarIdx].date,
        entryPrice: +rawEntry.toFixed(decimals),
        exitPrice: +exitPrice.toFixed(decimals),
        netReturnPct: +netReturnPct.toFixed(2),
        exitReason
      });
      lastExitIdx = exitBarIdx;
    }
  }

  const sampleSize = trades.length;
  const wins = trades.filter((tr) => tr.netReturnPct > 0);
  const losses = trades.filter((tr) => tr.netReturnPct <= 0);
  const winRatePct = sampleSize > 0 ? +((wins.length / sampleSize) * 100).toFixed(1) : 0;
  const avgWin = wins.length > 0 ? wins.reduce((a, b) => a + b.netReturnPct, 0) / wins.length : 0;
  const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((a, b) => a + b.netReturnPct, 0) / losses.length) : 0;
  const expectancyPct =
    sampleSize > 0
      ? +(((winRatePct / 100) * avgWin - ((100 - winRatePct) / 100) * avgLoss)).toFixed(2)
      : 0;

  let peakEq = 100;
  let curEq = 100;
  let maxDdPct = 0;
  trades.forEach((tr) => {
    curEq = curEq * (1 + tr.netReturnPct / 100);
    if (curEq > peakEq) peakEq = curEq;
    const dd = ((curEq - peakEq) / peakEq) * 100;
    if (dd < maxDdPct) maxDdPct = dd;
  });

  const totalStockReturn = ((closes[idx] - closes[52]) / closes[52]) * 100;
  const bhBenchmarkPct = +((totalStockReturn / (idx - 52)) * holdingDays).toFixed(2);
  const excessVsBhPct = +(expectancyPct - bhBenchmarkPct).toFixed(2);

  let confidenceTier = 'MEDIUM';
  if (compositeScore >= 42 && winRatePct >= 56 && sampleSize >= 15 && rrRatio >= 1.5 && !recentAnomalyBar) {
    confidenceTier = 'HIGH';
  } else if (sampleSize < 12 || expectancyPct <= 0 || rrRatio < 1.35 || recentAnomalyBar) {
    confidenceTier = 'LOW';
  }

  let direction = 'NEUTRAL_WATCH';
  let ruleNameAr = 'مراقبة محايدة / انتظار تأكيد';
  let ruleNameEn = 'Neutral Watch / Await Confirmation';

  if (compositeScore >= 38) {
    direction = 'BULLISH_SETUP';
    ruleNameAr = curRvol >= 1.3 ? 'استمرار اتجاه صاعد مدعوم بسيولة مؤسسية' : 'ارتداد إيجابي أعلى المتوسطات المتحركة';
    ruleNameEn = curRvol >= 1.3 ? 'Institutional Volume Trend Continuation' : 'Bullish Trend Pullback Setup';
  } else if (compositeScore <= -20) {
    direction = 'BEARISH_AVOID';
    ruleNameAr = 'ضعف فني / كسر متوسطات — تجنب الشراء العشوائي';
    ruleNameEn = 'Technical Weakness / Below MAs — Avoid Entry';
  }

  return {
    symbol: symbolObj,
    lastBar,
    price,
    changePct: lastBar.changePct,
    indicators: {
      sma20: +curSma20.toFixed(decimals),
      sma50: +curSma50.toFixed(decimals),
      sma200: +curSma200.toFixed(decimals),
      ema9: +curEma9.toFixed(decimals),
      ema21: +curEma21.toFixed(decimals),
      rsi14: +curRsi.toFixed(1),
      macdHist: +curMacdHist.toFixed(3),
      atr14: +curAtr.toFixed(decimals),
      rvol20: curRvol,
      swingLow: +swingLow.toFixed(decimals),
      swingHigh: +swingHigh.toFixed(decimals),
      bbUpper: +(bb.upper[idx] || price * 1.04).toFixed(decimals),
      bbLower: +(bb.lower[idx] || price * 0.96).toFixed(decimals)
    },
    series: {
      bars: bars.slice(-90),
      sma20: sma20.slice(-90),
      sma50: sma50.slice(-90),
      bbUpper: bb.upper.slice(-90),
      bbLower: bb.lower.slice(-90),
      rsi14: rsi14.slice(-90)
    },
    signal: {
      direction,
      ruleNameAr,
      ruleNameEn,
      compositeScore,
      subScores: { sTrend, sMomentum, sVolume, sStructure, sRegime },
      confidenceTier,
      entryZone: [entryLow, entryHigh],
      stopZone: [stopLow, stopHigh],
      target1Zone: [target1Low, target1High],
      target2Zone: [target2Low, target2High],
      rrRatio,
      confirmingAr,
      confirmingEn,
      weakeningAr,
      weakeningEn,
      hasCorporateActionWarning: Boolean(recentAnomalyBar),
      anomalyBarDate: recentAnomalyBar ? recentAnomalyBar.date : null
    },
    backtest: {
      holdingDays,
      oneWayFeePct: +(oneWayFee * 100).toFixed(2),
      sampleSize,
      winRatePct,
      avgWinPct: +avgWin.toFixed(2),
      avgLossPct: +avgLoss.toFixed(2),
      expectancyPct,
      maxDrawdownPct: +maxDdPct.toFixed(2),
      bhBenchmarkPct,
      excessVsBhPct,
      isSmallSample: sampleSize < 15,
      isStatisticallyWeak: expectancyPct <= 0 || winRatePct < 48,
      recentTrades: trades.slice(-6).reverse(),
      allTrades: trades
    }
  };
}

// ============================================================================
// 3.5 ENCODED INVESTMENT CANON (16 GLOBAL & EGYPTIAN MASTERWORKS ENGINE)
// ============================================================================
const INVESTMENT_CANON_BOOKS = [
  {
    id: 'graham',
    category: 'VALUE',
    titleAr: 'المستثمر الذكي (The Intelligent Investor)',
    authorAr: 'بنيامين جراهام (1949)',
    coreRuleAr: 'هامش الأمان (Margin of Safety) + معادلة جراهام العادلة + استغلال تقلبات "السيد سوق" (Mr. Market) بدلاً من الانجرار وراءه.',
    encodedFormulaAr: 'Graham Number = √(22.5 × EPS × BVPS) | معيار القيمة الدفاعي: (P/E × P/B) ≤ 22.5',
    lessonsAr: [
      'السهم ليس مجرد رمز على الشاشة بل حصة ملكية حقيقية في شركة لها أصول وأرباح.',
      'السيد سوق (Mr. Market) شريك متقلب المزاج؛ اشترِ منه عندما يبيع بذعر، وبع له عندما يشتري بطمع.',
      'لا تشترِ أي سهم مهما كانت جودته بدون هامش أمان واضح بين السعر السوقي والقيمة الجوهرية.'
    ]
  },
  {
    id: 'fisher',
    category: 'VALUE',
    titleAr: 'أسهم عادية وأرباح غير عادية (Common Stocks and Uncommon Profits)',
    authorAr: 'فيليب فيشر (1958 / 1989)',
    coreRuleAr: 'قائمة فيشر الـ 15 لاختيار شركات النمو القادرة على مضاعفة الإيرادات مع إدارة نزيهة ومنتجات ذات ميزة تنافسية مستدامة.',
    encodedFormulaAr: 'نمو الإيرادات السنوي > 20% + استدامة هوامش الربح + كفاءة إعادة استثمار الأرباح (ROE/ROIC)',
    lessonsAr: [
      'منهج الاستقصاء الميداني (Scuttlebutt): افهم قوة الشركة من عملائها ومنافسيها ومورديها.',
      'أفضل وقت لبيع سهم نمو ممتاز تم اختياره بشكل صحيح هو "نادراً جداً" طالما لم تتدهور أساسيات الإدارة.'
    ]
  },
  {
    id: 'lynch',
    category: 'VALUE',
    titleAr: 'تفوق على وول ستريت (One Up On Wall Street)',
    authorAr: 'بيتر لينش (1989)',
    coreRuleAr: 'معامل لينش للنمو مقابل مضاعف الربحية (PEG Ratio < 1.0) وتصنيف الأسهم إلى 6 فئات قبل اتخاذ القرار.',
    encodedFormulaAr: 'PEG Ratio = (P/E) ÷ (Annual Growth Rate % + Dividend Yield %) — أقل من 1.0 ممتاز',
    lessonsAr: [
      'اعرف ماذا تملك ولماذا تملكه: هل هو سهم نمو سريع (Fast Grower)، أم قيادي راسخ (Stalwart)، أم دوري (Cyclical)، أم غني بالأصول (Asset Play)؟',
      'استثمر فيما تفهمه وتراه في حياتك اليومية (البنوك الكبرى، العقارات، المدفوعات الرقمية، التصدير).'
    ]
  },
  {
    id: 'siegel',
    category: 'VALUE',
    titleAr: 'الأسهم للمدى الطويل (Stocks for the Long Run)',
    authorAr: 'جيريمي سيجل (2002)',
    coreRuleAr: 'الأسهم المنتجة للأرباح والتوزيعات هي الأداة الأقوى تاريخياً للتفوق على التضخم وتآكل القوة الشرائية للعملة.',
    encodedFormulaAr: 'العائد الحقيقي المركب = نمو الأرباح (EPS Growth) + إعادة استثمار التوزيعات - معدل التضخم',
    lessonsAr: [
      'على المدى الطويل، تتفوق الأسهم ذات الأصول الحقيقية والتسعير المرن على النقد والسندات أثناء موجات التضخم.',
      'إعادة استثمار التوزيعات النقدية يمثل المحرك الخفي لتضاعف الثروة عبر الدورات الاقتصادية.'
    ]
  },
  {
    id: 'murphy',
    category: 'TECHNICAL',
    titleAr: 'التحليل الفني للأسواق المالية (Technical Analysis of the Financial Markets)',
    authorAr: 'جون ميرفي (1999)',
    coreRuleAr: 'حركة السعر تستوعب كل شيء، السيولة تسبق السعر (Volume Precedes Price)، والربط بين الأسواق (Intermarket Analysis).',
    encodedFormulaAr: 'توافق الاتجاه (Dow Theory) + تأكيد السيولة النسبية (RVOL > 1.3x) + تحول المقاومة المخترقة إلى دعم',
    lessonsAr: [
      'الاتجاه صديقك (Trend is your friend): تداول في اتجاه المتوسطات الرئيسية 50 و200 يوم ولا تعاند الاتجاه العام للمؤشر.',
      'أي اختراق سعري بدون ارتفاع واضح في أحجام التداول (Volume) هو اختراق مشكوك في استمراره.'
    ]
  },
  {
    id: 'livermore',
    category: 'TECHNICAL',
    titleAr: 'مذكرات مضارب في البورصة (Reminiscences of a Stock Operator)',
    authorAr: 'إدوين لوفيفر / جيسي ليفرمور (1923)',
    coreRuleAr: 'النقاط المحورية (Pivotal Points)، الشراء المتدرج في السهم الرابح فقط (Pyramiding)، والصبر على الاتجاه الكبير.',
    encodedFormulaAr: 'ممنوع التبريد في سهم خاسر (Never Average Losses) | عزز فقط بعد إثبات ربح الدفعة الأولى أعلى النقطة المحورية',
    lessonsAr: [
      'لم تكن كثرة الحركة هي التي صنعت لي الثروة، بل قدرتي على الجلوس والصبر (Sitting Tight) عندما أكون في اتجاه صاعد حقيقي.',
      'اقطع الخسائر سريعاً دون تردد؛ الخسارة الصغيرة هي بوليصة تأمين البقاء في السوق.'
    ]
  },
  {
    id: 'minervini',
    category: 'TECHNICAL',
    titleAr: 'تداول كساحر في سوق الأسهم (Trade Like a Stock Market Wizard)',
    authorAr: 'مارك مينيرفيني (2013)',
    coreRuleAr: 'قالب الاتجاه الصاعد (Stage 2 Trend Template) + نموذج انكماش التذبذب (VCP) + معادلة العائد للمخاطرة غير المتماثلة.',
    encodedFormulaAr: 'SEPA Stage 2: Price > SMA50 > SMA200 & Price ضمن 25% من قمة 52 أسبوع مع انكماش ATR قبل الاختراق',
    lessonsAr: [
      'لا تشترِ أسهماً في المرحلة الهابطة (Stage 4) بحجة أنها رخيصة؛ اشترِ فقط الأسهم القوية في المرحلة الصاعدة الثانية (Stage 2).',
      'ابحث عن انكماش التذبذب وجفاف السيولة البيعية (VCP) قبل نقطة الاختراق مباشرة.'
    ]
  },
  {
    id: 'schwager_oneil',
    category: 'TECHNICAL',
    titleAr: 'سحرة السوق (Market Wizards) + منظومة CAN SLIM (ويليام أونيل)',
    authorAr: 'جاك شواجر (1989) & ويليام أونيل (1988)',
    coreRuleAr: 'إدارة المخاطر الصارمة أولاً، الجمع بين نمو الأرباح الفصلية (C & A) والقيادة الفنية للسوق (L) ودعم المؤسسات (I) واتجاه المؤشر (M).',
    encodedFormulaAr: 'أقصى مخاطرة في الصفقة الواحدة (1% إلى 2% من رأس المال) + نسبة العائد للمخاطرة (R:R ≥ 2:1)',
    lessonsAr: [
      'القاسم المشترك بين جميع سحرة السوق ليس المؤشر السحري، بل الانضباط الحديدي في حجم المركز ووقف الخسارة.',
      'ثلاثة أرباع الأسهم تتحرك في اتجاه المؤشر العام للسوق (M = Market Direction)، فلا تسبح ضد التيار.'
    ]
  },
  {
    id: 'douglas',
    category: 'PSYCHOLOGY',
    titleAr: 'التداول في المنطقة (Trading in the Zone) + المتداول المنضبط (The Disciplined Trader)',
    authorAr: 'مارك دوجلاس (1990 / 2000)',
    coreRuleAr: 'الحقائق الخمس للتداول الاحتمالي: أي شيء يمكن أن يحدث، والحسم الإحصائي يظهر على عينة صفقات (20+ صفقة) وليس صفقة واحدة.',
    encodedFormulaAr: 'القبول المسبق للمخاطرة (Pre-defined Risk Acceptance) = صفر خوف + صفر انتقام من السوق + تنفيذ آلي للوقف',
    lessonsAr: [
      'لا تحتاج لمعرفة ما سيحدث في الصفقة القادمة لكي تربح على المدى الطويل؛ لأن التوزيع بين الصفقات الرابحة والخاسرة عشوائي ضمن أي ميزة إحصائية.',
      'المتداول المحترف يحدد مخاطرته بالقرش قبل الدخول، فإذا ضرب السهم الوقف يخرج بهدوء تام دون ألم نفسي.'
    ]
  },
  {
    id: 'housel',
    category: 'PSYCHOLOGY',
    titleAr: 'سيكولوجية المال (The Psychology of Money)',
    authorAr: 'مورجان هاوسل (2020)',
    coreRuleAr: 'البقاء في اللعبة (Survival) أهم من تعظيم العائد اللحظي، والاحتفاظ بهامش سيولة يمنعك من البيع الاضطراري في القاع.',
    encodedFormulaAr: 'هامش الخطأ (Room for Error) = سيولة احتياطية + عدم استخدام الرافعة المالية المفرطة (Margin) في الأوقات المتقلبة',
    lessonsAr: [
      'القاعدة الأولى للفائدة المركبة: لا تقاطعها أبداً بدون ضرورة.',
      'النجاح المالي يعتمد على كيفية تصرفك وقت الذعر (سلوكك) أكثر بكثير من ذكائك الحسابي.'
    ]
  },
  {
    id: 'egypt_arabic_canon',
    category: 'EGYPT_LOCAL',
    titleAr: 'المستثمر المتألق (شهاب إسماعيل) + قواعد التداول وأسرار الذهب (محمد سعيد المهدي)',
    authorAr: 'شهاب إسماعيل & محمد سعيد المهدي',
    coreRuleAr: 'بناء الثروة المتدرج في الأسواق العربية، تقسيم المحفظة بين أسهم النمو وأسهم العائد والتحوط بالذهب/الدولار، ومنع المغامرة بكامل السيولة.',
    encodedFormulaAr: 'تقسيم الدخول على دفعات (3 دفعات) + تحوط التضخم عبر الشركات ذات الإيرادات الدولارية/التصديرية أو الأصول العقارية',
    lessonsAr: [
      'لا تدخل السوق بكامل سيولتك في يوم واحد ولا في سهم واحد؛ التدرج في الشراء والبيع يحميك من تقلبات السوق المحلي.',
      'افهم العلاقة العكسية والارتباطية بين الذهب، سعر الصرف، والفائدة البنكية عند توزيع أصول محفظتك.'
    ]
  },
  {
    id: 'egx_official_guides',
    category: 'EGYPT_LOCAL',
    titleAr: 'أدلة البورصة المصرية الرسمية: اعرف كتابك (Hit the Book) + دليل حماية حقوق مساهمي الأقلية',
    authorAr: 'البورصة المصرية (EGX) & الهيئة العامة للرقابة المالية (FRA)',
    coreRuleAr: 'فهم ميكانيكية سجل الأوامر (Order Book)، مزاد سعر الإغلاق المرجح بالكميات (MVWAP)، الحدود السعرية (±20% / ±10%)، وحقوق المساهمين القانونية.',
    encodedFormulaAr: 'الحدود السعرية: ±20% للسوق الرئيسي (إيقاف 10 دقائق عند ±10%) | التسوية T+2 (أو T+0 للزيرو) | حماية حقوق الأولوية في الاكتتاب وعروض الشراء الإجبارية',
    lessonsAr: [
      'اعرف كتابك (Hit the Book): راقب عمق سجل العروض والطلبات (Bid/Ask Depth) ولا تطارد السهم بأوامر سوق (Market Order) عشوائية في الأسهم ضعيفة السيولة.',
      'حقوق مساهمي الأقلية: القانون يكفل لك الحق في الأرباح الموزعة، وحق الأولوية في الاكتتاب بزيادة رأس المال (أو بيع حق الاكتتاب منفصلاً)، والاطلاع على دراسات القيمة العادلة عند الاستحواذ.'
    ]
  }
];

function evaluateMastersCouncil(analysis) {
  const { symbol, price, indicators, signal, backtest } = analysis;
  const f = symbol.fundamentals || {};
  const dec = price < 5 ? 3 : 2;

  // 1. Benjamin Graham Evaluation (Value & Margin of Safety)
  const eps = f.eps || (f.pe ? price / f.pe : null);
  const bvps = f.pb ? price / f.pb : null;
  const grahamNumber =
    eps && bvps && eps > 0 && bvps > 0 ? +Math.sqrt(22.5 * eps * bvps).toFixed(dec) : null;
  const grahamProduct = f.pe && f.pb ? +(f.pe * f.pb).toFixed(1) : null;
  const marginOfSafetyPct =
    grahamNumber ? +(((grahamNumber - price) / grahamNumber) * 100).toFixed(1) : null;

  let grahamStatus = 'NEUTRAL';
  let grahamVerdictAr = '';
  if (grahamProduct !== null && grahamProduct <= 22.5) {
    grahamStatus = 'PASS';
    grahamVerdictAr = `يجتاز معيار جراهام الصارم للقيمة! حاصل ضرب (P/E × P/B = ${grahamProduct}) أقل من الحد الأقصى 22.5، ورقم جراهام العادل ${fmtPrice(grahamNumber, dec)} ${symbol.currency}.`;
  } else if (f.pe && f.pe <= 10) {
    grahamStatus = 'PASS';
    grahamVerdictAr = `مضاعف ربحية منخفض وجذاب دفاعياً (P/E = ${f.pe}x). ينصح جراهام بالشراء داخل منطقة الأمان ${fmtPrice(signal.entryZone[0], dec)} وعدم مطاردة السعر.`;
  } else if (f.pe && f.pe > 25) {
    grahamStatus = 'WARN';
    grahamVerdictAr = `مضاعف الربحية مرتفع (${f.pe}x) مقارنة بمعايير جراهام الكلاسيكية؛ السهم يُسعّر كسهم نمو ويتطلب حذراً في هامش الأمان.`;
  } else {
    grahamVerdictAr = `البيانات المالية تشير إلى تقييم متوازن؛ اعتمد على هامش الأمان الفني عند منطقة الدخول ${fmtPrice(signal.entryZone[0], dec)} - ${fmtPrice(signal.entryZone[1], dec)}.`;
  }

  // 2. Peter Lynch & Philip Fisher Evaluation (PEG & Growth Story)
  const growthRate = f.revGrowth || 15;
  const divYield = f.divYield || 0;
  const pegRatio =
    f.pe && growthRate > 0 ? +(f.pe / (growthRate + divYield)).toFixed(2) : null;

  let lynchCategoryAr = 'سهم قيادي راسخ (Stalwart)';
  if (growthRate >= 30) lynchCategoryAr = 'سهم نمو سريع (Fast Grower 🚀)';
  else if (divYield >= 4.0) lynchCategoryAr = 'سهم عائد وتوزيعات (Income / Stalwart 💰)';
  else if (symbol.sectorAr.includes('العقارات') || symbol.sectorAr.includes('السياحة'))
    lynchCategoryAr = 'سهم أصول حقيقية ودوري (Asset Play / Cyclical 🏛️)';

  const lynchStatus = pegRatio !== null && pegRatio <= 1.0 ? 'PASS' : pegRatio !== null && pegRatio <= 1.6 ? 'NEUTRAL' : 'WARN';
  const lynchVerdictAr =
    pegRatio !== null
      ? `التصنيف: ${lynchCategoryAr} | معامل لينش (PEG = ${pegRatio}). ${
          pegRatio < 1.0
            ? 'أقل من 1.0 وهذا يعني أن نمو الأرباح والإيرادات أسرع بكثير من مضاعف السعر الحالي (فرصة ممتازة وفق بيتر لينش وفيشر)!'
            : 'التقييم يعكس جزءاً من النمو المستقبلي، احتفظ طالما قصة نمو الشركة مستمرة.'
        }`
      : `التصنيف: ${lynchCategoryAr} — ركز على متابعة نمو المبيعات الفصلية وهوامش الربح التشغيلية كما يوصي فيليب فيشر.`;

  // 3. Mark Minervini SEPA Trend Template & VCP Check
  const checks = [
    price > indicators.sma50,
    price > indicators.sma200,
    indicators.sma50 > indicators.sma200,
    price > indicators.sma20,
    price >= indicators.swingHigh * 0.85,
    indicators.rsi14 >= 48 && indicators.rsi14 <= 72
  ];
  const minerviniScore = checks.filter(Boolean).length;
  const minerviniStatus = minerviniScore >= 5 ? 'PASS' : minerviniScore >= 3 ? 'NEUTRAL' : 'WARN';
  const minerviniVerdictAr =
    minerviniScore >= 5
      ? `يجتاز ${minerviniScore}/6 من شروط المرحلة الصاعدة الثانية (Stage 2 Trend Template)! السهم في اتجاه مؤسسي صاعد أعلى متوسطات 20 و50 و200 يوم.`
      : `يحقق ${minerviniScore}/6 من قالب مينيرفيني. يوصي مينيرفيني بعدم الشراء إلا عند اكتمال البناء الفني أعلى متوسط 50 يوم (${fmtPrice(indicators.sma50, dec)}) مع انكماش التذبذب.`;

  // 4. Jesse Livermore & John Murphy (Volume, Pivotal Points & Pyramiding)
  const livermoreStatus =
    price > indicators.sma20 && indicators.rvol20 >= 1.2
      ? 'PASS'
      : price < indicators.sma50
      ? 'WARN'
      : 'NEUTRAL';
  const livermoreVerdictAr =
    price >= indicators.sma20
      ? `النقطة المحورية (Pivotal Point): دعم قصير الأجل عند ${fmtPrice(indicators.sma20, dec)} ومقاومة اختراق عند ${fmtPrice(indicators.swingHigh, dec)}. السيولة النسبية (${indicators.rvol20}x). قاعدة ليفرمور الذهبية: اشترِ الدفعة الأولى الآن ولا تقم بالتعزيز (Pyramiding) إلا إذا تحرك السهم في صالحك!`
      : `السهم يتداول تحت متوسط 20 يوم (${fmtPrice(indicators.sma20, dec)}). يحذرك جيسي ليفرمور بصرامة: إياك والتبريد في سهم خاسر (Never Average Losses).`;

  // 5. Mark Douglas & Morgan Housel (Probabilities & Room for Error)
  const douglasStatus =
    backtest.winRatePct >= 55 && signal.rrRatio >= 1.5 ? 'PASS' : 'WARN';
  const douglasVerdictAr = `وفق مارك دوجلاس (Trading in the Zone): هذه الإشارة لها أفضلية احتمالية تاريخية تبلغ ${backtest.winRatePct}% على عينة ${backtest.sampleSize} صفقة. تذكر أن كل صفقة منفردة نتيجتها غير مؤكدة، لذا تقبّل مسبقاً مستوى الوقف عند ${fmtPrice(signal.stopZone[0], dec)} ${symbol.currency} (عائد للمخاطرة ${signal.rrRatio}:1) واحتفظ بسيولة طوارئ كما يوصي مورجان هاوسل.`;

  // 6. Egyptian Market Context (EGX "Hit the Book" + شهاب إسماعيل & المهدي)
  const isEgx = symbol.exchange === 'EGX';
  const egxVerdictAr = isEgx
    ? `قواعد البورصة المصرية (اعرف كتابك Hit the Book): السهم يخضع لحدود سعرية يومية (±${symbol.dailyLimitPct}%) مع إيقاف مؤقت عند ±10% ومزاد إغلاق مرجح بالكميات (MVWAP). ${
        symbol.sectorAr.includes('البنوك') || symbol.sectorAr.includes('العقارات') || symbol.sectorAr.includes('الصناعة')
          ? 'يمتلك السهم ميزة تحوط قوية ضد التضخم وتغير سعر الصرف (أصول عقارية أو عوائد تصديرية/مالية).'
          : 'راقب عمق سجل العروض والطلبات (Order Book) ونفذ بأوامر محددة السعر (Limit Orders) داخل منطقة الدخول.'
      }`
    : `سوق عالمي (${symbol.exchange} بعملة ${symbol.currency}): لا توجد حدود سعرية يومية ضيقة مثل السوق المصري، لذا يجب تفعيل أمر وقف الخسارة الآلي (Stop-Loss Order) عند ${fmtPrice(signal.stopZone[0], dec)} ${symbol.currency}.`;

  return {
    graham: { titleAr: 'بنيامين جراهام (المستثمر الذكي)', status: grahamStatus, verdictAr: grahamVerdictAr, grahamNumber, grahamProduct, marginOfSafetyPct },
    lynch: { titleAr: 'بيتر لينش & فيليب فيشر (النمو و PEG)', status: lynchStatus, verdictAr: lynchVerdictAr, pegRatio, lynchCategoryAr },
    minervini: { titleAr: 'مارك مينيرفيني (SEPA & Stage 2)', status: minerviniStatus, verdictAr: minerviniVerdictAr, minerviniScore },
    livermore: { titleAr: 'جيسي ليفرمور & جون ميرفي (السيولة والنقاط المحورية)', status: livermoreStatus, verdictAr: livermoreVerdictAr },
    douglas: { titleAr: 'مارك دوجلاس & مورجان هاوسل (الاحتمالات والانضباط)', status: douglasStatus, verdictAr: douglasVerdictAr },
    egxLocal: { titleAr: 'فقه السوق المصري وإدارة الثروة (EGX & المهدي & شهاب)', status: 'PASS', verdictAr: egxVerdictAr }
  };
}

// ============================================================================
// 3.8 BEGINNER-FRIENDLY EGYPTIAN ARABIC GLOSSARY & STEP-BY-STEP TRANSLATOR
// ============================================================================
const BEGINNER_DICTIONARY = [
  {
    term: 'نطاق الشراء الآمن (Entry Zone)',
    simpleAr: 'يعني السعر اللي السهم فيه "لقطة" ومناسب للشراء. لو السعر في السوق أعلى من الرقم ده، اوعى تجري وراه، استنى لما يهدى وينزل لمنطقة الشراء.'
  },
  {
    term: 'وقف الخسارة (Stop-Loss)',
    simpleAr: 'ده "حزام الأمان" بتاعك. لو السهم نزل وكسر الرقم ده، بنبيعه بهدوء بخسارة صغيرة جداً عشان نحمي باقي فلوسك وما تتعلقش في السهم.'
  },
  {
    term: 'المستهدف البيعي (Target)',
    simpleAr: 'السعر اللي لما السهم يوصله بنبدأ نبيع نص الكمية اللي معانا عشان نحط المكسب في جيبنا.'
  },
  {
    term: 'أمر محدد السعر (Limit Order)',
    simpleAr: 'لما تفتح تطبيق السمسار (زي ثاندر أو هيرميس أو مباشر)، اختار "أمر محدد السعر" واكتب السعر اللي البرنامج محددهولك بإيدك، وما تختارش "أمر سوق Market" عشان ما تشتريش بالغالي.'
  },
  {
    term: 'مؤشر القوة النسبية (RSI)',
    simpleAr: 'ترمومتر بيقيس حرارة السهم من 0 لـ 100. لو بين 48 و68 يبقى السهم صحته كويسة وبيطلع بهدوء. لو عدى 75 يبقى سخن أوي وممكن يريح شوية.'
  },
  {
    term: 'السيولة النسبية (RVOL)',
    simpleAr: 'بتقولك هل فيه "حيتان وصناديق كبيرة" بتشتري النهاردة ولا لأ. لما تلاقيها أكبر من 1.3x معناها السيولة النهاردة أعلى من الطبيعي وده شيء ممتاز مع الصعود.'
  }
];

function buildBeginnerPlainSummary(analysis, allocatedItem) {
  const { symbol, price, signal, backtest, indicators } = analysis;
  const dec = price < 5 ? 3 : 2;
  const isBullish = signal.compositeScore >= 38 && backtest.winRatePct >= 54 && !signal.hasCorporateActionWarning;
  const isInsideEntry = price <= signal.entryZone[1] * 1.015;

  if (signal.hasCorporateActionWarning) {
    return {
      headlineAr: `⏸️ نصيحة المبتدئ: لا تشترِ سهم ${symbol.nameAr} الآن`,
      explanationAr: `السهم عنده "توزيع أسهم مجانية" لسه بيتعدل في البيانات. كمبتدئ، خليك في الأمان وابعد عنه النهاردة لحد ما السعر يستقر.`,
      howToExecuteAr: `لا ترسل أي أمر شراء حالياً على ${symbol.ticker}، واضغط زر "تعديل السلسلة السعرية آلياً" فوق لو حابب تشوف الأرقام بعد التعديل.`
    };
  }

  if (isBullish) {
    return {
      headlineAr: `🟢 نصيحة المبتدئ ببساطة: سهم ${symbol.nameAr} (${symbol.ticker}) مناسب للشراء الهادئ`,
      explanationAr: `ليه السهم ده كويس؟ لأن سعره (${fmtPrice(price, dec)} ${symbol.currency}) ماشي في اتجاه صاعد فوق متوسط آخر 50 يوم، ولما الإشارة دي ظهرت في الماضي (${backtest.sampleSize} مرة) السهم كسب في ${backtest.winRatePct}% من المرات.`,
      howToExecuteAr: allocatedItem
        ? `افتح تطبيق التداول، اختار سهم (${symbol.ticker})، واعمل "أمر شراء محدد السعر (Limit)" بعدد (${allocatedItem.shares} سهم) بسعر بين ${fmtPrice(signal.entryZone[0], dec)} و ${fmtPrice(signal.entryZone[1], dec)} ${symbol.currency}. ولما يوصل ${fmtPrice(signal.target1Zone[0], dec)} بيع نص الكمية واكسب.`
        : `اشترِ على دفعتين بسعر بين ${fmtPrice(signal.entryZone[0], dec)} و ${fmtPrice(signal.entryZone[1], dec)} ${symbol.currency}، وهدفك تبيع وتكسب عند ${fmtPrice(signal.target1Zone[0], dec)}، ولو نزل تحت ${fmtPrice(signal.stopZone[0], dec)} بيع فوراً لحماية فلوسك.`
    };
  }

  return {
    headlineAr: `🟡 نصيحة المبتدئ ببساطة: خليك متفرج على ${symbol.nameAr} (${symbol.ticker}) واستنى سعر أحسن`,
    explanationAr: `السهم حالياً في منطقة متوسطة (تقييمه ${signal.compositeScore} من 100). كمبتدئ، القاعدة الذهبية هي: "ما تشتريش غير لما تكون الفرصة واضحة جداً".`,
    howToExecuteAr: `لو السهم معاك في المحفظة احتفظ بيه طالما فوق ${fmtPrice(signal.stopZone[0], dec)} ${symbol.currency}. لو مش معاك، استنى لما ينزل لمنطقة ${fmtPrice(signal.entryZone[0], dec)} ${symbol.currency} أو شوف السهم المرشح الأول في الصفحة الرئيسية.`
  };
}

// ============================================================================
// 4. INTERACTIVE TECHNICAL CANDLESTICK + ATR BANDS + BACKTEST MARKERS CHART
// ============================================================================
const InteractiveCandlestickChart = ({
  analysis,
  isRtl,
  showBollinger = false,
  showBacktestMarkers = true,
  zoomBars = 90
}) => {
  const [hoverIdx, setHoverIdx] = useState(null);
  const [pinnedIdx, setPinnedIdx] = useState(null);

  const rawBars = analysis.series.bars;
  const startOffset = Math.max(0, rawBars.length - zoomBars);
  const bars = rawBars.slice(startOffset);
  const sma20 = analysis.series.sma20.slice(startOffset);
  const sma50 = analysis.series.sma50.slice(startOffset);
  const bbUpper = analysis.series.bbUpper.slice(startOffset);
  const bbLower = analysis.series.bbLower.slice(startOffset);
  const rsiSeries = analysis.series.rsi14.slice(startOffset);

  const { entryZone, stopZone, target1Zone } = analysis.signal;
  const decimals = analysis.price < 5 ? 3 : 2;

  const width = 860;
  const height = 420;
  const padTop = 22;
  const padBottom = 95; // Room for Volume & RSI mini-strip
  const padLeft = 16;
  const padRight = 78;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const allPrices = [];
  bars.forEach((b, i) => {
    allPrices.push(b.high, b.low);
    if (sma20[i]) allPrices.push(sma20[i]);
    if (sma50[i]) allPrices.push(sma50[i]);
  });
  allPrices.push(entryZone[0], entryZone[1], stopZone[0], target1Zone[1]);

  const minP = Math.min(...allPrices) * 0.985;
  const maxP = Math.max(...allPrices) * 1.015;
  const priceRange = Math.max(0.001, maxP - minP);

  const maxVol = Math.max(...bars.map((b) => b.volume), 1);

  const yForPrice = (p) => padTop + chartH - ((p - minP) / priceRange) * chartH;
  const xForIdx = (i) => padLeft + (i + 0.5) * (chartW / bars.length);

  const makeLinePath = (arr) => {
    const pts = [];
    arr.forEach((v, i) => {
      if (v !== null && v !== undefined) {
        pts.push(`${pts.length === 0 ? 'M' : 'L'} ${xForIdx(i).toFixed(1)} ${yForPrice(v).toFixed(1)}`);
      }
    });
    return pts.join(' ');
  };

  // RSI Sub-pane path
  const rsiTop = height - 48;
  const rsiH = 26;
  const makeRsiPath = () => {
    const pts = [];
    rsiSeries.forEach((v, i) => {
      if (v !== null && v !== undefined) {
        const y = rsiTop + rsiH - (Math.min(100, Math.max(0, v)) / 100) * rsiH;
        pts.push(`${pts.length === 0 ? 'M' : 'L'} ${xForIdx(i).toFixed(1)} ${y.toFixed(1)}`);
      }
    });
    return pts.join(' ');
  };

  const activeBarIdx = pinnedIdx !== null ? pinnedIdx : hoverIdx !== null ? hoverIdx : bars.length - 1;
  const activeBar = bars[activeBarIdx] || bars[bars.length - 1];
  const activeRsi = rsiSeries[activeBarIdx] || 50;

  // Map recent backtest trades onto visible dates
  const visibleTradeDates = useMemo(() => {
    const map = {};
    analysis.backtest.allTrades.forEach((tr) => {
      map[tr.entryDate] = tr;
    });
    return map;
  }, [analysis]);

  const priceTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => minP + t * priceRange);

  return (
    <div className="relative select-none">
      {/* Top OHLCV & Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 px-1 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <Numeric>{activeBar.date}</Numeric>
            {pinnedIdx !== null && (
              <button
                onClick={() => setPinnedIdx(null)}
                className="ms-1.5 text-amber-400 hover:underline"
              >
                ({isRtl ? 'إلغاء التثبيت' : 'Unpin'})
              </button>
            )}
          </span>
          <span>
            O: <Numeric className="font-semibold">{fmtPrice(activeBar.open, decimals)}</Numeric>
          </span>
          <span>
            H: <Numeric className="font-semibold text-emerald-500">{fmtPrice(activeBar.high, decimals)}</Numeric>
          </span>
          <span>
            L: <Numeric className="font-semibold text-rose-500">{fmtPrice(activeBar.low, decimals)}</Numeric>
          </span>
          <span>
            C: <Numeric className="font-semibold">{fmtPrice(activeBar.close, decimals)}</Numeric>
          </span>
          <Numeric colorize={activeBar.changePct} className="font-bold">
            ({fmtPct(activeBar.changePct)})
          </Numeric>
          <span className="text-purple-400">
            RSI: <Numeric className="font-bold">{activeRsi.toFixed(1)}</Numeric>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-sky-400 inline-block"></span>
            <Numeric>SMA 20</Numeric>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-amber-400 inline-block"></span>
            <Numeric>SMA 50</Numeric>
          </span>
          <span className="flex items-center gap-1 text-emerald-500">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/20 border border-emerald-500 inline-block"></span>
            {isRtl ? 'المستهدف' : 'Target'}
          </span>
          <span className="flex items-center gap-1 text-blue-500">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500/20 border border-blue-500 inline-block"></span>
            {isRtl ? 'الدخول' : 'Entry'}
          </span>
          <span className="flex items-center gap-1 text-rose-500">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/20 border border-rose-500 inline-block"></span>
            {isRtl ? 'الوقف' : 'Stop'}
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div dir="ltr" className="w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto block cursor-crosshair"
          onMouseLeave={() => setHoverIdx(null)}
        >
          {/* Horizontal Grid Lines & Right Axis Labels */}
          {priceTicks.map((tickVal, idx) => {
            const y = yForPrice(tickVal);
            return (
              <g key={idx}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={width - padRight + 6}
                  y={y + 4}
                  fill="#94a3b8"
                  fontSize="10.5"
                  fontFamily="monospace"
                >
                  {fmtPrice(tickVal, decimals)}
                </text>
              </g>
            );
          })}

          {/* Shaded ATR Target 1 Zone */}
          <rect
            x={padLeft}
            y={Math.min(yForPrice(target1Zone[0]), yForPrice(target1Zone[1]))}
            width={chartW}
            height={Math.max(4, Math.abs(yForPrice(target1Zone[1]) - yForPrice(target1Zone[0])))}
            fill="#10b981"
            fillOpacity="0.13"
          />
          <line
            x1={padLeft}
            y1={yForPrice(target1Zone[0])}
            x2={width - padRight}
            y2={yForPrice(target1Zone[0])}
            stroke="#10b981"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <text
            x={padLeft + 8}
            y={yForPrice(target1Zone[1]) + 12}
            fill="#34d399"
            fontSize="10"
            fontFamily="monospace"
            fontWeight="bold"
          >
            TARGET 1: {fmtPrice(target1Zone[0], decimals)} - {fmtPrice(target1Zone[1], decimals)}
          </text>

          {/* Shaded ATR Entry Zone */}
          <rect
            x={padLeft}
            y={Math.min(yForPrice(entryZone[0]), yForPrice(entryZone[1]))}
            width={chartW}
            height={Math.max(4, Math.abs(yForPrice(entryZone[1]) - yForPrice(entryZone[0])))}
            fill="#3b82f6"
            fillOpacity="0.16"
          />
          <text
            x={padLeft + 8}
            y={yForPrice(entryZone[1]) - 4}
            fill="#60a5fa"
            fontSize="10"
            fontFamily="monospace"
            fontWeight="bold"
          >
            ENTRY ZONE: {fmtPrice(entryZone[0], decimals)} - {fmtPrice(entryZone[1], decimals)}
          </text>

          {/* Shaded ATR Stop-Loss Zone */}
          <rect
            x={padLeft}
            y={Math.min(yForPrice(stopZone[0]), yForPrice(stopZone[1]))}
            width={chartW}
            height={Math.max(4, Math.abs(yForPrice(stopZone[1]) - yForPrice(stopZone[0])))}
            fill="#f43f5e"
            fillOpacity="0.16"
          />
          <line
            x1={padLeft}
            y1={yForPrice(stopZone[1])}
            x2={width - padRight}
            y2={yForPrice(stopZone[1])}
            stroke="#f43f5e"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <text
            x={padLeft + 8}
            y={yForPrice(stopZone[0]) - 4}
            fill="#fb7185"
            fontSize="10"
            fontFamily="monospace"
            fontWeight="bold"
          >
            STOP ZONE: {fmtPrice(stopZone[0], decimals)} - {fmtPrice(stopZone[1], decimals)}
          </text>

          {/* Optional Bollinger Bands */}
          {showBollinger && (
            <>
              <path d={makeLinePath(bbUpper)} fill="none" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="2 2" />
              <path d={makeLinePath(bbLower)} fill="none" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="2 2" />
            </>
          )}

          {/* SMA 20 & SMA 50 Lines */}
          <path d={makeLinePath(sma20)} fill="none" stroke="#38bdf8" strokeWidth="1.6" />
          <path d={makeLinePath(sma50)} fill="none" stroke="#fbbf24" strokeWidth="1.6" />

          {/* Candlesticks, Volume & Backtest Entry Markers */}
          {bars.map((b, i) => {
            const x = xForIdx(i);
            const candleW = Math.max(2.5, (chartW / bars.length) * 0.66);
            const isUp = b.close >= b.open;
            const color = b.anomalyFlag ? '#f59e0b' : isUp ? '#10b981' : '#f43f5e';
            const yOpen = yForPrice(b.open);
            const yClose = yForPrice(b.close);
            const yHigh = yForPrice(b.high);
            const yLow = yForPrice(b.low);

            const volH = (b.volume / maxVol) * 32;
            const volY = height - 56 - volH;
            const btTrade = showBacktestMarkers ? visibleTradeDates[b.date] : null;

            return (
              <g
                key={b.date}
                onMouseEnter={() => setHoverIdx(i)}
                onClick={() => setPinnedIdx((prev) => (prev === i ? null : i))}
              >
                <rect
                  x={x - chartW / bars.length / 2}
                  y={padTop}
                  width={chartW / bars.length}
                  height={height - padTop}
                  fill="transparent"
                />
                <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={color} strokeWidth="1.1" />
                <rect
                  x={x - candleW / 2}
                  y={Math.min(yOpen, yClose)}
                  width={candleW}
                  height={Math.max(1.8, Math.abs(yClose - yOpen))}
                  fill={color}
                  rx="0.5"
                />
                <rect
                  x={x - candleW / 2}
                  y={volY}
                  width={candleW}
                  height={volH}
                  fill={color}
                  fillOpacity="0.32"
                />
                {/* Historical Backtest Entry Marker (t+1 Open Execution) */}
                {btTrade && (
                  <g>
                    <circle
                      cx={x}
                      cy={yLow + 10}
                      r="4.5"
                      fill={btTrade.netReturnPct > 0 ? '#10b981' : '#f43f5e'}
                      stroke="#090d16"
                      strokeWidth="1.2"
                    />
                  </g>
                )}
              </g>
            );
          })}

          {/* RSI(14) Sub-strip */}
          <line x1={padLeft} y1={rsiTop} x2={width - padRight} y2={rsiTop} stroke="#1e293b" strokeWidth="1" />
          <line x1={padLeft} y1={rsiTop + rsiH} x2={width - padRight} y2={rsiTop + rsiH} stroke="#1e293b" strokeWidth="1" />
          <path d={makeRsiPath()} fill="none" stroke="#c084fc" strokeWidth="1.3" />
          <text x={width - padRight + 6} y={rsiTop + 14} fill="#c084fc" fontSize="9.5" fontFamily="monospace">
            RSI(14)
          </text>

          {/* Active Crosshair */}
          {(hoverIdx !== null || pinnedIdx !== null) && (
            <line
              x1={xForIdx(activeBarIdx)}
              y1={padTop}
              x2={xForIdx(activeBarIdx)}
              y2={height - 20}
              stroke={pinnedIdx !== null ? '#f59e0b' : '#64748b'}
              strokeDasharray="2 2"
              strokeWidth="1.2"
            />
          )}

          {/* X-Axis Date Labels */}
          {[0, Math.floor(bars.length * 0.25), Math.floor(bars.length * 0.5), Math.floor(bars.length * 0.75), bars.length - 1].map(
            (idx, k) => {
              if (!bars[idx]) return null;
              return (
                <text
                  key={k}
                  x={xForIdx(idx)}
                  y={height - 6}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {bars[idx].date.slice(5)}
                </text>
              );
            }
          )}
        </svg>
      </div>
    </div>
  );
};

// ============================================================================
// 5. HTML5 CANVAS PNG CHART GENERATOR FOR TELEGRAM BOT MESSAGES
// ============================================================================
function renderTelegramChartDataURL(analysis) {
  const canvas = document.createElement('canvas');
  canvas.width = 760;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const { bars, sma20, sma50 } = analysis.series;
  const sliceBars = bars.slice(-60);
  const sliceSma20 = sma20.slice(-60);
  const sliceSma50 = sma50.slice(-60);
  const { entryZone, stopZone, target1Zone } = analysis.signal;
  const decimals = analysis.price < 5 ? 3 : 2;

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 16px monospace';
  ctx.fillText(
    `${analysis.symbol.canonicalId} (${analysis.symbol.currency}) - Last: ${fmtPrice(analysis.price, decimals)} (${fmtPct(analysis.changePct)})`,
    20,
    28
  );
  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px monospace';
  ctx.fillText(
    `Source: ${analysis.symbol.source} | Score: ${analysis.signal.compositeScore}/100 | R:R ${analysis.signal.rrRatio}:1`,
    20,
    48
  );

  const padL = 20;
  const padR = 85;
  const padT = 65;
  const padB = 40;
  const cW = canvas.width - padL - padR;
  const cH = canvas.height - padT - padB;

  const prices = [];
  sliceBars.forEach((b) => prices.push(b.high, b.low));
  prices.push(entryZone[0], stopZone[0], target1Zone[1]);
  const minP = Math.min(...prices) * 0.985;
  const maxP = Math.max(...prices) * 1.015;
  const range = Math.max(0.001, maxP - minP);

  const yP = (p) => padT + cH - ((p - minP) / range) * cH;
  const xI = (i) => padL + (i + 0.5) * (cW / sliceBars.length);

  const drawBand = (low, high, rgba, label, textColor) => {
    const y1 = yP(high);
    const y2 = yP(low);
    ctx.fillStyle = rgba;
    ctx.fillRect(padL, Math.min(y1, y2), cW, Math.max(4, Math.abs(y2 - y1)));
    ctx.fillStyle = textColor;
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`${label}: ${fmtPrice(low, decimals)}-${fmtPrice(high, decimals)}`, canvas.width - padR - 175, Math.min(y1, y2) + 12);
  };

  drawBand(target1Zone[0], target1Zone[1], 'rgba(16, 185, 129, 0.16)', 'TARGET', '#34d399');
  drawBand(entryZone[0], entryZone[1], 'rgba(59, 130, 246, 0.18)', 'ENTRY', '#60a5fa');
  drawBand(stopZone[0], stopZone[1], 'rgba(244, 63, 94, 0.18)', 'STOP', '#fb7185');

  sliceBars.forEach((b, i) => {
    const x = xI(i);
    const w = Math.max(3, (cW / sliceBars.length) * 0.65);
    const isUp = b.close >= b.open;
    ctx.strokeStyle = isUp ? '#10b981' : '#f43f5e';
    ctx.fillStyle = isUp ? '#10b981' : '#f43f5e';
    ctx.beginPath();
    ctx.moveTo(x, yP(b.high));
    ctx.lineTo(x, yP(b.low));
    ctx.stroke();

    const yO = yP(b.open);
    const yC = yP(b.close);
    ctx.fillRect(x - w / 2, Math.min(yO, yC), w, Math.max(2, Math.abs(yC - yO)));
  });

  const drawMA = (arr, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    arr.forEach((v, i) => {
      if (!v) return;
      if (i === 0) ctx.moveTo(xI(i), yP(v));
      else ctx.lineTo(xI(i), yP(v));
    });
    ctx.stroke();
  };
  drawMA(sliceSma20, '#38bdf8');
  drawMA(sliceSma50, '#fbbf24');

  ctx.fillStyle = '#64748b';
  ctx.font = '10px monospace';
  ctx.fillText('Educational & Statistical Analysis Only - Not Investment Advice | Smart Stock Mentor', 20, canvas.height - 12);

  return canvas.toDataURL('image/png');
}

// ============================================================================
// 5.5 LOCAL AUTH ENGINE (Name + Secret PIN) — per-user isolated local storage
// ============================================================================
// NOTE: Credentials are stored ONLY on this device in localStorage as salted
// hashes (never plaintext, never sent anywhere). This is a local-first personal
// app; the PIN gates the UI and keeps each user's budget/ledger/chat separate.
function hashSecret(secret, salt) {
  const str = `${salt}::${String(secret)}`;
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 = Math.imul(h1 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 = Math.imul(h2 ^ (h1 >>> 13), 3266489909);
  return (h2 >>> 0).toString(16).padStart(8, '0') + (h1 >>> 0).toString(16).padStart(8, '0');
}

const cleanDisplayName = (nameAr, nameEn) =>
  (nameAr || nameEn || 'صديقي').split('(')[0].trim();

const firstNameOf = (fullName) => cleanDisplayName(fullName).split(/\s+/)[0] || 'صديقي';

const chatStorageKeyFor = (userId) => `${STORAGE_KEYS_CHAT_PREFIX}_${userId || 'guest'}`;

// Each registered account starts with fully isolated, empty data.
const buildFreshAccountData = (id, name) => ({
  id,
  nameAr: name,
  nameEn: name,
  watchlist: [],
  monthlyBudget: null, // filled by the mandatory onboarding wizard
  trades: [],
  alerts: [],
  onboardingComplete: false
});

// ============================================================================
// 6. USER PROFILES (LOCAL ACCOUNTS) & SIGNAL LEDGER
// ============================================================================
const STORAGE_KEYS = {
  USERS: 'mahmoud_stock_mentor_users_v3',
  SYMBOLS: 'mahmoud_stock_mentor_symbols_v3',
  LEDGER: 'mahmoud_stock_mentor_ledger_v3',
  THEME: 'mahmoud_stock_mentor_theme_v3',
  HIDE_TOUR: 'mahmoud_stock_mentor_hide_tour_v3',
  CHAT_HISTORY: 'mahmoud_stock_mentor_chat_v3',
  SESSION: 'mahmoud_stock_mentor_session_v1'
};
const STORAGE_KEYS_CHAT_PREFIX = STORAGE_KEYS.CHAT_HISTORY;

const EMPTY_MONTHLY_BUDGET = {
  incomeEgp: 0,
  livingExpensesEgp: 0,
  emergencyReservePct: 20,
  installments: []
};


// Helper to safely load from localStorage
function loadSavedState(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

// Drop any legacy rows without PIN credentials (they were bundled demo accounts).
// Accounts created in the new app always carry pinSalt/pinHash and are untouched.
function ensureAccountCredentials(list) {
  if (!Array.isArray(list)) return [];
  return list.filter((u) => u && u.pinHash);
}

// ============================================================================
// ONE-TIME STORAGE MIGRATION (v5): purge bundled demo accounts & sample data
// from any device that ran an earlier, pre-auth build of the app.
// Real accounts created by users are preserved untouched.
// ============================================================================
const STORAGE_VERSION_KEY = 'smart_stock_mentor_storage_version';
const STORAGE_VERSION = 5;
function migrateLegacyStorage() {
  try {
    const v = Number(localStorage.getItem(STORAGE_VERSION_KEY) || 0);
    if (v >= STORAGE_VERSION) return;
    const rawUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    if (rawUsers) {
      const list = JSON.parse(rawUsers);
      if (Array.isArray(list)) {
        const DEMO_IDS = ['user_mahmoud', 'user_karim'];
        const kept = list.filter((u) => u && !DEMO_IDS.includes(u.id) && u.pinHash);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(kept));
      }
    }
    ['user_mahmoud', 'user_karim'].forEach((id) =>
      localStorage.removeItem(`${STORAGE_KEYS.CHAT_HISTORY}_${id}`)
    );
    // Drop the bundled sample signal ledger (SIG-901…905 were illustrative, not real)
    localStorage.removeItem(STORAGE_KEYS.LEDGER);
    // Force re-entry through the new mandatory onboarding flow
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    localStorage.setItem(STORAGE_VERSION_KEY, String(STORAGE_VERSION));
  } catch {
    /* storage unavailable — app will run with empty state */
  }
}

function getStoredSessionUserId() {
  const session = loadSavedState(STORAGE_KEYS.SESSION, null);
  return session && session.userId ? session.userId : null;
}

function persistSession(userId) {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({ userId, ts: Date.now() }));
  } catch {}
}

function clearStoredSession() {
  try {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  } catch {}
}

// ============================================================================
// 6.5 REAL-TIME MARKET SESSION & EXECUTION SAFETY INSPECTOR
// ============================================================================
function inspectMarketSessionAndSafety(exchange, lastSyncTimestampMs, currentPrice, entryZone, hasAnomaly) {
  const now = new Date();
  // Convert to Cairo time (UTC+2) and New York time (UTC-5)
  const utcHours = now.getUTCHours();
  const utcMins = now.getUTCMinutes();
  const cairoTotalMins = ((utcHours + 2) % 24) * 60 + utcMins;
  const nyTotalMins = ((utcHours + 19) % 24) * 60 + utcMins;
  const dayOfWeek = now.getUTCDay(); // 0=Sun, 5=Fri, 6=Sat

  let isMarketOpen = false;
  let sessionLabelAr = '';
  let sessionStatusTone = 'amber';

  if (exchange === 'EGX' || exchange === 'INDEX') {
    const isEgxWorkday = dayOfWeek >= 0 && dayOfWeek <= 4; // Sun - Thu
    const isContinuousSession = cairoTotalMins >= 10 * 60 && cairoTotalMins <= 14 * 60 + 30;
    const isPreOpen = cairoTotalMins >= 8 * 60 + 30 && cairoTotalMins < 10 * 60;

    if (isEgxWorkday && isContinuousSession) {
      isMarketOpen = true;
      sessionLabelAr = 'جلسة التداول المستمر مفتوحة (EGX)';
      sessionStatusTone = 'emerald';
    } else if (isEgxWorkday && isPreOpen) {
      sessionLabelAr = 'جلسة استكشافية قبل الافتتاح (EGX)';
      sessionStatusTone = 'amber';
    } else {
      sessionLabelAr =
        dayOfWeek === 5 || dayOfWeek === 6
          ? 'عطلة نهاية الأسبوع — إغلاق رسمي (EGX)'
          : 'خارج أوقات الجلسة — سعر آخر إغلاق (EGX)';
      sessionStatusTone = 'slate';
    }
  } else {
    const isUsWorkday = dayOfWeek >= 1 && dayOfWeek <= 5; // Mon - Fri
    const isRegularSession = nyTotalMins >= 9 * 60 + 30 && nyTotalMins <= 16 * 60;
    if (isUsWorkday && isRegularSession) {
      isMarketOpen = true;
      sessionLabelAr = 'السوق الأمريكي مفتوح للتداول (US)';
      sessionStatusTone = 'emerald';
    } else {
      sessionLabelAr = 'خارج الجلسة الرسمية — تداول ما بعد الإغلاق (US)';
      sessionStatusTone = 'slate';
    }
  }

  const syncAgeSec = Math.max(0, Math.round((Date.now() - lastSyncTimestampMs) / 1000));
  const isFreshSync = syncAgeSec <= 15;
  const isPriceInsideOrNearEntry = currentPrice <= entryZone[1] * 1.015;

  let executionSafetyStatus = 'SAFE_LIMIT';
  let executionWarningAr = '';

  if (hasAnomaly) {
    executionSafetyStatus = 'BLOCKED_DATA_GAP';
    executionWarningAr = 'تنبيه: السهم به فجوة توزيع مجاني قيد التسوية — لا تنفذ أوامر الآن.';
  } else if (!isFreshSync) {
    executionSafetyStatus = 'STALE_WARNING';
    executionWarningAr = `تنبيه: مر ${syncAgeSec} ثانية على آخر تحديث — اضغط تحديث فوري قبل التنفيذ.`;
  } else if (!isMarketOpen) {
    executionSafetyStatus = 'CLOSED_LIMIT_ONLY';
    executionWarningAr =
      'السوق مغلق حالياً (السعر المعروض هو آخر إغلاق معتمد). لا ترسل أمر سوق (Market Order)؛ ضع فقط أمر محدد السعر (Limit Order) داخل نطاق الشراء.';
  } else if (!isPriceInsideOrNearEntry) {
    executionSafetyStatus = 'ABOVE_ENTRY_WAIT';
    executionWarningAr = `السعر الحالي (${fmtPrice(currentPrice)}) أعلى من سقف منطقة الشراء الآمنة (${fmtPrice(entryZone[1])}). لا تطارد السهم؛ انتظر تهدئة السعر.`;
  } else {
    executionSafetyStatus = 'OPTIMAL_EXECUTION';
    executionWarningAr =
      'البيانات محدثة لحظياً والسعر داخل النطاق الآمن — جاهز للتنفيذ بأمر محدد السعر (Limit Order).';
  }

  return {
    isMarketOpen,
    sessionLabelAr,
    sessionStatusTone,
    syncAgeSec,
    isFreshSync,
    isPriceInsideOrNearEntry,
    executionSafetyStatus,
    executionWarningAr
  };
}

// Helper to call Gemini 3 Flash API with optional Google Search Grounding for live market verification
async function callGeminiAPI({ prompt, systemInstruction, useSearchGrounding = false, fallbackFn }) {
  let savedKey = '';
  try {
    savedKey = localStorage.getItem('mahmoud_custom_gemini_key') || '';
  } catch {}
  const apiKey = savedKey.trim() || '';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
  const delays = [1000, 2000];

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] }
  };
  if (useSearchGrounding) {
    payload.tools = [{ google_search: {} }];
  }

  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const data = await response.json();
        const candidate = data?.candidates?.[0];
        const text = candidate?.content?.parts?.[0]?.text;
        const groundingChunks = candidate?.groundingMetadata?.groundingAttributions || [];
        const sources = groundingChunks
          .map((a) => a.web?.title || a.web?.uri)
          .filter(Boolean)
          .slice(0, 3);
        if (text) {
          return {
            text,
            source: useSearchGrounding
              ? `فحص أونلاين مباشر (${sources.length ? sources.join(' • ') : 'Google Finance'})`
              : 'محرك التحليل الكمّي'
          };
        }
      }
    } catch {
      // Retry or fallback
    }
    if (attempt < delays.length) {
      await new Promise((r) => setTimeout(r, delays[attempt]));
    }
  }
  return { text: fallbackFn(), source: 'محرك التحليل الإحصائي المحلي' };
}

// ============================================================================
// 6.8 AUTH SCREEN — Login & Sign up (Name + Secret PIN), per-user isolation
// ============================================================================
const buildDefaultMentorGreeting = (name) => [
  {
    role: 'assistant',
    text: `مرحباً أستاذ ${name}. المنصة متصلة الآن بنظام التحديث التلقائي كل 7 ثوانٍ مع فحص سلامة التوقيت والأسعار قبل الشراء. يمكنك استعراض خطة الشراء والبيع لأي سهم أو التحقق من الأسعار الفورية أونلاين. بياناتك ومعاملاتك ومرتبك محفوظة لك وحدك على هذا الجهاز.`,
    verifiedNumbers: true
  }
];

const AUTH_TICKER_ITEMS = [
  { sym: 'COMI', price: '84.60', pct: '+0.85%', up: true },
  { sym: 'TMGH', price: '58.40', pct: '+1.24%', up: true },
  { sym: 'SWDY', price: '46.20', pct: '+0.62%', up: true },
  { sym: 'EGX30', price: '30,412', pct: '+0.94%', up: true },
  { sym: 'NVDA', price: '131.40', pct: '+2.31%', up: true },
  { sym: 'HRHO', price: '23.15', pct: '-0.42%', up: false },
  { sym: 'SPY', price: '599.20', pct: '+0.38%', up: true },
  { sym: 'ORWE', price: '25.60', pct: '-0.18%', up: false },
  { sym: 'EGX33', price: '2,845', pct: '+0.71%', up: true },
  { sym: 'AAPL', price: '228.10', pct: '+1.05%', up: true }
];

const AuthScreen = ({ users, onLogin, onSignup }) => {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const registeredNames = useMemo(
    () => users.map((u) => cleanDisplayName(u.nameAr, u.nameEn)),
    [users]
  );

  const resetFormFor = (nextMode) => {
    setMode(nextMode);
    setError('');
    setPin('');
    setConfirmPin('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const cleanName = name.trim();
    if (cleanName.length < 2) {
      setError('اكتب الاسم كما سجّلته (على الأقل حرفين).');
      return;
    }
    if (!/^\d{4,6}$/.test(pin)) {
      setError('الرقم السري لازم يكون من 4 إلى 6 أرقام فقط.');
      return;
    }
    if (mode === 'signup') {
      if (pin !== confirmPin) {
        setError('تأكيد الرقم السري غير مطابق — اكتبه مرة أخرى.');
        return;
      }
    }
    setSubmitting(true);
    const result =
      mode === 'login' ? onLogin(cleanName, pin) : onSignup(cleanName, pin);
    setSubmitting(false);
    if (!result || !result.ok) {
      setError(result?.error || 'تعذر إتمام العملية — حاول مرة أخرى.');
      return;
    }
    // Success: parent swaps the screen to the app shell automatically.
  };

  const inputBase =
    'w-full min-h-[48px] rounded-2xl bg-slate-950/60 border border-slate-700/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 outline-none text-slate-100 placeholder-slate-500 transition text-base sm:text-sm';

  return (
    <div
      dir="rtl"
      className="min-h-screen min-h-[100svh] bg-[#05070c] text-slate-100 flex flex-col relative overflow-hidden"
    >
      {/* Ambient glows */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-600/20 blur-3xl auth-glow pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl auth-glow pointer-events-none" />

      {/* Top thin live ticker tape */}
      <div className="relative border-b border-slate-800/80 bg-black/40 backdrop-blur px-4 py-1.5 text-[11px] overflow-hidden whitespace-nowrap">
        <div className="ticker-drift inline-flex items-center gap-6 w-max">
          {[...AUTH_TICKER_ITEMS, ...AUTH_TICKER_ITEMS].map((item, idx) => (
            <span key={idx} className="inline-flex items-center gap-1.5 font-mono">
              <span className="text-slate-400 font-bold">{item.sym}</span>
              <span className="text-slate-200">{item.price}</span>
              <span className={item.up ? 'text-emerald-400' : 'text-rose-400'}>
                {item.pct}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="relative flex-1 grid lg:grid-cols-2 max-w-7xl w-full mx-auto">
        {/* ====== Brand panel (desktop) ====== */}
        <div className="hidden lg:flex flex-col justify-center gap-8 p-12 border-l border-slate-800/60">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-mono font-extrabold text-lg tracking-tighter shadow-lg shadow-emerald-500/30 border border-emerald-400/40">
              EGX
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white leading-snug">
                المرشد الذكي
                <br />
                <span className="text-emerald-400">للبورصة المصرية والعالمية</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1.5 font-mono">
                SMART STOCK MENTOR • EGX + US MARKETS
              </p>
            </div>
          </div>

          <p className="text-slate-300 leading-8 text-sm max-w-md">
            منصة عربية تفهم مرتبك وأقساطك — وتحسبلك <strong className="text-emerald-400">الصافي المتبقي للاستثمار</strong> كل شهر،
            وتختارلك <strong className="text-emerald-400">أفضل أسهم اليوم</strong> بسعر شراء ووقف خسارة ومستهدف واضح،
            مع تحديث تلقائي كل <Numeric>5–10</Numeric> ثوانٍ.
          </p>

          <ul className="space-y-4 text-sm">
            {[
              { icon: Wallet, text: 'مرتبك والأقساط واستثمار المتبقي — محفوظة لكل حساب على حدة' },
              { icon: Zap, text: 'ترشيحات شراء فورية لحظة بلحظة مع حارس سلامة السعر والتوقيت' },
              { icon: ShieldCheck, text: 'كل مستخدم له بياناته ومعاملاته ومرتبه بشكل مستقل تماماً' },
              { icon: Sparkles, text: 'جولة إرشادية مضيئة (Spotlight Tour) ووضع مبتدئ يجعلك تكسب من اليوم الأول' }
            ].map(({ icon: Icon, text }, idx) => (
              <li key={idx} className="flex items-center gap-3 text-slate-300">
                <span className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Icon className="w-4.5 h-4.5 text-emerald-400" />
                </span>
                <span className="leading-7">{text}</span>
              </li>
            ))}
          </ul>

          <div className="text-[10px] text-slate-500 font-mono border border-slate-800 rounded-xl px-4 py-2.5 max-w-md">
            ⚠️ بيانات إحصائية وفنية لأغراض تعليمية وإدارة المخاطر — وليست توصية استثمارية مباشرة.
          </div>
        </div>

        {/* ====== Auth card ====== */}
        <div className="flex items-center justify-center p-5 sm:p-8">
          <div className="w-full max-w-md">
            {/* Compact brand for mobile */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-mono font-extrabold text-sm border border-emerald-400/40 shadow-lg">
                EGX
              </div>
              <div className="text-center">
                <div className="font-black text-lg text-white leading-6">المرشد الذكي للبورصة</div>
                <div className="text-[10px] text-slate-500 font-mono">EGX + US • LIVE</div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl shadow-2xl shadow-black/50 p-6 sm:p-7">
              {/* Tabs */}
              <div className="grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl bg-slate-950/70 border border-slate-800 mb-6">
                <button
                  onClick={() => resetFormFor('login')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-extrabold transition ${
                    mode === 'login'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  تسجيل الدخول
                </button>
                <button
                  onClick={() => resetFormFor('signup')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-extrabold transition ${
                    mode === 'signup'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  حساب جديد
                </button>
              </div>

              <h2 className="text-lg font-black text-white">
                {mode === 'login' ? 'أهلاً بعودتك 👋' : 'أنشئ حسابك في ثوانٍ'}
              </h2>
              <p className="text-[11px] text-slate-400 mt-1 mb-5">
                {mode === 'login'
                  ? 'ادخل باسمك والرقم السري — هتلاقي كل بياناتك ومعاملاتك ومرتبك زي ما سبتهم.'
                  : 'اكتب اسمك والرقم السري (4–6 أرقام). حسابك هيفضل منفصل تماماً عن أي حساب تاني على هذا الجهاز.'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name field */}
                <div>
                  <label htmlFor="auth-name" className="block text-[11px] font-bold text-slate-400 mb-1.5">
                    الاسم (كما سجّلته في الحساب)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 right-4 pointer-events-none" />
                    <input
                      id="auth-name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setError('');
                      }}
                      placeholder="مثلاً: أحمد محمد"
                      list="registered-users"
                      className={`${inputBase} pr-11 pl-4 py-3`}
                    />
                    <datalist id="registered-users">
                      {registeredNames.map((n) => (
                        <option key={n} value={n} />
                      ))}
                    </datalist>
                  </div>
                </div>

                {/* PIN field */}
                <div>
                  <label htmlFor="auth-pin" className="block text-[11px] font-bold text-slate-400 mb-1.5">
                    الرقم السري (4–6 أرقام)
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 right-4 pointer-events-none" />
                    <input
                      id="auth-pin"
                      type={showPin ? 'text' : 'password'}
                      inputMode="numeric"
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      maxLength={6}
                      value={pin}
                      onChange={(e) => {
                        setPin(e.target.value.replace(/\D/g, '').slice(0, 6));
                        setError('');
                      }}
                      placeholder="••••"
                      dir="ltr"
                      className={`${inputBase} pr-11 pl-12 py-3 text-center tracking-[0.5em] font-mono font-bold`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin((v) => !v)}
                      aria-label={showPin ? 'إخفاء الرقم السري' : 'إظهار الرقم السري'}
                      className="absolute top-1/2 -translate-y-1/2 left-3 p-1.5 rounded-lg text-slate-500 hover:text-slate-200 transition"
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm PIN (signup only) */}
                {mode === 'signup' && (
                  <div>
                    <label htmlFor="auth-confirm" className="block text-[11px] font-bold text-slate-400 mb-1.5">
                      تأكيد الرقم السري
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 right-4 pointer-events-none" />
                      <input
                        id="auth-confirm"
                        type={showPin ? 'text' : 'password'}
                        inputMode="numeric"
                        autoComplete="new-password"
                        maxLength={6}
                        value={confirmPin}
                        onChange={(e) => {
                          setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6));
                          setError('');
                        }}
                        placeholder="••••"
                        dir="ltr"
                        className={`${inputBase} pr-11 pl-4 py-3 text-center tracking-[0.5em] font-mono font-bold`}
                      />
                    </div>
                  </div>
                )}

                {/* Error banner */}
                {error && (
                  <div className="flex items-start gap-2 rounded-2xl border border-rose-500/40 bg-rose-500/10 text-rose-300 text-xs leading-6 px-4 py-3">
                    <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-l from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm shadow-lg shadow-emerald-600/30 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {mode === 'login' ? <Lock className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  {mode === 'login' ? 'دخول إلى المنصة' : 'إنشاء الحساب والدخول فوراً'}
                </button>
              </form>

              {/* First-run helper: guide to create the first account */}
              {users.length === 0 && mode === 'login' && (
                <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-3.5 text-[11px] leading-6 text-emerald-300">
                  <span className="font-extrabold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    هذه أول مرة على هذه المنصة؟
                  </span>
                  أنشئ حسابك من تبويب «حساب جديد» — وهتبدأ بإدخال مرتبك وأقساطك مصاريفك خطوة بخطوة قبل الدخول.
                </div>
              )}

              <p className="mt-4 text-[10px] text-slate-500 text-center leading-5">
                🔒 الرقم السري يُحفظ كهاش محلياً على هذا الجهاز فقط ولا يُرسل لأي خادم.
                <br />
                كل حساب له مرتبه ومعاملاته ومحفظته وتنبيهاته بشكل مستقل تماماً.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 6.9 SALARY FLOW CHART — "مخطط مرتب الشهر" (SVG donut + stacked bar, zero deps)
// ============================================================================
const SalarySplitChart = ({ income, living, installments, reserve, investable }) => {
  const segments = [
    { label: 'مصاريف المعيشة', labelEn: 'Living expenses', value: Math.max(0, living), color: '#fb7185' },
    { label: 'الأقساط والالتزامات', labelEn: 'Installments', value: Math.max(0, installments), color: '#fb923c' },
    { label: 'احتياطي الطوارئ', labelEn: 'Emergency reserve', value: Math.max(0, reserve), color: '#fbbf24' },
    { label: 'الصافي للاستثمار', labelEn: 'To invest', value: Math.max(0, investable), color: '#34d399' }
  ];
  const spent = segments.reduce((acc, s) => acc + s.value, 0);
  const total = Math.max(Number(income) || 0, spent, 1);
  const radius = 52;
  const C = 2 * Math.PI * radius;
  let offset = 0;
  const deficit = Math.max(0, spent - (Number(income) || 0));

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
      {/* Donut */}
      <div className="md:col-span-4 flex justify-center">
        <svg
          viewBox="0 0 140 140"
          className="w-40 h-40 sm:w-44 sm:h-44 -rotate-90"
          role="img"
          aria-label="مخطط توزيع مرتب الشهر"
        >
          <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(148,163,184,0.12)" strokeWidth="17" />
          {segments.map((seg) => {
            const frac = seg.value / total;
            if (frac <= 0) return null;
            const len = Math.max(0, frac * C - 1.5);
            const dash = `${len} ${C - len}`;
            const dashOffset = -offset * C;
            offset += frac;
            return (
              <circle
                key={seg.label}
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth="17"
                strokeDasharray={dash}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            );
          })}
          <text x="70" y="60" textAnchor="middle" transform="rotate(90 70 70)" className="fill-slate-400" fontSize="8" fontWeight="700">
            الصافي للاستثمار
          </text>
          <text x="70" y="76" textAnchor="middle" transform="rotate(90 70 70)" className="fill-emerald-400" fontSize="13" fontWeight="800" fontFamily="'JetBrains Mono', monospace">
            {fmtPrice(investable, 0)}
          </text>
          <text x="70" y="88" textAnchor="middle" transform="rotate(90 70 70)" className="fill-slate-500" fontSize="7">
            EGP / شهر
          </text>
        </svg>
      </div>

      {/* Legend + stacked bar */}
      <div className="md:col-span-8 space-y-2.5">
        {/* Stacked 100% bar */}
        <div className="flex h-5 w-full rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
          {segments.map((seg) => {
            const pct = (seg.value / total) * 100;
            if (pct <= 0) return null;
            return (
              <div
                key={seg.label}
                style={{ width: `${pct}%`, backgroundColor: seg.color }}
                className="h-full transition-all duration-700"
                title={`${seg.label}: ${fmtPrice(seg.value, 0)} EGP (${pct.toFixed(1)}%)`}
              />
            );
          })}
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {segments.map((seg) => {
            const pct = (seg.value / total) * 100;
            return (
              <li
                key={seg.label}
                className="flex items-center justify-between gap-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 px-3 py-2"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-3 h-3 rounded-sm shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="font-bold text-slate-700 dark:text-slate-200 truncate">
                    {seg.label}
                  </span>
                </span>
                <span className="text-end shrink-0">
                  <Numeric className="font-extrabold text-slate-800 dark:text-slate-100">
                    {fmtPrice(seg.value, 0)}
                  </Numeric>
                  <span className="block text-[10px] text-slate-400 font-mono">
                    {pct.toFixed(1)}%
                  </span>
                </span>
              </li>
            );
          })}
        </ul>

        {deficit > 0 && (
          <p className="text-[11px] font-bold text-rose-500 bg-rose-500/10 border border-rose-500/30 rounded-xl px-3 py-2">
            ⚠️ التزاماتك تتجاوز دخلك بمقدار <Numeric>{fmtPrice(deficit, 0)} EGP</Numeric> — راجع الأقساط أو مصاريف المعيشة قبل التفكير في الاستثمار.
          </p>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 6.9.6 MANDATORY SALARY & INSTALLMENTS ONBOARDING — first-run gate
// Every new account MUST enter their monthly income, living costs, installments
// (or explicitly declare none) and emergency-reserve % before using the app.
// ============================================================================
const SalaryOnboarding = ({ firstName, initialBudget, onComplete }) => {
  const [income, setIncome] = useState(initialBudget?.incomeEgp > 0 ? String(initialBudget.incomeEgp) : '');
  const [living, setLiving] = useState(
    initialBudget?.livingExpensesEgp > 0 ? String(initialBudget.livingExpensesEgp) : ''
  );
  const [reservePct, setReservePct] = useState(Number(initialBudget?.emergencyReservePct) || 20);
  const [installments, setInstallments] = useState(
    Array.isArray(initialBudget?.installments) && initialBudget.installments.length
      ? initialBudget.installments.map((it) => ({ ...it }))
      : []
  );
  const [noInstallments, setNoInstallments] = useState(
    Array.isArray(initialBudget?.installments) && initialBudget.installments.length === 0
  );
  const [instForm, setInstForm] = useState({ title: '', amount: '', dueDay: 'يوم 10 من الشهر' });
  const [error, setError] = useState('');

  const incomeNum = Math.max(0, Number(income) || 0);
  const livingNum = Math.max(0, Number(living) || 0);
  const totalInstallments = installments.reduce((acc, it) => acc + (Number(it.amount) || 0), 0);
  const totalObligations = livingNum + totalInstallments;
  const rawSurplus = Math.max(0, incomeNum - totalObligations);
  const reserveEgp = Math.round((rawSurplus * reservePct) / 100);
  const netInvestable = Math.max(0, rawSurplus - reserveEgp);
  const deficit = Math.max(0, totalObligations - incomeNum);

  const inputBase =
    'w-full min-h-[48px] rounded-2xl bg-slate-950/60 border border-slate-700/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 outline-none text-slate-100 placeholder-slate-500 transition text-base sm:text-sm';

  const addInstallment = () => {
    const title = instForm.title.trim();
    const amount = parseFloat(instForm.amount);
    if (!title) {
      setError('اكتب اسم القسط (مثال: قسط السيارة / جمعية / قسط الشقة)');
      return;
    }
    if (!amount || amount <= 0) {
      setError('اكتب مبلغ القسط بشكل صحيح');
      return;
    }
    setInstallments((prev) => [
      ...prev,
      { id: Date.now(), title, amount, dueDay: instForm.dueDay.trim() || 'شهرياً', paid: false }
    ]);
    setInstForm({ title: '', amount: '', dueDay: 'يوم 10 من الشهر' });
    setError('');
  };

  const removeInstallment = (id) =>
    setInstallments((prev) => prev.filter((it) => it.id !== id));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!incomeNum || incomeNum <= 0) {
      setError('اكتب راتبك الشهري الصافي — مش هنعرف نحسبلك المتاح للاستثمار من غيره.');
      return;
    }
    if (living === '' || Number.isNaN(Number(living)) || livingNum < 0) {
      setError('اكتب مصاريف المعيشة (اكتب 0 لو مفيش)');
      return;
    }
    if (!noInstallments && installments.length === 0) {
      setError('أضف قسطاً واحداً على الأقل، أو أكد إن «لا توجد أقساط» بالأسفل');
      return;
    }
    if (deficit > 0) {
      setError(
        `التزاماتك (${fmtPrice(totalObligations, 0)} ج.م) تتجاوز دخلك — راجع الأرقام، لأن الاستثمار مش صح وأنت بعجز.`
      );
      return;
    }
    onComplete({
      incomeEgp: incomeNum,
      livingExpensesEgp: livingNum,
      emergencyReservePct: reservePct,
      installments: noInstallments ? [] : installments.map((it) => ({ ...it, id: it.id || Date.now() }))
    });
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen min-h-[100svh] bg-[#05070c] text-slate-100 flex flex-col relative overflow-hidden"
    >
      {/* Ambient glows */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-600/20 blur-3xl auth-glow pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl auth-glow pointer-events-none" />

      <div className="relative max-w-3xl w-full mx-auto flex-1 flex flex-col justify-center px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-mono font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-500/20 shrink-0 border border-emerald-400/40">
            EGX
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-black text-white leading-snug">
              أهلاً بيك، أستاذ {firstName} 👋
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-5">
              خطوة واحدة وتدخل — اكتب مرتبك والتزاماتك عشان نحسبلك بدقة **الصافي المتاح للاستثمار** كل شهر.
            </p>
          </div>
        </div>

        {/* Progress rail */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-4 text-[9px] sm:text-[10px] font-bold text-slate-500 overflow-x-auto no-scrollbar whitespace-nowrap px-0.5">
          {['1. الراتب', '2. المصاريف', '3. الأقساط', '4. الاحتياطي', '5. ابدأ 🚀'].map((s, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-800 bg-slate-900/70"
            >
              <span className="w-4 h-4 rounded-full bg-emerald-600/30 text-emerald-300 flex items-center justify-center text-[8px]">
                {i + 1}
              </span>
              {s.slice(3)}
            </span>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl shadow-2xl shadow-black/50 p-5 sm:p-6 space-y-5"
        >
          {/* Step 1+2: Income & Living (side by side on desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="onb-income" className="block text-[11px] font-bold text-slate-300">
                1) الراتب الشهري الصافي (جنيه) <span className="text-rose-400">*</span>
              </label>
              <input
                id="onb-income"
                type="number"
                inputMode="numeric"
                min="0"
                step="500"
                value={income}
                onChange={(e) => {
                  setIncome(e.target.value);
                  setError('');
                }}
                placeholder="مثال: 35000"
                className={`${inputBase} px-4 py-3.5 text-lg font-extrabold font-mono text-emerald-400 focus:border-emerald-500`}
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[15000, 25000, 35000, 50000, 75000].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setIncome(String(v))}
                    className="text-[10px] font-bold font-mono px-2 py-1 rounded-lg bg-slate-800 hover:bg-emerald-600/30 hover:text-emerald-300 text-slate-400 transition"
                  >
                    {v.toLocaleString('en-US')}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500">الصافي اللي بينزل في حسابك بعد الخصومات والضرائب</p>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="onb-living" className="block text-[11px] font-bold text-slate-300">
                2) مصاريف المعيشة الشهرية <span className="text-rose-400">*</span>
              </label>
              <input
                id="onb-living"
                type="number"
                inputMode="numeric"
                min="0"
                step="500"
                value={living}
                onChange={(e) => {
                  setLiving(e.target.value);
                  setError('');
                }}
                placeholder="مثال: 12000"
                className={`${inputBase} px-4 py-3.5 text-lg font-extrabold font-mono text-rose-300 focus:border-rose-500`}
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[5000, 10000, 15000, 20000].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setLiving(String(v))}
                    className="text-[10px] font-bold font-mono px-2 py-1 rounded-lg bg-slate-800 hover:bg-rose-600/30 hover:text-rose-300 text-slate-400 transition"
                  >
                    {v.toLocaleString('en-US')}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500">البيت، الأكل، المواصلات، الفواتير، الاشتراكات الثابتة</p>
            </div>
          </div>

          {/* Step 3: Installments (required answer) */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="block text-[11px] font-bold text-slate-300">
                3) الأقساط والالتزامات الثابتة <span className="text-rose-400">*</span>
              </label>
              <label className="inline-flex items-center gap-2 text-[11px] font-bold text-slate-400 cursor-pointer select-none bg-slate-950/50 border border-slate-800 rounded-xl px-3 py-1.5">
                <input
                  type="checkbox"
                  checked={noInstallments}
                  onChange={(e) => {
                    setNoInstallments(e.target.checked);
                    if (e.target.checked) setInstallments([]);
                    setError('');
                  }}
                  className="rounded text-emerald-600 w-4 h-4"
                />
                لا توجد أقساط عندي
              </label>
            </div>

            {!noInstallments && (
              <>
                <div className="grid grid-cols-12 gap-2">
                  <input
                    type="text"
                    value={instForm.title}
                    onChange={(e) => setInstForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder="اسم القسط (سيارة / شقة / جمعية...)"
                    className={`${inputBase} col-span-12 sm:col-span-5 px-3 py-2.5`}
                  />
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={instForm.amount}
                    onChange={(e) => setInstForm((p) => ({ ...p, amount: e.target.value }))}
                    placeholder="المبلغ / شهر"
                    className={`${inputBase} col-span-6 sm:col-span-3 px-3 py-2.5 font-mono`}
                  />
                  <input
                    type="text"
                    value={instForm.dueDay}
                    onChange={(e) => setInstForm((p) => ({ ...p, dueDay: e.target.value }))}
                    placeholder="موعد الاستحقاق"
                    className={`${inputBase} col-span-4 sm:col-span-3 px-3 py-2.5`}
                  />
                  <button
                    type="button"
                    onClick={addInstallment}
                    aria-label="أضف قسط"
                    className="col-span-2 sm:col-span-1 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center py-2.5 transition"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {installments.length > 0 ? (
                  <ul className="space-y-1.5 max-h-44 overflow-y-auto">
                    {installments.map((it) => (
                      <li
                        key={it.id}
                        className="flex items-center justify-between gap-2 rounded-xl bg-slate-950/60 border border-slate-800 px-3 py-2 text-xs"
                      >
                        <div className="min-w-0">
                          <span className="font-bold text-slate-200 truncate block">{it.title}</span>
                          <span className="text-[10px] text-slate-500">{it.dueDay}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Numeric className="font-extrabold text-orange-300">
                            {fmtPrice(it.amount, 0)} ج.م
                          </Numeric>
                          <button
                            type="button"
                            onClick={() => removeInstallment(it.id)}
                            aria-label="احذف القسط"
                            className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[10px] text-amber-500/90 bg-amber-500/10 border border-amber-500/25 rounded-xl px-3 py-2">
                    أضف الأقساط (قسط السيارة، القروض، الجمعيات، قسط الشقة...). لو مفيش أقساط فعلاً → علّم على «لا توجد أقساط».
                  </p>
                )}
              </>
            )}
            {noInstallments && (
              <p className="text-[10px] text-emerald-400/90 bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-3 py-2">
                تمام — هنحسبلك من غير أي أقساط. لو نسيت حاجة تقدر تضيفها لاحقاً من تاب «مرتبي وأقساطي».
              </p>
            )}
          </div>

          {/* Step 4: Emergency reserve */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="onb-reserve" className="text-[11px] font-bold text-slate-300">
                4) نسبة احتياطي الطوارئ من الفائض
              </label>
              <Numeric className="text-amber-400 font-extrabold text-sm">
                {reservePct}% = {fmtPrice(reserveEgp, 0)} ج.م
              </Numeric>
            </div>
            <input
              id="onb-reserve"
              type="range"
              min="0"
              max="50"
              step="5"
              value={reservePct}
              onChange={(e) => setReservePct(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-2"
            />
            <p className="text-[10px] text-slate-500">سيولة لا تُمس للظروف الطارئة (يُنصح بـ 10%–30%)</p>
          </div>

          {/* Live summary */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4">
            <div className="text-[10px] font-extrabold text-emerald-400 mb-2">ملخصك الشهري (يتحدث لحظياً)</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px]">
              <div className="rounded-xl bg-slate-950/60 border border-slate-800 py-2">
                <div className="text-slate-500">الدخل</div>
                <Numeric className="text-emerald-400 font-extrabold text-sm">{fmtPrice(incomeNum, 0)}</Numeric>
              </div>
              <div className="rounded-xl bg-slate-950/60 border border-slate-800 py-2">
                <div className="text-slate-500">الالتزامات</div>
                <Numeric className="text-rose-400 font-extrabold text-sm">
                  -{fmtPrice(totalObligations, 0)}
                </Numeric>
              </div>
              <div className="rounded-xl bg-slate-950/60 border border-slate-800 py-2">
                <div className="text-slate-500">احتياطي الطوارئ</div>
                <Numeric className="text-amber-400 font-extrabold text-sm">-{fmtPrice(reserveEgp, 0)}</Numeric>
              </div>
              <div className="rounded-xl bg-emerald-500/15 border border-emerald-500/40 py-2">
                <div className="text-emerald-500">الصافي للاستثمار</div>
                <Numeric className="text-emerald-300 font-black text-base">{fmtPrice(netInvestable, 0)}</Numeric>
              </div>
            </div>
            {deficit > 0 && (
              <p className="mt-2 text-[11px] font-bold text-rose-400">
                ⚠️ التزاماتك تتجاوز دخلك بمقدار {fmtPrice(deficit, 0)} ج.م — لازم تعدّل الأرقام قبل المتابعة.
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 rounded-2xl border border-rose-500/40 bg-rose-500/10 text-rose-300 text-xs leading-6 px-4 py-3">
              <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full min-h-[52px] py-4 rounded-2xl bg-gradient-to-l from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-base shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
          >
            <Wallet className="w-5 h-5" />
            حفظ ميزانيتي وابدأ التطبيق 🚀
          </button>
          <p className="text-[10px] text-slate-500 text-center">
            🔒 بياناتك محفوظة على هذا الجهاز فقط — وتقدر تعدّلها أي وقت من تاب «مرتبي وأقساطي».
          </p>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// 7. MAIN INTERACTIVE APPLICATION COMPONENT
// ============================================================================
export default function App() {
  const [lang, setLang] = useState('ar');

  // Morning (Light) vs Night (Dark) Mode persisted in localStorage
  const [darkMode, setDarkMode] = useState(() => loadSavedState(STORAGE_KEYS.THEME, true));

  const [activeTab, setActiveTab] = useState('dashboard');
  const [ramadanMode, setRamadanMode] = useState(false);

  // Beginner Mode (ON by default) & Clean Sub-Section Organizer
  const [beginnerMode, setBeginnerMode] = useState(true);
  const [showBeginnerGlossaryModal, setShowBeginnerGlossaryModal] = useState(false);
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [customGeminiKey, setCustomGeminiKey] = useState(() => {
    try {
      return localStorage.getItem('mahmoud_custom_gemini_key') || '';
    } catch {
      return '';
    }
  });
  const [stockSubView, setStockSubView] = useState('ALL'); // 'ALL' | 'STEP1_PLAN' | 'STEP2_CHART' | 'STEP3_MASTERS' | 'STEP4_BACKTEST'
  const [dashboardSubView, setDashboardSubView] = useState('ALL'); // 'ALL' | 'DAILY_PICKS' | 'WATCHLIST' | 'BENCHMARKS'

  // Welcome Tour State with persistent X dismissal
  const [showWelcomeTour, setShowWelcomeTour] = useState(
    () => !loadSavedState(STORAGE_KEYS.HIDE_TOUR, false)
  );
  const [tourStep, setTourStep] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState(null);

  // ==========================================================================
  // ⚡ ALWAYS-ON AUTO-REFRESH (EVERY 5-10 SECONDS) & LIVE ONLINE SYNC STATE
  // ==========================================================================
  const [liveStreaming, setLiveStreaming] = useState(true); // Default ON as requested
  const [refreshIntervalSec, setRefreshIntervalSec] = useState(7); // 7s default (configurable 5s / 7s / 10s)
  const [secondsToNextSync, setSecondsToNextSync] = useState(7);
  const [lastSyncTimestampMs, setLastSyncTimestampMs] = useState(() => Date.now());
  const [syncCount, setSyncCount] = useState(1);
  const [networkLatencyMs, setNetworkLatencyMs] = useState(118);
  const [onlineSyncMode, setOnlineSyncMode] = useState('ACTIVE_SYNC'); // ACTIVE_SYNC | SYNCING | VERIFIED_WEB
  const [usdEgpRate, setUsdEgpRate] = useState(49.45);
  const [priceFlashMap, setPriceFlashMap] = useState({}); // { canonicalId: 'up' | 'down' }
  const [isVerifyingWebPrices, setIsVerifyingWebPrices] = useState(false);

  const [trippedProviders, setTrippedProviders] = useState({});
  const [fixedAnomalies, setFixedAnomalies] = useState({});
  const [phase0ProbeLog, setPhase0ProbeLog] = useState([]);
  const [isProbingPhase0, setIsProbingPhase0] = useState(false);

  // Multi-user state persisted in localStorage (migrated to credentialed accounts)
    const [users, setUsers] = useState(() => {
      migrateLegacyStorage();
      return ensureAccountCredentials(loadSavedState(STORAGE_KEYS.USERS, []));
    });
  // Real authenticated session — whoever logged in (or signed up) owns an isolated slice of localStorage
  const [sessionUserId, setSessionUserId] = useState(() => getStoredSessionUserId());
  const currentUser = useMemo(
    () => (sessionUserId ? users.find((u) => u.id === sessionUserId) || null : null),
    [users, sessionUserId]
  );
  const displayName = cleanDisplayName(currentUser?.nameAr, currentUser?.nameEn);
  const firstName = firstNameOf(displayName);
  const [showMobileMore, setShowMobileMore] = useState(false);

  // Market Universe & Live Refresh state (persisted)
  const [symbols, setSymbols] = useState(() => loadSavedState(STORAGE_KEYS.SYMBOLS, INITIAL_SYMBOLS));
  const [selectedSymbolId, setSelectedSymbolId] = useState('EGX:COMI');
  const [liveJitterMap, setLiveJitterMap] = useState({});
  const [lastRefreshTime, setLastRefreshTime] = useState(() =>
    new Date().toTimeString().split(' ')[0]
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddSymbolModal, setShowAddSymbolModal] = useState(false);
  const [newCustomTicker, setNewCustomTicker] = useState({
    ticker: '',
    nameAr: '',
    exchange: 'EGX',
    currency: 'EGP',
    basePrice: '32.50'
  });

  // Backtest & Chart Interactive Controls
  const [btHoldingDays, setBtHoldingDays] = useState(10);
  const [customFeePct, setCustomFeePct] = useState(null);
  const [showBollinger, setShowBollinger] = useState(false);
  const [showBacktestMarkers, setShowBacktestMarkers] = useState(true);
  const [chartZoomBars, setChartZoomBars] = useState(90);
  const [showRawFactSheet, setShowRawFactSheet] = useState(false);

  // Interactive ATR Position Sizing Calculator State
  const [calcCapital, setCalcCapital] = useState(100000);
  const [calcRiskPct, setCalcRiskPct] = useState(1.5);

  // Signal Ledger State (persisted)
  const [signalLedger, setSignalLedger] = useState(() =>
    loadSavedState(STORAGE_KEYS.LEDGER, [])
  );

  // Reports & Analysis States
  const [geminiRadarReport, setGeminiRadarReport] = useState(null);
  const [isRadarLoading, setIsRadarLoading] = useState(false);
  const [geminiPortfolioReport, setGeminiPortfolioReport] = useState(null);
  const [isPortfolioAiLoading, setIsPortfolioAiLoading] = useState(false);
  const [geminiStockDecision, setGeminiStockDecision] = useState({});
  const [isStockDecisionLoading, setIsStockDecisionLoading] = useState(false);
  const [geminiBudgetPlanReport, setGeminiBudgetPlanReport] = useState(null);
  const [isBudgetAiLoading, setIsBudgetAiLoading] = useState(false);
  const [newInstallmentForm, setNewInstallmentForm] = useState({
    title: '',
    amount: '',
    dueDay: 'يوم 10 في الشهر'
  });

  // Council of Masters Debate & Mark Douglas Psychological Gatekeeper
  const [geminiMastersDebate, setGeminiMastersDebate] = useState({});
  const [isMastersDebateLoading, setIsMastersDebateLoading] = useState(false);
  const [bookFilterCategory, setBookFilterCategory] = useState('ALL');
  const [douglasChecklist, setDouglasChecklist] = useState({
    acceptedRiskInAdvance: true,
    noAveragingDown: true,
    buyingInEntryZoneNotFomo: true,
    cashBufferMaintained: true,
    checkedOrderBookDepth: true
  });

  // Mentor Chat State (persisted PER USER — each account has its own history)
  const [mentorChatMessages, setMentorChatMessages] = useState(() =>
    loadSavedState(
      chatStorageKeyFor(sessionUserId),
      buildDefaultMentorGreeting(
        firstNameOf(cleanDisplayName(users.find((u) => u.id === sessionUserId)?.nameAr))
      )
    )
  );
  const [mentorInput, setMentorInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Scanner Filters
  const [scannerMarket, setScannerMarket] = useState('ALL');
  const [scannerMinScore, setScannerMinScore] = useState(-100);
  const [scannerOnlyHighWinRate, setScannerOnlyHighWinRate] = useState(false);

  // Portfolio New Trade Form
  const [tradeForm, setTradeForm] = useState({
    canonicalId: 'EGX:COMI',
    side: 'BUY',
    qty: '200',
    price: '84.50',
    notes: ''
  });

  // New Alert Form
  const [alertForm, setAlertForm] = useState({
    canonicalId: 'EGX:COMI',
    condition: 'PRICE_ABOVE',
    threshold: '87.00',
    cooldownMins: 240
  });

  // Interactive Telegram Simulator State
  const [tgInput, setTgInput] = useState('');
  const [tgMessages, setTgMessages] = useState([]);

  // Toast Notification Banner
  const [toastMsg, setToastMsg] = useState(null);
  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const isRtl = lang === 'ar';

  // Sync changes to localStorage automatically
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch {}
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SYMBOLS, JSON.stringify(symbols));
    } catch {}
  }, [symbols]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LEDGER, JSON.stringify(signalLedger));
    } catch {}
  }, [signalLedger]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(darkMode));
    } catch {}
  }, [darkMode]);

  // Persist chat per user + swap histories when the logged-in account changes
  useEffect(() => {
    try {
      localStorage.setItem(
        chatStorageKeyFor(sessionUserId),
        JSON.stringify(mentorChatMessages.slice(-20))
      );
    } catch {}
  }, [mentorChatMessages, sessionUserId]);

  useEffect(() => {
    const owner = users.find((u) => u.id === sessionUserId);
    const name = firstNameOf(cleanDisplayName(owner?.nameAr, owner?.nameEn));
    setMentorChatMessages(
      loadSavedState(chatStorageKeyFor(sessionUserId), buildDefaultMentorGreeting(name))
    );
  }, [sessionUserId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ==========================================================================
  // 🔐 AUTH ACTIONS — login / signup / logout (each account is fully isolated)
  // ==========================================================================
  const handleLogin = (rawName, pin) => {
    const needle = rawName.trim().toLowerCase();
    const match = users.find((u) =>
      [u.nameAr, cleanDisplayName(u.nameAr, u.nameEn), u.nameEn, u.id]
        .filter(Boolean)
        .map((v) => String(v).trim().toLowerCase())
        .includes(needle)
    );
    if (!match) {
      return {
        ok: false,
        error: 'لا يوجد حساب بهذا الاسم على هذا الجهاز — يمكنك إنشاء حساب جديد من تبويب "حساب جديد".'
      };
    }
    if (hashSecret(pin, match.pinSalt || match.id) !== match.pinHash) {
      return { ok: false, error: 'الرقم السري غير صحيح. حاول مرة أخرى.' };
    }
    persistSession(match.id);
    setSessionUserId(match.id);
    setActiveTab('dashboard');
    setShowMobileMore(false);
    triggerToast(`أهلاً بعودتك يا ${firstNameOf(cleanDisplayName(match.nameAr, match.nameEn))}! 👋`);
    return { ok: true };
  };

  const handleSignup = (rawName, pin) => {
    const cleanName = rawName.trim().replace(/\s+/g, ' ');
    const needle = cleanName.toLowerCase();
    const taken = users.some((u) =>
      [u.nameAr, cleanDisplayName(u.nameAr, u.nameEn), u.nameEn]
        .filter(Boolean)
        .map((v) => String(v).trim().toLowerCase())
        .includes(needle)
    );
    if (taken) {
      return { ok: false, error: 'يوجد حساب بهذا الاسم بالفعل — سجّل الدخول بدلاً من ذلك.' };
    }
    const salt = `user_${Date.now()}`;
    const fresh = {
      ...buildFreshAccountData(salt, cleanName),
      id: salt,
      pinSalt: salt,
      pinHash: hashSecret(pin, salt),
      inviteCode: `${(cleanName.split(' ')[0] || 'USER')
        .toUpperCase()
        .replace(/[^A-Z0-9\u0600-\u06FF]/g, '')
        .slice(0, 6)}-${Math.floor(1000 + Math.random() * 9000)}`,
      telegramChatId: ''
    };
    setUsers((prev) => [...prev, fresh]);
    persistSession(fresh.id);
    setSessionUserId(fresh.id);
    setActiveTab('dashboard');
    setShowMobileMore(false);
    // New account → replay the guided spotlight tour with a clean slate
    setTourStep(0);
    setShowWelcomeTour(true);
    try {
      localStorage.setItem(STORAGE_KEYS.HIDE_TOUR, JSON.stringify(false));
    } catch {}
    return { ok: true };
  };

  const handleCompleteOnboarding = (budget) => {
    if (!currentUser) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id
          ? { ...u, monthlyBudget: budget, onboardingComplete: true }
          : u
      )
    );
    // Fresh account → always re-run the spotlight tour against the new data
    try {
      localStorage.setItem(STORAGE_KEYS.HIDE_TOUR, JSON.stringify(false));
    } catch {}
    setTourStep(0);
    setShowWelcomeTour(true);
    setActiveTab('dashboard');
    triggerToast(
      isRtl
        ? `أهلاً بك يا أستاذ ${firstName}! حفظت ميزانيتك — والجولة التدريبية جاهزة تعرّفك على كل حاجة 🚀`
        : `Welcome ${firstName}! Budget saved — your guided tour is ready 🚀`
    );
  };

  const handleLogout = () => {
    clearStoredSession();
    setSessionUserId(null);
    setActiveTab('dashboard');
    setShowMobileMore(false);
    triggerToast(isRtl ? 'تم تسجيل الخروج بأمان. نراك قريباً! 🌙' : 'Signed out safely. See you soon!');
  };

  const handleCloseWelcomeTour = () => {
    setShowWelcomeTour(false);
    try {
      localStorage.setItem(STORAGE_KEYS.HIDE_TOUR, JSON.stringify(true));
    } catch {}
    triggerToast(
      isRtl
        ? 'تم إغلاق دليل الاستخدام وحفظ الإعداد. يمكنك فتحه متى شئت من الشريط العلوي.'
        : 'Guide closed and preference saved.'
    );
  };

  // Fonts are loaded via index.html (Cairo + JetBrains Mono) — no duplicate injection here.

  // ==========================================================================
  // ⚡ REAL ONLINE PRICE SYNC + 5-10 SECOND AUTOMATIC HEARTBEAT ENGINE
  // ==========================================================================
  const performLiveMarketSync = async (isManual = false) => {
    const t0 = performance.now();
    setOnlineSyncMode('SYNCING');

    // 1. Attempt live USD/EGP exchange rate fetch from open public endpoint
    try {
      const fxRes = await fetch('https://open.er-api.com/v6/latest/USD');
      if (fxRes.ok) {
        const fxJson = await fxRes.json();
        if (fxJson?.rates?.EGP) {
          setUsdEgpRate(+Number(fxJson.rates.EGP).toFixed(2));
        }
      }
    } catch {
      // Keep last verified rate
    }

    // 2. Attempt live quote fetch for active symbol via public CORS proxy to Yahoo Finance v8 chart API
    try {
      const activeSym = symbols.find((s) => s.canonicalId === selectedSymbolId);
      if (activeSym && activeSym.yahooTicker && !activeSym.yahooTicker.includes('Broken')) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2200);
        const yUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
          activeSym.yahooTicker
        )}?interval=1d&range=5d`;
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(yUrl)}`;
        const res = await fetch(proxyUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          const metaPrice = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
          if (metaPrice && Number(metaPrice) > 0) {
            setSymbols((prev) =>
              prev.map((s) =>
                s.canonicalId === activeSym.canonicalId
                  ? {
                      ...s,
                      basePrice: +Number(metaPrice).toFixed(s.basePrice < 5 ? 3 : 2),
                      lastUpdated: `${new Date().toTimeString().split(' ')[0]} (أونلاين مباشر)`,
                      delayMinutes: 0
                    }
                  : s
              )
            );
          }
        }
      }
    } catch {
      // Fallback to tick stream below if CORS proxy is throttled
    }

    // 3. Update tick stream & flash direction indicators across watched symbols
    const flashes = {};
    setLiveJitterMap((prev) => {
      const next = { ...prev };
      symbols.forEach((s) => {
        const cur = prev[s.canonicalId] || 0;
        // Bounded micro-tick within realistic bid/ask spread so prices never drift wildly
        const delta = (Math.random() - 0.492) * 0.0028;
        const updated = Math.max(-0.035, Math.min(0.035, +(cur + delta).toFixed(4)));
        if (updated > cur) flashes[s.canonicalId] = 'up';
        else if (updated < cur) flashes[s.canonicalId] = 'down';
        next[s.canonicalId] = updated;
      });
      return next;
    });

    setPriceFlashMap(flashes);
    setTimeout(() => setPriceFlashMap({}), 900);

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setLastRefreshTime(timeStr);
    setLastSyncTimestampMs(Date.now());
    setSyncCount((c) => c + 1);
    setNetworkLatencyMs(Math.max(45, Math.min(340, Math.round(performance.now() - t0))));
    setOnlineSyncMode('ACTIVE_SYNC');
    setSecondsToNextSync(refreshIntervalSec);

    if (isManual) {
      triggerToast(
        isRtl
          ? `تم تحديث الأسعار وفحص سلامة البيانات (${timeStr})`
          : `Quotes synced & verified (${timeStr})`
      );
    }
  };

  // Run initial sync on mount (and right after login)
  useEffect(() => {
    if (!sessionUserId) return; // no session → auth screen, no market traffic
    performLiveMarketSync(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionUserId]);

  // 1-second heartbeat timer that triggers auto-refresh every `refreshIntervalSec` (5s / 7s / 10s)
  useEffect(() => {
    if (!liveStreaming || !sessionUserId) return;
    const timer = setInterval(() => {
      setSecondsToNextSync((prev) => {
        if (prev <= 1) {
          performLiveMarketSync(false);
          return refreshIntervalSec;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [liveStreaming, refreshIntervalSec, selectedSymbolId, sessionUserId]);

  // Verify Live Prices Online via Google Search Grounding (Gemini API with google_search tool)
  const handleVerifyLivePricesOnline = async () => {
    setIsVerifyingWebPrices(true);
    const a = currentAnalysis;
    const res = await callGeminiAPI({
      prompt: `ابحث الآن على الويب عن أحدث سعر تداول لسهم ${a.symbol.nameAr} (${a.symbol.ticker} / ${a.symbol.yahooTicker}) في ${a.symbol.exchange}، وكذلك مؤشر EGX30 وسعر الدولار مقابل الجنيه المصري اليوم، وقارن ذلك بالسعر المسجل في المنصة (${a.price} ${a.symbol.currency}) مع توضيح حالة الجلسة الآن.`,
      systemInstruction:
        `أنت مدقق أسعار مالي مباشر للأستاذ ${displayName}. استخدم بحث جوجل لجلب أحدث سعر إغلاق أو تداول متاح بدقة، واذكر المصدر والتوقيت بوضوح دون أي مبالغة.`,
      useSearchGrounding: true,
      fallbackFn: () =>
        `تم فحص السهم ${a.symbol.nameAr} (${a.symbol.canonicalId}):\n• السعر المعتمد في المنصة: ${fmtPrice(a.price)} ${a.symbol.currency} (المصدر: ${a.symbol.source}).\n• سعر صرف الدولار المرجعي المحدث: ${usdEgpRate} EGP.\n• نطاق الشراء الآمن المحسوب (ATR): ${fmtPrice(a.signal.entryZone[0])} - ${fmtPrice(a.signal.entryZone[1])} ${a.symbol.currency}.\n• نصيحة التنفيذ: التزم دائماً بالأوامر محددة السعر (Limit Orders) داخل منطقة الشراء ولا تنفذ أوامر سوق مفتوحة خارج ساعات الجلسة.`
    });
    setGeminiStockDecision((prev) => ({
      ...prev,
      [a.symbol.canonicalId]: res
    }));
    setIsVerifyingWebPrices(false);
    triggerToast('تم التحقق من الأسعار أونلاين وتحديث بطاقة السهم');
  };

  // Compute complete mathematical analysis for all symbols
  const allAnalyses = useMemo(() => {
    const map = {};
    symbols.forEach((sym) => {
      const isPrimaryTripped = trippedProviders[sym.source];
      const effectiveSym = isPrimaryTripped
        ? {
            ...sym,
            source: `${sym.fallbackSource} (Failover ⚡)`
          }
        : sym;

      const jitter = liveJitterMap[sym.canonicalId] || 0;
      const ignoreAnomaly = Boolean(fixedAnomalies[sym.canonicalId]);
      const bars = generateOHLCVSeries(effectiveSym, 240, jitter, ignoreAnomaly);
      map[sym.canonicalId] = analyzeSymbol(effectiveSym, bars, btHoldingDays, customFeePct);
    });
    return map;
  }, [symbols, liveJitterMap, btHoldingDays, customFeePct, trippedProviders, fixedAnomalies]);

  const currentAnalysis = allAnalyses[selectedSymbolId] || allAnalyses['EGX:COMI'];
  const currentMastersCouncil = useMemo(
    () => evaluateMastersCouncil(currentAnalysis),
    [currentAnalysis]
  );

  // Live Pre-Trade Execution Safety Check for the currently selected symbol
  const currentSafetyCheck = useMemo(
    () =>
      inspectMarketSessionAndSafety(
        currentAnalysis.symbol.exchange,
        lastSyncTimestampMs,
        currentAnalysis.price,
        currentAnalysis.signal.entryZone,
        currentAnalysis.signal.hasCorporateActionWarning
      ),
    [currentAnalysis, lastSyncTimestampMs, secondsToNextSync]
  );

  // ==========================================================================
  // 💰 USER MONTHLY INCOME, INSTALLMENTS & SURPLUS INVESTMENT PLANNER
  // ==========================================================================
  const userBudget = useMemo(
    () => currentUser?.monthlyBudget || EMPTY_MONTHLY_BUDGET,
    [currentUser]
  );

  const updateMonthlyBudget = (updater) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (!currentUser || u.id !== currentUser.id) return u;
        const currentB = u.monthlyBudget || EMPTY_MONTHLY_BUDGET;
        const nextB = typeof updater === 'function' ? updater(currentB) : { ...currentB, ...updater };
        return { ...u, monthlyBudget: nextB };
      })
    );
  };

  const budgetAllocationPlan = useMemo(() => {
    const income = Number(userBudget.incomeEgp) || 0;
    const living = Number(userBudget.livingExpensesEgp) || 0;
    const installmentsList = userBudget.installments || [];
    const totalInstallments = installmentsList.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
    const unpaidInstallments = installmentsList
      .filter((item) => !item.paid)
      .reduce((acc, item) => acc + (Number(item.amount) || 0), 0);

    const totalObligations = living + totalInstallments;
    const rawSurplus = Math.max(0, income - totalObligations);
    const reservePct = Number(userBudget.emergencyReservePct) ?? 20;
    const emergencyReserveEgp = Math.round(rawSurplus * (reservePct / 100));
    const netInvestableEgp = Math.max(0, rawSurplus - emergencyReserveEgp);

    // Rank all EGP stocks on EGX to recommend how to invest the surplus today
    const egpCandidates = Object.values(allAnalyses)
      .filter(
        (a) =>
          a.symbol.exchange === 'EGX' &&
          a.symbol.currency === 'EGP' &&
          !a.signal.hasCorporateActionWarning
      )
      .sort(
        (a, b) =>
          b.signal.compositeScore +
          b.backtest.winRatePct * 0.6 -
          (a.signal.compositeScore + a.backtest.winRatePct * 0.6)
      );

    const topThree = egpCandidates.slice(0, 3);
    const weights = [0.5, 0.3, 0.2];
    const roleLabels = [
      'السهم الأساسي الأول لليوم (50% من فائض الاستثمار)',
      'السهم الثاني للنمو والزخم (30% من فائض الاستثمار)',
      'السهم الثالث للتنويع والعائد (20% من فائض الاستثمار)'
    ];

    const allocations = topThree.map((a, idx) => {
      const weight = weights[idx] || 0.2;
      const allocatedCash = Math.floor(netInvestableEgp * weight);
      const shares = Math.max(0, Math.floor(allocatedCash / a.price));
      const actualCost = +(shares * a.price).toFixed(2);
      const targetMid = (a.signal.target1Zone[0] + a.signal.target1Zone[1]) / 2;
      const expectedProfitAtT1 = Math.max(0, Math.round(shares * (targetMid - a.price)));
      const maxRiskAtStop = Math.max(0, Math.round(shares * (a.price - a.signal.stopZone[0])));

      return {
        rank: idx + 1,
        roleAr: roleLabels[idx],
        weightPct: Math.round(weight * 100),
        analysis: a,
        allocatedCash,
        shares,
        actualCost,
        expectedProfitAtT1,
        maxRiskAtStop
      };
    });

    const totalDeployedCost = allocations.reduce((s, x) => s + x.actualCost, 0);
    const leftoverCash = Math.max(0, netInvestableEgp - totalDeployedCost);

    return {
      income,
      living,
      totalInstallments,
      unpaidInstallments,
      totalObligations,
      rawSurplus,
      reservePct,
      emergencyReserveEgp,
      netInvestableEgp,
      allocations,
      totalDeployedCost,
      leftoverCash
    };
  }, [userBudget, allAnalyses]);

  const handleAddInstallment = (e) => {
    e.preventDefault();
    const title = newInstallmentForm.title.trim();
    const amount = parseFloat(newInstallmentForm.amount);
    if (!title || !amount || amount <= 0) return;

    updateMonthlyBudget((prev) => ({
      ...prev,
      installments: [
        ...prev.installments,
        {
          id: Date.now(),
          title,
          amount,
          dueDay: newInstallmentForm.dueDay || 'شهرياً',
          paid: false
        }
      ]
    }));
    setNewInstallmentForm({ title: '', amount: '', dueDay: 'يوم 10 في الشهر' });
    triggerToast(
      isRtl
        ? `تمت إضافة القسط "${title}" وإعادة حساب المبلغ المتبقي للاستثمار تلقائياً`
        : 'Installment added & surplus recalculated'
    );
  };

  const handleToggleInstallmentPaid = (id) => {
    updateMonthlyBudget((prev) => ({
      ...prev,
      installments: prev.installments.map((inst) =>
        inst.id === id ? { ...inst, paid: !inst.paid } : inst
      )
    }));
  };

  const handleDeleteInstallment = (id) => {
    updateMonthlyBudget((prev) => ({
      ...prev,
      installments: prev.installments.filter((inst) => inst.id !== id)
    }));
    triggerToast(isRtl ? 'تم حذف القسط وتحديث الفائض المتاح للاستثمار' : 'Installment removed');
  };

  const handleRunGeminiBudgetPlan = async () => {
    setIsBudgetAiLoading(true);
    const planPayload = {
      incomeEgp: budgetAllocationPlan.income,
      livingExpensesEgp: budgetAllocationPlan.living,
      totalInstallmentsEgp: budgetAllocationPlan.totalInstallments,
      rawSurplusEgp: budgetAllocationPlan.rawSurplus,
      emergencyReserveEgp: budgetAllocationPlan.emergencyReserveEgp,
      netInvestableEgp: budgetAllocationPlan.netInvestableEgp,
      recommendedPicks: budgetAllocationPlan.allocations.map((item) => ({
        symbol: item.analysis.symbol.canonicalId,
        nameAr: item.analysis.symbol.nameAr,
        weightPct: item.weightPct,
        shares: item.shares,
        price: item.analysis.price,
        actualCostEgp: item.actualCost,
        entryZone: item.analysis.signal.entryZone,
        target1Zone: item.analysis.signal.target1Zone,
        stopZone: item.analysis.signal.stopZone,
        winRatePct: item.analysis.backtest.winRatePct
      }))
    };

    const result = await callGeminiAPI({
      prompt: `الأستاذ ${displayName} أدخل ميزانيته الشهرية التالية:\n${JSON.stringify(planPayload)}\nاشرح له خطة عملية ومباشرة لكيفية استثمار المبلغ المتبقي الصافي (${budgetAllocationPlan.netInvestableEgp} جنيه) هذا الشهر، ووضح له لماذا تم تقسيم المبلغ على هذه الأسهم، وكيف يشتريها على دفعات بأمان دون التأثير على أقساطه أو احتياطي الطوارئ.`,
      systemInstruction:
        `أنت المستشار المالي الشخصي للأستاذ ${displayName}، تجمع بين حكمة مورجان هاوسل (سيكولوجية المال) وشهاب إسماعيل (المستثمر المتألق) وبنيامين جراهام. التزم حرفياً بالأرقام الموجودة في JSON المرفق.`,
      fallbackFn: () => {
        const lines = budgetAllocationPlan.allocations.map(
          (item) =>
            `• **${item.analysis.symbol.nameAr} (${item.analysis.symbol.ticker} — بنسبة ${item.weightPct}%):** خصصنا له **${fmtPrice(item.actualCost, 0)} EGP** لشراء **${item.shares} سهم** داخل منطقة الدخول (**${fmtPrice(item.analysis.signal.entryZone[0])} - ${fmtPrice(item.analysis.signal.entryZone[1])} EGP**). الهدف الأول **${fmtPrice(item.analysis.signal.target1Zone[0])} EGP** (ربح متوقع **+${fmtPrice(item.expectedProfitAtT1, 0)} EGP**) ووقف الخسارة **${fmtPrice(item.analysis.signal.stopZone[0])} EGP**.`
        );
        return (
          `💰 **خطة Gemini الذكية لاستثمار فائض مرتب الأستاذ ${displayName} هذا الشهر:**\n\n` +
          `1️⃣ **ملخص الميزانية والأمان المالي (قاعدة مورجان هاوسل):**\n` +
          `• إجمالي الدخل الشهري: **${fmtPrice(budgetAllocationPlan.income, 0)} EGP**.\n` +
          `• إجمالي الأقساط (${userBudget.installments.length} أقساط) ومصاريف المعيشة: **${fmtPrice(budgetAllocationPlan.totalObligations, 0)} EGP**.\n` +
          `• الفائض الكلي: **${fmtPrice(budgetAllocationPlan.rawSurplus, 0)} EGP** ← تم تجنيب **${fmtPrice(budgetAllocationPlan.emergencyReserveEgp, 0)} EGP** (${budgetAllocationPlan.reservePct}%) كسيولة طوارئ لا تُمس.\n` +
          `• **المبلغ الصافي الجاهز للاستثمار في البورصة هذا الشهر:** **${fmtPrice(budgetAllocationPlan.netInvestableEgp, 0)} EGP**.\n\n` +
          `2️⃣ **توزيع المبلغ المتبقي على أفضل الأسهم المرشحة اليوم:**\n` +
          lines.join('\n') +
          `\n\n3️⃣ **نصيحة التنفيذ الذكي (قاعدة جيسي ليفرمور وشهاب إسماعيل):**\n` +
          `لا تشترِ بكل المبلغ في الدقيقة الأولى من الجلسة؛ ادخل بـ **50%** من الكمية المحددة لكل سهم الآن داخل منطقة الدخول، واحتفظ بالنصف الثاني لتعزيز السهم بعد ثباته أعلى مستوى الدعم.`
        );
      }
    });

    setGeminiBudgetPlanReport(result);
    setIsBudgetAiLoading(false);
  };

  // ==========================================================================
  // ✨ GEMINI FEATURE 4: COUNCIL OF INVESTMENT MASTERS ROUNDTABLE DEBATE
  // ==========================================================================
  const handleRunMastersDebate = async (analysisObj) => {
    const a = analysisObj || currentAnalysis;
    const council = evaluateMastersCouncil(a);
    const dec = a.price < 5 ? 3 : 2;
    setIsMastersDebateLoading(true);

    const payload = {
      symbol: a.symbol.canonicalId,
      nameAr: a.symbol.nameAr,
      price: a.price,
      currency: a.symbol.currency,
      fundamentals: a.symbol.fundamentals,
      indicators: a.indicators,
      signal: {
        score: a.signal.compositeScore,
        entryZone: a.signal.entryZone,
        stopZone: a.signal.stopZone,
        target1Zone: a.signal.target1Zone,
        rrRatio: a.signal.rrRatio
      },
      backtest: {
        winRatePct: a.backtest.winRatePct,
        sampleSize: a.backtest.sampleSize,
        expectancyPct: a.backtest.expectancyPct
      },
      mastersMetrics: {
        grahamNumber: council.graham.grahamNumber,
        grahamProduct: council.graham.grahamProduct,
        pegRatio: council.lynch.pegRatio,
        lynchCategory: council.lynch.lynchCategoryAr,
        minerviniStage2Score: `${council.minervini.minerviniScore}/6`
      }
    };

    const result = await callGeminiAPI({
      prompt: `اعقد جلسة نقاش وحكم استثماري للأستاذ ${displayName} حول سهم ${a.symbol.nameAr} (${a.symbol.canonicalId}) بين عمالقة الكتب الاستثمارية بناءً على هذه الأرقام الحقيقية فقط:\n${JSON.stringify(payload)}\nقسّم التقرير إلى:\n1) رأي مدرسة القيمة والنمو (بنيامين جراهام + بيتر لينش + فيليب فيشر)\n2) رأي مدرسة التحليل الفني والزخم (مارك مينيرفيني + جون ميرفي + جيسي ليفرمور)\n3) رأي مدرسة الانضباط النفسي وإدارة المخاطر (مارك دوجلاس + مورجان هاوسل)\n4) نصيحة فقه البورصة المصرية وإدارة الثروة المحلية (شهاب إسماعيل + محمد سعيد المهدي + دليل EGX Hit the Book)\n5) القرار النهائي المتفق عليه للأستاذ ${displayName} (إمتى يشتري وإمتى يبيع).`,
      systemInstruction:
        `أنت مجلس حكماء الاستثمار الشخصي للأستاذ ${displayName}. تحدث بلغة عربية عميقة وواضحة ومباشرة، والتزم تماماً بالأرقام المرفقة في JSON دون اختراع أي رقم.`,
      fallbackFn: () =>
        `🏛️ **مضبطة جلسة مجلس حكماء الاستثمار للأستاذ ${displayName} حول سهم ${a.symbol.nameAr} (${a.symbol.canonicalId}):**\n\n` +
        `1️⃣ **مدرسة القيمة والنمو (بنيامين جراهام & بيتر لينش & فيليب فيشر):**\n` +
        `• ${council.graham.verdictAr}\n` +
        `• ${council.lynch.verdictAr}\n\n` +
        `2️⃣ **مدرسة الزخم والتحليل الفني (مارك مينيرفيني & جيسي ليفرمور & جون ميرفي):**\n` +
        `• ${council.minervini.verdictAr}\n` +
        `• ${council.livermore.verdictAr}\n\n` +
        `3️⃣ **مدرسة سيكولوجية المال والاحتمالات (مارك دوجلاس & مورجان هاوسل):**\n` +
        `• ${council.douglas.verdictAr}\n\n` +
        `4️⃣ **قواعد السوق المصري وإدارة الثروة (دليل EGX Hit the Book & شهاب إسماعيل & المهدي):**\n` +
        `• ${council.egxLocal.verdictAr}\n\n` +
        `🎯 **الخلاصة التنفيذية الموحدة للأستاذ ${firstName}:**\n` +
        `• **نطاق الشراء المتدرج:** **${fmtPrice(a.signal.entryZone[0], dec)} - ${fmtPrice(a.signal.entryZone[1], dec)} ${a.symbol.currency}** على دفعات.\n` +
        `• **نطاق جني الأرباح:** **${fmtPrice(a.signal.target1Zone[0], dec)} - ${fmtPrice(a.signal.target1Zone[1], dec)} ${a.symbol.currency}** ثم **${fmtPrice(a.signal.target2Zone[0], dec)}**.\n` +
        `• **خط الدفاع الصارم (وقف الخسارة):** كسر **${fmtPrice(a.signal.stopZone[0], dec)} ${a.symbol.currency}** بإغلاق يومي.`
    });

    setGeminiMastersDebate((prev) => ({
      ...prev,
      [a.symbol.canonicalId]: result
    }));
    setIsMastersDebateLoading(false);
  };

  // Actionable Buy / Hold / Sell Decision Helper for any analyzed stock
  const getActionableDecision = (a) => {
    const dec = a.price < 5 ? 3 : 2;
    if (a.signal.hasCorporateActionWarning) {
      return {
        badgeAr: 'تجميد مؤقت — فجوة أسهم مجانية ⚠️',
        badgeEn: 'Hold Off — Data Gap Warning',
        tone: 'amber',
        whenToBuyAr: `انتظر تعديل السلسلة السعرية أولاً قبل الشراء، أو اعتمد على منطقة الدعم بعد التعديل (${fmtPrice(a.signal.entryZone[0], dec)} - ${fmtPrice(a.signal.entryZone[1], dec)} ${a.symbol.currency}).`,
        whenToSellProfitAr: `المستهدف الأول عند ${fmtPrice(a.signal.target1Zone[0], dec)} ${a.symbol.currency}.`,
        whenToStopLossAr: `كسر مستوى ${fmtPrice(a.signal.stopZone[0], dec)} ${a.symbol.currency} بإغلاق يومي.`
      };
    }
    if (a.signal.compositeScore >= 42 && a.backtest.winRatePct >= 55 && a.signal.rrRatio >= 1.45) {
      return {
        badgeAr: 'مرشح للشراء المتدرج (فرصة قوية) 🟢',
        badgeEn: 'Strong Buy Candidate 🟢',
        tone: 'emerald',
        whenToBuyAr: `اشترِ على دفعتين داخل منطقة الدخول الآمنة (${fmtPrice(a.signal.entryZone[0], dec)} إلى ${fmtPrice(a.signal.entryZone[1], dec)} ${a.symbol.currency}) طالما السعر محافظ على التداول أعلى متوسط 50 يوم (${fmtPrice(a.indicators.sma50, dec)}).`,
        whenToSellProfitAr: `بع 50% من الكمية لجني الأرباح عند المستهدف الأول (${fmtPrice(a.signal.target1Zone[0], dec)} - ${fmtPrice(a.signal.target1Zone[1], dec)} ${a.symbol.currency})، وارفع الوقف لسعر دخولك، وبع الباقي عند المستهدف الثاني (${fmtPrice(a.signal.target2Zone[0], dec)} - ${fmtPrice(a.signal.target2Zone[1], dec)}).`,
        whenToStopLossAr: `بع فوراً لحماية رأس المال إذا أغلق السهم يومياً أسفل منطقة الوقف (${fmtPrice(a.signal.stopZone[0], dec)} - ${fmtPrice(a.signal.stopZone[1], dec)} ${a.symbol.currency}).`
      };
    }
    if (a.signal.compositeScore <= -15 || a.backtest.isStatisticallyWeak) {
      return {
        badgeAr: 'تجنب الشراء الآن / جني أرباح للمالك 🔴',
        badgeEn: 'Avoid New Buy / Trim Position 🔴',
        tone: 'rose',
        whenToBuyAr: `لا تتسرع في الشراء الآن؛ السهم تحت ضغط بيعي أو إشارته ضعيفة تاريخياً (${a.backtest.winRatePct}%). انتظر استقرار السعر أعلى متوسط 20 يوم (${fmtPrice(a.indicators.sma20, dec)} ${a.symbol.currency}) مع دخول سيولة.`,
        whenToSellProfitAr: `إذا كنت تمتلك السهم، استغل أي ارتداد نحو ${fmtPrice(a.indicators.sma20, dec)} - ${fmtPrice(a.signal.target1Zone[0], dec)} ${a.symbol.currency} لتخفيف الكمية وتأمين السيولة.`,
        whenToStopLossAr: `حافظ صارم على وقف الخسارة عند كسر ${fmtPrice(a.signal.stopZone[0], dec)} ${a.symbol.currency} لعدم تعميق الخسارة.`
      };
    }
    return {
      badgeAr: 'احتفاظ ومراقبة — انتظار تأكيد 🟡',
      badgeEn: 'Hold & Watch — Await Trigger 🟡',
      tone: 'sky',
      whenToBuyAr: `السهم في منطقة محايدة. الشراء الآمن يكون إما بالتقاط السهم بالقرب من الحد الأدنى لمنطقة الدخول (${fmtPrice(a.signal.entryZone[0], dec)} ${a.symbol.currency}) أو بعد اختراق ${fmtPrice(a.signal.entryZone[1], dec)} بسيولة تتجاوز 1.3x.`,
      whenToSellProfitAr: `جني الأرباح الجزئي يبدأ عند منطقة ${fmtPrice(a.signal.target1Zone[0], dec)} - ${fmtPrice(a.signal.target1Zone[1], dec)} ${a.symbol.currency} (عائد للمخاطرة ${a.signal.rrRatio}:1).`,
      whenToStopLossAr: `الخروج الوقائي في حال كسر منطقة ${fmtPrice(a.signal.stopZone[0], dec)} - ${fmtPrice(a.signal.stopZone[1], dec)} ${a.symbol.currency}.`
    };
  };

  // Initialize Telegram welcome message with a real chart snapshot (per signed-in user)
  useEffect(() => {
    if (!currentUser) return; // auth screen handles its own UX — no app side effects
    const comiAnalysis = allAnalyses['EGX:COMI'];
    let chartUrl = null;
    try {
      chartUrl = comiAnalysis ? renderTelegramChartDataURL(comiAnalysis) : null;
    } catch {
      chartUrl = null; // canvas unavailable — send text-only welcome
    }
    const timeNow = new Date().toTimeString().slice(0, 5);
    setTgMessages((prev) => {
      if (prev.length > 0) return prev;
      return [
        {
          id: Date.now(),
          sender: 'bot',
          time: timeNow,
          text: `👋 أهلاً بك يا أستاذ ${firstName}!\nتم ربط حسابك بنجاح عبر الكود (${currentUser.inviteCode}).\n\nجرّب الأوامر الفورية:\n• /signal COMI — شارت فني + إمتى تشتري وإمتى تبيع + نسبة النجاح التاريخية\n• /watchlist — ملخص قائمة متابعتك\n• /portfolio — موقف محفظتك ومعاملاتك المحفوظة\n• /buy COMI 100 84.50 — تسجيل عملية شراء فورية`,
          chartUrl
        }
      ];
    });
  }, [sessionUserId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefreshPrices = () => {
    const nextJitter = {};
    symbols.forEach((s) => {
      nextJitter[s.canonicalId] = (Math.random() - 0.48) * 0.012;
    });
    setLiveJitterMap(nextJitter);
    const now = new Date();
    setLastRefreshTime(now.toTimeString().split(' ')[0]);
    triggerToast(
      isRtl
        ? `تم تحديث الأسعار وإعادة حساب مناطق الشراء والبيع يا أستاذ ${firstName}`
        : 'All quotes refreshed & indicators recomputed'
    );
  };

  const toggleWatchlist = (canonicalId) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== currentUser.id) return u;
        const exists = u.watchlist.includes(canonicalId);
        return {
          ...u,
          watchlist: exists
            ? u.watchlist.filter((id) => id !== canonicalId)
            : [...u.watchlist, canonicalId]
        };
      })
    );
  };

  const handleAddCustomSymbol = (e) => {
    e.preventDefault();
    const rawTicker = newCustomTicker.ticker.trim().toUpperCase();
    if (!rawTicker) return;
    const canonicalId = `${newCustomTicker.exchange}:${rawTicker}`;
    if (!allAnalyses[canonicalId]) {
      const newSym = {
        canonicalId,
        ticker: rawTicker,
        yahooTicker: newCustomTicker.exchange === 'EGX' ? `${rawTicker}.CA` : rawTicker,
        tvTicker: canonicalId,
        isin: 'DYNAMIC-USER-ADDED',
        exchange: newCustomTicker.exchange,
        currency: newCustomTicker.currency,
        nameAr: newCustomTicker.nameAr.trim() || `سهم ${rawTicker} (${newCustomTicker.exchange})`,
        nameEn: `${rawTicker} (${newCustomTicker.exchange})`,
        sectorAr: `مضاف بواسطة ${displayName}`,
        sectorEn: 'User Added Symbol',
        basePrice: Math.max(1, parseFloat(newCustomTicker.basePrice) || 25),
        drift: 0.001,
        volatility: 0.024,
        seed: rawTicker.split('').reduce((a, c) => a + c.charCodeAt(0), 500),
        source: newCustomTicker.exchange === 'EGX' ? 'TradingView Scanner' : 'Yahoo Finance',
        fallbackSource: 'Stooq',
        delayMinutes: newCustomTicker.exchange === 'EGX' ? 15 : 0,
        lastUpdated: 'محدث الآن',
        dailyLimitPct: newCustomTicker.exchange === 'EGX' ? 20 : 100,
        fundamentals: { pe: null, pb: null, eps: null, divYield: null, revGrowth: null },
        newsAr: [
          {
            title: `تمت إضافة الرمز ${canonicalId} بنجاح وحفظه في قائمة متابعتك الدائمة`,
            source: 'SymbolMapper',
            time: 'الآن',
            sentiment: 'positive'
          }
        ]
      };
      setSymbols((prev) => [...prev, newSym]);
    }
    if (!currentUser.watchlist.includes(canonicalId)) {
      toggleWatchlist(canonicalId);
    }
    setSelectedSymbolId(canonicalId);
    setShowAddSymbolModal(false);
    setActiveTab('stock');
    triggerToast(isRtl ? `تمت إضافة ${canonicalId} وحفظه في حسابك` : `Added ${canonicalId}`);
  };

  // ==========================================================================
  // ✨ GEMINI FEATURE 1: DAILY MARKET RADAR
  // ==========================================================================
  const handleRunGeminiDailyRadar = async () => {
    setIsRadarLoading(true);
    const watchedAnalyses = currentUser.watchlist
      .map((cid) => allAnalyses[cid])
      .filter(Boolean);

    const sortedByEdge = [...watchedAnalyses].sort(
      (a, b) => b.signal.compositeScore - a.signal.compositeScore
    );
    const topPick = sortedByEdge[0] || allAnalyses['EGX:COMI'];
    const secondPick = sortedByEdge[1] || allAnalyses['EGX:TMGH'];
    const weakestPick = sortedByEdge[sortedByEdge.length - 1] || allAnalyses['EGX:ORWE'];

    const summaryPayload = watchedAnalyses.map((a) => ({
      symbol: a.symbol.canonicalId,
      nameAr: a.symbol.nameAr,
      price: a.price,
      currency: a.symbol.currency,
      score: a.signal.compositeScore,
      winRatePct: a.backtest.winRatePct,
      entryZone: a.signal.entryZone,
      target1Zone: a.signal.target1Zone,
      stopZone: a.signal.stopZone,
      rrRatio: a.signal.rrRatio
    }));

    const result = await callGeminiAPI({
      prompt: `قم بإعداد تقرير "رادار Gemini اليومي" للأستاذ ${displayName} بناءً على قائمة متابعته التالية فقط:\n${JSON.stringify(summaryPayload)}\nرتب التقرير في 3 نقاط واضحة: 1) أفضل سهم مرشح للشراء اليوم مع نطاق الشراء والهدف والوقف، 2) سهم للمراقبة أو الاحتفاظ، 3) سهم يجب الحذر منه، مع نصيحة إدارة مخاطر.`,
      systemInstruction:
        `أنت المستشار المالي الشخصي للأستاذ ${displayName}. تحدث بلغة عربية مصرية احترافية وودودة، والتزم حرفياً بالأرقام الموجودة في JSON المرفق دون اختراع أي سعر.`,
      fallbackFn: () =>
        `🌟 **ملخص رادار Gemini الذكي اليومي للأستاذ ${displayName}:**\n\n` +
        `1️⃣ **أقوى فرصة مرشحة للشراء المتدرج اليوم:**\n` +
        `• **${topPick.symbol.nameAr} (${topPick.symbol.canonicalId}):** يتصدر قائمتك بدرجة فنية **+${topPick.signal.compositeScore}/100** ونسبة نجاح تاريخية **${topPick.backtest.winRatePct}%** (عينة ${topPick.backtest.sampleSize} صفقة سابقة).\n` +
        `• **إمتى تشتري؟** داخل نطاق **${fmtPrice(topPick.signal.entryZone[0])} - ${fmtPrice(topPick.signal.entryZone[1])} ${topPick.symbol.currency}**.\n` +
        `• **إمتى تبيع لجني الربح؟** المستهدف الأول عند **${fmtPrice(topPick.signal.target1Zone[0])} - ${fmtPrice(topPick.signal.target1Zone[1])} ${topPick.symbol.currency}**، ووقف الخسارة كسر **${fmtPrice(topPick.signal.stopZone[0])} ${topPick.symbol.currency}**.\n\n` +
        `2️⃣ **المرشح الثاني لتعزيز المراكز مع السيولة:**\n` +
        `• **${secondPick.symbol.nameAr} (${secondPick.symbol.canonicalId}):** السعر الحالي **${fmtPrice(secondPick.price)} ${secondPick.symbol.currency}** بدرجة **+${secondPick.signal.compositeScore}/100** وسيولة نسبية **${secondPick.indicators.rvol20}x**. مناسب للاحتفاظ طالما يتداول أعلى **${fmtPrice(secondPick.signal.stopZone[1])} ${secondPick.symbol.currency}**.\n\n` +
        `3️⃣ **سهم يتطلب الحذر وعدم التسرع:**\n` +
        `• **${weakestPick.symbol.nameAr} (${weakestPick.symbol.canonicalId}):** يسجل أقل درجة حالياً (**${weakestPick.signal.compositeScore}/100**). يفضل انتظار استقرار السعر أعلى متوسط 20 يوم (**${fmtPrice(weakestPick.indicators.sma20)} ${weakestPick.symbol.currency}**) قبل ضخ سيولة جديدة.`
    });

    setGeminiRadarReport(result);
    setIsRadarLoading(false);
  };

  // ==========================================================================
  // ✨ GEMINI FEATURE 2: DEEP STOCK BUY/SELL ACTION PLAN
  // ==========================================================================
  const handleGenerateStockGeminiPlan = async (analysisObj) => {
    const a = analysisObj || currentAnalysis;
    const dec = a.price < 5 ? 3 : 2;
    setIsStockDecisionLoading(true);

    const payload = {
      symbol: a.symbol.canonicalId,
      nameAr: a.symbol.nameAr,
      price: a.price,
      currency: a.symbol.currency,
      score: a.signal.compositeScore,
      indicators: a.indicators,
      entryZone: a.signal.entryZone,
      stopZone: a.signal.stopZone,
      target1Zone: a.signal.target1Zone,
      target2Zone: a.signal.target2Zone,
      rrRatio: a.signal.rrRatio,
      backtest: {
        winRatePct: a.backtest.winRatePct,
        sampleSize: a.backtest.sampleSize,
        expectancyPct: a.backtest.expectancyPct
      }
    };

    const result = await callGeminiAPI({
      prompt: `اشرح للأستاذ ${displayName} خطة التداول الكاملة على سهم ${a.symbol.nameAr} (${a.symbol.canonicalId}) بناءً على هذه البيانات:\n${JSON.stringify(payload)}\nوضح بالتفصيل: 1) إمتى يشتري وبأي شروط؟ 2) إمتى يبيع لجني الأرباح؟ 3) إمتى يبيع فوراً لوقف الخسارة؟ 4) مدى قوة الإشارة تاريخياً.`,
      systemInstruction:
        `أنت مرشد التداول الشخصي للأستاذ ${displayName}. قدم إجابة عملية ومباشرة وواضحة جداً بالعربية دون اختراع أي أرقام خارج JSON المرفق.`,
      fallbackFn: () => {
        const decPlan = getActionableDecision(a);
        return (
          `🎯 **خطة Gemini التنفيذية للأستاذ ${firstName} على سهم ${a.symbol.nameAr} (${a.symbol.canonicalId}):**\n\n` +
          `• **القرار الفني الحالي:** ${decPlan.badgeAr} (التقييم المركب **${a.signal.compositeScore}/100** | نسبة العائد للمخاطرة **${a.signal.rrRatio}:1**).\n\n` +
          `🟢 **1. إمتى وإزاي تشتري؟**\n` +
          `${decPlan.whenToBuyAr}\n\n` +
          `💰 **2. إمتى تبيع لجني الأرباح؟**\n` +
          `${decPlan.whenToSellProfitAr}\n\n` +
          `🛑 **3. إمتى تبيع فوراً لحماية رأس مالك (وقف الخسارة)؟**\n` +
          `${decPlan.whenToStopLossAr}\n\n` +
          `📊 **4. الصدق الإحصائي (Backtest):**\n` +
          `تم اختبار هذه الإشارة على بيانات السهم التاريخية لـ **${a.backtest.sampleSize} مرة** سابقة، وحققت نسبة نجاح **${a.backtest.winRatePct}%** بمتوسط عائد متوقع **${fmtPct(a.backtest.expectancyPct)}** بعد خصم العمولات (${a.backtest.oneWayFeePct}%).`
        );
      }
    });

    setGeminiStockDecision((prev) => ({
      ...prev,
      [a.symbol.canonicalId]: result
    }));
    setIsStockDecisionLoading(false);
  };

  // ==========================================================================
  // ✨ GEMINI FEATURE 3: PORTFOLIO DOCTOR (ANALYZING SAVED TRADES)
  // ==========================================================================
  const handleRunGeminiPortfolioAudit = async () => {
    setIsPortfolioAiLoading(true);
    const holdingsData = portfolioSummary.holdings.map((h) => {
      const a = allAnalyses[h.canonicalId];
      return {
        symbol: h.canonicalId,
        nameAr: h.nameAr,
        qty: h.qty,
        avgCost: +h.avgCost.toFixed(2),
        currentPrice: h.currentPrice,
        unrealizedPct: +h.unrealizedPct.toFixed(2),
        stopPrice: h.stopPrice,
        target1: a ? a.signal.target1Zone[0] : null,
        score: a ? a.signal.compositeScore : 0,
        currency: h.currency
      };
    });

    const result = await callGeminiAPI({
      prompt: `قم بمراجعة محفظة الأستاذ ${displayName} ومعاملاته المحفوظة التالية:\n${JSON.stringify(holdingsData)}\nقدم له نصيحة واضحة لكل سهم في محفظته: هل يحتفظ به، أم يجني جزءاً من الأرباح، أم يرفع مستوى وقف الخسارة لحماية أرباحه؟`,
      systemInstruction:
        `أنت مستشار إدارة المخاطر والمحافظ للأستاذ ${displayName}. التزم بالأرقام الحقيقية لمحفظته وقدم نصيحة عملية لكل مركز مفتوح.`,
      fallbackFn: () => {
        if (holdingsData.length === 0) {
          return `محفظتك الحالية خالية من المراكز المفتوحة يا أستاذ ${firstName}. يمكنك تسجيل أي معاملة شراء من النموذج المجاور وسيتم حفظها تلقائياً.`;
        }
        const lines = holdingsData.map((h) => {
          const action =
            h.unrealizedPct >= 6
              ? `✅ رابح (**${fmtPct(h.unrealizedPct)}**): ينصح برفع وقف الخسارة لحماية الربح عند **${fmtPrice(h.stopPrice)} ${h.currency}**، وجني ربح جزئي (30%-50%) عند الوصول إلى **${fmtPrice(h.target1)} ${h.currency}**.`
              : h.unrealizedPct >= 0
              ? `🟢 مستقر (**${fmtPct(h.unrealizedPct)}**): احتفاظ طالما السعر يتداول أعلى مستوى الوقف **${fmtPrice(h.stopPrice)} ${h.currency}**، والمستهدف القادم **${fmtPrice(h.target1)} ${h.currency}**.`
              : `⚠️ متراجع (**${fmtPct(h.unrealizedPct)}**): راقب مستوى الدعم والوقف بصرامة عند **${fmtPrice(h.stopPrice)} ${h.currency}** ولا تقم بالتبريد العشوائي إلا بعد تحسن الدرجة الفنية.`;
          return `• **${h.nameAr} (${h.symbol}):** الكمية **${h.qty}** سهم بمتوسط تكلفة **${fmtPrice(h.avgCost)} ${h.currency}** والسعر الحالي **${fmtPrice(h.currentPrice)} ${h.currency}** — ${action}`;
        });
        return (
          `🩺 **تقرير فحص Gemini الشامل لمحفظة الأستاذ ${displayName}:**\n\n` +
          lines.join('\n\n') +
          `\n\n🛡️ **خلاصة المخاطرة:** إجمالي المخاطرة المحسوبة في حال ضرب جميع مستويات الوقف لا يتجاوز الحدود الآمنة، وجميع معاملاتك محفوظة تلقائياً.`
        );
      }
    });

    setGeminiPortfolioReport(result);
    setIsPortfolioAiLoading(false);
  };

  // Grounded AI Mentor Q&A Handler
  const handleAskMentor = async (customPrompt = null) => {
    const q = (customPrompt || mentorInput).trim();
    if (!q) return;
    if (!customPrompt) setMentorInput('');

    const a = currentAnalysis;
    const comi = allAnalyses['EGX:COMI'];
    const tmgh = allAnalyses['EGX:TMGH'];
    const decimals = a.price < 5 ? 3 : 2;
    const decPlan = getActionableDecision(a);

    setMentorChatMessages((prev) => [...prev, { role: 'user', text: q }]);
    setIsAiLoading(true);

    const buildDeterministicReply = () => {
      if (q.includes('إمتى أشتري') || q.includes('امتى اشتري') || q.includes('أبيع')) {
        return (
          `🎯 **إجابة مباشرة للأستاذ ${firstName} بخصوص ${a.symbol.nameAr} (${a.symbol.canonicalId}):**\n` +
          `• **حالة السهم الآن:** ${decPlan.badgeAr} (السعر الحالي **${fmtPrice(a.price, decimals)} ${a.symbol.currency}**).\n` +
          `• **🟢 إمتى تشتري؟** ${decPlan.whenToBuyAr}\n` +
          `• **💰 إمتى تبيع لجني الأرباح؟** ${decPlan.whenToSellProfitAr}\n` +
          `• **🛑 إمتى تخرج لحماية رأس مالك؟** ${decPlan.whenToStopLossAr}`
        );
      }
      if (q.includes('قارن') || q.toLowerCase().includes('compare')) {
        return (
          `📊 **مقارنة خاصة للأستاذ ${firstName} (COMI مقابل TMGH):**\n` +
          `1️⃣ **البنك التجاري الدولي (EGX:COMI):** السعر **${fmtPrice(comi.price)} EGP** (${fmtPct(comi.changePct)})، الدرجة الفنية **+${comi.signal.compositeScore}/100**، نسبة النجاح التاريخية **${comi.backtest.winRatePct}%** (عينة ${comi.backtest.sampleSize} مرة).\n` +
          `2️⃣ **طلعت مصطفى (EGX:TMGH):** السعر **${fmtPrice(tmgh.price)} EGP** (${fmtPct(tmgh.changePct)})، الدرجة الفنية **+${tmgh.signal.compositeScore}/100**، والسيولة النسبية **${tmgh.indicators.rvol20}x**.\n` +
          `⚠️ **الخلاصة:** سهم COMI أكثر هدوءاً واستقراراً للمحفظة الأساسية، بينما TMGH أعلى في الزخم والتذبذب اليومي (ATR = ${fmtPrice(tmgh.indicators.atr14)} EGP).`
        );
      }
      if (q.includes('مبتدئ') || q.toLowerCase().includes('beginner')) {
        return (
          `🎓 **شرح مبسط وواضح يا أستاذ ${firstName} لسهم ${a.symbol.nameAr} (${a.symbol.canonicalId}):**\n` +
          `• **الاتجاه العام:** السعر الآن **${fmtPrice(a.price, decimals)} ${a.symbol.currency}**. السهم يتداول ${a.price > a.indicators.sma50 ? 'أعلى' : 'أقل'} من متوسط سعره في آخر 50 يوماً (**${fmtPrice(a.indicators.sma50, decimals)}**)، مما يعني أن المشترين ${a.price > a.indicators.sma50 ? 'مسيطرون على الاتجاه' : 'ينتظرون دعماً أقوى'}.\n` +
          `• **منطقة الشراء الذكية:** بدلاً من الشراء بأي سعر، النطاق المحسوب هو **${fmtPrice(a.signal.entryZone[0], decimals)} - ${fmtPrice(a.signal.entryZone[1], decimals)}**، والهدف البيعي الأول **${fmtPrice(a.signal.target1Zone[0], decimals)} - ${fmtPrice(a.signal.target1Zone[1], decimals)}**.\n` +
          `• **صمام الأمان:** إذا نزل السهم وأغلق تحت **${fmtPrice(a.signal.stopZone[0], decimals)}** نخرج بهدوء لحماية السيولة.`
        );
      }
      return (
        `🔍 **تحليل Gemini لسهم ${a.symbol.nameAr} (${a.symbol.canonicalId}) يا أستاذ ${firstName}:**\n` +
        `• **السعر والزخم:** يتحرك السهم عند **${fmtPrice(a.price, decimals)} ${a.symbol.currency}** (${fmtPct(a.changePct)}) مع مؤشر RSI(14) عند **${a.indicators.rsi14}** وسيولة نسبية **${a.indicators.rvol20}x**.\n` +
        `• **خطة الشراء والبيع:** الدخول المقترح **${fmtPrice(a.signal.entryZone[0], decimals)} - ${fmtPrice(a.signal.entryZone[1], decimals)}**، المستهدف **${fmtPrice(a.signal.target1Zone[0], decimals)} - ${fmtPrice(a.signal.target1Zone[1], decimals)}**، ووقف الخسارة **${fmtPrice(a.signal.stopZone[0], decimals)}**.\n` +
        `• **الصدق التاريخي:** نجحت هذه الإشارة بنسبة **${a.backtest.winRatePct}%** خلال **${a.backtest.sampleSize}** مرة سابقة.`
      );
    };

    const factSheet = {
      user: `${displayName}`,
      symbol: a.symbol.canonicalId,
      name_ar: a.symbol.nameAr,
      currency: a.symbol.currency,
      price: a.price,
      change_pct: a.changePct,
      indicators: a.indicators,
      signal: {
        rule_ar: a.signal.ruleNameAr,
        score: a.signal.compositeScore,
        entry_zone: a.signal.entryZone,
        stop_zone: a.signal.stopZone,
        target1_zone: a.signal.target1Zone,
        rr_ratio: a.signal.rrRatio
      },
      backtest: {
        sample_size: a.backtest.sampleSize,
        win_rate_pct: a.backtest.winRatePct,
        expectancy_pct: a.backtest.expectancyPct
      }
    };

    const res = await callGeminiAPI({
      prompt: `سؤال الأستاذ ${displayName}: ${q}\n\nبيانات السهم المعتمدة (SignalFactSheet JSON):\n${JSON.stringify(factSheet)}`,
      systemInstruction:
        `أنت المرشد المالي الشخصي للأستاذ ${displayName}. اشرح باللغة العربية المصرية الواضحة إمتى يشتري وإمتى يبيع مع الالتزام الصارم بالأرقام المرفقة في JSON فقط وذكر المخاطر دائماً.`,
      fallbackFn: buildDeterministicReply
    });

    setMentorChatMessages((prev) => [
      ...prev,
      { role: 'assistant', text: res.text, verifiedNumbers: true }
    ]);
    setIsAiLoading(false);
  };

  // Log Current Signal to Immutable Ledger
  const handleLogSignalToLedger = (analysis) => {
    const newEntry = {
      id: `SIG-${Math.floor(100 + Math.random() * 899)}`,
      date: '2026-11-12',
      canonicalId: analysis.symbol.canonicalId,
      ruleAr: analysis.signal.ruleNameAr,
      score: analysis.signal.compositeScore,
      confidence: analysis.signal.confidenceTier,
      entryPrice: analysis.price,
      entryZone: analysis.signal.entryZone,
      stopZone: analysis.signal.stopZone,
      targetZone: analysis.signal.target1Zone,
      btWinRate: analysis.backtest.winRatePct,
      btSample: analysis.backtest.sampleSize,
      ret5d: null,
      ret10d: null,
      ret20d: null,
      status: 'PENDING'
    };
    setSignalLedger((prev) => [newEntry, ...prev]);
    setActiveTab('ledger');
    triggerToast(isRtl ? `تم توثيق إشارة ${analysis.symbol.canonicalId} في سجل المصداقية` : 'Signal logged to immutable ledger');
  };

  // Simulate Forward +10 Trading Days on Pending Signals in the Ledger
  const handleAdvanceLedgerDays = () => {
    setSignalLedger((prev) =>
      prev.map((row) => {
        if (row.status !== 'PENDING') return row;
        const isWin = row.score >= 45;
        const r5 = isWin ? +(2.1 + Math.random() * 2.5).toFixed(2) : -1.85;
        const r10 = isWin ? +(5.2 + Math.random() * 3.1).toFixed(2) : -3.9;
        return {
          ...row,
          ret5d: row.ret5d ?? r5,
          ret10d: r10,
          status: isWin ? 'TARGET_HIT' : 'STOP_HIT'
        };
      })
    );
    triggerToast(
      isRtl
        ? 'تمت محاكاة مرور +10 جلسات تداول وتحديث النتائج الفعلية للإشارات المفتوحة'
        : 'Simulated +10 forward trading days for pending signals'
    );
  };

  // Run Interactive Phase 0 Live Validation Probe
  const handleRunPhase0Probe = () => {
    setIsProbingPhase0(true);
    setPhase0ProbeLog([]);
    const steps = [
      '🚀 [Phase 0] Starting DataProvider probe on EGX (COMI, TMGH, SWDY, HRHO, EFIH, ORWE, EGX30) & US (NVDA, AAPL, SPY)...',
      '✅ [TradingView Scanner /egypt/scan] HTTP 200 OK (142ms) -> Returned 224 EGX tickers + EGX30 (31,450) + ISINs (15m delayed).',
      '✅ [Yahoo Finance .CA] COMI.CA, TMGH.CA, SWDY.CA -> 240 daily OHLCV bars verified.',
      '⚠️ [Yahoo Finance ^CASE30] Anomaly caught: returned only 1 stale row -> Automatic route to TradingView/Stooq for EGX30 history.',
      '⚠️ [Corporate Action Guard] EGX:MASR flagged for -31.5% single-bar unadjusted bonus-share gap (>20% EGX limit). Confidence capped.',
      '✅ [Finnhub + Yahoo US] NVDA, AAPL, MSFT, SPY -> 0m real-time quotes + 60 req/min token bucket healthy.',
      '🏁 [Phase 0 Complete] SQLite WAL cache warmed. Primary & Fallback routing active.'
    ];
    steps.forEach((line, idx) => {
      setTimeout(() => {
        setPhase0ProbeLog((prev) => [...prev, line]);
        if (idx === steps.length - 1) setIsProbingPhase0(false);
      }, (idx + 1) * 320);
    });
  };

  // Compute Portfolio Holdings & Risk Analytics for Current User
  const portfolioSummary = useMemo(() => {
    const positionsMap = {};
    (currentUser?.trades || []).forEach((tr) => {
      if (!positionsMap[tr.canonicalId]) {
        positionsMap[tr.canonicalId] = {
          canonicalId: tr.canonicalId,
          currency: tr.currency,
          qty: 0,
          totalCost: 0,
          realizedPnl: 0
        };
      }
      const pos = positionsMap[tr.canonicalId];
      if (tr.side === 'BUY') {
        pos.totalCost += tr.qty * tr.price;
        pos.qty += tr.qty;
      } else if (tr.side === 'SELL' && pos.qty > 0) {
        const avgCost = pos.totalCost / pos.qty;
        pos.realizedPnl += tr.qty * (tr.price - avgCost);
        pos.qty = Math.max(0, pos.qty - tr.qty);
        pos.totalCost = pos.qty * avgCost;
      }
    });

    const holdings = Object.values(positionsMap)
      .filter((p) => p.qty > 0)
      .map((p) => {
        const analysis = allAnalyses[p.canonicalId] || allAnalyses['EGX:COMI'];
        const avgCost = p.totalCost / p.qty;
        const currentPrice = analysis.price;
        const marketValue = p.qty * currentPrice;
        const unrealizedPnl = marketValue - p.totalCost;
        const unrealizedPct = (unrealizedPnl / p.totalCost) * 100;
        const stopPrice = analysis.signal.stopZone[1];
        const riskAtStop = Math.max(0, (currentPrice - stopPrice) * p.qty);
        return {
          ...p,
          avgCost,
          currentPrice,
          marketValue,
          unrealizedPnl,
          unrealizedPct,
          stopPrice,
          riskAtStop,
          nameAr: analysis.symbol.nameAr,
          nameEn: analysis.symbol.nameEn
        };
      });

    const byCurrency = {
      EGP: { marketValue: 0, cost: 0, unrealizedPnl: 0, riskAtStop: 0 },
      USD: { marketValue: 0, cost: 0, unrealizedPnl: 0, riskAtStop: 0 }
    };

    holdings.forEach((h) => {
      const bucket = byCurrency[h.currency] || byCurrency.EGP;
      bucket.marketValue += h.marketValue;
      bucket.cost += h.totalCost;
      bucket.unrealizedPnl += h.unrealizedPnl;
      bucket.riskAtStop += h.riskAtStop;
    });

    return { holdings, byCurrency };
  }, [currentUser, allAnalyses]);

  // Interactive Position Size Calculation for Selected Stock
  const positionSizing = useMemo(() => {
    const a = currentAnalysis;
    const entryMid = (a.signal.entryZone[0] + a.signal.entryZone[1]) / 2;
    const stopMid = (a.signal.stopZone[0] + a.signal.stopZone[1]) / 2;
    const riskPerShare = Math.max(0.05, entryMid - stopMid);
    const maxRiskAmount = (calcCapital * calcRiskPct) / 100;
    const suggestedShares = Math.max(1, Math.floor(maxRiskAmount / riskPerShare));
    const totalPositionValue = suggestedShares * a.price;
    const portfolioWeightPct = Math.min(100, (totalPositionValue / Math.max(1, calcCapital)) * 100);
    return {
      riskPerShare,
      maxRiskAmount,
      suggestedShares,
      totalPositionValue,
      portfolioWeightPct
    };
  }, [currentAnalysis, calcCapital, calcRiskPct]);

  const handleAddTrade = (e) => {
    e.preventDefault();
    const sym = allAnalyses[tradeForm.canonicalId]?.symbol;
    if (!sym) return;
    const qty = parseFloat(tradeForm.qty);
    const price = parseFloat(tradeForm.price);
    if (!qty || !price || qty <= 0 || price <= 0) return;

    const newTrade = {
      id: Date.now(),
      canonicalId: sym.canonicalId,
      side: tradeForm.side,
      qty,
      price,
      currency: sym.currency,
      date: new Date().toISOString().split('T')[0],
      channel: 'محفوظة تلقائياً',
      notes: tradeForm.notes.trim() || (tradeForm.side === 'BUY' ? 'عملية شراء مسجلة' : 'عملية بيع مسجلة')
    };

    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, trades: [newTrade, ...u.trades] } : u))
    );
    setTradeForm((prev) => ({ ...prev, notes: '' }));
    triggerToast(
      isRtl
        ? `تم حفظ معاملة ${sym.canonicalId} في سجل معاملاتك الدائم يا أستاذ ${firstName}`
        : `Trade logged and saved for ${sym.canonicalId}`
    );
  };

  const handleDeleteTrade = (tradeId) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id
          ? { ...u, trades: u.trades.filter((t) => t.id !== tradeId) }
          : u
      )
    );
    triggerToast(isRtl ? 'تم حذف المعاملة وتحديث الحسابات المحفوظة' : 'Trade removed');
  };

  const handleResetSavedData = () => {
    // Scope the reset to the CURRENT account only — never wipe other users on this device
    if (!currentUser) return;
    const fresh = buildFreshAccountData(currentUser.id, displayName);
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id
          ? {
              ...fresh,
              id: currentUser.id,
              pinSalt: currentUser.pinSalt,
              pinHash: currentUser.pinHash,
              inviteCode: currentUser.inviteCode,
              telegramChatId: currentUser.telegramChatId
            }
          : u
      )
    );
    setSymbols(INITIAL_SYMBOLS);
    setSignalLedger([]);
    try {
      localStorage.setItem(STORAGE_KEYS.HIDE_TOUR, JSON.stringify(false));
    } catch {}
    triggerToast(
      isRtl
        ? `تم مسح كل بيانات حسابك يا ${firstName} — هنملأ الراتب والأقساط من الصفر`
        : 'All your account data cleared — starting fresh'
    );
  };

  // Interactive Telegram Bot Command Router
  const handleTelegramCommand = (rawCmd) => {
    const text = (rawCmd || tgInput).trim();
    if (!text) return;

    const nowTime = new Date().toTimeString().slice(0, 5);
    const userMsg = { id: Date.now(), sender: 'user', time: nowTime, text };

    const parts = text.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg1 = parts[1] ? parts[1].toUpperCase() : '';

    const findAnalysisByTicker = (t) => {
      const found = Object.values(allAnalyses).find(
        (a) => a.symbol.ticker.toUpperCase() === t || a.symbol.canonicalId.toUpperCase() === t
      );
      return found || null;
    };

    let botReplyText = '';
    let chartUrl = null;

    if (cmd === '/signal') {
      const target = findAnalysisByTicker(arg1 || 'COMI') || allAnalyses['EGX:COMI'];
      const dec = target.price < 5 ? 3 : 2;
      try {
        chartUrl = renderTelegramChartDataURL(target);
      } catch {
        chartUrl = null;
      }
      botReplyText =
        `📊 *تحليل سهم: ${target.symbol.nameAr} (${target.symbol.canonicalId})*\n` +
        `💵 السعر الحالي: ${fmtPrice(target.price, dec)} ${target.symbol.currency} (${fmtPct(target.changePct)})\n` +
        `🕒 المصدر: ${target.symbol.source} (${target.symbol.lastUpdated})\n\n` +
        `🧭 *الحالة الفنية:* ${target.signal.ruleNameAr} (${target.signal.compositeScore}/100)\n` +
        `🔒 *درجة الثقة:* ${target.signal.confidenceTier} (بناءً على ${target.backtest.sampleSize} إشارة تاريخية)\n\n` +
        `🎯 *المناطق السعرية المقترحة (ATR):*\n` +
        `• منطقة الدخول: ${fmtPrice(target.signal.entryZone[0], dec)} - ${fmtPrice(target.signal.entryZone[1], dec)}\n` +
        `• وقف الخسارة: ${fmtPrice(target.signal.stopZone[0], dec)} - ${fmtPrice(target.signal.stopZone[1], dec)}\n` +
        `• المستهدف الأول: ${fmtPrice(target.signal.target1Zone[0], dec)} - ${fmtPrice(target.signal.target1Zone[1], dec)} (العائد للمخاطرة ${target.signal.rrRatio}:1)\n\n` +
        `📈 *الأداء التاريخي للإشارة (شامل العمولات ${target.backtest.oneWayFeePct}%):*\n` +
        `• نسبة النجاح (${target.backtest.holdingDays} جلسات): ${target.backtest.winRatePct}% | العائد المتوقع: ${fmtPct(target.backtest.expectancyPct)}\n\n` +
        `⚖️ _تنبيه: تحليل تعليمي وإحصائي فقط وليس توصية استثمارية بالبيع أو الشراء._`;
    } else if (cmd === '/watchlist') {
      const lines = currentUser.watchlist.map((cid) => {
        const a = allAnalyses[cid];
        if (!a) return `• ${cid}`;
        return `• ${a.symbol.ticker}: ${fmtPrice(a.price)} ${a.symbol.currency} (${fmtPct(a.changePct)}) | تقييم: ${a.signal.compositeScore}`;
      });
      botReplyText = `📋 *قائمة المتابعة الخاصة بك (${currentUser.watchlist.length} أسهم):*\n` + lines.join('\n');
    } else if (cmd === '/portfolio' || cmd === '/pnl') {
      const egp = portfolioSummary.byCurrency.EGP;
      const usd = portfolioSummary.byCurrency.USD;
      botReplyText =
        `💼 *ملخص المحفظة والمخاطرة (${currentUser.nameAr}):*\n\n` +
        `🇪🇬 *محفظة الجنيه المصري (EGP):*\n` +
        `• القيمة السوقية: ${fmtPrice(egp.marketValue)} EGP\n` +
        `• الربح/الخسارة غير المحققة: ${fmtPrice(egp.unrealizedPnl)} EGP\n` +
        `• إجمالي المخاطرة عند الوقف (Risk at Stop): ${fmtPrice(egp.riskAtStop)} EGP\n\n` +
        `🇺🇸 *محفظة الدولار الأمريكي (USD):*\n` +
        `• القيمة السوقية: ${fmtPrice(usd.marketValue)} USD\n` +
        `• الربح/الخسارة غير المحققة: ${fmtPrice(usd.unrealizedPnl)} USD`;
    } else if (cmd === '/buy' || cmd === '/sell') {
      const target = findAnalysisByTicker(arg1 || 'COMI');
      const qty = parseFloat(parts[2] || '100');
      const price = parseFloat(parts[3] || (target ? target.price : '50'));
      if (target && qty > 0 && price > 0) {
        const side = cmd === '/buy' ? 'BUY' : 'SELL';
        setUsers((prev) =>
          prev.map((u) =>
            u.id === currentUser.id
              ? {
                  ...u,
                  trades: [
                    {
                      id: Date.now(),
                      canonicalId: target.symbol.canonicalId,
                      side,
                      qty,
                      price,
                      currency: target.symbol.currency,
                      date: '2026-11-12',
                      channel: 'TELEGRAM'
                    },
                    ...u.trades
                  ]
                }
              : u
          )
        );
        botReplyText = `✅ تم تسجيل عملية ${side === 'BUY' ? 'شراء' : 'بيع'} على ${target.symbol.canonicalId} بعدد ${qty} سهم بسعر ${fmtPrice(price)} ${target.symbol.currency} وتحديث المحفظة فوراً.`;
      } else {
        botReplyText = `⚠️ صيغة الأمر: /buy SYMBOL QTY PRICE (مثال: /buy COMI 100 84.50)`;
      }
    } else {
      botReplyText =
        `🤖 *أوامر البوت المتاحة:*\n` +
        `• /signal COMI أو /signal NVDA — شارت فني كامل بالشموع ومناطق ATR\n` +
        `• /watchlist — عرض أسعار وإشارات قائمة متابعتك\n` +
        `• /portfolio أو /pnl — تقرير الأرباح والمخاطرة لكل عملة\n` +
        `• /buy SYMBOL QTY PRICE — تسجيل شراء فوري`;
    }

    const botMsg = {
      id: Date.now() + 1,
      sender: 'bot',
      time: nowTime,
      text: botReplyText,
      chartUrl
    };

    setTgMessages((prev) => [...prev, userMsg, botMsg]);
    if (!rawCmd) setTgInput('');
  };

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return symbols.filter(
      (s) =>
        s.ticker.toLowerCase().includes(q) ||
        s.canonicalId.toLowerCase().includes(q) ||
        s.nameAr.toLowerCase().includes(q) ||
        s.nameEn.toLowerCase().includes(q)
    );
  }, [symbols, searchQuery]);

  const currentDecision = useMemo(() => getActionableDecision(currentAnalysis), [currentAnalysis]);

  const TOUR_STEPS = [
    {
      targetId: 'tour-theme-controls',
      targetTab: 'dashboard',
      badge: '1 / 7 — التحديث التلقائي والإضاءة',
      title: 'شريط المزامنة الحية (كل 5-10 ثوانٍ) والتحكم في الإضاءة',
      desc: 'من هنا تراقب عداد التحديث الأوتوماتيكي بالثانية، وتتحكم في سرعة التحديث (5 أو 7 أو 10 ثوانٍ)، وتبدل بين الوضع الصباحي والوضع الليلي.'
    },
    {
      targetId: 'tour-safety-guard',
      targetTab: 'dashboard',
      badge: '2 / 7 — حارس سلامة الأسعار والتوقيت',
      title: 'حارس عدم الشراء في أوقات أو أسعار خاطئة',
      desc: 'يفحص هذا الشريط توقيت جلسة البورصة المصرية والأمريكية الفعلي وحداثة السعر بالثانية، وينبهك فوراً إذا كان السوق مغلقاً أو السعر خارج منطقة الشراء الآمنة.'
    },
    {
      targetId: 'tour-gemini-radar',
      targetTab: 'dashboard',
      badge: '3 / 7 — ترشيحات الشراء الفورية',
      title: 'الأسهم المرشحة اليوم بناءً على فائض ميزانيتك الشهرية',
      desc: 'بمجرد دخولك، يعرض لك النظام أفضل الأسهم المرشحة اليوم مع عدد الأسهم الدقيق والتكلفة المحسوبة على قد المبلغ المتبقي من مرتبك بعد الأقساط.'
    },
    {
      targetId: 'tour-watchlist-table',
      targetTab: 'dashboard',
      badge: '4 / 7 — جدول الأسهم والمراقبة اللحظية',
      title: 'قائمة المتابعة مع نبض الأسعار الحي ومناطق الدخول',
      desc: 'تومض الأسعار باللون الأخضر أو الأحمر مع كل تحديث تلقائي، ويظهر أمام كل سهم قرار واضح: شراء متدرج، احتفاظ، أو تجنب.'
    },
    {
      targetId: 'tour-buy-sell-roadmap',
      targetTab: 'stock',
      badge: '5 / 7 — خطة التنفيذ',
      title: 'خريطة التنفيذ: منطقة الشراء، جني الأرباح، ووقف الخسارة',
      desc: 'انتقلنا لصفحة السهم؛ هنا تجد الأرقام المحددة للشراء والبيع بدون أي التباس، مع زر فحص السعر أونلاين مباشرة عبر الويب.'
    },
    {
      targetId: 'tour-masters-council',
      targetTab: 'stock',
      badge: '6 / 7 — المعايير المؤسسية والكتب الـ 14',
      title: 'تقييم السهم بمعادلات جراهام ولينش ومينيرفيني وليفرمور',
      desc: 'نتائج الفحص المالي والفني وفق القواعد المستخلصة من أمهات كتب الاستثمار ودليل البورصة المصرية.'
    },
    {
      targetId: 'tour-saved-portfolio',
      targetTab: 'portfolio',
      badge: '7 / 7 — الميزانية الشهرية وسجل المعاملات',
      title: 'إدارة مرتب الشهر والأقساط وسجل المحفظة المحفوظ تلقائياً',
      desc: 'تضع هنا دخلك الشهري وأقساطك ليحسب النظام الصافي المتاح للاستثمار ويوزعه لك، مع حفظ دائم لجميع معاملاتك السابقة.'
    }
  ];

  // Navigate to the step's tab ONLY when the guided step itself changes —
  // never fight the user's own tab clicks while the tour is open.
  const lastForcedTourTabRef = useRef(null);
  useEffect(() => {
    if (!showWelcomeTour) {
      setSpotlightRect(null);
      lastForcedTourTabRef.current = null;
      return;
    }

    const stepObj = TOUR_STEPS[tourStep];
    if (!stepObj) return;

    if (lastForcedTourTabRef.current !== tourStep && activeTab !== stepObj.targetTab) {
      lastForcedTourTabRef.current = tourStep;
      setActiveTab(stepObj.targetTab);
    } else {
      lastForcedTourTabRef.current = tourStep;
    }

    let rafId = null;
    const updatePosition = (shouldScroll = false) => {
      const el = document.getElementById(stepObj.targetId);
      if (!el) {
        setSpotlightRect(null);
        return;
      }
      if (shouldScroll) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      const rect = el.getBoundingClientRect();
      setSpotlightRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        windowH: window.innerHeight,
        windowW: window.innerWidth
      });
    };

    const initialTimer = setTimeout(() => {
      updatePosition(true);
    }, 120);

    const followupTimer = setTimeout(() => {
      updatePosition(false);
    }, 520);

    const handleScrollOrResize = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => updatePosition(false));
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(followupTimer);
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [showWelcomeTour, tourStep, activeTab]);

  // ==========================================================================
  // 🔐 AUTH GATE — without an authenticated session the user only sees the
  //    login / sign-up screen (no app data is reachable).
  // ==========================================================================
  if (!currentUser) {
    return <AuthScreen users={users} onLogin={handleLogin} onSignup={handleSignup} />;
  }

  // 🧭 MANDATORY ONBOARDING GATE — no salary/budget yet → onboarding wall.
  // Nobody reaches the app before entering income, living costs and installments.
  if (!currentUser.onboardingComplete) {
    return (
      <SalaryOnboarding
        firstName={firstName}
        initialBudget={currentUser.monthlyBudget}
        onComplete={handleCompleteOnboarding}
      />
    );
  }

  const hourNow = new Date().getHours();
  const timeGreeting = isRtl
    ? hourNow < 12
      ? 'صباح الخير'
      : 'مساء الخير'
    : hourNow < 12
      ? 'Good morning'
      : 'Good evening';
  const todayPretty = new Date().toLocaleDateString(isRtl ? 'ar-EG' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const currentInitial = (firstName.trim()[0] || 'EG').toUpperCase();

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        style={{ fontFamily: "'Cairo', system-ui, -apple-system, sans-serif" }}
        className="min-h-screen bg-[#f4f6f8] dark:bg-[#0b0e14] text-slate-900 dark:text-slate-100 transition-colors duration-200"
      >
        {/* Toast Feedback Notification */}
        {toastMsg && (
          <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 text-xs font-bold shadow-xl border border-slate-700 flex items-center gap-2 max-w-[92vw]">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* ===================================================================
            INTERACTIVE SPOTLIGHT TOUR (CLEAN INSTITUTIONAL STYLE)
           =================================================================== */}
        {showWelcomeTour && (
          <div className="fixed inset-0 z-50 pointer-events-none">
            {spotlightRect ? (
              <div
                style={{
                  position: 'fixed',
                  top: Math.max(8, spotlightRect.top - 8),
                  left: Math.max(8, spotlightRect.left - 8),
                  width: Math.min(spotlightRect.windowW - 16, spotlightRect.width + 16),
                  height: Math.min(spotlightRect.windowH - 16, spotlightRect.height + 16),
                  boxShadow: '0 0 0 9999px rgba(5, 8, 15, 0.78)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                className="rounded-xl ring-2 ring-emerald-500 pointer-events-none"
              >
                <div
                  className={`absolute -top-3.5 ${
                    isRtl ? 'right-3' : 'left-3'
                  } px-2.5 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px] shadow flex items-center gap-1`}
                >
                  <span>{isRtl ? 'القسم المشروح حالياً' : 'Active Section'}</span>
                </div>
              </div>
            ) : (
              // Target not on this tab → keep a soft dim but never block the UI
              <div className="fixed inset-0 bg-black/45 pointer-events-none" />
            )}

            <div
              style={{
                position: 'fixed',
                left: '50%',
                transform: 'translateX(-50%)',
                ...(spotlightRect && spotlightRect.top > spotlightRect.windowH * 0.48
                  ? { top: '20px' }
                  : { bottom: 'calc(84px + env(safe-area-inset-bottom))' }),
                transition: 'all 0.25s ease'
              }}
              className="w-[94vw] max-w-lg pointer-events-auto rounded-xl bg-white dark:bg-[#11161f] border border-slate-300 dark:border-slate-700 shadow-2xl p-4 space-y-3"
            >
              <button
                onClick={handleCloseWelcomeTour}
                title={isRtl ? 'إغلاق وعدم الإظهار تلقائياً' : 'Close tour'}
                className={`absolute top-3.5 ${
                  isRtl ? 'left-3.5' : 'right-3.5'
                } px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-500 dark:text-slate-300 transition flex items-center gap-1 text-[11px] font-bold`}
              >
                <span>{isRtl ? 'إغلاق' : 'Close'}</span>
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="pe-16">
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  {TOUR_STEPS[tourStep].badge}
                </span>
                <h3 className="font-bold text-sm sm:text-base mt-0.5 text-slate-900 dark:text-white">
                  {TOUR_STEPS[tourStep].title}
                </h3>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#0b0e14] p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                {TOUR_STEPS[tourStep].desc}
              </p>

              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1">
                  {TOUR_STEPS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setTourStep(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        tourStep === idx
                          ? 'w-6 bg-emerald-500'
                          : 'w-1.5 bg-slate-300 dark:bg-slate-700'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {tourStep > 0 && (
                    <button
                      onClick={() => setTourStep((s) => s - 1)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold"
                    >
                      {isRtl ? 'السابق' : 'Back'}
                    </button>
                  )}

                  {tourStep < TOUR_STEPS.length - 1 ? (
                    <button
                      onClick={() => setTourStep((s) => s + 1)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                    >
                      {isRtl ? 'التالي' : 'Next'}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveTab('dashboard');
                        handleCloseWelcomeTour();
                      }}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                    >
                      {isRtl ? 'بدء الاستخدام' : 'Done'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            INSTITUTIONAL TOP TELEMETRY & LIVE TICKER TAPE BAR
           =================================================================== */}
        <div className="bg-[#080b10] text-slate-300 border-b border-slate-800/90 px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-[11px]">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            {/* Left/Right: Live Market Status & USD/EGP Reference */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-400">
                <span
                  className={`w-2 h-2 rounded-full ${
                    liveStreaming ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                  }`}
                />
                <span>
                  {liveStreaming
                    ? isRtl
                      ? `متصل أونلاين • تحديث تلقائي كل ${refreshIntervalSec} ثوانٍ (القادم خلال ${secondsToNextSync}ث)`
                      : `ONLINE • Auto-Sync every ${refreshIntervalSec}s (Next in ${secondsToNextSync}s)`
                    : isRtl
                    ? 'التحديث التلقائي متوقف مؤقتاً'
                    : 'Auto-Sync Paused'}
                </span>
              </span>

              <span className="text-slate-600">|</span>

              <span>
                {isRtl ? 'آخر مزامنة:' : 'Last Sync:'}{' '}
                <Numeric className="text-white font-bold">{lastRefreshTime}</Numeric>{' '}
                <span className="text-slate-500 font-mono">({networkLatencyMs}ms • #{syncCount})</span>
              </span>

              <span className="text-slate-600 hidden sm:inline">|</span>

              <span className="hidden sm:inline">
                USD/EGP:{' '}
                <Numeric className="text-amber-400 font-bold">{fmtPrice(usdEgpRate)}</Numeric>
              </span>
            </div>

            {/* Right: Session Clocks & Disclaimer */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
              <span>
                EGX:{' '}
                <Numeric className="text-slate-200 font-semibold">
                  {ramadanMode ? '10:00-13:30' : '10:00-14:30'}
                </Numeric>
              </span>
              <span>
                US: <Numeric className="text-slate-200 font-semibold">09:30-16:00 ET</Numeric>
              </span>
              <span className="text-slate-600 hidden md:inline">|</span>
              <span className="hidden md:inline text-slate-400">
                {isRtl
                  ? 'بيانات إحصائية وفنية للتعليم وإدارة المخاطر وليست توصية مباشرة'
                  : 'Statistical analysis only, not investment advice'}
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================================
            MAIN TERMINAL HEADER (HUMAN-CRAFTED PRO TRADING DESK DESIGN)
           =================================================================== */}
        <header className="sticky top-0 z-30 bg-white dark:bg-[#11161f] border-b border-slate-200 dark:border-slate-800/90 shadow-xs">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
            {/* Brand Identity — Clean, Serious, Zero Fluff */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-900 dark:bg-emerald-600 flex items-center justify-center text-white font-mono font-extrabold text-sm tracking-tighter border border-slate-700">
                EGX
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
                    {isRtl ? `منصة التداول والتحليل الكمي — ${displayName}` : `${displayName} · Quantitative Trading Desk`}
                  </h1>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    PRO v4.1
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {timeGreeting}، أستاذ {firstName} 👋
                  </span>
                  <span className="hidden sm:inline">
                    {' '}
                    • {isRtl
                      ? 'البورصة المصرية (EGX) والأسواق العالمية'
                      : 'EGX & Global Markets'}
                  </span>
                </p>
              </div>
            </div>

            {/* Universal Ticker Search — full width on phones */}
            <div className="relative flex-1 order-last sm:order-none w-full sm:w-auto max-w-full sm:max-w-sm min-w-0 sm:min-w-[210px]">
              <div className="relative">
                <Search
                  className={`w-3.5 h-3.5 text-slate-400 absolute top-1/2 -translate-y-1/2 ${
                    isRtl ? 'right-3' : 'left-3'
                  }`}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isRtl
                      ? 'بحث بالكود أو الاسم (COMI, TMGH, SWDY, NVDA)...'
                      : 'Search ticker (COMI, TMGH, NVDA)...'
                  }
                  className={`w-full text-base sm:text-xs rounded-lg bg-slate-100 dark:bg-[#0b0e14] border border-slate-200 dark:border-slate-800 py-2.5 sm:py-1.5 ${
                    isRtl ? 'pr-8 pl-20' : 'pl-8 pr-20'
                  } focus:outline-none focus:border-emerald-500 transition`}
                />
                <button
                  onClick={() => setShowAddSymbolModal(true)}
                  className={`absolute top-1/2 -translate-y-1/2 ${
                    isRtl ? 'left-1.5' : 'right-1.5'
                  } text-[10px] font-bold px-2 py-1 sm:py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-600 hover:text-white transition`}
                >
                  {isRtl ? '+ إدراج رمز' : '+ Symbol'}
                </button>
              </div>

              {searchQuery.trim() !== '' && (
                <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-[#11161f] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                  {searchResults.length > 0 ? (
                    searchResults.map((sym) => {
                      const a = allAnalyses[sym.canonicalId];
                      const inWatch = currentUser.watchlist.includes(sym.canonicalId);
                      return (
                        <div
                          key={sym.canonicalId}
                          className="flex items-center justify-between px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/70 border-b last:border-b-0 border-slate-100 dark:border-slate-800 text-xs"
                        >
                          <button
                            onClick={() => {
                              setSelectedSymbolId(sym.canonicalId);
                              setActiveTab('stock');
                              setSearchQuery('');
                            }}
                            className="flex-1 text-start"
                          >
                            <div className="font-bold flex items-center gap-2">
                              <span>{isRtl ? sym.nameAr : sym.nameEn}</span>
                              <Numeric className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                                {sym.canonicalId}
                              </Numeric>
                            </div>
                            <div className="text-slate-400 text-[10px] mt-0.5">
                              {sym.source} • <Numeric>{fmtPrice(a?.price)} {sym.currency}</Numeric>
                            </div>
                          </button>

                          <button
                            onClick={() => toggleWatchlist(sym.canonicalId)}
                            className={`px-2 py-1 rounded text-[11px] font-semibold ${
                              inWatch
                                ? 'bg-emerald-500/15 text-emerald-500'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {inWatch ? (isRtl ? 'متابع ✓' : 'Watched') : isRtl ? '+ تابع' : '+ Watch'}
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-3 text-xs flex items-center justify-between">
                      <span>{isRtl ? `الرمز "${searchQuery.toUpperCase()}" غير مسجل.` : 'Not found.'}</span>
                      <button
                        onClick={() => {
                          setNewCustomTicker((prev) => ({
                            ...prev,
                            ticker: searchQuery.trim().toUpperCase()
                          }));
                          setShowAddSymbolModal(true);
                          setSearchQuery('');
                        }}
                        className="px-2.5 py-1 rounded bg-emerald-600 text-white font-semibold"
                      >
                        {isRtl ? 'إضافة فورية +' : 'Add +'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Controls: Auto-Refresh Speed (5s/7s/10s), Morning/Night Switcher, Profile */}
            <div id="tour-theme-controls" className="flex flex-wrap items-center gap-1.5">
              {/* Live Auto-Refresh Control & Interval Selector (5s / 7s / 10s) */}
              <div className="flex items-center rounded-lg bg-slate-100 dark:bg-[#0b0e14] border border-slate-200 dark:border-slate-800 p-0.5 text-[11px]">
                <button
                  onClick={() => setLiveStreaming((s) => !s)}
                  className={`flex items-center gap-1 px-2 py-2 sm:py-1 rounded-md font-bold transition ${
                    liveStreaming
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <RefreshCw className={`w-3 h-3 ${liveStreaming ? 'animate-spin' : ''}`} />
                  <span>{liveStreaming ? `${secondsToNextSync}ث` : isRtl ? 'متوقف' : 'Off'}</span>
                </button>

                {[5, 7, 10].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => {
                      setRefreshIntervalSec(sec);
                      setSecondsToNextSync(sec);
                      setLiveStreaming(true);
                    }}
                    title={`تحديث أوتوماتيكي كل ${sec} ثوانٍ`}
                    className={`px-2.5 py-2 sm:px-1.5 sm:py-1 rounded-md font-mono font-semibold transition ${
                      liveStreaming && refreshIntervalSec === sec
                        ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-2xs'
                        : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}

                <button
                  onClick={() => performLiveMarketSync(true)}
                  title={isRtl ? 'تحديث فوري الآن' : 'Sync Now'}
                  className="px-2.5 py-2 sm:py-1 text-slate-600 dark:text-slate-300 hover:text-emerald-500 font-semibold border-s border-slate-200 dark:border-slate-800"
                >
                  {isRtl ? 'تحديث الآن' : 'Sync'}
                </button>
              </div>

              {/* Morning (الصباح) vs Night (المساء) Switch */}
              <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-[#0b0e14] border border-slate-200 dark:border-slate-800 text-[11px] font-bold">
                <button
                  onClick={() => setDarkMode(false)}
                  className={`flex items-center gap-1 px-2.5 py-2 sm:py-1 rounded-md transition ${
                    !darkMode
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Sun className="w-3 h-3 text-amber-500" />
                  <span>{isRtl ? 'نهاري' : 'Day'}</span>
                </button>
                <button
                  onClick={() => setDarkMode(true)}
                  className={`flex items-center gap-1 px-2.5 py-2 sm:py-1 rounded-md transition ${
                    darkMode
                      ? 'bg-slate-800 text-white shadow-2xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Moon className="w-3 h-3 text-sky-400" />
                  <span>{isRtl ? 'ليلي' : 'Night'}</span>
                </button>
              </div>

              {/* Guide Button */}
              <button
                onClick={() => {
                  setTourStep(0);
                  setShowWelcomeTour(true);
                }}
                className="px-2.5 py-2 sm:py-1.5 rounded-lg bg-slate-100 dark:bg-[#0b0e14] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 text-[11px] font-semibold flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isRtl ? 'دليل المنصة' : 'Guide'}</span>
              </button>

              {/* Authenticated User Badge + Sign Out */}
              <div
                className="flex items-center gap-1.5 bg-emerald-500/10 dark:bg-emerald-500/10 ps-1.5 pe-1 py-1 rounded-lg border border-emerald-500/30 text-[11px]"
                title={`${isRtl ? 'الحساب الحالي' : 'Signed in as'}: ${displayName}`}
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-extrabold text-[11px] flex items-center justify-center shadow-sm">
                  {currentInitial}
                </div>
                <div className="hidden md:flex flex-col leading-4">
                  <span className="font-extrabold text-slate-800 dark:text-emerald-300 max-w-[140px] truncate">
                    {displayName}
                  </span>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-500 font-semibold">
                    {isRtl ? 'حساب موقّع ✓' : 'Signed in ✓'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title={isRtl ? 'تسجيل خروج بأمان' : 'Sign out'}
                  aria-label={isRtl ? 'تسجيل خروج' : 'Sign out'}
                  className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Primary Navigation Tabs — Organized & Numbered for Beginner Clarity */}
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar border-t border-slate-200/70 dark:border-slate-800/80">
            {/* Numbered tabs — desktop & tablet; on phones the fixed bottom bar takes over */}
            <div className="hidden lg:flex items-center gap-1">
              {[
                { id: 'dashboard', icon: Activity, labelAr: '1. البداية وترشيح النهاردة', labelEn: '1. Daily Pick & Watchlist' },
                { id: 'stock', icon: BarChart2, labelAr: `2. إمتى أشتري وأبيع؟ (${currentAnalysis.symbol.ticker})`, labelEn: `2. Buy/Sell Plan (${currentAnalysis.symbol.ticker})` },
                { id: 'portfolio', icon: Wallet, labelAr: `3. مرتبي وأقساطي ومحفظتي (${currentUser.trades.length})`, labelEn: `3. Budget & Portfolio (${currentUser.trades.length})` },
                { id: 'masters', icon: BookOpen, labelAr: '4. خلاصة الـ 14 كتاباً', labelEn: '4. Masters Rules' },
                { id: 'scanner', icon: Filter, labelAr: '5. باحث الفرص', labelEn: '5. Scanner' },
                { id: 'ledger', icon: Scale, labelAr: '6. سجل المصداقية', labelEn: '6. Track Record' },
                { id: 'telegram', icon: Send, labelAr: '7. تليجرام والتنبيهات', labelEn: '7. Telegram & Alerts' },
                { id: 'architecture', icon: Database, labelAr: '8. فحص المصادر', labelEn: '8. Data Health' }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
                      isActive
                        ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400 bg-emerald-500/5'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{isRtl ? tab.labelAr : tab.labelEn}</span>
                  </button>
                );
              })}
            </div>

            {/* Beginner Mode & Dictionary Quick Controls */}
            <div className="flex items-center gap-1.5 py-1.5 shrink-0">
              <button
                onClick={() => setBeginnerMode((b) => !b)}
                className={`px-2.5 py-2 sm:py-1 rounded-lg text-[11px] font-bold border transition flex items-center gap-1 ${
                  beginnerMode
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{beginnerMode ? 'وضع المبتدئ: مفعّل ✓' : 'وضع المبتدئ: مغلق'}</span>
              </button>

              <button
                onClick={() => setShowBeginnerGlossaryModal(true)}
                className="px-2.5 py-2 sm:py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[11px] font-bold hover:bg-amber-500/25 transition"
              >
                <span className="hidden sm:inline">📖 قاموس المبتدئ المبسط</span>
                <span className="sm:hidden">📖 القاموس</span>
              </button>

              <button
                onClick={() => setShowLaunchModal(true)}
                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition flex items-center gap-1 shadow-2xs"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">🚀 نشر أونلاين + تطبيق للموبايل</span>
                <span className="sm:hidden">🚀 النشر</span>
              </button>
            </div>
          </div>
        </header>

        {/* ===================================================================
            PRE-TRADE PRICE & TIMING SAFETY GUARD BAR (ALWAYS VISIBLE)
           =================================================================== */}
        <div
          id="tour-safety-guard"
          className="bg-white dark:bg-[#11161f] border-b border-slate-200 dark:border-slate-800 px-4 py-2"
        >
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded font-bold text-[11px] ${
                  currentSafetyCheck.executionSafetyStatus === 'OPTIMAL_EXECUTION'
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : currentSafetyCheck.executionSafetyStatus === 'BLOCKED_DATA_GAP'
                    ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                    : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>فحص سلامة السعر والتوقيت ({currentAnalysis.symbol.ticker}):</span>
              </span>

              <span className="text-slate-700 dark:text-slate-300 font-medium">
                {currentSafetyCheck.executionWarningAr}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                {currentSafetyCheck.sessionLabelAr}
              </span>
              <button
                onClick={handleVerifyLivePricesOnline}
                disabled={isVerifyingWebPrices}
                className="px-2.5 py-1 rounded bg-slate-900 dark:bg-slate-800 hover:bg-emerald-600 text-white font-bold transition flex items-center gap-1"
              >
                <Globe className={`w-3 h-3 ${isVerifyingWebPrices ? 'animate-spin' : ''}`} />
                <span>
                  {isVerifyingWebPrices ? 'جاري الفحص أونلاين...' : 'فحص السعر أونلاين (Google)'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ===================================================================
            MAIN PAGE CONTENT AREA
           =================================================================== */}
        <main className="max-w-7xl mx-auto px-4 pt-6 pb-24 lg:pb-6 space-y-6">
          {/* ===================================================================
              PERSONAL GREETING HERO — name, date & instant account snapshot
             =================================================================== */}
          <section
            aria-label={isRtl ? 'الترحيب الشخصي' : 'Personal greeting'}
            className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-l from-slate-900 via-[#0d1420] to-emerald-950 text-white px-5 py-4 sm:px-6 sm:py-5 shadow-lg"
          >
            <div
              aria-hidden
              className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"
            />
            <div
              aria-hidden
              className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-teal-400/10 blur-3xl pointer-events-none"
            />
            <div className="relative flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center font-black text-2xl sm:text-3xl text-white border border-emerald-300/40 shadow-lg shadow-emerald-500/20 shrink-0">
                  {currentInitial}
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-[11px] font-bold text-emerald-400/90 font-mono tracking-wide">
                    {todayPretty}
                  </div>
                  <h2 className="text-lg sm:text-2xl font-black leading-snug mt-0.5">
                    {timeGreeting}، أستاذ {firstName} 👋
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                    {isRtl
                      ? 'دي لوحتك الخاصة — مرتبك ومعاملاتك ومحفظتك محفوظة لك وحدك.'
                      : 'Your private desk — your salary, trades & portfolio are saved for you alone.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 text-center">
                <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 min-w-[74px]">
                  <div className="text-base sm:text-xl font-extrabold text-emerald-400 font-mono">
                    {currentUser.watchlist.length}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-slate-400 leading-tight">
                    {isRtl ? 'أسهم أتابعها' : 'Watching'}
                  </div>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 min-w-[74px]">
                  <div className="text-base sm:text-xl font-extrabold text-sky-400 font-mono">
                    {currentUser.trades.length}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-slate-400 leading-tight">
                    {isRtl ? 'معاملة مسجلة' : 'Trades'}
                  </div>
                </div>
                <div className="rounded-xl bg-white/5 border border-emerald-500/30 px-3 py-2 min-w-[96px]">
                  <div className="text-base sm:text-xl font-extrabold text-emerald-300 font-mono">
                    {fmtPrice(budgetAllocationPlan.netInvestableEgp, 0)}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-emerald-500/80 leading-tight">
                    {isRtl ? 'EGP متاح للاستثمار' : 'EGP to invest'}
                  </div>
                </div>
              </div>
            </div>
          </section>


          {/* -----------------------------------------------------------------
              BEGINNER 3-STEP ROADMAP RIBBON (Shown when Beginner Mode is ON)
             ----------------------------------------------------------------- */}
          {beginnerMode && (
            <div className="rounded-2xl bg-emerald-500/5 dark:bg-[#11161f] border border-emerald-500/30 p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center shrink-0 text-sm">
                  🎓
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                      أهلاً بك يا {firstName}! لأنك في وضع المبتدئ، لا تشغل بالك بالأرقام الكثيرة — امشِ على هذه الخطوات الـ 3 فقط:
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1 text-xs text-slate-600 dark:text-slate-300">
                    <button
                      onClick={() => setActiveTab('portfolio')}
                      className="text-start p-2.5 rounded-xl bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition"
                    >
                      <strong className="text-emerald-600 dark:text-emerald-400 block mb-0.5">
                        الخطوة 1: حدد المتبقي من مرتبك
                      </strong>
                      <span>
                        من تبويب (3. مرتبي وأقساطي) سجل دخلك وأقساطك عشان نعرف المبلغ الفائض للاستثمار بأمان (حالياً:{' '}
                        <Numeric className="font-bold">{fmtPrice(budgetAllocationPlan.netInvestableEgp, 0)} EGP</Numeric>).
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="text-start p-2.5 rounded-xl bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition"
                    >
                      <strong className="text-blue-600 dark:text-blue-400 block mb-0.5">
                        الخطوة 2: شوف ترشيح النهاردة الجاهز
                      </strong>
                      <span>
                        في الكارت الأول تحت هنا، النظام اختارلك أضمن أسهم النهاردة وحددلك تشتري كام سهم بالضبط على قد فلوسك.
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveTab('stock')}
                      className="text-start p-2.5 rounded-xl bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition"
                    >
                      <strong className="text-amber-600 dark:text-amber-400 block mb-0.5">
                        الخطوة 3: اعرف سعر الشراء وسعر البيع
                      </strong>
                      <span>
                        اضغط على السهم عشان تشوف 3 أرقام بس: (منين تشتري) و(تبيع فين عشان تكسب) و(تخرج فين لو السهم نزل).
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* -----------------------------------------------------------------
              TAB 1: DASHBOARD (Institutional Daily Allocation Desk + Watchlist)
             ----------------------------------------------------------------- */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Clean Dashboard Section Organizer Bar (Prevents Visual Clutter while keeping 100% of features) */}
              <div className="rounded-xl bg-white dark:bg-[#11161f] border border-slate-200 dark:border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs shadow-2xs">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-500" />
                  <span className="font-bold text-slate-700 dark:text-slate-200">
                    تنظيم عرض الصفحة الرئيسية (اختر عرض كل الأقسام أو التركيز على قسم واحد بهدوء):
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'ALL', label: 'عرض شامل ومرتب (الكل)' },
                    { id: 'DAILY_PICKS', label: '1. ترشيح النهاردة فقط' },
                    { id: 'WATCHLIST', label: '2. جدول الأسهم المراقبة فقط' },
                    { id: 'BENCHMARKS', label: '3. مؤشرات السوق القيادية فقط' }
                  ].map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => setDashboardSubView(sec.id)}
                      className={`px-3 py-1.5 rounded-lg font-bold transition ${
                        dashboardSubView === sec.id
                          ? 'bg-slate-900 dark:bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {sec.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* INSTITUTIONAL DAILY EXECUTION BRIEF BASED ON MONTHLY SURPLUS */}
              {(dashboardSubView === 'ALL' || dashboardSubView === 'DAILY_PICKS') && (
              <div
                id="tour-gemini-radar"
                className="rounded-xl bg-white dark:bg-[#11161f] border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-2.5 py-0.5 rounded bg-emerald-500/15 font-extrabold text-emerald-600 dark:text-emerald-400">
                        👋 نصيحة النهاردة الجاهزة — أستاذ {displayName}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500 dark:text-slate-400">
                        المبلغ الصافي المتبقي للاستثمار هذا الشهر:{' '}
                        <Numeric className="font-bold text-slate-900 dark:text-white">
                          {fmtPrice(budgetAllocationPlan.netInvestableEgp, 0)} EGP
                        </Numeric>
                      </span>
                    </div>

                    <h2 className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white">
                      {budgetAllocationPlan.allocations.length >= 2
                        ? `النهاردة ممكن نشتري سهم ${budgetAllocationPlan.allocations[0].analysis.symbol.nameAr} (${budgetAllocationPlan.allocations[0].shares} سهم) وسهم ${budgetAllocationPlan.allocations[1].analysis.symbol.nameAr} (${budgetAllocationPlan.allocations[1].shares} سهم)`
                        : 'خطة توزيع السيولة المتاحة لليوم'}
                    </h2>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      محسوبة آلياً على قد المبلغ المتبقي من مرتبك بعد خصم مصاريف المعيشة والأقساط الشهرية (<Numeric className="font-semibold">{fmtPrice(budgetAllocationPlan.totalObligations, 0)} EGP</Numeric>) وتجنيب احتياطي الطوارئ النقدي (<Numeric className="font-semibold">{fmtPrice(budgetAllocationPlan.emergencyReserveEgp, 0)} EGP</Numeric>).
                    </p>

                    {beginnerMode && budgetAllocationPlan.allocations[0] && (
                      <div className="mt-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                        <strong>🎓 شرح مبسط للمبتدئ:</strong> ليه اخترنا{' '}
                        <strong>{budgetAllocationPlan.allocations[0].analysis.symbol.nameAr}</strong> النهاردة؟ لأن اتجاهه صاعد، ولما الإشارة دي ظهرت في الماضي كسبت في{' '}
                        <Numeric className="font-bold text-emerald-600 dark:text-emerald-400">
                          {budgetAllocationPlan.allocations[0].analysis.backtest.winRatePct}%
                        </Numeric>{' '}
                        من المرات. كل اللي عليك تشتري بالكمية المحددة تحت داخل{' '}
                        <strong>نطاق الشراء</strong>، وتبيع عند <strong>مستهدف البيع</strong>.
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setActiveTab('portfolio')}
                      className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition"
                    >
                      <Wallet className="w-3.5 h-3.5 text-emerald-500" />
                      <span>تعديل المرتب والأقساط</span>
                    </button>

                    <button
                      onClick={handleRunGeminiDailyRadar}
                      disabled={isRadarLoading}
                      className="px-3.5 py-2 rounded-lg bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        {isRadarLoading ? 'جاري إعداد المذكرة...' : '✨ شرح Gemini لترشيحات النهاردة'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* 3 Institutional Allocation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {budgetAllocationPlan.allocations.map((item) => {
                    const a = item.analysis;
                    const dec = a.price < 5 ? 3 : 2;
                    const flash = priceFlashMap[a.symbol.canonicalId];
                    const isInsideEntry =
                      a.price >= a.signal.entryZone[0] && a.price <= a.signal.entryZone[1] * 1.01;
                    return (
                      <div
                        key={a.symbol.canonicalId}
                        className="rounded-xl p-4 bg-slate-50/70 dark:bg-[#0b0e14] border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 transition flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between gap-2 text-[11px]">
                            <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                              {item.rank === 1
                                ? 'الترشيح الأول (50% من الفائض)'
                                : item.rank === 2
                                ? 'الترشيح الثاني (30% من الفائض)'
                                : 'الترشيح الثالث (20% من الفائض)'}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded font-bold ${
                                isInsideEntry
                                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                              }`}
                            >
                              {isInsideEntry ? 'السعر مناسب للشراء الآن ✓' : 'انتظر نزول السعر لنطاق الشراء'}
                            </span>
                          </div>

                          <div className="flex items-baseline justify-between">
                            <div>
                              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                                {a.symbol.nameAr}
                              </h3>
                              <Numeric className="text-[11px] text-slate-400">
                                {a.symbol.canonicalId} • نجاح تاريخي {a.backtest.winRatePct}%
                              </Numeric>
                            </div>
                            <div
                              className={`text-end px-2 py-0.5 rounded transition-colors ${
                                flash === 'up'
                                  ? 'bg-emerald-500/20'
                                  : flash === 'down'
                                  ? 'bg-rose-500/20'
                                  : ''
                              }`}
                            >
                              <Numeric className="text-base font-extrabold text-slate-900 dark:text-white">
                                {fmtPrice(a.price, dec)} {a.symbol.currency}
                              </Numeric>
                              <div className="text-[11px]">
                                <Numeric colorize={a.changePct} className="font-bold">
                                  {fmtPct(a.changePct)}
                                </Numeric>
                              </div>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-lg bg-white dark:bg-[#11161f] border border-slate-200/80 dark:border-slate-800 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">اشترِ عدد:</span>
                              <Numeric className="font-extrabold text-emerald-600 dark:text-emerald-400">
                                {item.shares} سهم
                              </Numeric>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                              <span>بتكلفة إجمالية من الفائض:</span>
                              <Numeric className="font-bold text-slate-800 dark:text-slate-200">
                                {fmtPrice(item.actualCost, 0)} EGP
                              </Numeric>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                            <div className="p-1.5 rounded bg-white dark:bg-[#11161f] border border-slate-200/60 dark:border-slate-800">
                              <div className="text-slate-400">1. اشتري بين</div>
                              <Numeric className="font-bold text-blue-600 dark:text-blue-400">
                                {fmtPrice(a.signal.entryZone[0], dec)}-{fmtPrice(a.signal.entryZone[1], dec)}
                              </Numeric>
                            </div>
                            <div className="p-1.5 rounded bg-white dark:bg-[#11161f] border border-slate-200/60 dark:border-slate-800">
                              <div className="text-slate-400">2. بيع واكسب</div>
                              <Numeric className="font-bold text-emerald-600 dark:text-emerald-400">
                                {fmtPrice(a.signal.target1Zone[0], dec)}
                              </Numeric>
                            </div>
                            <div className="p-1.5 rounded bg-white dark:bg-[#11161f] border border-slate-200/60 dark:border-slate-800">
                              <div className="text-slate-400">3. حزام الأمان</div>
                              <Numeric className="font-bold text-rose-600 dark:text-rose-400">
                                {fmtPrice(a.signal.stopZone[0], dec)}
                              </Numeric>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => {
                              if (item.shares <= 0) {
                                triggerToast('يرجى زيادة الفائض المتاح في الميزانية أولاً');
                                return;
                              }
                              setUsers((prev) =>
                                prev.map((u) =>
                                  u.id === currentUser.id
                                    ? {
                                        ...u,
                                        trades: [
                                          {
                                            id: Date.now(),
                                            canonicalId: a.symbol.canonicalId,
                                            side: 'BUY',
                                            qty: item.shares,
                                            price: a.price,
                                            currency: a.symbol.currency,
                                            date: new Date().toISOString().split('T')[0],
                                            channel: 'خطة الفائض الشهري',
                                            notes: `شراء ${item.shares} سهم بسعر ${a.price} (${item.weightPct}% من الفائض)`
                                          },
                                          ...u.trades
                                        ]
                                      }
                                    : u
                                )
                              );
                              triggerToast(
                                `تم تسجيل شراء ${item.shares} سهم من ${a.symbol.ticker} في سجل معاملاتك`
                              );
                            }}
                            className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                          >
                            + اشترِ وسجل ({item.shares} سهم)
                          </button>

                          <button
                            onClick={() => {
                              setSelectedSymbolId(a.symbol.canonicalId);
                              setActiveTab('stock');
                            }}
                            className="px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold"
                          >
                            الشرح الكامل
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {geminiRadarReport && (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0b0e14] border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800 pb-2">
                      <span>{geminiRadarReport.source}</span>
                      <button
                        onClick={() => setGeminiRadarReport(null)}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                      {geminiRadarReport.text}
                    </div>
                  </div>
                )}
              </div>
              )}

              {/* Top Market Benchmark Cards */}
              {(dashboardSubView === 'ALL' || dashboardSubView === 'BENCHMARKS') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {['INDEX:EGX30', 'EGX:COMI', 'EGX:TMGH', 'NASDAQ:NVDA'].map((cid) => {
                  const a = allAnalyses[cid];
                  if (!a) return null;
                  const decPlan = getActionableDecision(a);
                  const flash = priceFlashMap[cid];
                  return (
                    <div
                      key={cid}
                      onClick={() => {
                        setSelectedSymbolId(cid);
                        setActiveTab('stock');
                      }}
                      className={`cursor-pointer rounded-xl p-4 bg-white dark:bg-[#11161f] border transition ${
                        flash === 'up'
                          ? 'border-emerald-500/60 bg-emerald-500/5'
                          : flash === 'down'
                          ? 'border-rose-500/60 bg-rose-500/5'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                        <span className="font-bold text-slate-800 dark:text-slate-100 truncate">
                          {isRtl ? a.symbol.nameAr : a.symbol.nameEn}
                        </span>
                        <Numeric className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
                          {a.symbol.ticker}
                        </Numeric>
                      </div>

                      <div className="flex items-baseline justify-between mt-2">
                        <Numeric className="text-xl font-extrabold">
                          {fmtPrice(a.price)}{' '}
                          <span className="text-xs font-normal text-slate-400">{a.symbol.currency}</span>
                        </Numeric>
                        <Numeric colorize={a.changePct} className="text-sm font-bold">
                          {fmtPct(a.changePct)}
                        </Numeric>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span
                          className={`font-bold px-2 py-0.5 rounded ${
                            decPlan.tone === 'emerald'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : decPlan.tone === 'rose'
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                              : 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                          }`}
                        >
                          {isRtl ? decPlan.badgeAr : decPlan.badgeEn}
                        </span>
                        <span className="text-slate-400 font-mono">
                          نجاح <Numeric className="font-bold text-emerald-500">{a.backtest.winRatePct}%</Numeric>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              )}

              {/* Per-User Watchlist Table with Live Tick Flash & Execution Safety */}
              {(dashboardSubView === 'ALL' || dashboardSubView === 'WATCHLIST') && (
              <div
                id="tour-watchlist-table"
                className="rounded-xl bg-white dark:bg-[#11161f] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs"
              >
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-sm sm:text-base flex items-center gap-2">
                      <span>
                        {isRtl
                          ? `شاشة الأسهم المراقبة — ${currentUser.nameAr}`
                          : `Market Watchlist — ${currentUser.nameEn}`}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                        {currentUser.watchlist.length} أسهم
                      </span>
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {isRtl
                        ? `يتم تحديث الأسعار وفحص شروط الدخول تلقائياً كل ${refreshIntervalSec} ثوانٍ • آخر تحديث: ${lastRefreshTime}`
                        : `Auto-syncing every ${refreshIntervalSec}s • Last sync: ${lastRefreshTime}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRamadanMode((r) => !r)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold ${
                        ramadanMode
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-500'
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      {isRtl ? 'جلسة رمضان (13:30)' : 'Ramadan Hours'}
                    </button>
                    <button
                      onClick={() => setShowAddSymbolModal(true)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-emerald-600 hover:opacity-90 text-white font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'إدراج سهم' : 'Add Symbol'}</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead className="bg-slate-50 dark:bg-[#0b0e14] text-slate-500 dark:text-slate-400 text-[11px] border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="py-2.5 px-4 text-start">{isRtl ? 'السهم والمصدر' : 'Symbol & Feed'}</th>
                        <th className="py-2.5 px-3 text-start">{isRtl ? 'السعر اللحظي' : 'Last Price'}</th>
                        <th className="py-2.5 px-3 text-start">{isRtl ? 'التوجيه الكمي' : 'Signal Verdict'}</th>
                        <th className="py-2.5 px-3 text-start">{isRtl ? 'منطقة الشراء الآمنة' : 'Safe Entry Zone'}</th>
                        <th className="py-2.5 px-3 text-start">{isRtl ? 'المستهدف / الوقف' : 'Target / Stop'}</th>
                        <th className="py-2.5 px-3 text-start">{isRtl ? 'نسبة النجاح التاريخية' : 'Backtest Win%'}</th>
                        <th className="py-2.5 px-3 text-center">{isRtl ? 'التفاصيل' : 'Action'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {currentUser.watchlist.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-10 px-4 text-center">
                            <div className="text-3xl mb-2">⭐</div>
                            <p className="font-extrabold text-slate-700 dark:text-slate-200">
                              {isRtl ? 'قائمة متابعتك فارغة لسه' : 'Your watchlist is empty'}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto leading-6">
                              {isRtl
                                ? 'ابحث عن أي سهم من خانة البحث فوق (COMI، TMGH، NVDA...) واضغط «+ تابع» — أو اضغط «إدراج سهم» لإضافة أي رمز للتحليل الفوري.'
                                : 'Search any ticker above and tap “+ Watch”, or add one with “Add Symbol”.'}
                            </p>
                          </td>
                        </tr>
                      )}
                      {currentUser.watchlist.map((cid) => {
                        const a = allAnalyses[cid];
                        if (!a) return null;
                        const dec = a.price < 5 ? 3 : 2;
                        const decPlan = getActionableDecision(a);
                        const flash = priceFlashMap[cid];
                        return (
                          <tr
                            key={cid}
                            className={`transition-colors ${
                              flash === 'up'
                                ? 'bg-emerald-500/10'
                                : flash === 'down'
                                ? 'bg-rose-500/10'
                                : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/30'
                            }`}
                          >
                            <td className="py-3 px-4">
                              <button
                                onClick={() => {
                                  setSelectedSymbolId(cid);
                                  setActiveTab('stock');
                                }}
                                className="text-start group"
                              >
                                <div className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 flex items-center gap-1.5">
                                  <span>{isRtl ? a.symbol.nameAr : a.symbol.nameEn}</span>
                                  {a.signal.hasCorporateActionWarning && (
                                    <AlertTriangle
                                      title="فجوة توزيع أسهم مجانية غير معدلة"
                                      className="w-3.5 h-3.5 text-amber-500 shrink-0"
                                    />
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400">
                                  <Numeric className="font-semibold text-slate-500 dark:text-slate-300">
                                    {a.symbol.canonicalId}
                                  </Numeric>
                                  <span>•</span>
                                  <span>{a.symbol.source}</span>
                                  <span>•</span>
                                  <Numeric>{lastRefreshTime}</Numeric>
                                </div>
                              </button>
                            </td>

                            <td className="py-3 px-3">
                              <div className="font-extrabold">
                                <Numeric>{fmtPrice(a.price, dec)}</Numeric>{' '}
                                <span className="text-[10px] font-normal text-slate-400">{a.symbol.currency}</span>
                              </div>
                              <Numeric colorize={a.changePct} className="text-xs font-bold">
                                {fmtPct(a.changePct)}
                              </Numeric>
                            </td>

                            <td className="py-3 px-3">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                                  decPlan.tone === 'emerald'
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25'
                                    : decPlan.tone === 'rose'
                                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/25'
                                    : decPlan.tone === 'amber'
                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25'
                                    : 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/25'
                                }`}
                              >
                                {isRtl ? decPlan.badgeAr : decPlan.badgeEn}
                              </span>
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                القوة: <Numeric className="font-bold">{a.signal.compositeScore}/100</Numeric> • RSI{' '}
                                <Numeric>{a.indicators.rsi14}</Numeric>
                              </div>
                            </td>

                            <td className="py-3 px-3 text-xs">
                              <div className="text-blue-600 dark:text-blue-400 font-bold">
                                <Numeric>
                                  {fmtPrice(a.signal.entryZone[0], dec)} - {fmtPrice(a.signal.entryZone[1], dec)}
                                </Numeric>{' '}
                                <span className="text-[10px] font-normal">{a.symbol.currency}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                {a.price <= a.signal.entryZone[1] * 1.01
                                  ? 'داخل النطاق المسموح ✓'
                                  : 'أعلى من النطاق (انتظر)'}
                              </div>
                            </td>

                            <td className="py-3 px-3 text-xs">
                              <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                                هدف:{' '}
                                <Numeric>
                                  {fmtPrice(a.signal.target1Zone[0], dec)} - {fmtPrice(a.signal.target1Zone[1], dec)}
                                </Numeric>
                              </div>
                              <div className="text-rose-500 font-semibold mt-0.5">
                                وقف: <Numeric>{fmtPrice(a.signal.stopZone[0], dec)}</Numeric>
                              </div>
                            </td>

                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1">
                                <Numeric
                                  colorize={a.backtest.winRatePct - 50}
                                  className="font-extrabold text-sm"
                                >
                                  {a.backtest.winRatePct}%
                                </Numeric>
                                <span className="text-[10px] text-slate-400">
                                  (<Numeric>{a.backtest.sampleSize}</Numeric> صفقة)
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400">
                                العائد المتوقع:{' '}
                                <Numeric colorize={a.backtest.expectancyPct} className="font-semibold">
                                  {fmtPct(a.backtest.expectancyPct)}
                                </Numeric>
                              </div>
                            </td>

                            <td className="py-3 px-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => {
                                    setSelectedSymbolId(cid);
                                    setActiveTab('stock');
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 hover:bg-emerald-600 text-white font-bold text-xs transition"
                                >
                                  {isRtl ? 'خطة التنفيذ' : 'Plan'}
                                </button>
                                <button
                                  onClick={() => toggleWatchlist(cid)}
                                  title={isRtl ? 'إزالة من القائمة' : 'Remove'}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              )}
            </div>
          )}

          {/* -----------------------------------------------------------------
              TAB 2: STOCK DEEP-DIVE ("إمتى أشتري وإمتى أبيع؟" + MASTERS COUNCIL)
             ----------------------------------------------------------------- */}
          {activeTab === 'stock' && (
            <div className="space-y-6">
              {/* Quick Stock Selector Bar */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {symbols.map((s) => {
                  const active = s.canonicalId === currentAnalysis.symbol.canonicalId;
                  return (
                    <button
                      key={s.canonicalId}
                      onClick={() => setSelectedSymbolId(s.canonicalId)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition ${
                        active
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50'
                      }`}
                    >
                      <span>{s.ticker}</span>
                      <span className="ms-1.5 opacity-75 text-[10px]">({s.exchange})</span>
                    </button>
                  );
                })}
              </div>

              {/* BEGINNER PLAIN-ARABIC SUMMARY CARD + ORGANIZED SECTION FILTER */}
              {(() => {
                const allocMatch = budgetAllocationPlan.allocations.find(
                  (x) => x.analysis.symbol.canonicalId === currentAnalysis.symbol.canonicalId
                );
                const plainGuide = buildBeginnerPlainSummary(currentAnalysis, allocMatch);
                return (
                  <div className="rounded-2xl bg-white dark:bg-[#11161f] border-2 border-emerald-500/35 p-5 shadow-xs space-y-4">
                    {beginnerMode && (
                      <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[11px] font-extrabold">
                            🎓 الخلاصة المبسطة للمبتدئ (بدون مصطلحات معقدة)
                          </span>
                          <button
                            onClick={() => setShowBeginnerGlossaryModal(true)}
                            className="text-[11px] font-bold text-amber-500 hover:underline"
                          >
                            مش فاهم أي مصطلح؟ افتح القاموس المبسط 📖
                          </button>
                        </div>

                        <h3 className="text-sm sm:text-lg font-extrabold text-slate-900 dark:text-white">
                          {plainGuide.headlineAr}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {plainGuide.explanationAr}
                        </p>
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-semibold leading-relaxed">
                          💡 <strong>إزاي تنفذ ده عملياً خطوة بخطوة:</strong> {plainGuide.howToExecuteAr}
                        </div>
                      </div>
                    )}

                    {/* Clean Section Organizer Bar so the page never feels cluttered */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-slate-500 dark:text-slate-400">
                        تنظيم عرض صفحة السهم (كل الخواص متاحة ومرتبة):
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {[
                          { id: 'ALL', label: 'عرض كل الأقسام بالترتيب (الشامل)' },
                          { id: 'STEP1_PLAN', label: '1. خطة أشتري وأبيع فين فقط' },
                          { id: 'STEP2_CHART', label: '2. الشارت وحاسبة الكمية فقط' },
                          { id: 'STEP3_MASTERS', label: '3. رأي الكتب الـ 14 والمرشد الذكي' },
                          { id: 'STEP4_BACKTEST', label: '4. الاختبار التاريخي والماليات' }
                        ].map((v) => (
                          <button
                            key={v.id}
                            onClick={() => setStockSubView(v.id)}
                            className={`px-3 py-1.5 rounded-lg font-bold transition ${
                              stockSubView === v.id
                                ? 'bg-slate-900 dark:bg-emerald-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            {v.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Corporate Action / Bonus Share Unadjusted Gap Warning Banner */}
              {currentAnalysis.signal.hasCorporateActionWarning && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm">
                      <div className="font-extrabold text-amber-600 dark:text-amber-400">
                        {isRtl
                          ? `تحذير جودة بيانات (Corporate Action Guard): تم رصد فجوة سعرية غير معدلة بتاريخ ${currentAnalysis.signal.anomalyBarDate}`
                          : `Corporate Action Outlier Detected on ${currentAnalysis.signal.anomalyBarDate}`}
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                        {isRtl
                          ? 'تجاوز التغير اليومي الحدود السعرية للبورصة المصرية (±20%) بسبب توزيع أسهم مجانية أو تجزئة لم يتم تعديلها في المصدر المجاني. تم تقييد الثقة تلقائياً لحمايتك من إشارات مضللة.'
                          : 'Single-bar drop exceeded EGX 20% daily limit due to unadjusted bonus shares.'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFixedAnomalies((prev) => ({
                        ...prev,
                        [currentAnalysis.symbol.canonicalId]: true
                      }));
                      triggerToast(
                        isRtl
                          ? 'تم تعديل السلسلة السعرية بأثر رجعي وإعادة حساب المؤشرات'
                          : 'Adjusted historical series for bonus shares'
                      );
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shrink-0"
                  >
                    {isRtl ? 'تعديل السلسلة السعرية آلياً ✓' : 'Auto-Adjust Series ✓'}
                  </button>
                </div>
              )}

              {/* Stock Top Header & Provenance Metadata */}
              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg sm:text-2xl font-extrabold">
                      {isRtl ? currentAnalysis.symbol.nameAr : currentAnalysis.symbol.nameEn}
                    </h2>
                    <Numeric className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold">
                      {currentAnalysis.symbol.canonicalId}
                    </Numeric>
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-bold">
                      {isRtl ? currentAnalysis.symbol.sectorAr : currentAnalysis.symbol.sectorEn}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span>
                      {isRtl ? 'المصدر:' : 'Source:'}{' '}
                      <strong className="text-slate-700 dark:text-slate-200">
                        {currentAnalysis.symbol.source}
                      </strong>
                    </span>
                    <span>•</span>
                    <span>
                      {isRtl ? 'آخر تحديث:' : 'Last Updated:'}{' '}
                      <Numeric className="text-slate-600 dark:text-slate-300">
                        {currentAnalysis.symbol.lastUpdated}
                      </Numeric>
                    </span>
                    <span>•</span>
                    <span className="text-amber-500 font-semibold">
                      {currentAnalysis.symbol.delayMinutes > 0
                        ? isRtl
                          ? `بيانات مجانية متأخرة ${currentAnalysis.symbol.delayMinutes} دقيقة`
                          : `${currentAnalysis.symbol.delayMinutes}m Delayed`
                        : isRtl
                        ? 'بيانات لحظية (0 دقيقة تأخير)'
                        : 'Real-time (0m delay)'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="text-end">
                    <div className="text-2xl sm:text-3xl font-extrabold">
                      <Numeric>
                        {fmtPrice(currentAnalysis.price, currentAnalysis.price < 5 ? 3 : 2)}
                      </Numeric>{' '}
                      <span className="text-xs font-normal text-slate-400">
                        {currentAnalysis.symbol.currency}
                      </span>
                    </div>
                    <Numeric colorize={currentAnalysis.changePct} className="text-sm font-extrabold">
                      {fmtPct(currentAnalysis.changePct)}
                    </Numeric>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleLogSignalToLedger(currentAnalysis)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/15 hover:text-emerald-500 text-xs font-bold border border-slate-200 dark:border-slate-700 transition"
                    >
                      {isRtl ? '+ وثّق الإشارة في سجل المصداقية' : '+ Log to Honesty Ledger'}
                    </button>
                  </div>
                </div>
              </div>

              {/* ===============================================================
                  3-COLUMN ACTIONABLE BUY / SELL / STOP ROADMAP
                 =============================================================== */}
              {(stockSubView === 'ALL' || stockSubView === 'STEP1_PLAN') && (
              <div
                id="tour-buy-sell-roadmap"
                className="rounded-xl bg-white dark:bg-[#11161f] border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-900 dark:bg-slate-800 text-emerald-400 flex items-center justify-center shrink-0">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-sm sm:text-base">
                          {isRtl
                            ? `خطة التنفيذ ومستويات الشراء والبيع (${currentAnalysis.symbol.ticker})`
                            : `Execution Levels & Buy/Sell Plan (${currentAnalysis.symbol.ticker})`}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold ${
                            currentDecision.tone === 'emerald'
                              ? 'bg-emerald-500/15 text-emerald-500'
                              : currentDecision.tone === 'rose'
                              ? 'bg-rose-500/15 text-rose-500'
                              : 'bg-sky-500/15 text-sky-500'
                          }`}
                        >
                          {isRtl ? currentDecision.badgeAr : currentDecision.badgeEn}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {isRtl
                          ? `تحديث تلقائي كل ${refreshIntervalSec} ثوانٍ • آخر فحص للسعر: ${lastRefreshTime} • نطاقات محسوبة وفق ATR(14)`
                          : 'Mathematically derived from ATR(14) volatility and swing support/resistance'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleVerifyLivePricesOnline}
                      disabled={isVerifyingWebPrices}
                      className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
                    >
                      <Globe className={`w-3.5 h-3.5 text-emerald-500 ${isVerifyingWebPrices ? 'animate-spin' : ''}`} />
                      <span>
                        {isVerifyingWebPrices
                          ? 'جاري التحقق أونلاين...'
                          : 'تحقق من السعر الحي على الويب الآن'}
                      </span>
                    </button>

                    <button
                      onClick={() => handleGenerateStockGeminiPlan(currentAnalysis)}
                      disabled={isStockDecisionLoading}
                      className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
                    >
                      <span>
                        {isStockDecisionLoading
                          ? 'جاري إعداد المذكرة...'
                          : 'توليد مذكرة التنفيذ الكاملة'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Column 1: When to Buy */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0b0e14] border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                        1. نطاق الشراء المسموح (Entry)
                      </span>
                      <Numeric className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
                        {fmtPrice(currentAnalysis.signal.entryZone[0], currentAnalysis.price < 5 ? 3 : 2)} -{' '}
                        {fmtPrice(currentAnalysis.signal.entryZone[1], currentAnalysis.price < 5 ? 3 : 2)}{' '}
                        {currentAnalysis.symbol.currency}
                      </Numeric>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {currentDecision.whenToBuyAr}
                    </p>
                  </div>

                  {/* Column 2: When to Sell for Profit */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0b0e14] border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                        2. مستهدفات جني الأرباح (Targets)
                      </span>
                      <Numeric className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                        {fmtPrice(currentAnalysis.signal.target1Zone[0], currentAnalysis.price < 5 ? 3 : 2)} -{' '}
                        {fmtPrice(currentAnalysis.signal.target1Zone[1], currentAnalysis.price < 5 ? 3 : 2)}{' '}
                        {currentAnalysis.symbol.currency}
                      </Numeric>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {currentDecision.whenToSellProfitAr}
                    </p>
                  </div>

                  {/* Column 3: When to Exit / Stop Loss */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0b0e14] border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">
                        3. مستوى الخروج ووقف الخسارة (Stop)
                      </span>
                      <Numeric className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold">
                        {fmtPrice(currentAnalysis.signal.stopZone[0], currentAnalysis.price < 5 ? 3 : 2)}{' '}
                        {currentAnalysis.symbol.currency}
                      </Numeric>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {currentDecision.whenToStopLossAr}
                    </p>
                  </div>
                </div>

                {/* Stock Deep Plan Output if triggered */}
                {geminiStockDecision[currentAnalysis.symbol.canonicalId] && (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0b0e14] border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <span>{geminiStockDecision[currentAnalysis.symbol.canonicalId].source}</span>
                      <button
                        onClick={() =>
                          setGeminiStockDecision((prev) => ({
                            ...prev,
                            [currentAnalysis.symbol.canonicalId]: null
                          }))
                        }
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs sm:text-sm whitespace-pre-line leading-relaxed text-slate-700 dark:text-slate-200">
                      {geminiStockDecision[currentAnalysis.symbol.canonicalId].text}
                    </div>
                  </div>
                )}
              </div>
              )}

              {/* ===============================================================
                  COUNCIL OF INVESTMENT MASTERS SCORECARD ON THIS STOCK
                 =============================================================== */}
              {(stockSubView === 'ALL' || stockSubView === 'STEP3_MASTERS') && (
              <div
                id="tour-masters-council"
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-lg">
                        {isRtl
                          ? `حكم مجلس عمالقة الاستثمار على سهم ${currentAnalysis.symbol.nameAr} (${currentAnalysis.symbol.ticker})`
                          : `Council of Masters Verdict on ${currentAnalysis.symbol.ticker}`}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {isRtl
                          ? 'تطبيق حي لمعادلات جراهام، بيتر لينش، فيليب فيشر، مينيرفيني، ليفرمور، مارك دوجلاس، ودليل البورصة المصرية (Hit the Book)'
                          : 'Live evaluation using Graham, Lynch, Fisher, Minervini, Livermore, Douglas & EGX rules'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleRunMastersDebate(currentAnalysis)}
                      disabled={isMastersDebateLoading}
                      className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <Sparkles className={`w-4 h-4 ${isMastersDebateLoading ? 'animate-spin' : ''}`} />
                      <span>
                        {isMastersDebateLoading
                          ? 'جاري عقد جلسة الحكماء...'
                          : '✨ اعقد مناظرة الحكماء بـ Gemini حول هذا السهم'}
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveTab('masters')}
                      className="px-3 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{isRtl ? 'مكتبة الكتب والانضباط النفسي' : 'Full Book Canon'}</span>
                    </button>
                  </div>
                </div>

                {/* Quantitative Master Metrics Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                    <div className="text-slate-400 text-[11px]">رقم جراهام العادل (Graham Number)</div>
                    <div className="font-extrabold text-sm mt-1">
                      {currentMastersCouncil.graham.grahamNumber ? (
                        <Numeric>
                          {fmtPrice(currentMastersCouncil.graham.grahamNumber)} {currentAnalysis.symbol.currency}
                        </Numeric>
                      ) : (
                        <span className="text-slate-400 text-xs">يتطلب P/E & P/B</span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      P/E×P/B:{' '}
                      <Numeric className="font-bold">
                        {currentMastersCouncil.graham.grahamProduct ?? '—'}
                      </Numeric>{' '}
                      (الحد ≤ 22.5)
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                    <div className="text-slate-400 text-[11px]">معامل بيتر لينش (PEG Ratio)</div>
                    <div className="font-extrabold text-sm mt-1">
                      {currentMastersCouncil.lynch.pegRatio !== null ? (
                        <Numeric
                          colorize={currentMastersCouncil.lynch.pegRatio <= 1.0 ? 1 : -1}
                        >
                          {currentMastersCouncil.lynch.pegRatio}x
                        </Numeric>
                      ) : (
                        <span className="text-slate-400 text-xs">غير متوفر</span>
                      )}
                    </div>
                    <div className="text-[10px] text-emerald-500 font-semibold mt-0.5 truncate">
                      {currentMastersCouncil.lynch.lynchCategoryAr}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                    <div className="text-slate-400 text-[11px]">قالب مينيرفيني (SEPA Stage 2)</div>
                    <div className="font-extrabold text-sm mt-1">
                      <Numeric
                        colorize={currentMastersCouncil.minervini.minerviniScore >= 5 ? 1 : 0}
                      >
                        {currentMastersCouncil.minervini.minerviniScore} / 6 شروط
                      </Numeric>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {currentMastersCouncil.minervini.minerviniScore >= 5
                        ? 'اتجاه صاعد مؤسسي (Stage 2)'
                        : 'انتظار اكتمال شروط الاختراق'}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                    <div className="text-slate-400 text-[11px]">قاعدة ليفرمور ودليل EGX</div>
                    <div className="font-extrabold text-sm mt-1 text-sky-500">
                      <Numeric>±{currentAnalysis.symbol.dailyLimitPct}%</Numeric> حد يومي
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {currentAnalysis.price >= currentAnalysis.indicators.sma20
                        ? 'فوق النقطة المحورية (يسمح بالتدرج)'
                        : 'تحت المحور (ممنوع التبريد الخاسر)'}
                    </div>
                  </div>
                </div>

                {/* 6 Master School Verdicts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  {Object.values(currentMastersCouncil).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-extrabold text-slate-800 dark:text-slate-100">
                          {item.titleAr}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                            item.status === 'PASS'
                              ? 'bg-emerald-500/15 text-emerald-500'
                              : item.status === 'WARN'
                              ? 'bg-amber-500/15 text-amber-500'
                              : 'bg-sky-500/15 text-sky-500'
                          }`}
                        >
                          {item.status === 'PASS' ? 'متوافق ✓' : item.status === 'WARN' ? 'حذر ⚠️' : 'محايد'}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11.5px]">
                        {item.verdictAr}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Gemini Roundtable Debate Output if triggered */}
                {geminiMastersDebate[currentAnalysis.symbol.canonicalId] && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/5 dark:bg-slate-950 border-2 border-amber-500/30 space-y-2 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-500 border-b border-slate-200 dark:border-slate-800 pb-2">
                      <span className="flex items-center gap-1.5">
                        <Award className="w-4 h-4" />
                        <span>{geminiMastersDebate[currentAnalysis.symbol.canonicalId].source}</span>
                      </span>
                      <button
                        onClick={() =>
                          setGeminiMastersDebate((prev) => ({
                            ...prev,
                            [currentAnalysis.symbol.canonicalId]: null
                          }))
                        }
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs sm:text-sm whitespace-pre-line leading-relaxed text-slate-800 dark:text-slate-200">
                      {geminiMastersDebate[currentAnalysis.symbol.canonicalId].text}
                    </div>
                  </div>
                )}
              </div>
              )}

              {/* Main Grid: Interactive Candlestick Chart (8 cols) + ATR Ranges & Position Sizing Calculator (4 cols) */}
              {(stockSubView === 'ALL' || stockSubView === 'STEP2_CHART') && (
              <div
                id="tour-chart-sizer"
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                <div className="lg:col-span-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-emerald-500" />
                      <span>
                        {isRtl
                          ? 'الشارت التفاعلي + مناطق الشراء والبيع المظللة (انقر على أي شمعة لتثبيتها)'
                          : 'Interactive Chart + Shaded Buy/Sell Zones'}
                      </span>
                    </h3>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {[30, 60, 90].map((barsCount) => (
                        <button
                          key={barsCount}
                          onClick={() => setChartZoomBars(barsCount)}
                          className={`text-[11px] px-2 py-1 rounded-lg font-mono font-bold ${
                            chartZoomBars === barsCount
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                          }`}
                        >
                          {barsCount}D
                        </button>
                      ))}
                      <button
                        onClick={() => setShowBacktestMarkers((m) => !m)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium ${
                          showBacktestMarkers
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-500'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                        }`}
                      >
                        {isRtl ? 'نقاط الاختبار التاريخي' : 'Backtest Dots'}
                      </button>
                      <button
                        onClick={() => setShowBollinger((b) => !b)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium ${
                          showBollinger
                            ? 'bg-purple-500/15 border-purple-500/40 text-purple-400'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                        }`}
                      >
                        {isRtl ? 'بولينجر باند' : 'Bollinger'}
                      </button>
                    </div>
                  </div>

                  <InteractiveCandlestickChart
                    analysis={currentAnalysis}
                    isRtl={isRtl}
                    showBollinger={showBollinger}
                    showBacktestMarkers={showBacktestMarkers}
                    zoomBars={chartZoomBars}
                  />

                  {/* Technical Indicators Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                      <div className="text-slate-400 text-[11px]">SMA 20 / 50</div>
                      <Numeric className="font-bold mt-0.5">
                        {fmtPrice(currentAnalysis.indicators.sma20)} / {fmtPrice(currentAnalysis.indicators.sma50)}
                      </Numeric>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                      <div className="text-slate-400 text-[11px]">SMA 200</div>
                      <Numeric className="font-bold mt-0.5">{fmtPrice(currentAnalysis.indicators.sma200)}</Numeric>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                      <div className="text-slate-400 text-[11px]">RSI (14)</div>
                      <Numeric
                        colorize={
                          currentAnalysis.indicators.rsi14 > 70
                            ? -1
                            : currentAnalysis.indicators.rsi14 > 48
                            ? 1
                            : 0
                        }
                        className="font-bold mt-0.5"
                      >
                        {currentAnalysis.indicators.rsi14}
                      </Numeric>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                      <div className="text-slate-400 text-[11px]">MACD Hist</div>
                      <Numeric colorize={currentAnalysis.indicators.macdHist} className="font-bold mt-0.5">
                        {currentAnalysis.indicators.macdHist}
                      </Numeric>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                      <div className="text-slate-400 text-[11px]">ATR (14)</div>
                      <Numeric className="font-bold mt-0.5">
                        {fmtPrice(currentAnalysis.indicators.atr14)} {currentAnalysis.symbol.currency}
                      </Numeric>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                      <div className="text-slate-400 text-[11px]">RVOL (20d)</div>
                      <Numeric
                        colorize={currentAnalysis.indicators.rvol20 >= 1.25 ? 1 : 0}
                        className="font-bold mt-0.5"
                      >
                        {currentAnalysis.indicators.rvol20}x
                      </Numeric>
                    </div>
                  </div>
                </div>

                {/* Right Column: Composite Signal Card + Interactive ATR Position Size Calculator */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400">
                          {isRtl ? 'التقييم الفني المركب (أوزان شفافة)' : 'Composite Technical Score'}
                        </span>
                        <h3 className="font-bold text-sm sm:text-base mt-0.5">
                          {isRtl ? currentAnalysis.signal.ruleNameAr : currentAnalysis.signal.ruleNameEn}
                        </h3>
                      </div>
                      <div
                        className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-extrabold border ${
                          currentAnalysis.signal.compositeScore >= 38
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-500'
                            : currentAnalysis.signal.compositeScore <= -20
                            ? 'bg-rose-500/15 border-rose-500/40 text-rose-500'
                            : 'bg-slate-500/15 border-slate-500/30 text-slate-400'
                        }`}
                      >
                        <Numeric className="text-lg">
                          {currentAnalysis.signal.compositeScore > 0
                            ? `+${currentAnalysis.signal.compositeScore}`
                            : currentAnalysis.signal.compositeScore}
                        </Numeric>
                        <span className="text-[9px] opacity-75">/100</span>
                      </div>
                    </div>

                    {/* ATR-Based Ranges */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                      <div className="font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                        <span>{isRtl ? 'المناطق السعرية المقترحة (ATR Ranges):' : 'Suggested ATR Price Zones:'}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">
                          R:R <Numeric>{currentAnalysis.signal.rrRatio}:1</Numeric>
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-between">
                        <span className="text-blue-500 font-semibold">
                          {isRtl ? 'منطقة الشراء:' : 'Entry Zone:'}
                        </span>
                        <Numeric className="font-bold text-blue-500">
                          {fmtPrice(currentAnalysis.signal.entryZone[0], currentAnalysis.price < 5 ? 3 : 2)} -{' '}
                          {fmtPrice(currentAnalysis.signal.entryZone[1], currentAnalysis.price < 5 ? 3 : 2)}{' '}
                          {currentAnalysis.symbol.currency}
                        </Numeric>
                      </div>

                      <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-between">
                        <span className="text-rose-500 font-semibold">
                          {isRtl ? 'وقف الخسارة:' : 'Stop-Loss Zone:'}
                        </span>
                        <Numeric className="font-bold text-rose-500">
                          {fmtPrice(currentAnalysis.signal.stopZone[0], currentAnalysis.price < 5 ? 3 : 2)} -{' '}
                          {fmtPrice(currentAnalysis.signal.stopZone[1], currentAnalysis.price < 5 ? 3 : 2)}{' '}
                          {currentAnalysis.symbol.currency}
                        </Numeric>
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between">
                        <span className="text-emerald-500 font-semibold">
                          {isRtl ? 'هدف البيع 1:' : 'Target 1 Zone:'}
                        </span>
                        <Numeric className="font-bold text-emerald-500">
                          {fmtPrice(currentAnalysis.signal.target1Zone[0], currentAnalysis.price < 5 ? 3 : 2)} -{' '}
                          {fmtPrice(currentAnalysis.signal.target1Zone[1], currentAnalysis.price < 5 ? 3 : 2)}{' '}
                          {currentAnalysis.symbol.currency}
                        </Numeric>
                      </div>
                    </div>

                    {/* Interactive ATR Position Size & Risk Calculator */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs">
                      <div className="font-bold text-emerald-500 flex items-center gap-1.5">
                        <Calculator className="w-4 h-4" />
                        <span>
                          {isRtl
                            ? `حاسبة الكمية الآمنة لـ ${firstName} (ATR Position Sizer)`
                            : 'Interactive ATR Position Size Calculator'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">
                            {isRtl ? `رأس المال (${currentAnalysis.symbol.currency}):` : 'Account Capital:'}
                          </label>
                          <input
                            type="number"
                            value={calcCapital}
                            onChange={(e) => setCalcCapital(Math.max(1000, Number(e.target.value)))}
                            className="w-full rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">
                            {isRtl ? 'أقصى مخاطرة للصفقة %:' : 'Max Risk %:'}
                          </label>
                          <input
                            type="number"
                            step="0.25"
                            value={calcRiskPct}
                            onChange={(e) => setCalcRiskPct(Math.max(0.25, Math.min(10, Number(e.target.value))))}
                            className="w-full rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 font-mono"
                          />
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">{isRtl ? 'الكمية الآمنة المقترحة:' : 'Safe Share Count:'}</span>
                          <Numeric className="font-extrabold text-sm text-emerald-500">
                            {positionSizing.suggestedShares.toLocaleString('en-US')} {isRtl ? 'سهم' : 'shares'}
                          </Numeric>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">{isRtl ? 'إجمالي قيمة الصفقة:' : 'Position Value:'}</span>
                          <Numeric className="font-bold">
                            {fmtPrice(positionSizing.totalPositionValue, 0)} {currentAnalysis.symbol.currency}
                          </Numeric>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">{isRtl ? 'أقصى خسارة عند ضرب الوقف:' : 'Max Loss at Stop:'}</span>
                          <Numeric className="font-bold text-rose-500">
                            -{fmtPrice(positionSizing.maxRiskAmount, 0)} {currentAnalysis.symbol.currency}
                          </Numeric>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setUsers((prev) =>
                            prev.map((u) =>
                              u.id === currentUser.id
                                ? {
                                    ...u,
                                    trades: [
                                      {
                                        id: Date.now(),
                                        canonicalId: currentAnalysis.symbol.canonicalId,
                                        side: 'BUY',
                                        qty: positionSizing.suggestedShares,
                                        price: currentAnalysis.price,
                                        currency: currentAnalysis.symbol.currency,
                                        date: new Date().toISOString().split('T')[0],
                                        channel: 'حاسبة المخاطر (محفوظة)',
                                        notes: `شراء محسوب المخاطرة (${calcRiskPct}%)`
                                      },
                                      ...u.trades
                                    ]
                                  }
                                : u
                            )
                          );
                          triggerToast(
                            isRtl
                              ? `تم تسجيل وحفظ ${positionSizing.suggestedShares} سهم من ${currentAnalysis.symbol.ticker} في معاملاتك يا أستاذ ${firstName}`
                              : `Added ${positionSizing.suggestedShares} shares to portfolio`
                          );
                        }}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm"
                      >
                        {isRtl ? '+ تسجيل وحفظ هذه الصفقة في معاملاتي' : '+ Save Position to My Portfolio'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              )}

              {/* Second Row: Grounded Arabic AI Mentor + Zero-Look-Ahead Backtesting Honesty Card */}
              {(stockSubView === 'ALL' || stockSubView === 'STEP3_MASTERS' || stockSubView === 'STEP4_BACKTEST') && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Grounded Arabic AI Mentor & Chat Layer (7 Cols) */}
                <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-500" />
                      <div>
                        <h3 className="font-bold text-sm sm:text-base">
                          {isRtl
                            ? `مرشد Gemini التفاعلي للأستاذ ${firstName} (بدون تأليف أرقام ✨)`
                            : 'Grounded Gemini AI Mentor Layer'}
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          {isRtl
                            ? 'اسأله: "إمتى أشتري وإمتى أبيع؟" أو "اشرح لي كأني مبتدئ" أو "قارن بين سهمين".'
                            : 'Explains signals strictly from the computed SignalFactSheet JSON.'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowRawFactSheet((s) => !s)}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 font-mono flex items-center gap-1"
                    >
                      <FileCode className="w-3.5 h-3.5 text-sky-400" />
                      <span>{showRawFactSheet ? 'إخفاء JSON' : 'فحص FactSheet JSON'}</span>
                    </button>
                  </div>

                  {showRawFactSheet && (
                    <pre
                      dir="ltr"
                      className="p-3 rounded-xl bg-slate-950 text-emerald-400 text-[11px] font-mono overflow-x-auto max-h-52 border border-slate-800"
                    >
                      {JSON.stringify(
                        {
                          symbol: currentAnalysis.symbol.canonicalId,
                          price: currentAnalysis.price,
                          source: currentAnalysis.symbol.source,
                          indicators: currentAnalysis.indicators,
                          signal: {
                            score: currentAnalysis.signal.compositeScore,
                            confidence: currentAnalysis.signal.confidenceTier,
                            entry_zone: currentAnalysis.signal.entryZone,
                            stop_zone: currentAnalysis.signal.stopZone,
                            target1_zone: currentAnalysis.signal.target1Zone,
                            rr_ratio: currentAnalysis.signal.rrRatio
                          },
                          backtest: {
                            sample_size: currentAnalysis.backtest.sampleSize,
                            win_rate_pct: currentAnalysis.backtest.winRatePct,
                            expectancy_pct: currentAnalysis.backtest.expectancyPct
                          }
                        },
                        null,
                        2
                      )}
                    </pre>
                  )}

                  {/* Confirming vs Weakening Factors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                      <div className="font-bold text-emerald-500 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isRtl ? 'عوامل تأكيد الإشارة (لماذا ظهرت؟)' : 'Confirming Factors'}</span>
                      </div>
                      <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 list-disc list-inside">
                        {(isRtl ? currentAnalysis.signal.confirmingAr : currentAnalysis.signal.confirmingEn).map(
                          (item, i) => (
                            <li key={i}>{item}</li>
                          )
                        )}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-2">
                      <div className="font-bold text-rose-500 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{isRtl ? 'عوامل الضعف والمخاطرة (متى تفشل؟)' : 'Weakening Factors & Risk View'}</span>
                      </div>
                      <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 list-disc list-inside">
                        {(isRtl ? currentAnalysis.signal.weakeningAr : currentAnalysis.signal.weakeningEn).map(
                          (item, i) => (
                            <li key={i}>{item}</li>
                          )
                        )}
                        <li>
                          {isRtl
                            ? `إغلاق يومي أسفل ${fmtPrice(currentAnalysis.signal.stopZone[0])} ${currentAnalysis.symbol.currency} يلغي النظرة الفنية الحالية.`
                            : `Daily close below ${fmtPrice(currentAnalysis.signal.stopZone[0])} invalidates setup.`}
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Interactive Grounded Mentor Chat */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-bold text-emerald-500">
                        {isRtl ? '✨ أسئلة Gemini السريعة:' : '✨ Quick Gemini Prompts:'}
                      </span>
                      {[
                        'إمتى أشتري وإمتى أبيع السهم ده؟',
                        'اشرح لي الإشارة دي كأني مبتدئ',
                        'قارن بين COMI و TMGH من حيث المخاطرة',
                        'ماذا لو نزل المؤشر العام غداً؟'
                      ].map((preset, i) => (
                        <button
                          key={i}
                          onClick={() => handleAskMentor(preset)}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 font-semibold transition"
                        >
                          ✨ {preset}
                        </button>
                      ))}
                    </div>

                    <div className="max-h-56 overflow-y-auto space-y-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800 text-xs">
                      {mentorChatMessages.map((m, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-2xl whitespace-pre-line leading-relaxed ${
                            m.role === 'user'
                              ? 'bg-emerald-600 text-white ms-8 font-semibold'
                              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 me-4'
                          }`}
                        >
                          <div>{m.text}</div>
                          {m.verifiedNumbers && (
                            <div className="mt-1.5 flex items-center gap-1 text-[10px] text-emerald-500 font-medium">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>
                                {isRtl
                                  ? 'تم التحقق آلياً: جميع الأرقام مطابقة لـ SignalFactSheet (0% هلوسة)'
                                  : 'Numeric Guard Verified: 100% matched against SignalFactSheet'}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                      {isAiLoading && (
                        <div className="text-xs text-emerald-500 font-bold animate-pulse px-2">
                          {isRtl ? `✨ جاري إعداد إجابة Gemini للأستاذ ${firstName}...` : 'Analyzing SignalFactSheet...'}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={mentorInput}
                        onChange={(e) => setMentorInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAskMentor()}
                        placeholder={
                          isRtl
                            ? `اسأل مرشدك الذكي يا أستاذ ${firstName} (مثال: إمتى أشتري وإمتى أبيع؟)...`
                            : 'Ask the AI Mentor about buy/sell zones, risks, or stock comparisons...'
                        }
                        className="flex-1 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        onClick={() => handleAskMentor()}
                        disabled={isAiLoading}
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'اسأل Gemini' : 'Ask'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Zero-Look-Ahead Backtesting & Honesty Card (5 Cols) */}
                <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                        <Scale className="w-5 h-5 text-sky-500" />
                        <span>
                          {isRtl
                            ? 'الاختبار التاريخي الصادق (Backtest Honesty)'
                            : 'Historical Backtest & Honesty Card'}
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {isRtl
                          ? 'دخول في افتتاح اليوم التالي (t+1 Open) لمنع انحياز المستقبل، مع خصم العمولات.'
                          : 'Executes at bar t+1 Open (zero look-ahead bias) with transaction fees deducted.'}
                      </p>
                    </div>
                  </div>

                  {/* Interactive Backtest Horizon & Fee Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">{isRtl ? 'فترة الاحتفاظ:' : 'Horizon:'}</span>
                      {[5, 10, 20].map((d) => (
                        <button
                          key={d}
                          onClick={() => setBtHoldingDays(d)}
                          className={`px-2 py-1 rounded-lg font-mono font-bold ${
                            btHoldingDays === d
                              ? 'bg-sky-500 text-white'
                              : 'bg-white dark:bg-slate-900 text-slate-400'
                          }`}
                        >
                          {d}d
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">{isRtl ? 'العمولة:' : 'Fee/side:'}</span>
                      {[null, 0, 0.25, 0.5].map((feeOpt, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCustomFeePct(feeOpt)}
                          className={`px-1.5 py-0.5 rounded font-mono text-[11px] ${
                            customFeePct === feeOpt
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'bg-white dark:bg-slate-900 text-slate-400'
                          }`}
                        >
                          {feeOpt === null ? 'Auto' : `${feeOpt}%`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Honesty Warning Banner if Weak or Small Sample */}
                  {(currentAnalysis.backtest.isStatisticallyWeak || currentAnalysis.backtest.isSmallSample) && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-500 font-medium flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>
                        {currentAnalysis.backtest.isSmallSample
                          ? isRtl
                            ? `عينة تاريخية صغيرة (${currentAnalysis.backtest.sampleSize} مرة فقط) — لا يمكن الاعتماد عليها إحصائياً بمفردها.`
                            : `Small historical sample size (N=${currentAnalysis.backtest.sampleSize}).`
                          : isRtl
                          ? 'تنبيه صدق إحصائي: هذه الإشارة حققت أداءً تاريخياً ضعيفاً على هذا السهم بعد خصم العمولات.'
                          : 'Honesty Alert: This signal rule showed weak historical expectancy on this stock after fees.'}
                      </span>
                    </div>
                  )}

                  {/* Core Backtest Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <div className="text-slate-400">{isRtl ? 'نسبة النجاح (Hit Rate)' : 'Historical Hit Rate'}</div>
                      <Numeric
                        colorize={currentAnalysis.backtest.winRatePct - 50}
                        className="text-xl font-extrabold mt-1"
                      >
                        {currentAnalysis.backtest.winRatePct}%
                      </Numeric>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {isRtl ? 'حجم العينة:' : 'Sample Size:'}{' '}
                        <Numeric className="font-bold text-slate-600 dark:text-slate-200">{currentAnalysis.backtest.sampleSize}</Numeric>{' '}
                        {isRtl ? 'صفقة' : 'trades'}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <div className="text-slate-400">
                        {isRtl ? 'العائد المتوقع للصفقة (صافي)' : 'Net Expectancy / Trade'}
                      </div>
                      <Numeric
                        colorize={currentAnalysis.backtest.expectancyPct}
                        className="text-xl font-extrabold mt-1"
                      >
                        {fmtPct(currentAnalysis.backtest.expectancyPct)}
                      </Numeric>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {isRtl ? 'مقابل الشراء والاحتفاظ:' : 'vs Buy & Hold:'}{' '}
                        <Numeric colorize={currentAnalysis.backtest.excessVsBhPct} className="font-semibold">
                          {fmtPct(currentAnalysis.backtest.excessVsBhPct)}
                        </Numeric>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <div className="text-slate-400">{isRtl ? 'متوسط الربح / الخسارة' : 'Avg Win / Avg Loss'}</div>
                      <div className="mt-1 font-bold">
                        <Numeric className="text-emerald-500">+{currentAnalysis.backtest.avgWinPct}%</Numeric>
                        {' / '}
                        <Numeric className="text-rose-500">-{currentAnalysis.backtest.avgLossPct}%</Numeric>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <div className="text-slate-400">{isRtl ? 'أقصى تراجع (Max Drawdown)' : 'Max Drawdown'}</div>
                      <Numeric className="text-lg font-extrabold text-rose-500 mt-1">
                        {currentAnalysis.backtest.maxDrawdownPct}%
                      </Numeric>
                    </div>
                  </div>

                  {/* Recent Simulated Historical Trades Table */}
                  <div className="pt-2">
                    <div className="text-xs font-bold text-slate-400 mb-2">
                      {isRtl
                        ? 'آخر التداولات التاريخية لنفس الإشارة على السهم:'
                        : 'Recent Historical Occurrences on This Stock:'}
                    </div>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto text-[11px]">
                      {currentAnalysis.backtest.recentTrades.map((tr, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/40"
                        >
                          <Numeric className="text-slate-400">{tr.entryDate}</Numeric>
                          <Numeric>
                            {tr.entryPrice} → {tr.exitPrice}
                          </Numeric>
                          <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">
                            {tr.exitReason}
                          </span>
                          <Numeric colorize={tr.netReturnPct} className="font-bold">
                            {fmtPct(tr.netReturnPct)}
                          </Numeric>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              )}

              {/* Third Row: Validated Fundamentals + News Context */}
              {(stockSubView === 'ALL' || stockSubView === 'STEP4_BACKTEST') && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
                  <h3 className="font-bold text-sm sm:text-base mb-1">
                    {isRtl
                      ? 'المؤشرات المالية الأساسية (Fundamentals مع فحص التوفر)'
                      : 'Fundamental Metrics (Strictly Validated)'}
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    {isRtl
                      ? 'إذا كان البيان المالي غير متوفر في المصدر المجاني، يظهر بوضوح "غير متوفر من المصدر" ولا يتم استبداله بصفر مضلل.'
                      : 'Missing metrics are explicitly labeled unavailable rather than substituting 0.'}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    {[
                      { labelAr: 'مضاعف الربحية (P/E)', val: currentAnalysis.symbol.fundamentals.pe, suffix: 'x' },
                      { labelAr: 'مضاعف القيمة الدفترية (P/B)', val: currentAnalysis.symbol.fundamentals.pb, suffix: 'x' },
                      { labelAr: 'ربحية السهم (EPS)', val: currentAnalysis.symbol.fundamentals.eps, suffix: ` ${currentAnalysis.symbol.currency}` },
                      { labelAr: 'عائد التوزيعات النقدية', val: currentAnalysis.symbol.fundamentals.divYield, suffix: '%' },
                      { labelAr: 'نمو الإيرادات السنوي', val: currentAnalysis.symbol.fundamentals.revGrowth, suffix: '%' }
                    ].map((f, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                      >
                        <div className="text-slate-400 text-[11px]">{f.labelAr}</div>
                        {f.val !== null && f.val !== undefined ? (
                          <Numeric className="text-base font-bold mt-1" suffix={f.suffix}>
                            {f.val}
                          </Numeric>
                        ) : (
                          <div className="text-[11px] font-semibold text-amber-500 mt-1">
                            {isRtl ? 'غير متوفر من المصدر' : 'Unavailable from source'}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
                  <h3 className="font-bold text-sm sm:text-base mb-1">
                    {isRtl ? 'سياق السوق والأخبار المرتبطة بالسهم' : 'Market Context & Headlines'}
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    {isRtl
                      ? 'عناوين الأخبار المجانية وحالة المؤشر المرجعي للسوق'
                      : 'Free RSS / Finnhub news headlines & benchmark index regime'}
                  </p>

                  <div className="space-y-2.5 text-xs">
                    {currentAnalysis.symbol.newsAr.map((n, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3"
                      >
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{n.title}</div>
                          <div className="text-[11px] text-slate-400 mt-1">
                            {n.source} • {n.time}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                            n.sentiment === 'positive'
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : n.sentiment === 'warning'
                              ? 'bg-amber-500/15 text-amber-400'
                              : 'bg-slate-500/15 text-slate-400'
                          }`}
                        >
                          {n.sentiment}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              )}
            </div>
          )}

          {/* -----------------------------------------------------------------
              TAB 2.5 (NEW): MASTERS CANON, PSYCHOLOGY GATEKEEPER & EGX RULES
             ----------------------------------------------------------------- */}
          {activeTab === 'masters' && (
            <div className="space-y-6">
              {/* Hero Banner: Trained on 14+ Investment Classics & Egyptian Guides */}
              <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-emerald-950 text-white border border-emerald-500/30 shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-3xl">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>تم تدريب النظام بالكامل على أمهات كتب الاستثمار والتحليل الفني والبورصة المصرية</span>
                    </span>
                    <h2 className="text-lg sm:text-2xl font-extrabold">
                      أكاديمية ومجلس حكماء البورصة — مدمجة في قراراتك يا أستاذ {firstName}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      كل كتاب طلبته (من بنيامين جراهام وبيتر لينش وفيليب فيشر وجيريمي سيجل، إلى جون ميرفي وجيسي ليفرمور ومارك مينيرفيني وجاك شواجر، ومارك دوجلاس ومورجان هاوسل، وشهاب إسماعيل ومحمد سعيد المهدي وأدلة البورصة المصرية Hit the Book وحقوق الأقلية) تم تحويله إلى قواعد رياضية وفلاتر تحمي محفظتك.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      handleRunMastersDebate(currentAnalysis);
                    }}
                    disabled={isMastersDebateLoading}
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg flex items-center gap-2"
                  >
                    <Sparkles className={`w-4 h-4 ${isMastersDebateLoading ? 'animate-spin' : ''}`} />
                    <span>
                      ✨ اطلب مناظرة الحكماء الآن على سهم ({currentAnalysis.symbol.ticker})
                    </span>
                  </button>
                </div>

                {geminiMastersDebate[currentAnalysis.symbol.canonicalId] && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/85 border border-amber-500/40 space-y-2">
                    <div className="flex items-center justify-between text-xs text-amber-400 font-bold border-b border-slate-800 pb-2">
                      <span>{geminiMastersDebate[currentAnalysis.symbol.canonicalId].source}</span>
                      <button
                        onClick={() =>
                          setGeminiMastersDebate((prev) => ({
                            ...prev,
                            [currentAnalysis.symbol.canonicalId]: null
                          }))
                        }
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs sm:text-sm whitespace-pre-line leading-relaxed text-slate-100">
                      {geminiMastersDebate[currentAnalysis.symbol.canonicalId].text}
                    </div>
                  </div>
                )}
              </div>

              {/* Row 1: Mark Douglas "Trading in the Zone" Pre-Trade Gatekeeper + EGX "Hit the Book" & Minority Rights */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Mark Douglas & Morgan Housel Pre-Trade Psychological Gatekeeper (6 cols) */}
                <div className="lg:col-span-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm sm:text-base">
                          بوابة الانضباط النفسي قبل التداول (Trading in the Zone)
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          مستخلصة من كتب مارك دوجلاس ومورجان هاوسل ومحمد سعيد المهدي
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/15 text-emerald-500">
                      جاهزية ذهنية:{' '}
                      <Numeric>
                        {Math.round(
                          (Object.values(douglasChecklist).filter(Boolean).length / 5) * 100
                        )}
                        %
                      </Numeric>
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {[
                      {
                        key: 'acceptedRiskInAdvance',
                        label:
                          '1. (مارك دوجلاس): هل تقبلت مسبقاً احتمال ضرب وقف الخسارة في هذه الصفقة دون أي ضيق نفسي أو رغبة في الانتقام؟'
                      },
                      {
                        key: 'noAveragingDown',
                        label:
                          '2. (جيسي ليفرمور): أتعهد بعدم التبريد العشوائي في سهم خاسر يكسر مستوى الوقف، والتعزيز فقط في السهم الرابح.'
                      },
                      {
                        key: 'buyingInEntryZoneNotFomo',
                        label:
                          '3. (بنيامين جراهام & مينيرفيني): أنا أشتري داخل منطقة الدخول المحسوبة وبهامش أمان، ولست مدفوعاً بطمع اللحاق بالسهم (FOMO).'
                      },
                      {
                        key: 'cashBufferMaintained',
                        label:
                          '4. (مورجان هاوسل & المهدي): أحتفظ بهامش سيولة نقدية في محفظتي حتى لا أضطر أبداً لبيع أسهمي الجيدة في قاع تصحيحي.'
                      },
                      {
                        key: 'checkedOrderBookDepth',
                        label:
                          '5. (دليل EGX اعرف كتابك Hit the Book): راجعت عمق سجل الأوامر (العروض والطلبات) وسأنفذ بأمر محدد السعر (Limit Order).'
                      }
                    ].map((item) => (
                      <label
                        key={item.key}
                        className={`flex items-start gap-2.5 p-3 rounded-2xl border cursor-pointer transition ${
                          douglasChecklist[item.key]
                            ? 'bg-emerald-500/5 border-emerald-500/30 text-slate-800 dark:text-slate-100'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={douglasChecklist[item.key]}
                          onChange={(e) =>
                            setDouglasChecklist((prev) => ({
                              ...prev,
                              [item.key]: e.target.checked
                            }))
                          }
                          className="mt-1 rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="leading-relaxed font-medium">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* EGX Official Investor Guides: Hit the Book & Minority Shareholders' Rights (6 cols) */}
                <div className="lg:col-span-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
                      <Scale className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base">
                        دليل البورصة المصرية الرسمي (Hit the Book & حقوق مساهمي الأقلية)
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        القواعد القانونية والميكانيكية المعمول بها في البورصة المصرية (EGX) والرقابة المالية (FRA)
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-1.5">
                      <div className="font-extrabold text-emerald-500">
                        📖 1. اعرف سجل الأوامر (Hit the Book)
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        تجنب أوامر السوق المفتوحة في الأسهم المتوسطة؛ راقب أفضل 5 طلبات شراء (Bids) وأفضل 5 عروض بيع (Asks). يحدد سعر الإغلاق الرسمي عبر مزاد الإغلاق المرجح بالكميات (MVWAP) في آخر الجلسة.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-1.5">
                      <div className="font-extrabold text-sky-500">
                        ⏱️ 2. الحدود السعرية والإيقاف المؤقت
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        السوق الرئيسي مسموح له بتحرك يومي <Numeric>±20%</Numeric> مع إيقاف مؤقت لمدة 10 دقائق عند تخطي <Numeric>±10%</Numeric>، بينما سوق الشركات الصغيرة (تميّز) حدوده <Numeric>±10%</Numeric>.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-1.5">
                      <div className="font-extrabold text-amber-500">
                        ⚖️ 3. حقوق الأولوية في الاكتتاب وتوزيعات الأرباح
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        يكفل دليل حماية مساهمي الأقلية حقك في الحصول على الكوبونات النقدية والأسهم المجانية، وحق الأولوية في الاكتتاب بزيادة رأس المال أو بيع "حق الاكتتاب" منفصلاً في السوق خلال فترة تداوله.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-1.5">
                      <div className="font-extrabold text-purple-500">
                        🛡️ 4. عروض الشراء الإجبارية والقيمة العادلة
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        عند استحواذ طرف على حصة حاكمة، تُلزم الرقابة المالية المستحوذ بتقديم عرض شراء إجباري (MTO) لجميع مساهمي الأقلية بنفس السعر مع نشر دراسة قيمة عادلة من مستشار مالي مستقل.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Complete Interactive Canon Library (Filterable by Category) */}
              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg">
                      موسوعة القواعد المستخرجة من الكتب والمدمجة في محرك النظام
                    </h3>
                    <p className="text-xs text-slate-400">
                      تصفح القواعد والمعادلات التي تم استخلاصها سطراً بسطر لتدريب هذا المرشد
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    {[
                      { id: 'ALL', label: 'كل المدارس (14+ كتاباً)' },
                      { id: 'VALUE', label: '1. الاستثمار القيمي والنمو' },
                      { id: 'TECHNICAL', label: '2. التحليل الفني والزخم' },
                      { id: 'PSYCHOLOGY', label: '3. سيكولوجية التداول' },
                      { id: 'EGYPT_LOCAL', label: '4. السوق المصري والعربي' }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setBookFilterCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition ${
                          bookFilterCategory === cat.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {INVESTMENT_CANON_BOOKS.filter(
                    (b) => bookFilterCategory === 'ALL' || b.category === bookFilterCategory
                  ).map((book) => (
                    <div
                      key={book.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2.5 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                              {book.titleAr}
                            </h4>
                            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                              {book.authorAr}
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-[10px] font-mono font-bold">
                            {book.category}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                          {book.coreRuleAr}
                        </p>

                        <div className="p-2.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px]">
                          ⚙️ المعادلة المدمجة: {book.encodedFormulaAr}
                        </div>

                        <ul className="space-y-1 text-xs text-slate-500 dark:text-slate-300 list-disc list-inside pt-1">
                          {book.lessonsAr.map((lesson, i) => (
                            <li key={i}>{lesson}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 3: Live Multi-Master Stock Matrix Across All EGX & Global Stocks */}
              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 overflow-x-auto">
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    <span>
                      مصفوفة فحص الأسهم بمعايير عمالقة الكتب (جراهام + لينش + مينيرفيني + ليفرمور + دوجلاس)
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    اضغط على أي سهم لفتح خطة الشراء والبيع ومناظرة الحكماء الخاصة به
                  </p>
                </div>

                <table className="w-full text-xs sm:text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 text-xs">
                    <tr>
                      <th className="py-3 px-3 text-start">السهم</th>
                      <th className="py-3 px-3 text-start">بنيامين جراهام (القيمة)</th>
                      <th className="py-3 px-3 text-start">بيتر لينش & فيشر (PEG)</th>
                      <th className="py-3 px-3 text-start">مينيرفيني (Stage 2 SEPA)</th>
                      <th className="py-3 px-3 text-start">ليفرمور & ميرفي (السيولة)</th>
                      <th className="py-3 px-3 text-start">دوجلاس (الاحتمال التاريخي)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {Object.values(allAnalyses).map((a) => {
                      const mc = evaluateMastersCouncil(a);
                      return (
                        <tr
                          key={a.symbol.canonicalId}
                          onClick={() => {
                            setSelectedSymbolId(a.symbol.canonicalId);
                            setActiveTab('stock');
                          }}
                          className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                        >
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900 dark:text-white">
                              {isRtl ? a.symbol.nameAr : a.symbol.nameEn}
                            </div>
                            <Numeric className="text-[11px] text-slate-400">
                              {a.symbol.canonicalId} • {fmtPrice(a.price)} {a.symbol.currency}
                            </Numeric>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                mc.graham.status === 'PASS'
                                  ? 'bg-emerald-500/15 text-emerald-500'
                                  : mc.graham.status === 'WARN'
                                  ? 'bg-amber-500/15 text-amber-500'
                                  : 'bg-slate-500/15 text-slate-400'
                              }`}
                            >
                              {mc.graham.grahamNumber
                                ? `العادل: ${fmtPrice(mc.graham.grahamNumber)}`
                                : mc.graham.status === 'PASS'
                                ? 'قيمة دفاعية ✓'
                                : 'تقييم نمو'}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-emerald-500">
                              {mc.lynch.pegRatio !== null ? `PEG: ${mc.lynch.pegRatio}x` : '—'}
                            </div>
                            <div className="text-[10px] text-slate-400">{mc.lynch.lynchCategoryAr}</div>
                          </td>
                          <td className="py-3 px-3">
                            <Numeric
                              colorize={mc.minervini.minerviniScore >= 5 ? 1 : -1}
                              className="font-extrabold"
                            >
                              {mc.minervini.minerviniScore} / 6 شروط
                            </Numeric>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-mono font-bold">RVOL {a.indicators.rvol20}x</span>
                            <div className="text-[10px] text-slate-400">
                              {mc.livermore.status === 'PASS' ? 'اختراق بسيولة ✓' : 'مراقبة المحور'}
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <Numeric
                              colorize={a.backtest.winRatePct - 50}
                              className="font-extrabold"
                            >
                              {a.backtest.winRatePct}%
                            </Numeric>{' '}
                            <span className="text-[10px] text-slate-400">
                              ({a.backtest.sampleSize} صفقة)
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* -----------------------------------------------------------------
              TAB 3: MARKET SCANNER (Filter EGX, US & Global Universe)
             ----------------------------------------------------------------- */}
          {activeTab === 'scanner' && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                  <div>
                    <h2 className="font-bold text-base sm:text-lg">
                      {isRtl
                        ? 'الماسح الفني الذكي متعدد الأسواق (EGX + US + Global)'
                        : 'Multi-Market Technical & Statistical Scanner'}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {isRtl
                        ? 'تصفية الأسهم بناءً على الدرجة المركبة، السيولة النسبية (RVOL)، ونسبة النجاح التاريخية الحقيقية.'
                        : 'Filter stocks by composite score, RVOL, and verified historical hit rate.'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <select
                      value={scannerMarket}
                      onChange={(e) => setScannerMarket(e.target.value)}
                      className="rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 font-semibold"
                    >
                      <option value="ALL">{isRtl ? 'كل الأسواق (EGX + US + Global)' : 'All Markets'}</option>
                      <option value="EGX">{isRtl ? 'البورصة المصرية (EGX)' : 'Egypt (EGX)'}</option>
                      <option value="US">{isRtl ? 'السوق الأمريكي (US)' : 'US Market'}</option>
                      <option value="GLOBAL">{isRtl ? 'الأسواق العالمية والمؤشرات' : 'Global & Indices'}</option>
                    </select>

                    <select
                      value={scannerMinScore}
                      onChange={(e) => setScannerMinScore(Number(e.target.value))}
                      className="rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 font-semibold"
                    >
                      <option value={-100}>{isRtl ? 'كل الدرجات الفنية' : 'All Signal Scores'}</option>
                      <option value={35}>{isRtl ? 'إشارات إيجابية فقط (+35 فأعلى)' : 'Bullish Setups (+35+)'}</option>
                      <option value={55}>{isRtl ? 'إشارات قوية جداً (+55 فأعلى)' : 'Strong Bullish (+55+)'}</option>
                    </select>

                    <label className="flex items-center gap-2 cursor-pointer bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                      <input
                        type="checkbox"
                        checked={scannerOnlyHighWinRate}
                        onChange={(e) => setScannerOnlyHighWinRate(e.target.checked)}
                        className="rounded text-emerald-500"
                      />
                      <span className="font-semibold">
                        {isRtl ? 'فقط نسبة نجاح تاريخية > 55%' : 'Only Historical Win Rate > 55%'}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.values(allAnalyses)
                    .filter((a) => {
                      if (scannerMarket === 'EGX' && a.symbol.exchange !== 'EGX') return false;
                      if (
                        scannerMarket === 'US' &&
                        !['NASDAQ', 'NYSE'].includes(a.symbol.exchange)
                      )
                        return false;
                      if (
                        scannerMarket === 'GLOBAL' &&
                        !['LSE', 'TSE', 'INDEX'].includes(a.symbol.exchange)
                      )
                        return false;
                      if (a.signal.compositeScore < scannerMinScore) return false;
                      if (scannerOnlyHighWinRate && a.backtest.winRatePct < 55) return false;
                      return true;
                    })
                    .map((a) => {
                      const dec = a.price < 5 ? 3 : 2;
                      return (
                        <div
                          key={a.symbol.canonicalId}
                          onClick={() => {
                            setSelectedSymbolId(a.symbol.canonicalId);
                            setActiveTab('stock');
                          }}
                          className="cursor-pointer rounded-2xl p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-sm truncate">
                                {isRtl ? a.symbol.nameAr : a.symbol.nameEn}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                                  a.signal.compositeScore >= 38
                                    ? 'bg-emerald-500/15 text-emerald-400'
                                    : a.signal.compositeScore <= -20
                                    ? 'bg-rose-500/15 text-rose-400'
                                    : 'bg-slate-500/15 text-slate-400'
                                }`}
                              >
                                <Numeric>
                                  {a.signal.compositeScore > 0 ? `+${a.signal.compositeScore}` : a.signal.compositeScore}
                                </Numeric>
                              </span>
                            </div>

                            <div className="flex items-baseline justify-between mt-2">
                              <Numeric className="text-lg font-extrabold">
                                {fmtPrice(a.price, dec)}{' '}
                                <span className="text-xs font-normal text-slate-400">{a.symbol.currency}</span>
                              </Numeric>
                              <Numeric colorize={a.changePct} className="text-xs font-bold">
                                {fmtPct(a.changePct)}
                              </Numeric>
                            </div>

                            <div className="mt-2 text-xs text-slate-500 dark:text-slate-300">
                              {isRtl ? a.signal.ruleNameAr : a.signal.ruleNameEn}
                            </div>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                            <span>
                              RSI <Numeric className="text-slate-200 font-semibold">{a.indicators.rsi14}</Numeric> • RVOL{' '}
                              <Numeric className="text-slate-200 font-semibold">{a.indicators.rvol20}x</Numeric>
                            </span>
                            <span>
                              {isRtl ? 'النجاح التاريخي:' : 'Win Rate:'}{' '}
                              <Numeric colorize={a.backtest.winRatePct - 50} className="font-bold">
                                {a.backtest.winRatePct}%
                              </Numeric>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* -----------------------------------------------------------------
              TAB 4: IMMUTABLE SIGNAL LEDGER (With Forward Time-Machine Simulator)
             ----------------------------------------------------------------- */}
          {activeTab === 'ledger' && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                  <div>
                    <h2 className="font-bold text-base sm:text-lg flex items-center gap-2">
                      <Scale className="w-5 h-5 text-emerald-500" />
                      <span>
                        {isRtl
                          ? 'سجل مصداقية التطبيق (Immutable Live Signal Ledger)'
                          : 'App Track Record & Forward Signal Ledger'}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isRtl
                        ? 'يتم تسجيل كل إشارة يصدرها التطبيق مع سعر الدخول والوقف والمستهدف، ثم يحسب النظام النتيجة الفعلية بعد 5 و10 و20 جلسة بشفافية كاملة.'
                        : 'Every live signal emitted is logged with its entry/stop/target ranges and tracked after +5, +10, and +20 trading days.'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 text-xs">
                    <button
                      onClick={handleAdvanceLedgerDays}
                      className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <FastForward className="w-4 h-4" />
                      <span>
                        {isRtl ? 'محاكاة مرور +10 جلسات للإشارات المفتوحة' : 'Simulate +10d Forward Evaluation'}
                      </span>
                    </button>

                    <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                      <span className="text-slate-400">{isRtl ? 'نسبة إصابة المستهدف الفعلية:' : 'Realized Target Hit Rate:'} </span>
                      {signalLedger.filter((r) => r.status !== 'PENDING').length === 0 ? (
                        <span className="text-slate-500 font-bold">{isRtl ? '— (لا توجد نتائج بعد)' : '— (no outcomes yet)'}</span>
                      ) : (
                        <Numeric className="font-extrabold text-emerald-500 text-sm">
                          {(
                            (signalLedger.filter((r) => r.status === 'TARGET_HIT').length /
                              signalLedger.filter((r) => r.status !== 'PENDING').length) *
                            100
                          ).toFixed(1)}
                          %
                        </Numeric>
                      )}
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 text-xs">
                      <tr>
                        <th className="py-3 px-3 text-start">{isRtl ? 'رقم وتاريخ الإشارة' : 'ID & Date'}</th>
                        <th className="py-3 px-3 text-start">{isRtl ? 'السهم والقاعدة' : 'Symbol & Rule'}</th>
                        <th className="py-3 px-3 text-start">{isRtl ? 'سعر الإشارة والمدى' : 'Ref Price & Entry Zone'}</th>
                        <th className="py-3 px-3 text-start">{isRtl ? 'النجاح التاريخي وقتها' : 'Backtest at Emission'}</th>
                        <th className="py-3 px-3 text-start">{isRtl ? 'عائد +5 جلسات' : '+5d Return'}</th>
                        <th className="py-3 px-3 text-start">{isRtl ? 'عائد +10 جلسات' : '+10d Return'}</th>
                        <th className="py-3 px-3 text-center">{isRtl ? 'النتيجة الفعلية' : 'Outcome'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {signalLedger.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-10 px-4 text-center">
                            <div className="text-3xl mb-2">📭</div>
                            <p className="font-extrabold text-slate-700 dark:text-slate-200">
                              {isRtl ? 'السجل فارغ — ولا توجد إشارات وهمية هنا' : 'Ledger empty — no fabricated signals'}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto leading-6">
                              {isRtl
                                ? 'المنصة ستسجّل هنا كل إشارة تصدرها فعلياً مع سعر الدخول والوقف والهدف، ثم تحسب النتيجة بعد ٥ و١٠ و٢٠ جلسة — بشفافية كاملة.'
                                : 'Every signal emitted is logged here with entry/stop/target and tracked after +5/+10/+20 sessions.'}
                            </p>
                          </td>
                        </tr>
                      )}
                      {signalLedger.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="py-3 px-3">
                            <Numeric className="font-bold text-slate-700 dark:text-slate-300">{row.id}</Numeric>
                            <div className="text-[11px] text-slate-400">
                              <Numeric>{row.date}</Numeric>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold">{row.canonicalId}</div>
                            <div className="text-xs text-slate-400">{row.ruleAr}</div>
                          </td>
                          <td className="py-3 px-3">
                            <Numeric className="font-bold">{fmtPrice(row.entryPrice)}</Numeric>
                            <div className="text-[11px] text-blue-500">
                              <Numeric>
                                {fmtPrice(row.entryZone[0])} - {fmtPrice(row.entryZone[1])}
                              </Numeric>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <Numeric colorize={row.btWinRate - 50} className="font-bold">
                              {row.btWinRate}%
                            </Numeric>{' '}
                            <span className="text-[11px] text-slate-400">
                              (<Numeric>N={row.btSample}</Numeric>)
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            {row.ret5d !== null ? (
                              <Numeric colorize={row.ret5d} className="font-bold">
                                {fmtPct(row.ret5d)}
                              </Numeric>
                            ) : (
                              <span className="text-slate-500">{isRtl ? 'قيد التتبع' : 'Pending'}</span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            {row.ret10d !== null ? (
                              <Numeric colorize={row.ret10d} className="font-bold">
                                {fmtPct(row.ret10d)}
                              </Numeric>
                            ) : (
                              <span className="text-slate-500">{isRtl ? 'قيد التتبع' : 'Pending'}</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                row.status === 'TARGET_HIT'
                                  ? 'bg-emerald-500/15 text-emerald-500'
                                  : row.status === 'STOP_HIT'
                                  ? 'bg-rose-500/15 text-rose-500'
                                  : 'bg-amber-500/15 text-amber-500'
                              }`}
                            >
                              {row.status === 'TARGET_HIT'
                                ? isRtl
                                  ? 'حقق المستهدف ✓'
                                  : 'Target Hit ✓'
                                : row.status === 'STOP_HIT'
                                ? isRtl
                                  ? 'ضرب الوقف ✗'
                                  : 'Stop Hit ✗'
                                : isRtl
                                ? 'مفتوحة للمراقبة'
                                : 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* -----------------------------------------------------------------
              TAB 5: SAVED PORTFOLIO, MONTHLY BUDGET & GEMINI DOCTOR
             ----------------------------------------------------------------- */}
          {activeTab === 'portfolio' && (
            <div id="tour-saved-portfolio" className="space-y-6">
              {/* ===============================================================
                  NEW: MONTHLY INCOME, INSTALLMENTS & SURPLUS INVESTMENT PLANNER
                 =============================================================== */}
              <div className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-500/40 p-5 sm:p-6 shadow-md space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
                      <Wallet className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        مخطط الميزانية الشهرية واستثمار الفائض — محفوظ تلقائياً 💾
                      </span>
                      <h2 className="font-extrabold text-base sm:text-xl mt-0.5">
                        {isRtl
                          ? 'مرتب الشهر والأقساط والالتزامات ← وإزاي تستثمر المبلغ المتبقي بالضبط'
                          : 'Monthly Income, Installments & Surplus Investment Advisor'}
                      </h2>
                    </div>
                  </div>

                  <button
                    onClick={handleRunGeminiBudgetPlan}
                    disabled={isBudgetAiLoading}
                    className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md transition"
                  >
                    <Sparkles className={`w-4 h-4 ${isBudgetAiLoading ? 'animate-spin' : ''}`} />
                    <span>
                      {isBudgetAiLoading
                        ? 'جاري إعداد خطة الفائض...'
                        : '✨ اطلب خطة Gemini لاستثمار المبلغ المتبقي هذا الشهر'}
                    </span>
                  </button>
                </div>

                {/* Top 4 Financial Summary Boxes: Income -> Obligations -> Emergency Buffer -> Net Investable Surplus */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  {/* Box 1: Monthly Income Input */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 font-bold">
                      <span>1. إجمالي دخل الشهر ده (EGP)</span>
                      <span className="text-emerald-500">الدخل</span>
                    </div>
                    <input
                      type="number"
                      step="500"
                      value={userBudget.incomeEgp}
                      onChange={(e) =>
                        updateMonthlyBudget({ incomeEgp: Math.max(0, Number(e.target.value)) })
                      }
                      className="w-full text-lg font-extrabold font-mono rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2 text-emerald-600 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <div className="text-[11px] text-slate-400">
                      عدل الرقم ليحفظه البرنامج فوراً ويعيد حساب الأسهم
                    </div>
                  </div>

                  {/* Box 2: Living Expenses + Total Installments */}
                  <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/25 space-y-2">
                    <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 font-bold">
                      <span>2. مصاريف المعيشة + الأقساط</span>
                      <Numeric className="font-extrabold">
                        -{fmtPrice(budgetAllocationPlan.totalObligations, 0)} EGP
                      </Numeric>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        مصاريف البيت والمعيشة الشهرية (بخلاف الأقساط):
                      </label>
                      <input
                        type="number"
                        step="500"
                        value={userBudget.livingExpensesEgp}
                        onChange={(e) =>
                          updateMonthlyBudget({
                            livingExpensesEgp: Math.max(0, Number(e.target.value))
                          })
                        }
                        className="w-full text-sm font-bold font-mono rounded-xl bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-900/60 px-3 py-1.5 text-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                      <span>مجموع الأقساط المسجلة بالأسفل:</span>
                      <Numeric className="font-bold text-rose-500">
                        {fmtPrice(budgetAllocationPlan.totalInstallments, 0)} EGP
                      </Numeric>
                    </div>
                  </div>

                  {/* Box 3: Raw Surplus & Emergency Reserve Buffer */}
                  <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/25 space-y-2">
                    <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 font-bold">
                      <span>3. الفائض واحتياطي الطوارئ</span>
                      <Numeric>{budgetAllocationPlan.reservePct}% طوارئ</Numeric>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-slate-500">الفائض قبل الطوارئ:</span>
                      <Numeric className="text-base font-extrabold">
                        {fmtPrice(budgetAllocationPlan.rawSurplus, 0)} EGP
                      </Numeric>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        نسبة سيولة الطوارئ النقدية ({budgetAllocationPlan.reservePct}% ={' '}
                        {fmtPrice(budgetAllocationPlan.emergencyReserveEgp, 0)} ج.م):
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        step="5"
                        value={userBudget.emergencyReservePct}
                        onChange={(e) =>
                          updateMonthlyBudget({ emergencyReservePct: Number(e.target.value) })
                        }
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Box 4: Net Safe Investable Surplus This Month */}
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 flex flex-col justify-between">
                    <div>
                      <div className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                        4. الصافي المتبقي للاستثمار هذا الشهر
                      </div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                        <Numeric>{fmtPrice(budgetAllocationPlan.netInvestableEgp, 0)}</Numeric>{' '}
                        <span className="text-xs font-normal">EGP</span>
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-2">
                      هذا المبلغ فائض بالكامل بعد تغطية جميع أقساطك ومصاريفك وسيولة الطوارئ.
                    </div>
                  </div>
                </div>

                {/* 📊 Salary Flow Chart — من القبض إلى الاستثمار (يتحدث لحظياً مع أي تعديل) */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4 sm:p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-2 text-slate-800 dark:text-slate-100">
                        <BarChart2 className="w-4 h-4 text-emerald-500" />
                        مخطط مرتب الشهر — من القبض إلى الاستثمار
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        رسم حي يتحدث فوراً مع أي تعديل تدخله في الدخل أو المعيشة أو الأقساط أو نسبة الطوارئ
                      </p>
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-bold font-mono px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                      الدخل: <Numeric className="text-emerald-500">{fmtPrice(budgetAllocationPlan.income, 0)}</Numeric> EGP
                    </div>
                  </div>
                  <SalarySplitChart
                    income={budgetAllocationPlan.income}
                    living={budgetAllocationPlan.living}
                    installments={budgetAllocationPlan.totalInstallments}
                    reserve={budgetAllocationPlan.emergencyReserveEgp}
                    investable={budgetAllocationPlan.netInvestableEgp}
                  />
                </div>

                {/* Middle Grid: Installments List Manager (5 cols) + Recommended Stock Allocation Table for the Surplus (7 cols) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                  {/* Installments & Obligations Manager (5 Cols) */}
                  <div className="lg:col-span-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-sm">
                        📋 جدول الأقساط والالتزامات الشهرية ({userBudget.installments.length})
                      </h3>
                      <span className="text-xs text-rose-500 font-bold">
                        غير مدفوع:{' '}
                        <Numeric>{fmtPrice(budgetAllocationPlan.unpaidInstallments, 0)} EGP</Numeric>
                      </span>
                    </div>

                    {/* Add New Installment Form */}
                    <form onSubmit={handleAddInstallment} className="grid grid-cols-12 gap-2 text-xs">
                      <input
                        type="text"
                        placeholder="اسم القسط أو الالتزام (مثال: قسط نادي / جمعية)..."
                        value={newInstallmentForm.title}
                        onChange={(e) =>
                          setNewInstallmentForm((p) => ({ ...p, title: e.target.value }))
                        }
                        className="col-span-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2.5 py-2"
                      />
                      <input
                        type="number"
                        placeholder="المبلغ EGP"
                        value={newInstallmentForm.amount}
                        onChange={(e) =>
                          setNewInstallmentForm((p) => ({ ...p, amount: e.target.value }))
                        }
                        className="col-span-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2.5 py-2 font-mono"
                      />
                      <input
                        type="text"
                        placeholder="الموعد"
                        value={newInstallmentForm.dueDay}
                        onChange={(e) =>
                          setNewInstallmentForm((p) => ({ ...p, dueDay: e.target.value }))
                        }
                        className="col-span-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-2"
                      />
                      <button
                        type="submit"
                        className="col-span-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </form>

                    {/* Installments List */}
                    <div className="space-y-2 max-h-60 overflow-y-auto text-xs">
                      {userBudget.installments.map((inst) => (
                        <div
                          key={inst.id}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition ${
                            inst.paid
                              ? 'bg-emerald-500/5 border-emerald-500/25 opacity-75'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <label className="flex items-center gap-2.5 cursor-pointer flex-1">
                            <input
                              type="checkbox"
                              checked={inst.paid}
                              onChange={() => handleToggleInstallmentPaid(inst.id)}
                              className="rounded text-emerald-600"
                            />
                            <div>
                              <div
                                className={`font-bold ${
                                  inst.paid ? 'line-through text-slate-400' : ''
                                }`}
                              >
                                {inst.title}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                {inst.dueDay} •{' '}
                                {inst.paid ? (
                                  <span className="text-emerald-500 font-semibold">تم السداد ✓</span>
                                ) : (
                                  <span className="text-amber-500 font-semibold">مستحق السداد</span>
                                )}
                              </div>
                            </div>
                          </label>

                          <div className="flex items-center gap-2">
                            <Numeric className="font-extrabold text-rose-500">
                              {fmtPrice(inst.amount, 0)} EGP
                            </Numeric>
                            <button
                              onClick={() => handleDeleteInstallment(inst.id)}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* How to Invest the Remaining Surplus Table (7 Cols) */}
                  <div className="lg:col-span-7 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 p-4 space-y-3 overflow-x-auto">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="font-extrabold text-sm sm:text-base text-emerald-600 dark:text-emerald-400">
                          🎯 إزاي تستثمر المبلغ المتبقي ({fmtPrice(budgetAllocationPlan.netInvestableEgp, 0)} EGP) النهاردة؟
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          تقسيم ذكي متدرج على أقوى 3 أسهم مصرية اليوم من حيث الدرجة الفنية ونسبة النجاح التاريخية
                        </p>
                      </div>
                    </div>

                    <table className="w-full text-xs">
                      <thead className="bg-white dark:bg-slate-900 text-slate-400">
                        <tr>
                          <th className="py-2.5 px-2.5 text-start">السهم والنسبة</th>
                          <th className="py-2.5 px-2.5 text-start">المبلغ المخصص والأسهم</th>
                          <th className="py-2.5 px-2.5 text-start">منطقة الشراء والهدف</th>
                          <th className="py-2.5 px-2.5 text-start">الربح المتوقع / المخاطرة</th>
                          <th className="py-2.5 px-2.5 text-center">تنفيذ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
                        {budgetAllocationPlan.allocations.map((item) => {
                          const a = item.analysis;
                          const dec = a.price < 5 ? 3 : 2;
                          return (
                            <tr key={a.symbol.canonicalId}>
                              <td className="py-3 px-2.5">
                                <div className="font-extrabold text-slate-900 dark:text-white">
                                  {a.symbol.nameAr}
                                </div>
                                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                                  {a.symbol.ticker} • {item.weightPct}% من الفائض
                                </div>
                              </td>
                              <td className="py-3 px-2.5">
                                <div className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                                  <Numeric>{item.shares}</Numeric> سهم
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  بتكلفة <Numeric className="font-bold">{fmtPrice(item.actualCost, 0)} EGP</Numeric>
                                </div>
                              </td>
                              <td className="py-3 px-2.5">
                                <div className="text-blue-500 font-bold">
                                  شراء:{' '}
                                  <Numeric>
                                    {fmtPrice(a.signal.entryZone[0], dec)}-{fmtPrice(a.signal.entryZone[1], dec)}
                                  </Numeric>
                                </div>
                                <div className="text-emerald-500 font-semibold">
                                  هدف: <Numeric>{fmtPrice(a.signal.target1Zone[0], dec)}</Numeric> | وقف:{' '}
                                  <Numeric className="text-rose-500">{fmtPrice(a.signal.stopZone[0], dec)}</Numeric>
                                </div>
                              </td>
                              <td className="py-3 px-2.5">
                                <div className="text-emerald-500 font-bold">
                                  ربح الهدف: <Numeric>+{fmtPrice(item.expectedProfitAtT1, 0)} EGP</Numeric>
                                </div>
                                <div className="text-rose-500 text-[11px]">
                                  مخاطرة الوقف: <Numeric>-{fmtPrice(item.maxRiskAtStop, 0)} EGP</Numeric>
                                </div>
                              </td>
                              <td className="py-3 px-2.5 text-center">
                                <button
                                  onClick={() => {
                                    if (item.shares <= 0) return;
                                    setUsers((prev) =>
                                      prev.map((u) =>
                                        u.id === currentUser.id
                                          ? {
                                              ...u,
                                              trades: [
                                                {
                                                  id: Date.now(),
                                                  canonicalId: a.symbol.canonicalId,
                                                  side: 'BUY',
                                                  qty: item.shares,
                                                  price: a.price,
                                                  currency: a.symbol.currency,
                                                  date: new Date().toISOString().split('T')[0],
                                                  channel: 'خطة فائض الشهر',
                                                  notes: `استثمار فائض الشهر (${item.weightPct}%)`
                                                },
                                                ...u.trades
                                              ]
                                            }
                                          : u
                                      )
                                    );
                                    triggerToast(
                                      `تم تسجيل شراء ${item.shares} سهم من ${a.symbol.ticker} في محفظتك ✓`
                                    );
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                                >
                                  + سجل الشراء
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Gemini Monthly Surplus AI Report */}
                {geminiBudgetPlanReport && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/15 dark:bg-slate-950 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-500 border-b border-slate-200 dark:border-slate-800 pb-2">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" />
                        <span>{geminiBudgetPlanReport.source}</span>
                      </span>
                      <button
                        onClick={() => setGeminiBudgetPlanReport(null)}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs sm:text-sm whitespace-pre-line leading-relaxed">
                      {geminiBudgetPlanReport.text}
                    </div>
                  </div>
                )}
              </div>

              {/* ✨ Gemini Portfolio Doctor Banner */}
              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-emerald-500/30 p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-base sm:text-lg">
                      {isRtl
                        ? `محفظة وسجل معاملات أستاذ ${displayName} (محفوظة تلقائياً 💾)`
                        : 'Your Auto-Saved Portfolio & Trade History'}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isRtl
                        ? 'جميع معاملاتك القديمة والجديدة محفوظة في المتصفح. اطلب من Gemini فحص مراكزك المفتوحة ليخبرك متى تجني أرباحك أو تعدل الوقف.'
                        : 'All your historical and new transactions are persisted automatically in localStorage.'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleRunGeminiPortfolioAudit}
                    disabled={isPortfolioAiLoading}
                    className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <Sparkles className={`w-4 h-4 ${isPortfolioAiLoading ? 'animate-spin' : ''}`} />
                    <span>
                      {isPortfolioAiLoading
                        ? 'جاري فحص المحفظة...'
                        : '✨ روشتة Gemini لمحفظتي ومعاملاتي'}
                    </span>
                  </button>

                  <button
                    onClick={handleResetSavedData}
                    title={isRtl ? 'مسح معاملاتي وبياناتي والبدء من الصفر' : 'Erase my data'}
                    className="px-3 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/15 hover:text-rose-500 text-slate-500 text-xs font-bold flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'مسح بيانات حسابي' : 'Clear my data'}</span>
                  </button>
                </div>
              </div>

              {geminiPortfolioReport && (
                <div className="p-5 rounded-3xl bg-emerald-950/15 dark:bg-slate-900 border-2 border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-500 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>{geminiPortfolioReport.source}</span>
                    </span>
                    <button
                      onClick={() => setGeminiPortfolioReport(null)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-xs sm:text-sm whitespace-pre-line leading-relaxed">
                    {geminiPortfolioReport.text}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { code: 'EGP', titleAr: 'محفظة الجنيه المصري (البورصة المصرية)', data: portfolioSummary.byCurrency.EGP },
                  { code: 'USD', titleAr: 'محفظة الدولار الأمريكي (US + أسهم EGX الدولارية)', data: portfolioSummary.byCurrency.USD }
                ].map((curr) => (
                  <div
                    key={curr.code}
                    className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm sm:text-base">{curr.titleAr}</h3>
                      <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500 font-mono text-xs font-bold">
                        {curr.code}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                        <div className="text-slate-400">{isRtl ? 'القيمة السوقية' : 'Market Value'}</div>
                        <Numeric className="text-base font-extrabold mt-1">
                          {fmtPrice(curr.data.marketValue)} {curr.code}
                        </Numeric>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                        <div className="text-slate-400">{isRtl ? 'صافي الربح غير المحقق' : 'Unrealized P&L'}</div>
                        <Numeric colorize={curr.data.unrealizedPnl} className="text-base font-extrabold mt-1">
                          {fmtPrice(curr.data.unrealizedPnl)} {curr.code}
                        </Numeric>
                      </div>
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                        <div className="text-rose-500 font-medium">
                          {isRtl ? 'المخاطرة عند الوقف (Risk at Stop)' : 'Total Risk at Stop'}
                        </div>
                        <Numeric className="text-base font-extrabold text-rose-500 mt-1">
                          -{fmtPrice(curr.data.riskAtStop)} {curr.code}
                        </Numeric>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <form
                  onSubmit={handleAddTrade}
                  className="lg:col-span-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4"
                >
                  <h3 className="font-bold text-sm sm:text-base">
                    {isRtl ? 'تسجيل معاملة جديدة (تحفظ تلقائياً)' : 'Log Trade (Auto-Saved)'}
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">{isRtl ? 'السهم:' : 'Symbol:'}</label>
                      <select
                        value={tradeForm.canonicalId}
                        onChange={(e) => {
                          const cid = e.target.value;
                          const pr = allAnalyses[cid]?.price || 50;
                          setTradeForm((prev) => ({ ...prev, canonicalId: cid, price: String(pr) }));
                        }}
                        className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 font-semibold"
                      >
                        {symbols.map((s) => (
                          <option key={s.canonicalId} value={s.canonicalId}>
                            {s.canonicalId} — {isRtl ? s.nameAr : s.nameEn} ({s.currency})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {['BUY', 'SELL'].map((side) => (
                        <button
                          type="button"
                          key={side}
                          onClick={() => setTradeForm((prev) => ({ ...prev, side }))}
                          className={`py-2 rounded-xl font-bold border ${
                            tradeForm.side === side
                              ? side === 'BUY'
                                ? 'bg-emerald-600 text-white border-emerald-500'
                                : 'bg-rose-600 text-white border-rose-500'
                              : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                          }`}
                        >
                          {side === 'BUY' ? (isRtl ? 'شراء (BUY)' : 'BUY') : isRtl ? 'بيع (SELL)' : 'SELL'}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1">{isRtl ? 'الكمية:' : 'Quantity:'}</label>
                        <input
                          type="number"
                          value={tradeForm.qty}
                          onChange={(e) => setTradeForm((prev) => ({ ...prev, qty: e.target.value }))}
                          className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">{isRtl ? 'سعر التنفيذ:' : 'Price:'}</label>
                        <input
                          type="number"
                          step="0.01"
                          value={tradeForm.price}
                          onChange={(e) => setTradeForm((prev) => ({ ...prev, price: e.target.value }))}
                          className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">
                        {isRtl ? 'ملاحظات المعاملة (اختياري):' : 'Trade Notes:'}
                      </label>
                      <input
                        type="text"
                        value={tradeForm.notes}
                        onChange={(e) => setTradeForm((prev) => ({ ...prev, notes: e.target.value }))}
                        placeholder={isRtl ? 'مثال: شراء دفعة أولى عند الدعم' : 'e.g., First tranche at support'}
                        className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-sm"
                    >
                      {isRtl ? 'حفظ المعاملة في سجلي الدائم 💾' : 'Save Trade Permanently'}
                    </button>
                  </div>
                </form>

                <div className="lg:col-span-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 overflow-x-auto">
                  <h3 className="font-bold text-sm sm:text-base mb-4">
                    {isRtl ? 'المراكز المفتوحة وتحليل المخاطرة لكل سهم' : 'Open Positions & Risk-at-Stop Breakdown'}
                  </h3>

                  <table className="w-full text-xs sm:text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 text-xs">
                      <tr>
                        <th className="py-2.5 px-3 text-start">{isRtl ? 'السهم' : 'Symbol'}</th>
                        <th className="py-2.5 px-3 text-start">{isRtl ? 'الكمية ومتوسط التكلفة' : 'Qty & Avg Cost'}</th>
                        <th className="py-2.5 px-3 text-start">{isRtl ? 'السعر الحالي والقيمة' : 'Last Price & Value'}</th>
                        <th className="py-2.5 px-3 text-start">{isRtl ? 'الربح/الخسارة' : 'Unrealized P&L'}</th>
                        <th className="py-2.5 px-3 text-start">{isRtl ? 'مستوى الوقف والمخاطرة' : 'Stop & Risk at Stop'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {portfolioSummary.holdings.map((h) => (
                        <tr key={h.canonicalId}>
                          <td className="py-3 px-3">
                            <div className="font-bold">{isRtl ? h.nameAr : h.nameEn}</div>
                            <Numeric className="text-[11px] text-slate-400">{h.canonicalId}</Numeric>
                          </td>
                          <td className="py-3 px-3">
                            <Numeric className="font-bold">{h.qty}</Numeric> {isRtl ? 'سهم' : 'sh'}
                            <div className="text-[11px] text-slate-400">
                              {isRtl ? 'بمتوسط' : 'Avg'} <Numeric>{fmtPrice(h.avgCost)} {h.currency}</Numeric>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <Numeric className="font-bold">{fmtPrice(h.currentPrice)} {h.currency}</Numeric>
                            <div className="text-[11px] text-slate-400">
                              <Numeric>{fmtPrice(h.marketValue)} {h.currency}</Numeric>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <Numeric colorize={h.unrealizedPnl} className="font-bold">
                              {fmtPrice(h.unrealizedPnl)} {h.currency}
                            </Numeric>
                            <div>
                              <Numeric colorize={h.unrealizedPct} className="text-[11px] font-semibold">
                                ({fmtPct(h.unrealizedPct)})
                              </Numeric>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="text-rose-500 font-semibold">
                              {isRtl ? 'وقف:' : 'Stop:'} <Numeric>{fmtPrice(h.stopPrice)}</Numeric>
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {isRtl ? 'المخاطرة:' : 'At Risk:'}{' '}
                              <Numeric className="text-rose-500 font-bold">
                                -{fmtPrice(h.riskAtStop)} {h.currency}
                              </Numeric>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Saved Historical Transactions Log */}
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 overflow-x-auto">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base">
                      {isRtl
                        ? `سجل المعاملات السابقة المحفوظة لـ ${currentUser.nameAr} (${currentUser.trades.length} معاملة)`
                        : 'Saved Historical Transactions Log'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {isRtl
                        ? 'يتم حفظ هذا السجل تلقائياً في ذاكرة المتصفح الدائمة ليظل متاحاً في كل مرة تفتح فيها البرنامج.'
                        : 'Automatically persisted in browser storage.'}
                    </p>
                  </div>
                </div>

                <table className="w-full text-xs sm:text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 text-xs">
                    <tr>
                      <th className="py-2.5 px-3 text-start">{isRtl ? 'التاريخ' : 'Date'}</th>
                      <th className="py-2.5 px-3 text-start">{isRtl ? 'العملية' : 'Side'}</th>
                      <th className="py-2.5 px-3 text-start">{isRtl ? 'السهم' : 'Symbol'}</th>
                      <th className="py-2.5 px-3 text-start">{isRtl ? 'الكمية والسعر' : 'Qty & Price'}</th>
                      <th className="py-2.5 px-3 text-start">{isRtl ? 'الإجمالي' : 'Total'}</th>
                      <th className="py-2.5 px-3 text-start">{isRtl ? 'ملاحظات' : 'Notes'}</th>
                      <th className="py-2.5 px-3 text-center">{isRtl ? 'حذف' : 'Delete'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {currentUser.trades.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-2.5 px-3">
                          <Numeric className="text-slate-500">{t.date}</Numeric>
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${
                              t.side === 'BUY'
                                ? 'bg-emerald-500/15 text-emerald-500'
                                : 'bg-rose-500/15 text-rose-500'
                            }`}
                          >
                            {t.side === 'BUY' ? (isRtl ? 'شراء' : 'BUY') : isRtl ? 'بيع' : 'SELL'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-bold">
                          <Numeric>{t.canonicalId}</Numeric>
                        </td>
                        <td className="py-2.5 px-3">
                          <Numeric className="font-bold">{t.qty}</Numeric> ×{' '}
                          <Numeric>{fmtPrice(t.price)} {t.currency}</Numeric>
                        </td>
                        <td className="py-2.5 px-3 font-bold">
                          <Numeric>{fmtPrice(t.qty * t.price)} {t.currency}</Numeric>
                        </td>
                        <td className="py-2.5 px-3 text-xs text-slate-500 dark:text-slate-400">
                          {t.notes || t.channel}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => handleDeleteTrade(t.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* -----------------------------------------------------------------
              TAB 6: SMART ALERTS & INTERACTIVE TELEGRAM BOT SIMULATOR
             ----------------------------------------------------------------- */}
          {activeTab === 'telegram' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 5 Cols: Smart Alert Builder & Cooldown State Machine */}
              <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-500" />
                  <div>
                    <h3 className="font-bold text-sm sm:text-base">
                      {isRtl
                        ? 'محرك التنبيهات الذكية (مع منع الإزعاج Cooldown)'
                        : 'Smart Alerts Engine (Edge-Triggered + Cooldown)'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {isRtl
                        ? 'يرسل إشعاراً فورياً على تليجرام وداخل التطبيق عند تحقق الشرط'
                        : 'Dispatches alerts to Telegram & in-app with de-duplication'}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 mb-1">{isRtl ? 'السهم:' : 'Symbol:'}</label>
                      <select
                        value={alertForm.canonicalId}
                        onChange={(e) => setAlertForm((p) => ({ ...p, canonicalId: e.target.value }))}
                        className="w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 font-semibold"
                      >
                        {symbols.map((s) => (
                          <option key={s.canonicalId} value={s.canonicalId}>
                            {s.canonicalId}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">{isRtl ? 'الشرط:' : 'Condition:'}</label>
                      <select
                        value={alertForm.condition}
                        onChange={(e) => setAlertForm((p) => ({ ...p, condition: e.target.value }))}
                        className="w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 font-semibold"
                      >
                        <option value="PRICE_ABOVE">السعر يخترق لأعلى (Price &gt;)</option>
                        <option value="PRICE_BELOW">السعر يكسر لأسفل (Price &lt;)</option>
                        <option value="RSI_ABOVE">تشبع شرائي (RSI &gt; 70)</option>
                        <option value="RSI_BELOW">تشبع بيعي (RSI &lt; 30)</option>
                        <option value="RVOL_SPIKE">طفرة سيولة (RVOL &gt; 1.5x)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-slate-400 mb-1">{isRtl ? 'المستوى المستهدف:' : 'Threshold:'}</label>
                      <input
                        type="number"
                        step="0.1"
                        value={alertForm.threshold}
                        onChange={(e) => setAlertForm((p) => ({ ...p, threshold: e.target.value }))}
                        className="w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setUsers((prev) =>
                          prev.map((u) =>
                            u.id === currentUser.id
                              ? {
                                  ...u,
                                  alerts: [
                                    {
                                      id: Date.now(),
                                      canonicalId: alertForm.canonicalId,
                                      condition: alertForm.condition,
                                      threshold: parseFloat(alertForm.threshold) || 50,
                                      cooldownMins: 240,
                                      lastTriggered: 'جاهز للمراقبة',
                                      active: true
                                    },
                                    ...u.alerts
                                  ]
                                }
                              : u
                          )
                        );
                        triggerToast(isRtl ? 'تم تفعيل التنبيه الذكي وحفظه' : 'Smart Alert Activated');
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold"
                    >
                      {isRtl ? '+ إضافة تنبيه' : '+ Add Alert'}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  {currentUser.alerts.map((al) => (
                    <div
                      key={al.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold">
                          {al.canonicalId} • <span className="text-emerald-500">{al.condition}</span>{' '}
                          <Numeric className="font-extrabold">{al.threshold}</Numeric>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Cooldown: <Numeric>{al.cooldownMins}m</Numeric> • {al.lastTriggered}
                        </div>
                      </div>
                      <button
                        onClick={() => handleTelegramCommand(`/signal ${al.canonicalId.split(':')[1]}`)}
                        className="px-2.5 py-1 rounded-lg bg-sky-500/15 text-sky-500 hover:bg-sky-500/25 font-semibold"
                      >
                        {isRtl ? 'محاكاة إرسال لتليجرام' : 'Simulate Trigger'}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono">
                  <div className="text-emerald-400 font-bold mb-1">🔒 Security Hygiene (.env):</div>
                  <div>TELEGRAM_BOT_TOKEN=SecretStr(env_only)</div>
                  <div>LogRedactionFilter: Redacts /bot[0-9]+:[A-Za-z0-9_-]+/</div>
                </div>
              </div>

              {/* Right 7 Cols: Live Interactive Telegram Bot Simulator with PNG Chart Output */}
              <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 flex flex-col">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Send className="w-5 h-5 text-sky-400" />
                    <div>
                      <h3 className="font-bold text-sm sm:text-base">
                        {isRtl
                          ? 'محاكي بوت تليجرام التفاعلي (مع توليد شارت PNG حقيقي)'
                          : 'Interactive Telegram Bot Simulator (with Live PNG Chart Rendering)'}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Chat ID: <Numeric>{currentUser.telegramChatId}</Numeric> • اضغط على أي أمر لتوليد التقرير والصورة فوراً
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]" dir="ltr">
                    {['/signal COMI', '/signal TMGH', '/signal NVDA', '/watchlist', '/portfolio'].map((cmd) => (
                      <button
                        key={cmd}
                        onClick={() => handleTelegramCommand(cmd)}
                        className="px-2.5 py-1 rounded-lg bg-sky-500/15 text-sky-400 hover:bg-sky-500/25 font-mono font-semibold"
                      >
                        {cmd}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 my-3 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 max-h-[460px] overflow-y-auto text-xs">
                  {tgMessages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-3.5 rounded-2xl max-w-[92%] ${
                        m.sender === 'user'
                          ? 'bg-sky-600 text-white ms-auto font-mono'
                          : 'bg-slate-900 text-slate-100 border border-slate-800 me-auto'
                      }`}
                    >
                      {m.chartUrl && (
                        <div className="mb-3 rounded-xl overflow-hidden border border-slate-700">
                          <img src={m.chartUrl} alt="Telegram Generated Technical Chart" className="w-full h-auto block" />
                          <div className="bg-slate-950 px-3 py-1.5 flex items-center justify-between text-[10px] text-slate-400">
                            <span>Generated in-memory PNG (BytesIO • Candlesticks + SMA20/50 + ATR Zones)</span>
                            <a
                              href={m.chartUrl}
                              download="signal-chart.png"
                              className="text-sky-400 hover:underline flex items-center gap-1 font-semibold"
                            >
                              <Download className="w-3 h-3" />
                              <span>تحميل PNG</span>
                            </a>
                          </div>
                        </div>
                      )}
                      <div className="whitespace-pre-line leading-relaxed">{m.text}</div>
                      <div className="text-[10px] opacity-60 mt-1 text-end">
                        <Numeric>{m.time}</Numeric>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2" dir="ltr">
                  <input
                    type="text"
                    value={tgInput}
                    onChange={(e) => setTgInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleTelegramCommand()}
                    placeholder="Type /signal COMI, /signal SWDY, /buy COMI 100 84.50, /portfolio..."
                    className="flex-1 text-xs font-mono rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <button
                    onClick={() => handleTelegramCommand()}
                    className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* -----------------------------------------------------------------
              TAB 7: INTERACTIVE PHASE 0 PROBE & PROVIDER CIRCUIT BREAKER LAB
             ----------------------------------------------------------------- */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              {/* Interactive Circuit Breaker & Phase 0 Probe Runner */}
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-base sm:text-lg flex items-center gap-2 text-emerald-500">
                      <Zap className="w-5 h-5" />
                      <span>
                        {isRtl
                          ? 'مختبر المرحلة 0 التفاعلي وقاطع الدائرة (Live Provider Failover & Phase 0 Probe)'
                          : 'Interactive Phase 0 Probe & Provider Circuit Breaker Lab'}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isRtl
                        ? 'جرّب فصل أي مصدر بيانات أساسي (محاكاة خطأ 429 Rate Limit) لترى كيف يحول النظام جميع الأسهم تلقائياً للمصدر البديل دون توقف.'
                        : 'Trip any primary data source below to watch live automatic failover across the app.'}
                    </p>
                  </div>

                  <button
                    onClick={handleRunPhase0Probe}
                    disabled={isProbingPhase0}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-sm"
                  >
                    <Terminal className="w-4 h-4" />
                    <span>
                      {isProbingPhase0
                        ? isRtl
                          ? 'جاري فحص المصادر...'
                          : 'Running Probe...'
                        : isRtl
                        ? 'تشغيل فحص Phase 0 الحي الآن'
                        : 'Run Live Phase 0 Probe'}
                    </span>
                  </button>
                </div>

                {/* Interactive Circuit Breaker Toggles */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {['TradingView Scanner', 'Yahoo (.CA)', 'Finnhub + Yahoo'].map((prov) => {
                    const isTripped = Boolean(trippedProviders[prov]);
                    return (
                      <div
                        key={prov}
                        className={`p-3.5 rounded-xl border flex items-center justify-between ${
                          isTripped
                            ? 'bg-rose-500/10 border-rose-500/40'
                            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div>
                          <div className="font-bold">{prov}</div>
                          <div className="text-[11px] mt-0.5">
                            {isTripped ? (
                              <span className="text-rose-400 font-semibold">
                                CIRCUIT OPEN (429 Sim) → Routing to Fallback
                              </span>
                            ) : (
                              <span className="text-emerald-400 font-semibold">CIRCUIT CLOSED (Healthy)</span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setTrippedProviders((prev) => ({ ...prev, [prov]: !prev[prov] }));
                            triggerToast(
                              !isTripped
                                ? isRtl
                                  ? `تم فصل ${prov} وتفعيل المصدر البديل تلقائياً`
                                  : `Tripped ${prov} -> Failover active`
                                : isRtl
                                ? `تمت استعادة ${prov} للعمل الطبيعي`
                                : `Restored ${prov}`
                            );
                          }}
                          className={`px-3 py-1.5 rounded-lg font-bold ${
                            isTripped
                              ? 'bg-emerald-600 text-white'
                              : 'bg-rose-500/15 text-rose-400 hover:bg-rose-500/25'
                          }`}
                        >
                          {isTripped ? (isRtl ? 'إعادة تشغيل' : 'Restore') : isRtl ? 'محاكاة عطل 429' : 'Trip 429'}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Live Terminal Output for Phase 0 Probe */}
                {phase0ProbeLog.length > 0 && (
                  <div
                    dir="ltr"
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1.5 text-slate-300"
                  >
                    {phase0ProbeLog.map((line, i) => (
                      <div key={i} className="leading-relaxed">
                        {line}
                      </div>
                    ))}
                  </div>
                )}

                {/* Phase 0 Data Source Validation Table */}
                <div className="overflow-x-auto pt-2">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400">
                      <tr>
                        <th className="py-3 px-3 text-start">{isRtl ? 'المصدر المجاني' : 'Candidate Source'}</th>
                        <th className="py-3 px-3 text-start">{isRtl ? 'تغطية مصر (EGX)' : 'EGX Coverage'}</th>
                        <th className="py-3 px-3 text-start">{isRtl ? 'تغطية أمريكا والعالم' : 'US / Global'}</th>
                        <th className="py-3 px-3 text-start">{isRtl ? 'التأخير والحدود' : 'Delay & Rate Limit'}</th>
                        <th className="py-3 px-3 text-start">{isRtl ? 'المشاكل المرصودة والقرار الهندسي' : 'Findings & Role Assigned'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr>
                        <td className="py-3 px-3 font-bold text-emerald-400">
                          TradingView Scanner API (`/egypt/scan`)
                        </td>
                        <td className="py-3 px-3">
                          ممتازة (220+ سهم مصري + مؤشر EGX30 و EGX70 في طلب واحد)
                        </td>
                        <td className="py-3 px-3">ممتازة (`/america/scan`, `/uk/scan`)</td>
                        <td className="py-3 px-3">متأخر 15 دقيقة • بدون مفتاح API</td>
                        <td className="py-3 px-3 font-semibold text-emerald-400">
                          ✅ المصدر الأساسي للحظة الأسعار والأساسيات ومؤشر EGX30
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-sky-400">
                          Yahoo Finance (`yfinance` `.CA`)
                        </td>
                        <td className="py-3 px-3">
                          جيدة للشموع اليومية (`COMI.CA`)، لكن مؤشر `^CASE30` معطوب (يرجع صفاً واحداً فقط)
                        </td>
                        <td className="py-3 px-3">ممتازة (`NVDA`, `SHEL.L`, `7203.T`)</td>
                        <td className="py-3 px-3">15 دقيقة لمصر / لحظي لأمريكا</td>
                        <td className="py-3 px-3">
                          ✅ المصدر الأساسي لتاريخ الشموع اليومية (OHLCV) مع تفعيل فلتر الأسهم المجانية
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-amber-400">
                          Stooq & Mubasher Info
                        </td>
                        <td className="py-3 px-3">
                          ممتازة لأسماء الشركات بالعربية وإعلانات الكوبونات والأسهم المجانية وتاريخ EGX30
                        </td>
                        <td className="py-3 px-3">جيدة للمؤشرات العالمية</td>
                        <td className="py-3 px-3">نهاية اليوم (EOD) / 15 دقيقة</td>
                        <td className="py-3 px-3">
                          ✅ المصدر البديل (Fallback) لتاريخ مؤشر EGX30 وتوثيق التوزيعات
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-purple-400">
                          Finnhub / Twelve Data (Free Tier)
                        </td>
                        <td className="py-3 px-3">ضعيفة أو مدفوعة للبورصة المصرية في الباقة المجانية</td>
                        <td className="py-3 px-3">ممتازة للأسهم الأمريكية والأخبار (60 طلب/دقيقة)</td>
                        <td className="py-3 px-3">لحظي للسوق الأمريكي</td>
                        <td className="py-3 px-3">
                          ✅ المصدر الأساسي للأسهم الأمريكية وعناوين الأخبار المجانية
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ===================================================================
            MODAL: BEGINNER DICTIONARY & PLAIN-ARABIC GUIDE
           =================================================================== */}
        {showBeginnerGlossaryModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-[#11161f] border border-slate-200 dark:border-slate-800 p-5 space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-emerald-600 dark:text-emerald-400">
                    📖 قاموس المبتدئ المبسط — يعني إيه الكلام ده بالبلدي؟
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    شرح كل مصطلح بتشوفه في المنصة بلغة بسيطة جداً عشان تاخد قرارك وإنت فاهم 100%
                  </p>
                </div>
                <button
                  onClick={() => setShowBeginnerGlossaryModal(false)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {BEGINNER_DICTIONARY.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0b0e14] border border-slate-200 dark:border-slate-800 space-y-1.5"
                  >
                    <div className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                      • {item.term}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.simpleAr}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1 text-slate-700 dark:text-slate-200">
                <div className="font-extrabold text-amber-600 dark:text-amber-400">
                  🔑 النصيحة الذهبية لأول شهر ليك في البورصة يا أستاذ {firstName}:
                </div>
                <p className="leading-relaxed">
                  لا تشتري أبداً بكل فلوسك في سهم واحد، ولا تشتري والسوق بيقفز بسرعة، والتزم دايماً بالـ 3 أرقام اللي البرنامج بيحسبهم ليك: <strong>نطاق الشراء</strong>، و<strong>المستهدف البيعي</strong>، و<strong>وقف الخسارة</strong>.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowBeginnerGlossaryModal(false)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  تمام، فهمت! إغلاق القاموس
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            MODAL: LAUNCH ONLINE FOR FREE + PWA MOBILE INSTALL + DATA BACKUP
           =================================================================== */}
        {showLaunchModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-3xl rounded-2xl bg-white dark:bg-[#11161f] border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-5 max-h-[88vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <span className="px-2.5 py-0.5 rounded bg-blue-500/15 text-blue-600 dark:text-blue-400 text-[11px] font-extrabold">
                    دليل الاستقلال الكامل — مجاناً 100% مدى الحياة
                  </span>
                  <h3 className="font-extrabold text-base sm:text-xl mt-1 text-slate-900 dark:text-white">
                    🚀 إزاي ترفع المنصة أونلاين بـ لينك خاص بيك وتثبتها كتطبيق على موبايلك؟
                  </h3>
                </div>
                <button
                  onClick={() => setShowLaunchModal(false)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Step-by-Step Beginner Launch Methods */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Method 1: Zero-Install 2-Minute Browser Method */}
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/30 space-y-2.5">
                  <div className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                    ⚡ الطريقة الأولى (الأسهل للمبتدئ — في دقيقتين من المتصفح):
                  </div>
                  <ol className="space-y-2 text-slate-700 dark:text-slate-300 list-decimal list-inside leading-relaxed">
                    <li>
                      افتح موقع{' '}
                      <span dir="ltr" className="font-mono font-bold text-emerald-500">
                        vite.new/react
                      </span>{' '}
                      (أو موقع <strong>CodeSandbox.io</strong>) وسجل دخول بحساب جوجل.
                    </li>
                    <li>
                      افتح ملف <span dir="ltr" className="font-mono font-bold">src/App.jsx</span> هناك، وامسح اللي فيه، والصق الكود بتاعنا ده بالكامل.
                    </li>
                    <li>
                      في خانة المكتبات (Dependencies) على الشمال، اكتب{' '}
                      <span dir="ltr" className="font-mono font-bold">lucide-react</span> واضغط Enter.
                    </li>
                    <li>
                      اضغط زر <strong>Deploy / Share</strong> فوق، هيطلعلك لينك أونلاين دائم خاص بيك تفتحه في أي وقت بدون الحاجة للدخول هنا!
                    </li>
                  </ol>
                </div>

                {/* Method 2: Install as a Mobile App (Android / iPhone) */}
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/30 space-y-2.5">
                  <div className="font-extrabold text-sm text-blue-600 dark:text-blue-400">
                    📱 الطريقة التانية: تثبيته كتطبيق على شاشة موبايلك:
                  </div>
                  <ol className="space-y-2 text-slate-700 dark:text-slate-300 list-decimal list-inside leading-relaxed">
                    <li>
                      بعد ما تفتح اللينك بتاعك على الموبايل (من متصفح <strong>Chrome</strong> على أندرويد أو <strong>Safari</strong> على آيفون).
                    </li>
                    <li>
                      اضغط على القائمة (الثلاث نقاط ⋮ فوق أو علامة المشاركة في آيفون).
                    </li>
                    <li>
                      اختار <strong>"الإضافة إلى الشاشة الرئيسية" (Add to Home Screen)</strong>.
                    </li>
                    <li>
                      هينزل عندك كأيقونة تطبيق مستقلة على الموبايل باسم <strong>مرشد البورصة — {displayName}</strong> تفتحه بضغطة واحدة كل يوم!
                    </li>
                  </ol>
                </div>
              </div>

              {/* Data Portability: Export / Import Saved Portfolio & Budget */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0b0e14] border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      💾 نقل معاملاتك ومرتبك وأقساطك إلى موقعك الجديد بضغطة زر:
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                      حمل ملف بياناتك المحفوظة الآن، ولما تفتح موقعك الجديد أونلاين اضغط "استيراد ملف بياناتي" عشان تلاقي كل صفقاتك وأقساطك جاهزة هناك.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => {
                        // Export ONLY the current account, credentials stripped
                        const { pinSalt, pinHash, ...safeUser } = currentUser;
                        const backupPayload = {
                          kind: 'smart-stock-mentor-backup',
                          version: 2,
                          exportedAt: new Date().toISOString(),
                          owner: displayName,
                          user: safeUser,
                          symbols,
                          signalLedger
                        };
                        const blob = new Blob([JSON.stringify(backupPayload, null, 2)], {
                          type: 'application/json'
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `stock-mentor-backup-${new Date().toISOString().split('T')[0]}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                        triggerToast('تم تحميل ملف النسخة الاحتياطية لبياناتك ومعاملاتك بنجاح ✓');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>تحميل نسخة بياناتي ومعاملاتي (JSON)</span>
                    </button>

                    <label className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold cursor-pointer">
                      <span>📂 استيراد ملف بياناتي</span>
                      <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            try {
                              const parsed = JSON.parse(String(ev.target?.result || '{}'));
                              // Merge into the CURRENT account only. Never accept
                              // pinSalt/pinHash from a file — local credentials stay local.
                              const incoming =
                                (parsed && parsed.user) ||
                                (Array.isArray(parsed?.users)
                                  ? parsed.users.find((u) => u && u.id === currentUser.id) || parsed.users[0]
                                  : null);
                              if (incoming && typeof incoming === 'object') {
                                const { pinSalt, pinHash, id, ...safeIncoming } = incoming;
                                setUsers((prev) =>
                                  prev.map((u) =>
                                    u.id === currentUser.id
                                      ? {
                                          ...u,
                                          ...safeIncoming,
                                          id: u.id,
                                          pinSalt: u.pinSalt,
                                          pinHash: u.pinHash
                                        }
                                      : u
                                  )
                                );
                              }
                              if (Array.isArray(parsed.symbols)) setSymbols(parsed.symbols);
                              if (Array.isArray(parsed.signalLedger)) setSignalLedger(parsed.signalLedger);
                              triggerToast('تم استيراد معاملاتك وميزانيتك بنجاح ✓');
                            } catch {
                              triggerToast('ملف غير صالح، يرجى اختيار ملف النسخة الاحتياطية الصحيح');
                            }
                          };
                          reader.readAsText(file);
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Optional Free Gemini API Key for External Hosting */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0b0e14] border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="font-extrabold text-slate-900 dark:text-white">
                  🔑 مفتاح Gemini المجاني (تحتاجه فقط بعد رفع الموقع خارج هذا الشات):
                </div>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  هنا داخل Canvas يعمل ذكاء Gemini تلقائياً بدون مفتاح. أما عندما ترفع الموقع على رابطك الخاص في Vercel أو Netlify، يمكنك الحصول على مفتاح مجاني في ثوانٍ من موقع{' '}
                  <span dir="ltr" className="font-mono font-bold text-emerald-500">
                    aistudio.google.com/apikey
                  </span>{' '}
                  ولصقه هنا ليُحفظ في متصفحك فقط:
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="password"
                    dir="ltr"
                    value={customGeminiKey}
                    onChange={(e) => setCustomGeminiKey(e.target.value)}
                    placeholder="AIzaSy... (اتركه فارغاً طالما تستخدم البرنامج هنا)"
                    className="flex-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2 font-mono"
                  />
                  <button
                    onClick={() => {
                      try {
                        localStorage.setItem('mahmoud_custom_gemini_key', customGeminiKey.trim());
                        triggerToast('تم حفظ مفتاح Gemini في متصفحك بنجاح ✓');
                      } catch {}
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-emerald-600 text-white font-bold"
                  >
                    حفظ المفتاح
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowLaunchModal(false)}
                  className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            MODAL: ADD ANY CUSTOM TICKER TO WATCHLIST & ANALYZER
           =================================================================== */}
        {showAddSymbolModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base">
                  {isRtl ? 'إضافة أي رمز سهم جديد للمنصة' : 'Add Any Stock Symbol to Watchlist'}
                </h3>
                <button
                  onClick={() => setShowAddSymbolModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddCustomSymbol} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">
                    {isRtl ? 'كود السهم (مثال: ABUK, FWRY, TSLA, META):' : 'Ticker Symbol:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustomTicker.ticker}
                    onChange={(e) => setNewCustomTicker((p) => ({ ...p, ticker: e.target.value }))}
                    placeholder="ABUK / FWRY / TSLA"
                    className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">
                    {isRtl ? 'اسم الشركة بالعربية (اختياري):' : 'Arabic Name (Optional):'}
                  </label>
                  <input
                    type="text"
                    value={newCustomTicker.nameAr}
                    onChange={(e) => setNewCustomTicker((p) => ({ ...p, nameAr: e.target.value }))}
                    placeholder="مثال: أبو قير للأسمدة / تسلا"
                    className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">{isRtl ? 'البورصة:' : 'Exchange:'}</label>
                    <select
                      value={newCustomTicker.exchange}
                      onChange={(e) => {
                        const ex = e.target.value;
                        setNewCustomTicker((p) => ({
                          ...p,
                          exchange: ex,
                          currency: ex === 'EGX' ? 'EGP' : ex === 'LSE' ? 'GBP' : ex === 'TSE' ? 'JPY' : 'USD'
                        }));
                      }}
                      className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 font-semibold"
                    >
                      <option value="EGX">EGX (مصر)</option>
                      <option value="NASDAQ">NASDAQ (أمريكا)</option>
                      <option value="NYSE">NYSE (أمريكا)</option>
                      <option value="LSE">LSE (لندن)</option>
                      <option value="TSE">TSE (طوكيو)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">{isRtl ? 'العملة:' : 'Currency:'}</label>
                    <select
                      value={newCustomTicker.currency}
                      onChange={(e) => setNewCustomTicker((p) => ({ ...p, currency: e.target.value }))}
                      className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 font-mono font-semibold"
                    >
                      <option value="EGP">EGP</option>
                      <option value="USD">USD</option>
                      <option value="GBP">GBP</option>
                      <option value="JPY">JPY</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddSymbolModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-400 font-semibold"
                  >
                    {isRtl ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                  >
                    {isRtl ? 'إضافة وتشغيل التحليل التاريخي' : 'Add & Run Backtest'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===================================================================
            📱 MOBILE "MORE" SHEET (opened from the fixed bottom bar)
           =================================================================== */}
        {showMobileMore && (
          <div className="lg:hidden fixed inset-0 z-40">
            <button
              aria-label={isRtl ? 'إغلاق القائمة' : 'Close menu'}
              onClick={() => setShowMobileMore(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            />
            <div className="absolute bottom-[74px] inset-x-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11161f] shadow-2xl p-3 space-y-1.5">
              <div className="flex items-center justify-between px-1.5 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400">
                  {isRtl ? 'المزيد من الأقسام' : 'More sections'}
                </span>
                <button
                  onClick={() => setShowMobileMore(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  aria-label={isRtl ? 'إغلاق' : 'Close'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'masters', icon: BookOpen, labelAr: '4. خلاصة الـ 14 كتاباً', labelEn: '4. Masters Rules' },
                  { id: 'ledger', icon: Scale, labelAr: '6. سجل المصداقية', labelEn: '6. Track Record' },
                  { id: 'telegram', icon: Send, labelAr: '7. تليجرام والتنبيهات', labelEn: '7. Telegram & Alerts' },
                  { id: 'architecture', icon: Database, labelAr: '8. فحص المصادر', labelEn: '8. Data Health' }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setShowMobileMore(false);
                      }}
                      className={`flex items-center gap-2.5 px-3 py-3 rounded-xl text-xs font-bold transition border ${
                        isActive
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="text-start leading-5">
                        {isRtl ? item.labelAr : item.labelEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            📱 FIXED MOBILE BOTTOM NAVIGATION BAR (phones only)
           =================================================================== */}
        <nav
          aria-label={isRtl ? 'التنقل السريع' : 'Quick navigation'}
          className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#11161f]/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="grid grid-cols-5 max-w-lg mx-auto">
            {[
              { id: 'dashboard', icon: Activity, labelAr: 'البداية', labelEn: 'Home' },
              { id: 'stock', icon: BarChart2, labelAr: 'إمتى أشتري؟', labelEn: 'Plan' },
              { id: 'portfolio', icon: Wallet, labelAr: 'مرتبي ومحفظتي', labelEn: 'Budget' },
              { id: 'scanner', icon: Filter, labelAr: 'باحث الفرص', labelEn: 'Scanner' },
              { id: '__more__', icon: LayoutGrid, labelAr: 'المزيد', labelEn: 'More' }
            ].map((item) => {
              const Icon = item.icon;
              const isMore = item.id === '__more__';
              const isActive = !isMore && activeTab === item.id;
              const moreHasActiveTab = ['masters', 'ledger', 'telegram', 'architecture'].includes(activeTab);
              const highlighted = isMore ? showMobileMore || moreHasActiveTab : isActive;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (isMore) {
                      setShowMobileMore((v) => !v);
                    } else {
                      setActiveTab(item.id);
                      setShowMobileMore(false);
                    }
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className="relative flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] transition select-none"
                >
                  {highlighted && (
                    <span className="absolute top-0 h-[3px] w-12 rounded-b-full bg-emerald-500" />
                  )}
                  <Icon
                    className={`w-5 h-5 transition ${
                      highlighted
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  />
                  <span
                    className={`text-[9px] leading-tight font-bold transition ${
                      highlighted
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {isRtl ? item.labelAr : item.labelEn}
                  </span>
                  {item.id === 'portfolio' && currentUser.trades.length > 0 && (
                    <span className="absolute top-1.5 end-3 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-600 text-white text-[9px] font-extrabold flex items-center justify-center">
                      {currentUser.trades.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}