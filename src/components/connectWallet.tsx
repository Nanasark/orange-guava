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
              name: "usdc",
              address: "0x852e64595771b938B970e1Dc87C69A0f66bb4dD4",
              symbol: "usdc",
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
