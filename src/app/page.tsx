"use client";

import { useState } from "react";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
import BuyCryptoCard from "../components/BuyCryptoCard";
import SellCryptoCard from "../components/SellCryptoCard";
import Link from "next/link";
import { contract } from "./contract";
import { useReadContract } from "thirdweb/react";
import { useMerchantsData } from "@/hooks/useMerchantsData";
  import { useEffect } from "react";
import { useRouter } from "next/router";
import {useChain} from "@/context/ChainProvider"

export default function Dashboard() {
  const [isBuyCrypto, setIsBuyCrypto] = useState(true);
    const {  selectedChainSymbol,selectedChain, selectedChainId, contractAddress, usdcAddress, updateChain } = useChain();

  const { allMerchants, isLoading, error } = useMerchantsData();
  const router = useRouter();

  useEffect(() => {
    if (selectedChainSymbol) {
      // Option 1: Reload the page while maintaining the query parameters
      router.replace(router.asPath);
      
      // Option 2: Full page reload (not recommended for SPA)
      // window.location.reload();
    }
  }, [selectedChainSymbol, router]);

  return (
    <div>
      <p>Selected Chain: {selectedChainSymbol}</p>
      {/* Your other component logic */}
    </div>
  );
}

export default YourComponent;


  // Handle loading, error, and display of merchants
  const renderMerchants = () => {
    if (isLoading) {
      return <div>Loading merchants...</div>;
    }
    if (error) {
      return <div>Error: {error.message}</div>;
    }
    if (allMerchants.length === 0) {
      return <div>No merchants available.</div>;
    }
  };
  console.log(allMerchants[0]);
  console.log(allMerchants.length);
  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">
            BuyCryptoPlatform
          </h1>
          <div className="flex items-center space-x-4">
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
            <Link
              href="/profile"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              My Profile
            </Link>
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Register
            </Link>
          </div>
        </div>

        {isLoading ? (
          <p className="text-center text-blue-500">Loading merchants...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error loading merchants</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allMerchants.map((merchant, index) =>
              isBuyCrypto ? (
                <BuyCryptoCard key={index} merchant={merchant} />
              ) : (
                <SellCryptoCard key={index} merchant={merchant} />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
