// src/hooks/useMerchantsData.tsx
import { useState, useEffect } from "react";
import { useReadContract } from "thirdweb/react";
import { contract } from "@/app/contract";
import { toEther } from "thirdweb";

interface Merchant {
  isRegistered: boolean;
  stakedBalance: string; // Raw value from smart contract (typically in wei)
  rewardBalance: string; // Raw value from smart contract (typically in wei)
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
        stakedBalance: toEther(merchant.stakedBalance), // Assuming 18 decimals for token
        rewardBalance: toEther(merchant.rewardBalance), // Assuming 18 decimals for token
        merchantAddress: merchant.merchant,
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
