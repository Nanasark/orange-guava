export const formatPhoneNumber = (number: string) => {
  // Remove any non-digit characters
  const cleanNumber = number.replace(/\D/g, "");

  // Check if the number starts with '0' or '+233'
  if (cleanNumber.startsWith("0")) {
    return "233" + cleanNumber.slice(1);
  } else if (cleanNumber.startsWith("233")) {
    return cleanNumber;
  } else {
    // If it doesn't match the expected formats, return the original input
    return number;
  }
};