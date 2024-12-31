export const formatPhoneNumber = (number: string) => {
  // Remove any non-digit characters except '+'
  const cleanNumber = number.replace(/[^\\d+]/g, "");

  // Check if the number starts with '+233'
  if (cleanNumber.startsWith("+233")) {
    return cleanNumber; // Already in correct format
  } else if (cleanNumber.startsWith("0")) {
    return "+233" + cleanNumber.slice(1); // Convert local format to international
  } else if (cleanNumber.startsWith("233")) {
    return "+233" + cleanNumber.slice(3); // Ensure it has the '+' prefix
  } else {
    // If it doesn't match the expected formats, return the original input
    return number;
  }
};
