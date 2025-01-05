import { getContract } from "thirdweb";
import { Strings } from "./strings";
import { client } from "./client";
import { chain } from "./chain";
import { ICOABI } from "./abi";

export const contract = getContract({
  address: Strings.contractAddress,
  chain: chain,
  client: client,
  abi: ICOABI,
});

export const tokenContract = getContract({
  address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  // "0x61db8048005919076645c82bB871ee321366Dd31",
  chain: chain,
  client: client,
});
