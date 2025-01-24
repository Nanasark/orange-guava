import { ChainOptions } from "thirdweb/chains";
import { polygon, scroll, celo } from "thirdweb/chains";

export function chain(
  chainName: string
): Readonly<ChainOptions & { rpc: string }> {
  switch (chainName) {
    case "CELO":
      return celo;
    case "POLYGON":
      return polygon;
    case "SCROLL":
      return scroll;
    default:
      return celo;
  }
}

export function chainId(chainName: string): number {
  switch (chainName) {
    case "CELO":
      return celo.id;
    case "POLYGON":
      return polygon.id;
    case "SCROLL":
      return scroll.id;
    default:
      return celo.id;
  }
}

export const selectedChain = chain("POLYGON");
export const selectedChainId = chainId("POLYGON");
