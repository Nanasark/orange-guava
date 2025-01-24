import { client } from "@/app/client";
import { ConnectButton } from "thirdweb/react";
import {
  getSelectedChain,
  getSelectedChainId,
  getUSDCAddress,
} from "./SelectChain";
const selectedChain = getSelectedChain();
const selectedUsdc = getUSDCAddress();
const chainId = getSelectedChainId();

export default function ConnectWallet() {
  return (
    <>
      <ConnectButton
        client={client}
        chain={selectedChain}
        supportedTokens={{
          [chainId]: [
            {
              name: "USD Coin",
              address: selectedUsdc,
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
