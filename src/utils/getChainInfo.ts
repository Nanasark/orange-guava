import { ChainOptions } from "thirdweb/chains";
import { polygon, scroll, celo } from "thirdweb/chains";
import { defineChain } from "thirdweb";

const lisk = defineChain(1135);

interface ChainDetail {
  ContractAddress: string;
  USDCAddress: string;
  chain: Readonly<ChainOptions & { rpc: string }>;
  chainId: number;
}

export function getChainInfo(chainName: string): ChainDetail {
  switch (chainName) {
    case "POLYGON":
      return {
        ContractAddress: "0x46aa26bdca96fa57025c3d6a067e82e3e65d53f3",
        USDCAddress: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
        chain: polygon,
        chainId: polygon.id,
      };
    case "SCROLL":
      return {
        ContractAddress: "0xE38d1D31e6B75a95516857ce5bAdbF70C5464cd7",
        USDCAddress: "0x06efdbff2a14a7c8e15944d1f4a48f9f95f663a4",
        chain: scroll,
        chainId: scroll.id,
      };
    case "CELO":
      return {
        ContractAddress: "0x1AC513717801c2FD691db6302dCf9F9e4234f957",
        USDCAddress: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C",
        chain: lisk,
        chainId: lisk.id,
      };
    case "LISK":
      return {
        ContractAddress: "0x650ECaF3beEe6fBdd86697d28232F66fc8c8C317",
        USDCAddress: "0xF242275d3a6527d877f2c927a82D9b057609cc71",
        chain: celo,
        chainId: celo.id,
      };
    default:
      return {
        ContractAddress: "0x1AC513717801c2FD691db6302dCf9F9e4234f957",
        USDCAddress: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C",
        chain: celo,
        chainId: celo.id,
      };
  }
}
