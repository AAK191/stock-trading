require('dotenv').config();

const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");

const { HoldingsModel } = require('./model/HoldingsModel');
const { PositionsModel } = require('./model/PositionsModel');
const { OrdersModel } = require('./model/OrdersModel');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');


const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const axios = require("axios");

const cookieParser = require('cookie-parser');
const FINNHUB_KEY  = process.env.FINNHUB_API_KEY;

const app = express();
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:3003',  
    'http://localhost:3001',  
  ],
  credentials: true           
}));

//app.use(bodyParser.json());
const YF_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "application/json",
};

app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

//---Yahoo proxy endpoints----

//----1. Batch quotes---
app.get("/api/quotes", async (req, res) => {
  const { symbols } = req.query;
  if (!symbols) return res.json({});
 
  try {
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbols)}&region=IN&lang=en-IN`;
    const response = await axios.get(url, { headers: YF_HEADERS });
    const results  = response.data?.quoteResponse?.result ?? [];
 
    // Convert array → simple object: { "INFY.NS": 1823.5, ... }
    const prices = {};
    results.forEach((stock) => {
      if (stock.regularMarketPrice) {
        prices[stock.symbol] = stock.regularMarketPrice;
      }
    });
 
    res.json(prices);
  } catch (err) {
    console.error("Yahoo Finance batch quote error:", err.message);
    res.status(500).json({ error: "Price fetch failed" });
  }
});

// -----2. stock research

app.get("/api/search", async (req, res) => {
  const { q } = req.query;
  if (!q || !q.trim()) return res.json([]);
 
  try {
    const url =
      `https://query1.finance.yahoo.com/v1/finance/search` +
      `?q=${encodeURIComponent(q)}&quotesCount=10&newsCount=0&region=IN&lang=en-IN`;
 
    const response = await axios.get(url, { headers: YF_HEADERS });
    const quotes   = response.data?.quotes ?? [];
 
    // Return the quotes array — frontend will filter to NSE only
    res.json(quotes);
  } catch (err) {
    console.error("Yahoo Finance search error:", err.message);
    res.status(500).json({ error: "Search failed" });
  }
});


// --- 3. single stock full quote

app.get("/api/quote", async (req, res) => {
  const { symbol } = req.query;
  if (!symbol) return res.status(400).json({ error: "symbol is required" });
 
  try {
    const url =
      `https://query1.finance.yahoo.com/v7/finance/quote` +
      `?symbols=${encodeURIComponent(symbol)}&region=IN&lang=en-IN`;
 
    const response = await axios.get(url, { headers: YF_HEADERS });
    const result   = response.data?.quoteResponse?.result?.[0];
 
    if (!result) return res.json({});
    res.json(result);
  } catch (err) {
    console.error("Yahoo Finance quote error:", err.message);
    res.status(500).json({ error: "Quote fetch failed" });
  }
});

app.get('/allHoldings', async (req, res) => {
    let allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
});

app.get('/allPositions', async (req, res) => {
    let allPositions = await PositionsModel.find({});
    res.json(allPositions);
});


// POST /newOrder  — called by placeOrder() in frontend
app.post("/newOrder", async (req, res) => {
  const { name, qty, price, mode } = req.body;

  try {
    await OrdersModel.create({ name, qty, price, mode });

    if (mode === "BUY") {
      const existing = await HoldingsModel.findOne({ name });

      if (existing) {
        const totalQty  = existing.qty + qty;
        const newAvg    = ((existing.avg * existing.qty) + (price * qty)) / totalQty;
        await HoldingsModel.updateOne(
          { name },
          { $set: { qty: totalQty, avg: newAvg, price } }
        );
      } else {
        await HoldingsModel.create({
          name,
          qty,
          avg: price,
          price,
          net: "0.00%",
          day: "0.00%",
          isLoss: false,
        });
      }

      //-- update position
       const existingPos = await PositionsModel.findOne({ name });
      if (existingPos) {
        const totalQty = existingPos.qty + qty;
        const newAvg   = ((existingPos.avg * existingPos.qty) + (price * qty)) / totalQty;
        await PositionsModel.updateOne(
          { name },
          { $set: { qty: totalQty, avg: newAvg, price } }
        );
      } else {
        await PositionsModel.create({
          product: "CNC",
          name,
          qty,
          avg: price,
          price,
          net: "0.00%",
          day: "0.00%",
          isLoss: false,
        });
      }

    }

    if (mode === "SELL") {
      //updating holdings
      const existing = await HoldingsModel.findOne({ name });
      if (existing) {
        const remaining = existing.qty - qty;
        if (remaining <= 0) await HoldingsModel.deleteOne({ name });
        else await HoldingsModel.updateOne({ name }, { $set: { qty: remaining } });
      }

      
      //updating positions
      const existingPos = await PositionsModel.findOne({ name });
      if (existingPos) {
        const remaining = existingPos.qty - qty;
        if (remaining <= 0) {
          await PositionsModel.deleteOne({ name });
        } else {
          await PositionsModel.updateOne({ name }, { $set: { qty: remaining, price } });
        }
      }

    }

    res.json({ message: "Order placed & holdings updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


mongoose.connect(uri)
  .then(() => {
    console.log("DB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("DB connection error:", err);
  });