import React, { useState, useContext } from "react";
import GeneralContext from "../../context/GeneralContext";
import { placeOrder } from "../../services/orderService";
import { Link } from "react-router-dom";

const BuyActionWindow = ({ uid }) => {
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(0);

  const { closeBuyWindow, refreshHoldings } = useContext(GeneralContext);

  const handleBuyClick = async () => {
    if (!qty || !price) {
      return alert("Enter valid values");
    }

    try {
      await placeOrder({
        name: uid,
        qty,
        price,
        mode: "BUY",
      });

      refreshHoldings();
      closeBuyWindow();

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              onChange={(e) => setQty(Number(e.target.value))}
              value={qty}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹140.65</span>
        <div>
          <Link className="btn btn-blue" onClick={handleBuyClick}>
            Buy
          </Link>
          <Link className="btn btn-grey" onClick={closeBuyWindow}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;