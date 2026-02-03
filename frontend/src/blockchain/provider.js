import { ethers } from "ethers";
import casinoAddress from "../../artifacts/contracts/contract-address.json";
import casinoABI from "../../artifacts/contracts/Casino.sol/Casino.json";
import tokenABI from "../../artifacts/contracts/LoyaltyToken.sol/LoyaltyToken.json";

// We store the provider/signer outside so we can reuse them
let provider;
let signer;

export const initConnection = async () => {
  if (window.ethereum) {
    try {
      // 1. Request accounts from MetaMask
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      
      // 2. Initialize Ethers provider and signer
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();

      // 3. Create Contract Instances
      const casinoContract = new ethers.Contract(
        casinoAddress.Address, 
        casinoABI.abi || casinoABI, // Handles different hardhat artifact formats
        signer
      );

      // We assume your Casino contract has a 'token' function to get the token address
      const tokenAddr = await casinoContract.token(); 
      const tokenContract = new ethers.Contract(tokenAddr, tokenABI.abi || tokenABI, signer);

      return { 
        account: accounts[0], 
        casinoContract, 
        tokenContract,
        signer 
      };
    } catch (error) {
      console.error("Connection failed:", error);
      return null;
    }
  } else {
    alert("Please install MetaMask!");
    return null;
  }
};

// Global listener for events so the UI updates automatically
export const listenToEvents = (contract, callback) => {
  contract.on("GameResolved", (player, won, amountMinted) => {
    callback(player, won, amountMinted);
  });
};