import { getContract } from "thirdweb";
import { client } from "./client";
import {
  getSelectedChain,
  getContractAddress,
  getUSDCAddress,
} from "@/components/SelectChain";
import { ICOABI } from "./abi";
const selectedChain = getSelectedChain();
const selectedContractAddress = getContractAddress();
const selectedTokenAddress = getUSDCAddress();

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
