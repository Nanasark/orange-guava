import Image from "next/image";
import thirdwebIcon from "@public/thirdweb.svg";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/app/client";
import { polygonAmoy } from "thirdweb/chains";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-evenly gap-5 relative h-[50px] bg-blue-500 w-full">
      <ConnectButton
        client={client}
        chain={polygonAmoy}
        supportedTokens={{
          80002: [
            {
              name: "ftc",
              address: "0x852e64595771b938B970e1Dc87C69A0f66bb4dD4",
              symbol: "ftc",
            },
          ],
        }}
      />
      <Link href="/" className="text-gray-800 hover:text-gray-600">
        Home
      </Link>
         <Link
        href="/exchange"
        className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
       P2P Exchange
      </Link>
      <Link
        href="/dashboard"
        className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        Go to Dashboard
      </Link>
    </header>
  );
}
