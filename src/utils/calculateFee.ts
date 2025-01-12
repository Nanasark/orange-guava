type FeeConfig = {
    fiatFee: number;
    exchangeRate: number;
}

export function calculateTotalAmount(amountInUSDC: number, feeConfig: FeeConfig) {

  const fiatFee = feeConfig.fiatFee;

 
  let cryptoFeeRate: number;

  if (amountInUSDC <= 500) {
    cryptoFeeRate = 2; // 2% for amounts <= 500 USDC
  } else if (amountInUSDC <= 1500) {
    cryptoFeeRate = 1.5; // 1.5% for amounts between 500 and 1500 USDC
  } else if (amountInUSDC <= 5000) {
    cryptoFeeRate = 1; // 1% for amounts between 1500 and 5000 USDC
  } else if (amountInUSDC <= 20000) {
    cryptoFeeRate = 0.7; // 0.7% for amounts between 5000 and 20000 USDC
  } else if (amountInUSDC <= 50000) {
    cryptoFeeRate = 0.5; // 0.5% for amounts between 20000 and 50000 USDC
  } else if (amountInUSDC <= 100000) {
    cryptoFeeRate = 0.4; // 0.4% for amounts between 50000 and 100000 USDC
  } else {
    cryptoFeeRate = 0.3; // 0.3% for amounts above 100000 USDC
  }

  // Calculate the crypto fee in USDC
  const cryptoFeeInUSDC = (amountInUSDC * cryptoFeeRate) / 100;

  // Convert the crypto fee to GHS
  const cryptoFeeInGHS = cryptoFeeInUSDC * feeConfig.exchangeRate;

  // Calculate the total fee (fiat + crypto fee)
  const totalFee = fiatFee + cryptoFeeInGHS;

  // Calculate total amount in GHS (with fiat fee)
  const totalAmountInGHS = amountInUSDC * feeConfig.exchangeRate + totalFee;

  // Calculate amount to be sent to the API (without fiat fee)
  const amountToSendInGHS =
    amountInUSDC * feeConfig.exchangeRate + cryptoFeeInGHS;

  return {
    totalAmountInGHS, // Display the total amount (with fiat fee)
    amountToSendInGHS, // Amount to send to API (without fiat fee)
    fiatFee, // The fiat fee in GHS
    cryptoFeeInGHS, // The crypto fee in GHS
  };
}

// Example usage:
const paymentAmountInUSDC = 3500; // User is buying 3500 USDC
const feeConfig: FeeConfig = {
  fiatFee: 0.5, // Fixed fiat fee of 0.5 GHS
  exchangeRate: 5, // 5 GHS per 1 USDC
};

const result = calculateTotalAmount(paymentAmountInUSDC, feeConfig);
console.log(
  `Total amount to be paid (including fees in GHS): ${result.totalAmountInGHS}`
);
console.log(
  `Amount to send to API (excluding fiat fee): ${result.amountToSendInGHS}`
);
console.log(`Fiat fee (GHS): ${result.fiatFee}`);
console.log(`Crypto fee (GHS): ${result.cryptoFeeInGHS}`);
