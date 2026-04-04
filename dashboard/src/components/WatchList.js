// src/components/WatchList.jsx
import React, { useState, useContext, useCallback, useEffect, useRef } from "react";
import axios from "axios";

import { Tooltip, Grow } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import MoreHoriz from "@mui/icons-material/MoreHorizOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import { watchlist } from "../data/data";
import GeneralContext from "../context/GeneralContext";
import { DoughnoutChart } from "./Graphs/DoughnoutChart";
import { useLivePrices } from "./hooks/useLivePrices";


const WatchList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [selectedQuote, setSelectedQuote] = useState(null); // { symbol, description, c, d, dp }
  const [extraStocks, setExtraStocks] = useState([]); // stocks added via search
  const debounceRef = useRef(null);
  const dropdownRef = useRef(null);


  const dynamicWatchlist = [...watchlist, ...extraStocks];
  const stockNames = dynamicWatchlist.map((s) => `NSE:${s.name}`);

  const { prices: livePrices } = useLivePrices(stockNames, 30000);



  //---enrich list with live prices-----
  const enrichedWatchlist = dynamicWatchlist.map((stock) => {
    const livePrice = livePrices[stock.name];
    return {
      ...stock,
      price: typeof livePrice === "number" ? livePrice : stock.price,
      isDown:
        typeof livePrice === "number"
          ? livePrice < stock.price
          : stock.isDown,
    };
  });


  // --- pie- chart-data -----
  const chartData = {
    labels: enrichedWatchlist.map((s) => s.name),
    datasets: [{
      label: "Price",
      data: enrichedWatchlist.map((s) => s.price),
      backgroundColor: [
        "rgba(255,99,132,0.5)", "rgba(54,162,235,0.5)", "rgba(255,206,86,0.5)",
        "rgba(75,192,192,0.5)", "rgba(153,102,255,0.5)", "rgba(255,159,64,0.5)",
      ],
      borderWidth: 1,
    }],
  };

  // ── Search: debounced call to backend proxy ───────────────────────────────
  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    setSelectedQuote(null);

    if (!q.trim()) {
      setSearchResults([]);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await axios.get(
          `http://localhost:3002/api/search?q=${encodeURIComponent(q)}`
        );
        // Filter to NSE stocks only, take first 8
        const nseResults = (res.data || [])
          .filter((r) => r.exchDisp === "NSE" || r.exchange === "NSI")
          .slice(0, 8);
        setSearchResults(nseResults);
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  };


  // ── Fetch full quote when user clicks a search result ────────────────────
  const handleSelectResult = async (result) => {
    // result.symbol is like "INFY.NS" — use it directly for Yahoo Finance quote
    setSearchQuery(result.shortname || result.symbol);
    setSearchResults([]);

    try {
      const res = await axios.get(
        `http://localhost:3002/api/quote?symbol=${encodeURIComponent(result.symbol)}`
      );
      setSelectedQuote({
        ...res.data,
        yahooSymbol: result.symbol,                        // "INFY.NS"
        plainName: result.symbol.replace(/\.(NS|BO)$/, ""),  // "INFY"
        description: result.shortname || result.longname || result.symbol,
      });
    } catch (err) {
      console.error("Quote error:", err);
    }
  };

  // ── Add searched stock to dynamic watchlist ───────────────────────────────
  const handleAddToWatchlist = () => {
    if (!selectedQuote || selectedQuote.regularMarketPrice === 0) return;

    const name = selectedQuote.plainName;
    if (dynamicWatchlist.some((s) => s.name === name)) {
      // Already in watchlist — just close the card
      setSelectedQuote(null);
      setSearchQuery("");
      return;
    }

    const change = selectedQuote.regularMarketChangePercent ?? 0;
    setExtraStocks((prev) => [...prev, {
      name,
      price: selectedQuote.regularMarketPrice ?? 0,
      percent: `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`,
      isDown: change < 0,
    }]);

    setSelectedQuote(null);
    setSearchQuery("");
  };


  // ── Close dropdown on outside click ──────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="watchlist-container">
      {/* ── Search ────────────────────────────────────────────────────────── */}
      <div className="search-container" ref={dropdownRef} style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="Search eg: infy, tcs, nifty..."
          className="search"
          value={searchQuery}
          onChange={handleSearchChange}
          autoComplete="off"
        />
        <span className="counts">{dynamicWatchlist.length} / 50</span>

        {/* Search dropdown */}
        {(searchResults.length > 0 || isSearching) && (
          <ul
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "var(--bg-color, #1e1e1e)",
              border: "1px solid #333",
              borderRadius: "4px",
              zIndex: 100,
              listStyle: "none",
              margin: 0,
              padding: "4px 0",
              maxHeight: "260px",
              overflowY: "auto",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            }}
          >
            {isSearching && (
              <li style={{ padding: "8px 12px", color: "#888", fontSize: "13px" }}>
                Searching…
              </li>
            )}
            {searchResults.map((r, i) => (
              <li
                key={i}
                onClick={() => handleSelectResult(r)}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "13px",
                  borderBottom: "1px solid #2a2a2a",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#2a2a2a")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <span style={{ fontWeight: 600 }}>
                  {r.symbol.replace(/\.(NS|BO)$/, "")}                </span>
                <span style={{ color: "#999", fontSize: "12px", maxWidth: "55%", textAlign: "right" }}>
                  {r.shortname || r.longname}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Quote card (shown after selecting a search result) ──────────────── */}
      {selectedQuote && (
        <div
          style={{
            margin: "8px 12px",
            padding: "12px",
            background: "#1a1a2e",
            border: "1px solid #333",
            borderRadius: "6px",
            position: "relative",
          }}
        >

          <button
            onClick={() => { setSelectedQuote(null); setSearchQuery(""); }}
            style={{
              position: "absolute", top: 8, right: 8,
              background: "none", border: "none", cursor: "pointer", color: "#888",
            }}
          >
            <CloseIcon fontSize="small" />
          </button>


          {/* No data case */}
          {!selectedQuote.regularMarketPrice ? (
            <p style={{ color: "#f44336", fontSize: "13px", margin: 0 }}>
              No data available for {selectedQuote.plainName} on NSE.
            </p>
          ) : (
            <>
              {/* Stock name + live price */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "14px", margin: 0 }}>
                    {selectedQuote.plainName}
                  </p>
                  <p style={{ color: "#888", fontSize: "11px", margin: "2px 0 0" }}>
                    {selectedQuote.description}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontWeight: 700, fontSize: "16px", margin: 0 }}>
                    ₹{selectedQuote.regularMarketPrice?.toFixed(2)}
                  </p>
                  <p style={{
                    fontSize: "12px", margin: 0,
                    color: selectedQuote.regularMarketChange >= 0 ? "#4caf50" : "#f44336",
                  }}>
                    {selectedQuote.regularMarketChange >= 0 ? "▲" : "▼"}{" "}
                    {selectedQuote.regularMarketChange?.toFixed(2)}{" "}
                    ({selectedQuote.regularMarketChangePercent?.toFixed(2)}%)
                  </p>
                </div>
              </div>

              {/* OHLC details */}
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr",
                gap: "4px 16px", fontSize: "12px", color: "#aaa", marginBottom: "10px",
              }}>
                <span>Open:       ₹{selectedQuote.regularMarketOpen?.toFixed(2)}</span>
                <span>Prev close: ₹{selectedQuote.regularMarketPreviousClose?.toFixed(2)}</span>
                <span>High:       ₹{selectedQuote.regularMarketDayHigh?.toFixed(2)}</span>
                <span>Low:        ₹{selectedQuote.regularMarketDayLow?.toFixed(2)}</span>
              </div>

              {/* Add to watchlist button */}
              <button
                onClick={handleAddToWatchlist}
                style={{
                  width: "100%", padding: "6px", background: "#3f51b5",
                  color: "#fff", border: "none", borderRadius: "4px",
                  cursor: "pointer", fontSize: "13px",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "4px",
                }}
              >
                <AddIcon fontSize="small" />
                {dynamicWatchlist.some((s) => s.name === selectedQuote.plainName)
                  ? "Already in watchlist"
                  : "Add to Watchlist"}
              </button>
            </>
          )}
        </div>
      )}

      {/* Watchlist */}
      <ul className="list">
        {enrichedWatchlist.map((stock, index) => (
          <WatchListItem stock={stock} key={index} />
        ))}
      </ul>

      <DoughnoutChart data={chartData} />
    </div>
  );
};




