import React, { useState } from "react";
import BuyActionWindow from "../components/actions/BuyActionWindow";
import SellActionWindow from "../components/actions/SellActionWindow";


const GeneralContext = React.createContext({
  openBuyWindow: () => {},
  closeBuyWindow: () => {},
  openSellWindow: () => {},
  closeSellWindow: () => {},
  refreshHoldings: () => {},
  refreshFlag: false,
});

export const GeneralContextProvider = ({ children }) => {
  const [buyOpen, setBuyOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);
  const [uid, setUid] = useState("");
  const [refreshFlag, setRefreshFlag] = useState(false);

  const refreshHoldings = () => setRefreshFlag(prev => !prev);

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: (id) => { setUid(id); setBuyOpen(true); },
        closeBuyWindow: () => setBuyOpen(false),

        openSellWindow: (id) => { setUid(id); setSellOpen(true); },
        closeSellWindow: () => setSellOpen(false),

        refreshHoldings,
        refreshFlag,
      }}
    >
      {children}

      {buyOpen && <BuyActionWindow uid={uid} />}
      {sellOpen && <SellActionWindow uid={uid} />}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;