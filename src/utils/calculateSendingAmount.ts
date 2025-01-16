const Decimal = require('decimal.js'); // Use Decimal.js for precise calculations

export function calculateSendingAmount(cediAmount:any, pricePerToken:any) {
  // Parse and validate the input
  if (isNaN(cediAmount) || parseFloat(cediAmount) < 0.05) {
    throw new Error("Invalid cedi amount");
  }

  // Use Decimal.js for accurate calculations
  const amount = new Decimal(cediAmount).div(pricePerToken); // Divide cediAmount by pricePerToken
  const sendingAmount = BigInt(amount.times(1e6).toFixed(0)); // Multiply by 1e6 and convert to BigInt

  return sendingAmount;
}