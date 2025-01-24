"use client";

import React from "react";
import { useChain } from "@/context/ChainProvider";

export default function SelectChain() {
  const { selectedChain, selectedChainId, contractAddress, usdcAddress, updateChain } = useChain();

  const handleChainChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newChain = event.target.value;
    updateChain(newChain);
  };

  return (
    <div>
      <div className="flex items-center space-x-2">
        <label htmlFor="chainSelect" className="text-sm font-medium text-white">
          Chain:
        </label>
        <select
          id="chainSelect"
          value={selectedChain}
          onChange={handleChainChange}
          className="bg-blue-400 text-white text-sm rounded-md border-none px-3 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:bg-blue-700 transition-colors duration-200 appearance-none cursor-pointer"
        >
          <option value="CELO">CELO</option>
          <option value="POLYGON">POLYGON</option>
          <option value="SCROLL">SCROLL</option>
        </select>
      </div>
      <div className="mt-4">

        
        <p>Selected Chain: {selectedChain}</p>
        <p>Chain ID: {selectedChainId}</p>
        <p>Contract Address: {contractAddress}</p>
        <p>USDC Address: {usdcAddress}</p>
      </div>
    </div>
  );
}
