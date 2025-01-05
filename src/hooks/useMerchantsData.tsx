import { useState, useEffect } from "react";
import { useReadContract } from "thirdweb/react";
import { contract } from "@/app/contract";
import { toUSDC } from "@/utils/conversions";

interface Merchant {
  isRegistered: boolean;
  stakedBalance: string; // Changed to string to match the output of toUSDC
  rewardBalance: string; // Changed to string to match the output of toUSDC
  merchantAddress: string;
}

export const useMerchantsData = () => {
  const [allMerchants, setAllMerchants] = useState<Merchant[]>([]);
  const {
    data: merchants,
    isLoading,
    error,
  } = useReadContract({
    contract,
    method: "getAllMerchants",
    params: [], // No parameters required
  });

  useEffect(() => {
    if (merchants && error === null) {
      const formattedMerchants = merchants.map((merchant: any) => ({
        isRegistered: merchant.isRegistered,
        stakedBalance: toUSDC(merchant.stakedBalance), // This converts to a string
        rewardBalance: toUSDC(merchant.rewardBalance), // This converts to a string
        merchantAddress: merchant.merchant, // Ensure this is correctly named
      }));
      setAllMerchants(formattedMerchants);
    }
  }, [merchants, error]);

  return {
    allMerchants,
    isLoading,
    error,
  };
};
