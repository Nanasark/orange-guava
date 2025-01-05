import { client } from "@/app/client";
import { polygon } from "thirdweb/chains";
import { ConnectButton } from "thirdweb/react";

export default function ConnectWallet() {
  return (
    <>
      <ConnectButton
        client={client}
        chain={polygon}
        supportedTokens={{
          137: [
            {
              name: "USD Coin",
              address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
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
