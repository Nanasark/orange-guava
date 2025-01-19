import { useEffect, useState } from "react";
import { FaExchangeAlt, FaCoins } from "react-icons/fa";
import {
  useActiveAccount,
  useSendTransaction,
  useContractEvents,
  useReadContract,
} from "thirdweb/react";
import {
  prepareContractCall,
  sendTransaction,
  PreparedTransaction,
} from "thirdweb";
import { approve, allowance } from "thirdweb/extensions/erc20";
import { contract, tokenContract } from "@/app/contract";
import { Account } from "thirdweb/wallets";
import { baseUrl } from "@/app/strings";
import { formatPhoneNumber } from "../utils/phoneNumber";
import { toUSDC, toUwei } from "@/utils/conversions";
import getChannel from "@/utils/getChannel";
import getPayoutId from "@/utils/generatePayoutId";

interface SellCryptoFormProps {
  merchantAddress: string;
}

interface EventArgs {
  user: string;
  merchant: string;
  amount: bigint; // Since amount is a big integer
  fee: bigint;
  merchantReward: bigint;
  ownerReward: bigint;
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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [provider, setProvider] = useState("");
  const [amount, setAmount] = useState("");
  const [allowed, setAllowed] = useState<number | null>(null); // Null to indicate loading state
  const [allowanceLoading, setAllowanceLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reference, setReference] = useState("");
  const [error, setError] = useState<string | null>(null);
  const {
    mutateAsync: sendTx,
    error: sellError,
    status: sellStatus,
  } = useSendTransaction();
  const buyingAmount = Number(amount) * 5;
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
        const allowedValue = toUSDC(result);
        setAllowed(Number(allowedValue));
      } catch (error) {
        console.error("Failed to fetch allowance:", error);
        setAllowed(0); // Handle errors by setting to 0
      } finally {
        setAllowanceLoading(false); // End loading
      }
    };

    fetchAllowance();
  }, [address, tokenContract]);

  const payoutId = getPayoutId({
    amount,
    network: provider,
    merchantAddress,
    reference,
    phoneNumber,
    payerAddress: address,
  });
  const formatedNumber = formatPhoneNumber(phoneNumber);

  const { data } = useReadContract({
    contract,
    method: "getLatestCryptoToFiatTransaction",
    params: [address, merchantAddress, toUwei(`${amount}`)],
  });

  const payout = "payout";
  const channel = getChannel(provider, payout);
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
          amountWei: toUwei(amount),
        }) as PreparedTransaction;

        await sendTransaction({ transaction: approval, account: Account });
      } else {
        const transaction = (await prepareContractCall({
          contract,
          method: "buyFiatWithCrypto",
          params: [Account.address, toUwei(amount), merchantAddress],
        })) as PreparedTransaction;

        await sendTx(transaction);

        if (sellStatus === "success" || sellError === null) {
          try {
            // let cediAmount;
            // if (data) {
            //   cediAmount = Number(toUSDC(data.amount)) * 5;
            // }

            const response = fetch("/api/momo-transaction/send-fiat", {
              method: "POST",
              body: JSON.stringify({
                channel,
                receiver: phoneNumber,
                amount: buyingAmount,
                payoutId,
                reference,
                sublistid: "",
                currency: "GHS",
                cdata: data,
                callbackUrl: `${baseUrl}/api/momo-status/payout-status`,
                merchantAddress,
                payerAddress: address,
              }),
            });
          } catch (error) {}
        }
      }

      // console.log(allEventArgs);
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
            Amount (USDC)
          </label>
          <div className="relative">
            <input
              type="number"
              id="sellAmount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 pr-10 border text-blue-800 border-blue-200 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              placeholder="Enter USDC amount"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaCoins className="text-gray-400" />
            </div>
          </div>
        </div>
        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-800 mb-2"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-2 border text-blue-800 border-blue-200 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
            placeholder="Enter phone number"
            required
          />
        </div>
        <div>
          <label
            htmlFor="reference"
            className="block text-sm font-medium text-gray-800 mb-2"
          >
            Reference
          </label>
          <input
            type="text"
            id="reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="w-full p-2 border text-blue-800 border-blue-200 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
            placeholder="Enter Reference"
            required
          />
        </div>
        <div>
          <label
            htmlFor="provider"
            className="block text-sm font-medium  text-gray-800 mb-2"
          >
            Provider
          </label>
          <select
            id="provider"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="w-full p-2 border text-blue-800 border-blue-200 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
            required
          >
            <option className="text-blue-900" value="">
              Select Network Provider
            </option>
            <option className="text-blue-900" value="MTN">
              MTN
            </option>
            <option className="text-blue-900" value="AIRTEL">
              AIRTEL
            </option>
            <option className="text-blue-900" value="VODAFONE">
              VODAFONE
            </option>
            <option className="text-blue-900" value="TIGO">
              TIGO
            </option>
          </select>
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
