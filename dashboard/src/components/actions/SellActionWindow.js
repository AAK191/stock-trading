import React, { useState, useContext } from "react";
import GeneralContext from "../../context/GeneralContext";
import { placeOrder } from "../../services/orderService";

const SellActionWindow = ({ uid }) => {
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(0);

  const { closeSellWindow, refreshHoldings } = useContext(GeneralContext);

  const handleSell = async () => {
    if (!qty || !price) {
      return alert("Enter valid values");
    }

    try {
      await placeOrder({
        name: uid,
        qty,
        price,
        mode: "SELL",
      });

      refreshHoldings();
      closeSellWindow();

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container" id="sell-window">
      
      {/* Optional header */}
      <div className="header">
        <h3>Sell {uid}</h3>
      </div>

      <div className="regular-order">
        <div className="inputs">

          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
            />
          </fieldset>

          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              step="0.05"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </fieldset>

        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹140.65</span>

        <div>
          <button className="btn btn-blue" onClick={handleSell}>
            Sell
          </button>

          <button className="btn btn-grey" onClick={closeSellWindow}>
            Cancel
          </button>
        </div>
      </div>

    </div>
  );
};

export default SellActionWindow;