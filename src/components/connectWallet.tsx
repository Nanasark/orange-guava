import { client } from "@/app/client";
import { polygonAmoy } from "thirdweb/chains";
import { ConnectButton } from "thirdweb/react";

export default function ConnectWallet() {
  return (
    <>
      <ConnectButton
        client={client}
        chain={polygonAmoy}
        supportedTokens={{
          80002: [
            {
              name: "USD Coin",
              address: "0x61db8048005919076645c82bB871ee321366Dd31",
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
