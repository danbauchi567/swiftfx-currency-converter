// script.js — SwiftFX Currency Converter
const API_ENDPOINT = // script.js — SwiftFX Currency Converter
const API_ENDPOINT = 'https://api.exchangerate.host/convert';
const SYMBOLS_ENDPOINT = 'https://api.exchangerate.host/symbols';

const fromCur = document.getElementById('from-currency');
const toCur = document.getElementById('to-currency');
const fromAmt = document.getElementById('from-amount');
const manualRate = document.getElementById('manual-rate');
const offlineMode = document.getElementById('offline-mode');
const convertBtn = document.getElementById('convert-btn');
const swapBtn = document.getElementById('swap-btn');
const resultEl = document.getElementById('result');
const rateInfo = document.getElementById('rate-info');
const precision = document.getElementById('precision');
const savedRatesKey = 'swiftfx.saved.rates';

const fallbackCurrencies = [
  "USD","EUR","GBP","NGN","CAD","AUD","JPY","CNY","INR","BRL","ZAR","SGD","CHF","SEK","KRW"
];

// Fetch list of supported symbols
async function fetchSymbols() {
  try {
    const r = await fetch(SYMBOLS_ENDPOINT);
    if (!r.ok) throw new Error('No symbols');
    const j = await r.json();
    const keys = Object.keys(j.symbols);
    keys.sort();
    return keys;
  } catch {
    console.warn('Falling back to default currency list');
    return fallbackCurrencies;
  }
}

// Populate dropdowns
async function populateSelects() {
  const symbols = await fetchSymbols();
  for (const s of symbols) {
    const o1 = new Option(s, s);
    const o2 = new Option(s, s);
    fromCur.append(o1);
    toCur.append(o2);
  }
  fromCur.value = 'USD';
  toCur.value = 'EUR';
}

// Convert currency
async function convert() {
  const from = fromCur.value;
  const to = toCur.value;
  const amount = parseFloat(fromAmt.value || '0');
  const dp = parseInt(precision.value || 2, 10);

  if (amount <= 0) {
    resultEl.textContent = 'Enter an amount';
    return;
  }

  if (offlineMode.checked && manualRate.value) {
    const rate = parseFloat(manualRate.value);
    const value = (amount * rate).toFixed(dp);
    rateInfo.textContent = `Manual rate used: 1 ${from} = ${rate}`;
    resultEl.textContent = `${value} ${to}`;
    return;
  }

  rateInfo.textContent = 'Fetching latest rate…';
  try {
    const res = await fetch(`${API_ENDPOINT}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&amount=${encodeURIComponent(amount)}`);
    const data = await res.json();
    if (!data.result) throw new Error('Conversion failed');
    const rate = data.info.rate;
    const value = data.result.toFixed(dp);

    rateInfo.textContent = `1 ${from} = ${rate.toFixed(6)} ${to} (source: exchangerate.host)`;
    resultEl.textContent = `${value} ${to}`;
  } catch (err) {
    rateInfo.textContent = 'Error fetching rate — try offline/manual rate.';
    resultEl.textContent = '—';
    console.error(err);
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await populateSelects();
  document.getElementById('year').textContent = new Date().getFullYear();
  convert();
});

convertBtn.addEventListener('click', e => { e.preventDefault(); convert(); });

swapBtn.addEventListener('click', () => {
  const a = fromCur.value;
  fromCur.value = toCur.value;
  toCur.value = a;
  convert();
});

// Save rate feature
document.getElementById('save-rate').addEventListener('click', async () => {
  try {
    const from = fromCur.value;
    const to = toCur.value;
    const key = `${from}_${to}`;
    const res = await fetch(`${API_ENDPOINT}?from=${from}&to=${to}`);
    const data = await res.json();
    const rate = data.info.rate;
    const saved = JSON.parse(localStorage.getItem(savedRatesKey) || '{}');
    saved[key] = { rate, time: new Date().toISOString() };
    localStorage.setItem(savedRatesKey, JSON.stringify(saved));
    alert(`Saved rate ${rate} for ${from}→${to}`);
  } catch {
    alert('Unable to save rate. Make sure you are online.');
  }
});

// Register service worker for PWA/offline mode
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => console.warn('SW registration failed'));
  });
}
