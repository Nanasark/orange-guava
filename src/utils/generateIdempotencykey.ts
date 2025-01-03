import { createHash } from "crypto";

interface Props {
  walletAddress: string;
  network: string;
  reference: string;
  phoneNumber: string;
  amount: string;
}

export default function generateIdempotencyKey({
  walletAddress,
  network,
  reference,
  phoneNumber,
  amount,
}: Props) {
  // Concatenate inputs into a single string
  const data = `${walletAddress}-${network}-${reference}-${phoneNumber}-${amount}`;

  // Hash the data to create a deterministic key
  const hash = createHash("sha256").update(data).digest("hex");

  // Return the first 6 characters of the wallet address + the hash
  return `${walletAddress.slice(0, 6)}-${hash}`;
}

// Example usage
// const walletAddress = "0x8f8b93b04a5d3e61c7f4b6c8123da45a72a2b9f7";
// const network = "MTN";
// const reference = "ref123456";
// const fullName = "John Doe Smith";

// const idempotencyKey = generateIdempotencyKey(walletAddress, network, reference, fullName);
// console.log("Generated Idempotency Key:", idempotencyKey);
