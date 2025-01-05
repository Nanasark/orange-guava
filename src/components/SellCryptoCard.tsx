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
          <span className="ml-2">${merchantInfo.available_fiat}</span>
        </div>

        {/* Enabled Networks */}
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Networks:</h3>
          {enabledNetworks.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
              {enabledNetworks.map((network) => (
                <li key={network.id} className="text-sm">
                  <FaNetworkWired className="inline mr-2 text-blue-500" />
                  {network.provider}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">No enabled networks.</p>
          )}
        </div>

        {/* Merchant Details */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Contact:</span>{" "}
            {merchantInfo.firstName} {merchantInfo.lastName}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Email:</span> {merchantInfo.email}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Phone:</span>{" "}
            {merchantInfo.phoneNumber}
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
