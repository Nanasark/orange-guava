"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ChainOptions } from "thirdweb/chains";
import { ContractAddress, USDCAddress } from "@/utils/getChainAddresses";
import { chain, chainId } from "@/app/chain";
import Cookies from "js-cookie";

type ChainContextType = {
  selectedChain: Readonly<ChainOptions & { rpc: string }>;
  selectedChainSymbol: string;
  selectedChainId: number;
  contractAddress: string;
  usdcAddress: string;
  updateChain: (chainName: string) => void;
};

const ChainContext = createContext<ChainContextType | undefined>(undefined);

export function ChainProvider({ children }: { children: React.ReactNode }) {
  const [selectedChainSymbol, setSelectedChainSymbol] = useState(
    () => Cookies.get("selectedChainSymbol") || "CELO"
  );
  const [selectedChain, setSelectedChain] = useState(() =>
    chain(Cookies.get("selectedChainSymbol") || "CELO")
  );

  const updateChain = (chainName: string) => {
    const newChain = chain(chainName);
    setSelectedChain(newChain);
    setSelectedChainSymbol(chainName);

    // Sync with cookies
    Cookies.set("selectedChainSymbol", chainName, { expires: 7 });
  };

  useEffect(() => {
    const storedChain = Cookies.get("selectedChainSymbol");
    if (storedChain) {
      updateChain(storedChain);
    }
  }, []);

  // Derived values
  const selectedChainId = selectedChain.id;
  const contractAddress = ContractAddress(selectedChainSymbol);
  const usdcAddress = USDCAddress(selectedChainSymbol);

  return (
    <ChainContext.Provider
      value={{
        selectedChain,
        selectedChainSymbol,
        selectedChainId,
        contractAddress,
        usdcAddress,
        updateChain,
      }}
    >
      {children}
    </ChainContext.Provider>
  );
}

export function useChain() {
  const context = useContext(ChainContext);
  if (!context) {
    throw new Error("useChain must be used within a ChainProvider");
  }
  return context;
}
