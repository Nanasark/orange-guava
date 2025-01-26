import { getContract } from "thirdweb";
import { client } from "./client";
import Cookies from "js-cookie";
import { getChainInfo } from "@/utils/getChainInfo";
import { ICOABI } from "./abi";
const selectedChainSymbol = Cookies.get("selectedChainSymbol") || "CELO";

export function getContracts(chainName: string) {
  const { ContractAddress, USDCAddress, chain } = getChainInfo(chainName);
  const contract = getContract({
    address: ContractAddress,
    chain: chain,
    client: client,
    abi: ICOABI,
  });

  const tokenContract = getContract({
    address: USDCAddress,
    // "0x61db8048005919076645c82bB871ee321366Dd31",
    chain: chain,
    client: client,
  });
  return { contract, tokenContract };
}
