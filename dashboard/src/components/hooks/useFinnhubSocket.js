// src/hooks/useFinnhubSocket.js
import { useEffect, useRef, useCallback } from "react";

const FINNHUB_API_KEY = process.env.REACT_APP_FINNHUB_API_KEY;

export const useFinnhubSocket = (symbols, onPriceUpdate) => {
    const wsRef = useRef(null);
    const subscribedRef = useRef(new Set());

    const subscribe = useCallback((symbol) => {
        if (wsRef.current?.readyState === WebSocket.OPEN && !subscribedRef.current.has(symbol)) {
            wsRef.current.send(JSON.stringify({ type: "subscribe", symbol }));
            subscribedRef.current.add(symbol);
        }
    }, []);

    useEffect(() => {
        if (!symbols.length) return;

        const ws = new WebSocket(`wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`);
        wsRef.current = ws;

        ws.onopen = () => {
            symbols.forEach(subscribe);
        };

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.type === "trade" && msg.data) {
                // Finnhub sends an array of trades; take the last one per symbol
                const latestBySymbol = {};
                msg.data.forEach((trade) => {
                    latestBySymbol[trade.s] = trade.p; // s = symbol, p = price
                });
                onPriceUpdate(latestBySymbol);
            }
        };

        ws.onerror = (err) => console.error("Finnhub WS error:", err);
        ws.onclose = () => console.log("Finnhub WS closed");

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                symbols.forEach((sym) => {
                    ws.send(JSON.stringify({ type: "unsubscribe", symbol: sym }));
                });
            }
            ws.close();
            subscribedRef.current.clear();

        };
    }, [symbols.join(",")]); // re-run only if symbol list changes
};