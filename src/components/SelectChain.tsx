import React, { useState } from "react";
import { chain, chainId } from "@/app/chain";
import { ContractAddress, USDCAddress } from "@/utils/getChainAddresses";
import Image from "next/image";

let currentSelectedChain = chain("CELO");
let currentSelectedChainId = chainId("CELO");
let currentConractAddress = ContractAddress("CELO");
let currentUSDCAddress = USDCAddress("CELO");

export function getSelectedChain() {
  return currentSelectedChain;
}

export function getSelectedChainId() {
  return currentSelectedChainId;
}

export function getContractAddress() {
  return currentConractAddress;
}
export function getUSDCAddress() {
  return currentUSDCAddress;
}
export default function SelectChain() {
  const [activeChain, setActiveChain] = useState("CELO");

  const handleChainChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newChain = event.target.value;
    setActiveChain(newChain);
    currentSelectedChain = chain(newChain);
    currentSelectedChainId = chainId(newChain);
    currentConractAddress = ContractAddress(newChain);
    currentUSDCAddress = USDCAddress(newChain);
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="chainSelect" className="text-sm font-medium text-white">
        Chain:
      </label>
      <select
        id="chainSelect"
        value={activeChain}
        onChange={handleChainChange}
        className="bg-blue-400 text-white text-sm rounded-md border-none px-3 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:bg-blue-700 transition-colors duration-200 appearance-none cursor-pointer"
      >
        <option value="CELO" className="flex gap-2">
          <Image alt="" src={"/celo.png"} width={20} height={20} />
          <p>CELO</p>
        </option>
        <option value="POLYGON">POLYGON</option>
        <option value="SCROLL">SCROLL</option>
      </select>
    </div>
  );
}
