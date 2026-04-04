import React from "react";

import axios from "axios";
import GeneralContext from "../context/GeneralContext";
import { useLivePrices } from "./hooks/useLivePrices";
import { useEffect, useState, useContext, useCallback } from "react";

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const { refreshFlag } = useContext(GeneralContext);

  const stockNames = positions.map((p) => p.name);
  const { prices: livePrices, loading } = useLivePrices(stockNames, 30000);



  useEffect(() => {
    axios.get("http://localhost:3002/allPositions").then((res) => {
      console.log(res.data);
      setPositions(res.data);
    });
  }, [refreshFlag]);

  const totalPnl = positions.reduce((sum, stock) => {
    const lp = livePrices[stock.name] ?? stock.price ?? 0;
    return sum + (lp - (stock.avg ?? 0)) * stock.qty;
  }, 0);

  const pnlClass = totalPnl >= 0 ? "profit" : "loss";

  return (
    <>
      <h3 className="title">Positions ({positions.length})
        {loading && (
          <span style={{ fontSize: "12px", color: "#888", marginLeft: "8px" }}>
            loading prices…
          </span>
        )}
      </h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&amp;L</th>
              <th>Chg.</th>
            </tr>
          </thead>

          <tbody>
            {positions.map((stock, index) => {
              const livePrice = livePrices[stock.name] ?? stock.price ?? 0;
              const avgCost = stock.avg ?? 0;
              const pnl = (livePrice - avgCost) * stock.qty;
              const isProfit = pnl >= 0;
              const profClass = isProfit ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={index}>
                  <td>{stock.product}</td>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{avgCost.toFixed(2)}</td>
                  <td>
                    <span style={{ color: livePrices[stock.name] ? "#4caf50" : "inherit" }}>
                      {livePrice.toFixed(2)}
                    </span>
                  </td>
                  <td className={profClass}>
                    {pnl.toFixed(2)}
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


      {positions.length > 0 && (
        <div className="row">
          <div className="col">
            <h5 className={pnlClass}>
              {totalPnl >= 0 ? "+" : ""}
              {totalPnl.toFixed(2)}
            </h5>
            <p>Total P&amp;L</p>
          </div>
        </div>
      )}

    </>
  );
};

export default Positions;