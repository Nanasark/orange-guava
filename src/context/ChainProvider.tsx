"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ChainOptions } from "thirdweb/chains";
import Cookies from "js-cookie";
import { getChainInfo } from "@/utils/getChainInfo";

type ChainContextType = {
  chain: Readonly<ChainOptions & { rpc: string }>;
  selectedChainSymbol: string;
  chainId: number;
  ContractAddress: string;
  USDCAddress: string;
  updateChain: (chainName: string) => void;
};

const ChainContext = createContext<ChainContextType | undefined>(undefined);

export function ChainProvider({ children }: { children: React.ReactNode }) {
  const [selectedChainSymbol, setSelectedChainSymbol] = useState(
    () => Cookies.get("selectedChainSymbol") || "CELO"
  );

  const updateChain = (chainName: string) => {
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
  const { ContractAddress, USDCAddress, chain, chainId } =
    getChainInfo(selectedChainSymbol);

  return (
    <ChainContext.Provider
      value={{
        chain,
        selectedChainSymbol,
        chainId,
        ContractAddress,
        USDCAddress,
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
