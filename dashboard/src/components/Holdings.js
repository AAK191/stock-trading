import React from "react";

import axios from "axios";
import { useEffect, useState, useContext, useCallback } from "react";
import GeneralContext from "../context/GeneralContext";
import { VerticalGraph } from "./Graphs/VerticalGraph";
import { useFinnhubSocket } from "./hooks/useFinnhubSocket";


const Holdings = () => {
  const [allHoldings, setHoldings] = useState([]);
  const { refreshFlag } = useContext(GeneralContext);
  const [livePrices, setLivePrices] = useState({});

  const holdingSymbols = allHoldings.map((h) => `NSE:${h.name}`);

  useFinnhubSocket(holdingSymbols, useCallback((updates) => {
    setLivePrices((prev) => ({ ...prev, ...updates }));
  }, []));

  useEffect(() => {
    axios.get("http://localhost:3002/allHoldings").then((res) => {
      console.log(res.data);
      setHoldings(res.data);
    });
  }, [refreshFlag]);

  const labels = allHoldings.map((s) => s.name);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => livePrices[`NSE:${stock.name}`] ?? stock.price),
        backgroundColor: "rgba(255,99,132,0.5)",
      },
    ],
  };


  //calctn of profit and loss
  const totalInvestment = allHoldings.reduce(
    (sum, s) => sum + s.avg * s.qty, 0
  );

  const currentValue = allHoldings.reduce((sum, s) => {
    const lp = livePrices[`NSE:${s.name}`] ?? s.price;
    return sum + lp * s.qty;
  }, 0);

  const totalPnl = currentValue - totalInvestment;
  const pnlPct = totalInvestment > 0 ? (totalPnl / totalInvestment) * 100 : 0;
  const pnlClass = totalPnl >= 0 ? "profit" : "loss";


  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&amp;L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
            </tr>
          </thead>

          <tbody>
            {allHoldings.map((stock, index) => {

              const livePrice = livePrices[`NSE:${stock.name}`] ?? stock.price;
              const safeLivePrice =
                typeof livePrice === "number" ? livePrice : stock.price;
 
              const avgCost = typeof stock.avg === "number" ? stock.avg : 0;
              const currValue = safeLivePrice * stock.qty;
              const pnl = currValue - avgCost * stock.qty;
              const isProfit = pnl >= 0;
              const profClass = isProfit ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";
              
              return (
                <tr key={index}>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{avgCost.toFixed(2)}</td>
                  <td>{safeLivePrice.toFixed(2)}</td>
                  <td>{currValue.toFixed(2)}</td>
                  <td className={profClass}>
                    {pnl.toFixed(2)}
                  </td>
                  <td className={profClass}>
                    {stock.net}
                  </td>
                  <td className={dayClass}>
                    {stock.day}
                  </td>
                </tr>
              );

            })}
          </tbody>
        </table>
      </div>


      <div className="row">
        <div className="col">
          <h5>
            {totalInvestment.toFixed(2).split(".")[0]}
            <span>.{totalInvestment.toFixed(2).split(".")[1]}</span>
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>
            {currentValue.toFixed(2).split(".")[0]}
            <span>.{currentValue.toFixed(2).split(".")[1]}</span>
          </h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5 className={pnlClass}>
            {totalPnl.toFixed(2)} ({pnlPct >= 0 ? "+" : ""}
            {pnlPct.toFixed(2)}%)
          </h5>
          <p>P&amp;L</p>
        </div>
      </div>

      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;