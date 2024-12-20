import { prepareContractCall, PreparedTransaction, toWei } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { contract } from "@/app/contract";
import { useState } from "react";

export default function Withdraw() {
  const { mutate: sendTx, error: eRROR, status } = useSendTransaction();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tokens, setTokens] = useState<number>(0)

  const withdraw = async () => {
    try {
      const transaction = (await prepareContractCall({
        contract,
        method: "withdrawBNB",
        params: [],
      })) as PreparedTransaction;

      await sendTx(transaction);
      if (status === "pending") {
        setIsLoading(true);
      }
      if (status === "success") {
        setIsLoading(false);
        alert("Transaction successful");
      }
    } catch (error) {
      console.log(eRROR);
    }
  };

  const tokensInWei = toWei(`${tokens}`)

    const withdrawToken = async () => {
      try {
        const transaction = (await prepareContractCall({
          contract,
          method: "withdrawTokens",
          params: [tokensInWei],
        })) as PreparedTransaction;

        await sendTx(transaction);
        if (status === "pending") {
          setIsLoading(true);
        }
        if (status === "success") {
          setIsLoading(false);
          alert("Transaction successful");
        }
      } catch (error) {
        console.log(eRROR);
      }
    };

  return (
    <section className="flex flex-col gap-10 lg:flex-row w-full h-full pt-24">
      <div className="max-w-md mx-auto">
        <button
          type="button"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors duration-200 text-lg font-semibold"
          onClick={withdraw}
        >
          {isLoading ? "Withdrawing..." : "Withdraw All BNB"}
        </button>
        <p className="mt-4 text-sm text-blue-600">
          Withdraw all available BNB 
        </p>
      </div>
      <div className="max-w-md mx-auto">
        <form className="space-y-4">
          <input
            type="number"
            placeholder="Enter amount to withdraw"
            onChange={(e) => setTokens(Number(e.target.value))}
            className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
            onClick={withdrawToken}
          >
            {isLoading ? "Withdrawing..." : "Withdraw TNC Tokens"}
          </button>
        </form>
        <p className="mt-4 text-sm text-blue-600">
          Withdraw TNC tokens from smart contract
        </p>
      </div>
    </section>
  );
}
