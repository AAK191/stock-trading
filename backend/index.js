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

app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

//---finnhub proxy endpoints----

app.get('/api/search', async (req, res) => {
  const { q } = req.query;
  if (!q || !q.trim()) return res.json({ result: [] });
 
  try {
    const url = `https://finnhub.io/api/v1/search?q=${encodeURIComponent(q)}&exchange=NSE&token=${FINNHUB_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data); // { count, result: [{ description, displaySymbol, symbol, type }] }
  } catch (err) {
    console.error('Finnhub search error:', err);
    res.status(500).json({ error: 'Search failed', result: [] });
  }
});

app.get('/api/quote', async (req, res) => {
  const { symbol } = req.query;
  if (!symbol) return res.status(400).json({ error: 'symbol is required' });
 
  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${FINNHUB_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Finnhub quote error:', err);
    res.status(500).json({ error: 'Quote fetch failed' });
  }
})



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

      //-- update position for intraday tracking
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
        if (remaining <= 0) {
          await HoldingsModel.deleteOne({ name });
        } else {
          await HoldingsModel.updateOne({ name }, { $set: { qty: remaining } });
        }
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