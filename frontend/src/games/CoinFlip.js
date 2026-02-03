import React, { useState } from 'react';
import { calculateOutcome } from './FairnessEngine.js';

const CoinFlip = ({ casino }) => {
  const play = async () => {
    // 1. Pay ETH to Contract
    const tx = await casino.placeBet({ value: ethers.parseEther("0.01") });
    await tx.wait();

    // 2. Local Animation / Calculation
    const serverSecret = "SERVER_SECRET_KEY"; // Usually comes from an API
    const result = calculateOutcome("user_seed", serverSecret);
    
    // 3. Send reveal to contract for verification and minting
    const verifyTx = await casino.verifyAndMint("user_seed", serverSecret);
    await verifyTx.wait();
  };

  return <button onClick={play}>Flip Coin (0.01 ETH)</button>;
};