import Image from "next/image";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/app/client";
import { polygonAmoy } from "thirdweb/chains";
import Link from "next/link";
import ConnectWallet from "./connectWallet";
import SelectChain from "./SelectChain";

export default function Header() {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-3 sm:mb-0">
          <h1 className="text-xl font-bold">Crypto Exchange</h1>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-4">
          <SelectChain />
          <Link
            href="/"
            className="text-white hover:text-blue-200 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/invoice"
            className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            Generate Paylink
          </Link>
          <ConnectWallet />
        </nav>
      </div>
    </header>
  );
}
