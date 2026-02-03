import CryptoJS from "crypto-js";

export const generateResult = (clientSeed, serverSeed, nonce) => {
  // Combine inputs into a single hash
  const hash = CryptoJS.HmacSHA256(`${clientSeed}:${nonce}`, serverSeed).toString();
  
  // Convert hash to a big number to determine the outcome
  const decimalValue = parseInt(hash.substring(0, 8), 16);
  
  return {
    hash,
    decimalValue,
    // For CoinFlip: 0 or 1
    flip: decimalValue % 2, 
    // For Slots: returns 3 numbers between 0-7
    slots: [
      (decimalValue % 8),
      (Math.floor(decimalValue / 8) % 8),
      (Math.floor(decimalValue / 64) % 8)
    ]
  };
};