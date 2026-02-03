import { ethers } from "ethers";
import contractAddress from "../contracts/contract-address.json";
import casinoABI from "../contracts/Casino.json"; 

export const placeBet = async (amountInEth) => {
  if (!window.ethereum) return;

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const casinoContract = new ethers.Contract(contractAddress.Casino, casinoABI.abi || casinoABI, signer);

  try {
    // Convert ETH string (e.g. "0.1") to Wei
    const wager = ethers.parseEther(amountInEth);

    // This triggers the MetaMask popup to spend Testnet ETH
    const tx = await casinoContract.playGame(wager, { value: wager });
    
    console.log("Transaction sent! Waiting...");
    await tx.wait(); // Wait for block confirmation
    
    return true;
  } catch (error) {
    console.error("User denied or transaction failed", error);
    return false;
  }
};