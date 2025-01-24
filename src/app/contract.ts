import { getContract } from "thirdweb";
import { client } from "./client";
import Cookies from "js-cookie";
import { ContractAddress, USDCAddress } from "@/utils/getChainAddresses";
import {chain, chainId} from "./chain"
import { ICOABI } from "./abi";
 const selectedChainSymbol = Cookies.get("selectedChainSymbol") || "CELO";
const selectedChain = chain(selectedChainSymbol)
const selectedContractAddress = ContractAddress(selectedChainSymbol);
const selectedTokenAddress = USDCAddress(selectedChainSymbol)

export const contract = getContract({
  address: selectedContractAddress,
  chain: selectedChain,
  client: client,
  abi: ICOABI,
});

export const tokenContract = getContract({
  address: selectedTokenAddress,
  // "0x61db8048005919076645c82bB871ee321366Dd31",
  chain: selectedChain,
  client: client,
});