// ── WatchListItem ──────────────────────────────────────────────────────────────

const WatchListItem = ({ stock }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <li
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
        <div className="itemInfo">
          <span className="percent">{stock.percent}</span>
          {stock.isDown
            ? <KeyboardArrowDownIcon className="down" />
            : <KeyboardArrowUpIcon className="up" />}
          <span className="price">₹{Number(stock.price).toFixed(2)}</span>
        </div>
      </div>
      {showActions && <WatchListActions uid={stock.name} />}
    </li>
  );
};

// ── WatchListActions ───────────────────────────────────────────────────────────

const WatchListActions = ({ uid }) => {
  const { openBuyWindow, openSellWindow } = useContext(GeneralContext);

  return (
    <span className="actions">
      <Tooltip title="Buy (B)" placement="top" arrow TransitionComponent={Grow}>
        <button className="buy" onClick={() => openBuyWindow(uid)}>Buy</button>
      </Tooltip>
      <Tooltip title="Sell (S)" placement="top" arrow TransitionComponent={Grow}>
        <button className="sell" onClick={() => openSellWindow(uid)}>Sell</button>
      </Tooltip>
      <Tooltip title="Analytics (A)" placement="top" arrow TransitionComponent={Grow}>
        <button className="action"><BarChartOutlinedIcon className="icon" /></button>
      </Tooltip>
      <Tooltip title="More (M)" placement="top" arrow TransitionComponent={Grow}>
        <button className="btn"><MoreHoriz /></button>
      </Tooltip>
    </span>
  );
};

export default WatchList;
