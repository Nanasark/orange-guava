import { useEffect, useState } from "react";
import { FaExchangeAlt, FaCoins } from "react-icons/fa";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import {
  prepareContractCall,
  sendTransaction,
  toWei,
  PreparedTransaction,
  toEther,
} from "thirdweb";
import { approve, allowance } from "thirdweb/extensions/erc20";
import { contract, tokenContract } from "@/app/contract";
import { Account } from "thirdweb/wallets";

interface SellCryptoFormProps {
  merchantAddress: string;
}

export default function SellCryptoForm({
  merchantAddress,
}: SellCryptoFormProps) {
  const account = useActiveAccount();
  const address = account ? account.address : "";
  let Account: Account;
  if (account) {
    Account = account;
  }

  const { mutateAsync: sendTx } = useSendTransaction();
  const [amount, setAmount] = useState("");
  const [allowed, setAllowed] = useState<number | null>(null); // Null to indicate loading state
  const [allowanceLoading, setAllowanceLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Allowance
  useEffect(() => {
    const fetchAllowance = async () => {
      if (!address) return;

      setAllowanceLoading(true); // Start loading
      try {
        const result = await allowance({
          contract: tokenContract,
          owner: address,
          spender: contract.address,
        });
        const allowedValue = Number(toEther(result));
        setAllowed(allowedValue);
      } catch (error) {
        console.error("Failed to fetch allowance:", error);
        setAllowed(0); // Handle errors by setting to 0
      } finally {
        setAllowanceLoading(false); // End loading
      }
    };

    fetchAllowance();
  }, [address, tokenContract]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (allowanceLoading) return; // Prevent submission during allowance fetch
    setLoading(true);
    setError(null);

    try {
      if (allowed !== null && allowed < Number(amount)) {
        const approval = approve({
          contract: tokenContract,
          spender: contract.address,
          amount: amount,
        }) as PreparedTransaction;

        await sendTransaction({ transaction: approval, account: Account });
      } else {
        const transaction = (await prepareContractCall({
          contract,
          method: "buyFiatWithCrypto",
          params: [Account.address, toWei(amount), merchantAddress],
        })) as PreparedTransaction;

        await sendTx(transaction);
      }
    } catch (error) {
      setError("Transaction failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const feePercentage = 2; // Example fee percentage
  const fee = (Number(amount) * feePercentage) / 100;
  const totalAmount = Number(amount) + fee;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-blue-200">
      <h2 className="text-xl font-semibold text-blue-600 mb-4">Sell Crypto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="sellAmount"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Amount (USDT)
          </label>
          <div className="relative">
            <input
              type="number"
              id="sellAmount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 pr-10 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              placeholder="Enter USDT amount"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaCoins className="text-gray-400" />
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Fees:</span> ${fee.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Total Amount:</span> $
            {totalAmount.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Allowed:</span>{" "}
            {allowanceLoading
              ? "Loading..."
              : allowed !== null
              ? allowed
              : "N/A"}
          </p>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
          disabled={loading || allowanceLoading}
        >
          <FaExchangeAlt className="mr-2" />
          {loading
            ? "Processing..."
            : allowanceLoading
            ? "Fetching Allowance..."
            : allowed !== null && allowed < Number(amount)
            ? "Approve Sell Amount"
            : "Sell Crypto"}
        </button>
      </form>
    </div>
  );
}
