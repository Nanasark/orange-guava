"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
import BuyCryptoForm from "../../../components/BuyCryptoForm";
import SellCryptoForm from "../../../components/SellCryptoForm";

export default function MerchantDetails() {
  const { address: merchantId } = useParams(); // Get merchantId from the URL params
  const [merchant, setMerchant] = useState<any>(null);
  const [networks, setNetworks] = useState<any[]>([]);
  const [isBuyCrypto, setIsBuyCrypto] = useState(true);
  const [loading, setLoading] = useState(true);

  // Fetch merchant data and networks from the API
  useEffect(() => {
    async function fetchMerchantData() {
      try {
        // Fetch merchant data from the API
        const response = await fetch(`/api/merchant/details/${merchantId}`);
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setMerchant(data.merchant);
        setNetworks(data.networks);
      } catch (error) {
        console.error("Error fetching merchant or network data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMerchantData();
  }, [merchantId]); // Run when merchantId changes

  if (loading) {
    return <div>Loading...</div>; // Display loading state while fetching data
  }

  if (!merchant) {
    return <div>No merchant data found.</div>; // Display error if merchant data is not found
  }

  // Filter enabled networks
  const enabledNetworks = networks.filter((network) => network.enabled);

  return (
    <div className="min-h-screen bg-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 border border-blue-200">
          <h1 className="text-3xl font-bold text-blue-600 mb-8">
            {merchant.business_name}
          </h1>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold text-blue-600 mb-4">
                Merchant Information
              </h2>
              <p className="mb-2">
                <span className="font-medium">Description:</span>{" "}
                {merchant.description}
              </p>
              <p className="mb-2">
                <span className="font-medium">Email:</span> {merchant.email}
              </p>
              <p className="mb-2">
                <span className="font-medium">Phone:</span>{" "}
                {merchant.phone_number}
              </p>

              <p className="mb-2">
                <span className="font-medium">Available Crypto:</span>{" "}
                {merchant.available_crypto} USDT
              </p>
              <p className="mb-2">
                <span className="font-medium">Available Fiat:</span> $
                {merchant.available_fiat}
              </p>
              <p>
                <span className="font-medium">Total Transactions:</span>{" "}
                {merchant.total_transactions}
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-blue-600">
                  Transaction Form
                </h2>
                <button
                  className="flex items-center text-blue-600 hover:text-blue-700"
                  onClick={() => setIsBuyCrypto(!isBuyCrypto)}
                >
                  {isBuyCrypto ? (
                    <FaToggleOn className="mr-2 text-2xl" />
                  ) : (
                    <FaToggleOff className="mr-2 text-2xl" />
                  )}
                  {isBuyCrypto ? "Buy Crypto" : "Sell Crypto"}
                </button>
              </div>
              {isBuyCrypto ? (
                <BuyCryptoForm merchantId={merchant.id} />
              ) : (
                <SellCryptoForm
                  merchantId={merchant.id}
                  availableFiat={merchant.available_fiat}
                />
              )}
            </div>
          </div>

          {/* Networks Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-blue-600 mb-4">
              Enabled Networks
            </h3>
            {enabledNetworks.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700">
                {enabledNetworks.map((network) => (
                  <li key={network.id} className="text-sm">
                    {network.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">No enabled networks.</p>
            )}
          </div>

          <div className="text-center mt-8">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
