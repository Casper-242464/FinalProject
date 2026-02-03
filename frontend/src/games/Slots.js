import React, { useState } from 'react';
import { generateResult } from './FairnessEngine.js';
import { placeBet, resolveGame } from '../blockchain/casinoActions.js';
import '../public/css/main.css';

const Symbols = ["🍒", "🍋", "🍊", "🔔", "⭐", "🍇", "💎", "7️⃣"];

const Slots = ({ casino }) => {
  const [reels, setReels] = useState([0, 0, 0]);
  const [spinning, setSpinning] = useState(false);
  const [clientSeed, setClientSeed] = useState("lucky-spin-777");

  const spin = async () => {
    try {
      // 1. On-Chain: Pay for the spin
      const success = await placeBet("0.02"); // Example 0.02 ETH cost
      if (!success) return;

      setSpinning(true);
      const serverSecret = "SERVER_SECRET_UNREVEALED"; // Usually from backend API

      // 2. Off-Chain: Generate Provably Fair Result
      // We use the FairnessEngine to get 3 numbers between 0-7
      setTimeout(async () => {
        const outcome = generateResult(clientSeed, serverSecret, Date.now());
        setReels(outcome.slots);
        setSpinning(false);

        // 3. On-Chain: Verify result and Mint LoyaltyTokens if they won
        await resolveGame(clientSeed, serverSecret);
      }, 2000);
    } catch (err) {
      console.error(err);
      setSpinning(false);
    }
  };

  return (
    <div className="game-card slot-machine">
      <h2>Provable Slots</h2>
      <div className="reels-container">
        {reels.map((symbolIndex, i) => (
          <div key={i} className={`reel ${spinning ? 'spinning-reel' : ''}`}>
            {Symbols[symbolIndex]}
          </div>
        ))}
      </div>
      <input 
        type="text" 
        value={clientSeed} 
        onChange={(e) => setClientSeed(e.target.value)} 
      />
      <button onClick={spin} disabled={spinning}>
        {spinning ? "Spinning..." : "Pull Lever"}
      </button>
    </div>
  );
};

export default Slots;