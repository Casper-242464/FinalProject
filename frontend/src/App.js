import React, { useState, useEffect } from "react";
import { initConnection, listenToEvents } from "./blockchain/provider";
import CoinFlip from "./games/CoinFlip.js";

function App() {
  const [account, setAccount] = useState(null);
  const [casino, setCasino] = useState(null);

  const handleConnect = async () => {
    const result = await initConnection();
    if (result) {
      setAccount(result.account);
      setCasino(result.casinoContract);
      listenToEvents(result.casinoContract, (player, won) => {
        alert(won ? "You won LOYAL tokens!" : "Try again!");
      });
    }
  };

  return (
    <div className="App">
      <h1>Web3 Casino</h1>
      {account ? <CoinFlip casino={casino} /> : <button onClick={handleConnect}>Connect</button>}
    </div>
  );
}
export default App;