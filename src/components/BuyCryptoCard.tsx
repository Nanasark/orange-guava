import { useEffect, useState } from "react";
import Link from "next/link";
import { FaMoneyBillWave, FaNetworkWired } from "react-icons/fa";
import { supabase } from "@/utils/supabase-server";
import { toUSDC } from "@/utils/conversions";
import {useChain} from "@/context/ChainProvider"

interface BuyCryptoCardProps {
  merchant: {
    isRegistered: boolean;
    stakedBalance: string;
    rewardBalance: string;
    merchantAddress: string;
  };
}

export default function BuyCryptoCard({ merchant }: BuyCryptoCardProps) {
  const {
    selectedChainSymbol,
    selectedChain,
    selectedChainId,
    contractAddress,
    usdcAddress,
    updateChain,
  } = useChain();

  const [merchantInfo, setMerchantInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Prevent fetching if merchantAddress or selectedChainSymbol is missing
    if (!merchant?.merchantAddress || !selectedChainSymbol) return;

    async function fetchMerchantData() {
      try {
        // Fetch data from the API
        const response = await fetch(
          `/api/merchant/details/${merchant.merchantAddress}`
        );

        // Log the response for debugging
        console.log("API response:", response);

        // Handle non-OK HTTP responses
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Log the data for debugging
        console.log("Merchant data fetched:", data);

        if (data.error) {
          throw new Error(data.error);
        }

        // Update state with fetched merchant info
        setMerchantInfo(data.merchant);
      } catch (error) {
        console.error("Error fetching merchant or network data:", error);
      } finally {
        // Ensure loading is set to false regardless of success or failure
        setLoading(false);
      }
    }

    fetchMerchantData();
  }, [merchant?.merchantAddress, selectedChainSymbol]); // Add merchant.merchantAddress and selectedChainSymbol as dependencies

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!merchant) {
    return <div>No merchant data found.</div>;
  }

  return (
    <Link href={`/merchant/${merchant.merchantAddress}`}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-blue-200">
        {/* Merchant Name */}
        <h2 className="text-xl font-semibold text-blue-600 mb-4">
          {merchantInfo.businessName}
        </h2>

        {/* Available Crypto */}
        <div className="flex items-center text-lg text-gray-700 mb-2">
          <FaMoneyBillWave className="mr-2 text-blue-500" />
          <span className="font-medium">Available Crypto:</span>
          <span className="ml-2">{merchant.stakedBalance} USDC</span>
        </div>

        {/* Enabled Networks */}

        {/* Merchant Details */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Contact:</span>{" "}
            {merchantInfo.firstName} {merchantInfo.lastName}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Phone:</span>{" "}
            {merchantInfo.phoneNumber}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-4">
          <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-2 py-1 rounded">
            Buy Crypto
          </span>
        </div>
      </div>
    </Link>
  );
}
