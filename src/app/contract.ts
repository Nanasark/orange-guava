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
