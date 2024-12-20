import {
  prepareContractCall,
  PreparedTransaction,
  toEther,
  toWei,
} from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { contract } from "@/app/contract";
import { useState } from "react";
import { useReadContract } from "thirdweb/react";

export default function UpdatePrice() {
  const { mutate: sendTx, error: eRROR, status } = useSendTransaction();
  const [newPrice, setNewPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: rate, error } = useReadContract({
    contract: contract,
    method: "rate",
  });

  const rateInEther = rate ? toEther(rate) : "610";
  console.log(rateInEther, rate, error);

  const tokenPrice = toWei(`${newPrice}`);

  const updateToken = async () => {
    try {
      const transaction = (await prepareContractCall({
        contract: contract,
        method: "setPresaleRate",
        params: [tokenPrice],
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
    <div className="max-w-md mx-auto">
      <p className="mt-4 text-sm text-blue-600">
        Current Rate: 1 BNB gives user {rateInEther} tokens
      </p>
      <form className="space-y-4">
        <input
          type="number"
          placeholder="Enter new price"
          onChange={(e) => setNewPrice(Number(e.target.value))}
          className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
          onClick={updateToken}
        >
          {isLoading ? "Updating..." : "Update Price"}
        </button>
      </form>
      <p className="mt-4 text-sm text-blue-600">
        New rate: 1 BNB will now give users {newPrice.toString()}{" "}
        tokens
      </p>
    </div>
  );
}
