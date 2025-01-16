import { useEffect, useState } from "react";
import Link from "next/link";
import { FaDollarSign, FaNetworkWired } from "react-icons/fa";
import { supabase } from "@/utils/supabase-server";

interface SellCryptoCardProps {
  merchant: {
    isRegistered: boolean;
    stakedBalance: string;
    rewardBalance: string;
    merchantAddress: string;
  };
}

export default function SellCryptoCard({ merchant }: SellCryptoCardProps) {
  const [merchantInfo, setMerchantInfo] = useState<any>(null);
  const [networks, setNetworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch merchant details and networks data when the component mounts
  useEffect(() => {
    async function fetchMerchantData() {
      try {
        // Fetch merchant data from the API
        const response = await fetch(
          `/api/merchant/details/${merchant.merchantAddress}`
        );
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setMerchantInfo(data.merchant);
        setNetworks(data.networks);
      } catch (error) {
        console.error("Error fetching merchant or network data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMerchantData();
  }, [merchant.merchantAddress]); // Run when merchantId changes

  if (loading) {
    return <div>Loading...</div>; // Display loading state while fetching data
  }

  if (!merchant.merchantAddress) {
    return <div>No merchant data found.</div>; // Display error if merchant data is not found
  }

  // Filter enabled networks
  const enabledNetworks = networks.filter((network) => network.enabled);

  return (
    <Link href={`/merchant/${merchant.merchantAddress}`}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-blue-200">
        {/* Merchant Name */}
        <h2 className="text-xl font-semibold text-blue-600 mb-4">
          {merchantInfo.businessName}
        </h2>

        {/* Available Fiat */}
        <div className="flex items-center text-lg text-gray-700 mb-2">
          <FaDollarSign className="mr-2 text-green-500" />
          <span className="font-medium">Available Fiat:</span>
          <span className="ml-2">GHS {merchantInfo.balance}</span>
        </div>

        {/* Merchant Details */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Contact:</span>{" "}
            {merchantInfo.firstName} {merchantInfo.lastName}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-4">
          <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-2 py-1 rounded">
            Sell Crypto
          </span>
        </div>
      </div>
    </Link>
  );
}
