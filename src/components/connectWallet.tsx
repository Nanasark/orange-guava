import { client } from "@/app/client";
import { ConnectButton } from "thirdweb/react";
import {useChain} from "@/context/ChainProvider"


export default function ConnectWallet() {
  const {
    selectedChain,
    selectedChainSymbol,
    selectedChainId,
    contractAddress,
    usdcAddress,
    updateChain,
  } = useChain();
  return (
    <>
      <ConnectButton
        client={client}
        chain={selectedChain}
        supportedTokens={{
          [selectedChainId]: [
            {
              name: "USD Coin",
              address: usdcAddress,
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
