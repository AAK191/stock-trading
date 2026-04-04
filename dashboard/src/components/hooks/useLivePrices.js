// dashboard/src/components/hooks/useLivePrices.js
//
// ─── WHAT THIS HOOK DOES ────────────────────────────────────────────────────
//
//  Gives you live prices for a list of stocks, auto-refreshing every 30s.
//
//  Usage:
//    const { prices, loading } = useLivePrices(["INFY", "TCS", "RELIANCE"]);
//    prices  →  { "INFY": 1823.5, "TCS": 3410.0, "RELIANCE": 2920.0 }
//    loading →  true only on the very first fetch
//
// ─── WHY WE SWITCHED FROM FINNHUB WEBSOCKET ─────────────────────────────────
//
//  Finnhub's free WebSocket only streams US market (NYSE/NASDAQ) stocks.
//  Subscribing to NSE:TCS, NSE:RELIANCE etc. was silently ignored —
//  no data came back, no error, nothing. Only INFY worked because it's
//  cross-listed on NYSE. Yahoo Finance is completely free, no API key,
//  and supports ALL NSE stocks.
//
// ─── HOW IT WORKS (step by step) ────────────────────────────────────────────
//
//  1. Convert plain names → Yahoo Finance symbols:
//        "INFY"  →  "INFY.NS"    (.NS = National Stock Exchange India)
//        "TCS"   →  "TCS.NS"
//
//  2. Send ONE batch request to our backend:
//        GET /api/quotes?symbols=INFY.NS,TCS.NS,RELIANCE.NS
//        (all stocks in a single call — efficient, avoids rate limits)
//
//  3. Backend fetches from Yahoo Finance and returns:
//        { "INFY.NS": 1823.5, "TCS.NS": 3410.0 }
//
//  4. We strip the ".NS" back off so components can look up by plain name:
//        { "INFY": 1823.5, "TCS": 3410.0 }
//
//  5. Repeat step 2-4 every 30 seconds (polling)

import { useEffect, useRef, useState } from "react";

const BACKEND_URL = "http://localhost:3002";

export const useLivePrices = (stockNames, intervalMs = 30000) => {
  const [prices, setPrices] = useState({});    // { "INFY": 1823.5, ... }
  const [loading, setLoading] = useState(true); // true until first data arrives
  const timerRef = useRef(null);

  const fetchPrices = async (names) => {
    if (!names || names.length === 0) return;

    // "INFY","TCS" → "INFY.NS,TCS.NS" (Yahoo Finance NSE format)
    const yahooSymbols = names.map((n) => `${n}.NS`).join(",");

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/quotes?symbols=${encodeURIComponent(yahooSymbols)}`
      );
      const data = await res.json();
      // data = { "INFY.NS": 1823.5, "TCS.NS": 3410.0, ... }

      // Strip ".NS" so components can do: prices["INFY"] instead of prices["INFY.NS"]
      const mapped = {};
      Object.entries(data).forEach(([sym, price]) => {
        const name = sym.replace(/\.(NS|BO)$/, "");
        mapped[name] = price;
      });

      setPrices((prev) => ({ ...prev, ...mapped }));
    } catch (err) {
      console.warn("Live price fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!stockNames || stockNames.length === 0) return;

    fetchPrices(stockNames);                              // immediate first fetch
    timerRef.current = setInterval(                       // then every 30s
      () => fetchPrices(stockNames), intervalMs
    );

    return () => clearInterval(timerRef.current);         // cleanup on unmount

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockNames.join(",")]);                            // re-run if stock list changes

  return { prices, loading };
};