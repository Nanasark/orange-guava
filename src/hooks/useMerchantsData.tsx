// src/hooks/useMerchantsData.tsx
import { useState, useEffect } from "react";
import { useReadContract } from "thirdweb/react";
import { contract } from "@/app/contract";
import { toEther } from "thirdweb";
import { toUSDC } from "@/utils/conversions";

interface Merchant {
  isRegistered: boolean;
  stakedBalance: bigint; // Raw value from smart contract (typically in wei)
  rewardBalance: bigint; // Raw value from smart contract (typically in wei)
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
      const formattedMerchants = merchants.map((merchant: Merchant) => ({
        isRegistered: merchant.isRegistered,
        stakedBalance: toUSDC(merchant.stakedBalance), 
        rewardBalance: toUSDC(merchant.rewardBalance),
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
