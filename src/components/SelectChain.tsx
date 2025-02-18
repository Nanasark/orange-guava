"use client";

import React from "react";
import { useChain } from "@/context/ChainProvider";
import Cookies from "js-cookie";

export default function SelectChain() {
  const { selectedChainSymbol, ContractAddress, USDCAddress, updateChain } =
    useChain();

  const handleChainChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newChain = event.target.value;
    Cookies.set("selectedChainSymbol", newChain, { expires: 7 });
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
          value={selectedChainSymbol}
          onChange={handleChainChange}
          className="bg-blue-400 text-white text-sm rounded-md border-none px-3 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:bg-blue-700 transition-colors duration-200 appearance-none cursor-pointer"
        >
          <option value="CELO">CELO</option>
          <option value="POLYGON">POLYGON</option>
          <option value="SCROLL">SCROLL</option>
          <option value="LISK">LISK</option>
        </select>
      </div>
      <div className="mt-4"></div>
    </div>
  );
}
