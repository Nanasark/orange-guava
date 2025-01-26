import { useState, useEffect } from "react";
import { useReadContract } from "thirdweb/react";
import { getContracts } from "@/app/contract";
import { toUSDC } from "@/utils/conversions";
import { useChain } from "@/context/ChainProvider";

interface Merchant {
  isRegistered: boolean;
  stakedBalance: string; // Changed to string to match the output of toUSDC
  rewardBalance: string; // Changed to string to match the output of toUSDC
  merchantAddress: string;
}

export const useMerchantsByAddress = (address: string) => {
  const {selectedChainSymbol}= useChain()
  const {contract} = getContracts(selectedChainSymbol) 
  const [merchant, setMerchant] = useState<Merchant>();
  const {
    data: merchantData,
    isLoading,
    error,
  } = useReadContract({
    contract,
    method: "getMerchantByAddress",
    params: [address], // No parameters required
  });

  useEffect(() => {
    if (merchantData && error === null) {
      const formattedMerchants = {
        isRegistered: merchantData.isRegistered,
        stakedBalance: toUSDC(merchantData.stakedBalance), // This converts to a string
        rewardBalance: toUSDC(merchantData.rewardBalance), // This converts to a string
        merchantAddress: merchantData.merchant, // Ensure this is correctly named
      };
      setMerchant(formattedMerchants);
    }
  }, [merchantData, error]);

  return {
    merchant,
    isLoading,
    error,
  };
};
