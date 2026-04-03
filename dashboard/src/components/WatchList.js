import React, { useState, useContext } from "react";
import { Tooltip, Grow } from "@mui/material";

import { watchlist } from "../data/data";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import MoreHoriz from '@mui/icons-material/MoreHorizOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';

import GeneralContext from "../context/GeneralContext";
import { DoughnoutChart } from "./Graphs/DoughnoutChart";

const labels = watchlist.map((stock) => stock.name); // ✅ move labels here too

const WatchList = () => {
  const [stocks, setStocks] = useState([]); // ✅ MOVED INSIDE the component

  const data = {
    labels,
    datasets: [
      {
        label: "Price",
        data: watchlist.map((stock) => stock.price),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search eg:infy, bse, nifty fut weekly, gold mcx"
          className="search"
        />
        <span className="counts"> {watchlist.length} / 50</span>
      </div>

      <ul className="list">
        {watchlist.map((stock, index) => (
          <WatchListItem stock={stock} key={index} />
        ))}
      </ul>

      <DoughnoutChart data={data} />
    </div>
  );
};

export default WatchList;

// ---- Keep these below the default export ----

const WatchListItem = ({ stock }) => {
  const [showWatchlistActions, setShowWatchlistActions] = useState(false);

  const handleMouseEnter = () => setShowWatchlistActions(true);
  const handleMouseLeave = () => setShowWatchlistActions(false);

  const WatchListActions = ({ uid }) => {
    const generalContext = useContext(GeneralContext);

    const handleBuyClick = () => generalContext.openBuyWindow(uid);
    const handleSellClick = () => generalContext.openSellWindow(uid);

    return (
      <span className="actions">
        <span>
          <Tooltip title="Buy (B)" placement="top" arrow TransitionComponent={Grow} onClick={handleBuyClick}>
            <button className="buy">Buy</button>
          </Tooltip>
        </span>
        <span>
          <Tooltip title="Sell (S)" placement="top" arrow TransitionComponent={Grow} onClick={handleSellClick}>
            <button className="sell">Sell</button>
          </Tooltip>
        </span>
        <span>
          <Tooltip title="Analytics (A)" placement="top" arrow TransitionComponent={Grow}>
            <button className="action"><BarChartOutlinedIcon className="icon" /></button>
          </Tooltip>
        </span>
        <span>
          <Tooltip title="More (M)" placement="top" arrow TransitionComponent={Grow}>
            <button className="btn"><MoreHoriz /></button>
          </Tooltip>
        </span>
      </span>
    );
  };

  return (
    <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
        <div className="itemInfo">
          <span className="percent">{stock.percent}</span>
          {stock.isDown
            ? <KeyboardArrowDownIcon className="down" />
            : <KeyboardArrowUpIcon className="up" />}
          <span className="price">{stock.price}</span>
        </div>
      </div>
      {showWatchlistActions && <WatchListActions uid={stock.name} />}
    </li>
  );
};