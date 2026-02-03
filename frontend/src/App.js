import React, { useState, useEffect } from "react";
import { initConnection, listenToEvents } from "./blockchain/provider";
import CoinFlip from "./games/CoinFlip.js";

function App() {
  const [account, setAccount] = useState(null);
  const [casino, setCasino] = useState(null);

  useEffect(() => {
    const start = async () => {
      const { account, casinoContract } = await initConnection();
      setAccount(account);
      setCasino(casinoContract);
      
      // Listen for the "Shout" from Solidity
      listenToEvents(casinoContract, (player, won) => {
        alert(won ? "You won LOYAL tokens!" : "Try again!");
      });
    };
    start();
  }, []);

  return (
    <div className="App">
      <h1>Web3 Casino</h1>
      {account ? <CoinFlip casino={casino} /> : <button onClick={initConnection}>Connect</button>}
    </div>
  );
}
export default App;