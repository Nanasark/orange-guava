import { createHash, randomBytes } from "crypto";

interface Props {
  merchantAddress: string;
  network: string;
  payerAddress: string;
  reference: string;
  phoneNumber: string;
  amount: string;
}

export default function getPayoutId({
  merchantAddress,
  network,
  reference,
  phoneNumber,
  amount,
  payerAddress,
}: Props) {
  // Generate a random salt to ensure uniqueness
  const randomValue = randomBytes(16).toString("hex"); // 16 bytes = 32-character hex string

  // Concatenate inputs into a single string with the random salt
  const data = `${merchantAddress}-${network}-${reference}-${phoneNumber}-${amount}-${randomValue}`;

  // Hash the data to create a unique key
  const hash = createHash("sha256").update(data).digest("hex");

  // Return the first 6 characters of the wallet address + the hash
  return `${payerAddress.slice(0, 6)}-${hash}`;
}
