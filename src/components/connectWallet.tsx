import { client } from "@/app/client";
import { ConnectButton } from "thirdweb/react";
import { useChain } from "@/context/ChainProvider";

export default function ConnectWallet() {
  const { ContractAddress, selectedChainSymbol, USDCAddress, chain, chainId } =
    useChain();
  return (
    <>
      <ConnectButton
        client={client}
        chain={chain}
        supportedTokens={{
          [chainId]: [
            {
              name: "USD Coin",
              address: USDCAddress,
              symbol: "USDC",
              icon: "/usdc.png",
            },
          ],
        }}
        connectButton={{
          className: "connect",
          label: "Sign In",
        }}
        theme={"light"}
      />
    </>
  );
}
