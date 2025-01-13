import { createHash } from "crypto";

interface Props {
  receiverAddress: string;
  merchantAddress: string;
  title: string;
}

export default function generateInvoiceId({
  receiverAddress,
  merchantAddress,
  title,
}: Props) {
  // Get the current timestamp
  const timestamp = Date.now();

  // Concatenate inputs into a single string
  const data = `${receiverAddress}-${merchantAddress}-${title}-${timestamp}`;

  // Hash the data to create a deterministic key
  const hash = createHash("sha256").update(data).digest("hex");

  // Return the first 6 characters of the wallet address + the hash
  return `${receiverAddress.slice(0, 6)}-${hash}`;
}

// Example usage
// const walletAddress = "0x8f8b93b04a5d3e61c7f4b6c8123da45a72a2b9f7";
// const receiverAddress = "0x1234567890abcdef1234567890abcdef12345678";
// const merchantAddress = "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd";
// const title = "Invoice Title";
// const network = "MTN";
// const reference = "ref123456";
// const phoneNumber = "1234567890";
// const amount = "100.00";

// const invoiceId = generateInvoiceId({
//   walletAddress,
//   receiverAddress,
//   merchantAddress,
//   title,
//   network,
//   reference,
//   phoneNumber,
//   amount,
// });
// console.log("Generated Invoice ID:", invoiceId);
