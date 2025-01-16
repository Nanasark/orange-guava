export function calculateSendingAmount(cediAmount: any, pricePerToken: any) {
  // Parse and validate the input
  const parsedCediAmount = parseFloat(cediAmount);

  if (isNaN(parsedCediAmount) || parsedCediAmount < 0.05) {
    throw new Error("Invalid cedi amount");
  }

  // Calculate the amount in tokens and scale it by 1e6
  const scaledAmount = parsedCediAmount * 1e6; // Convert to micro-units (to handle precision)

  // Divide by the pricePerToken and round once
  const amountInTokens = Math.round(scaledAmount / pricePerToken); // Round once to get the final token amount

  // Convert the result into BigInt
  const sendingAmount = BigInt(amountInTokens);

  return sendingAmount;
}
