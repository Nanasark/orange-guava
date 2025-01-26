import { NextRequest, NextResponse } from "next/server";
// import { toWei } from "thirdweb";
import { toUwei } from "@/utils/conversions";
import { isAddress } from "thirdweb";
import { supabase } from "@/utils/supabase-server";
import { calculateSendingAmount } from "@/utils/calculateSendingAmount";
import Cookies from "js-cookie";
import { getChainInfo } from "@/utils/getChainInfo";
import { cookies } from "next/headers";
// Derive other chain details

interface ChainResponse {
  result: {
    queueId: string;
  };
}

interface Status {
  success: boolean;
  msg: string;
  data: {
    txstatus: number;
    txtype: number;
    accountnumber: string;
    payer: string;
    payee: string;
    amount: string;
    value: string;
    transactionid: string;
    externalref: string;
    thirdpartyref: string;
    ts: string; // Timestamp in ISO 8601 format
  };
}

interface Payload {
  status: number;
  code: string;
  message: string;
  data: {
    txstatus: number;
    payer: string;
    terminalid: string;
    accountnumber: string;
    name: string;
    amount: string;
    value: string;
    transactionid: string;
    externalref: string;
    thirdpartyref: string;
    secret: string;
    ts: string; // Timestamp in ISO 8601 format
  };
  go: any | null; // Adjust based on the actual structure of `go`, if applicable
}

const {
  ENGINE_URL,
  ENGINE_ACCESS_TOKEN,
  NEXT_PUBLIC_ICO_CONTRACT,
  BACKEND_WALLET_ADDRESS,
  TRANSACT_SECRET_KEY,
  TRANSACT_API_KEY,
} = process.env;

if (
  !ENGINE_URL ||
  !ENGINE_ACCESS_TOKEN ||
  !NEXT_PUBLIC_ICO_CONTRACT ||
  !BACKEND_WALLET_ADDRESS ||
  !TRANSACT_SECRET_KEY ||
  !TRANSACT_API_KEY
) {
  throw new Error(
    `Server misconfigured. Missing environment variables: 
    ${!ENGINE_URL ? "ENGINE_URL" : ""}
    ${!ENGINE_ACCESS_TOKEN ? "ENGINE_ACCESS_TOKEN" : ""}
    ${!NEXT_PUBLIC_ICO_CONTRACT ? "NEXT_PUBLIC_ICO_CONTRACT" : ""}
    ${!BACKEND_WALLET_ADDRESS ? "BACKEND_WALLET_ADDRESS" : ""}
    ${!TRANSACT_SECRET_KEY ? "TRANSACT_SECRET_KEY" : ""}
    ${!TRANSACT_API_KEY ? "TRANSACT_API_KEY" : ""}`
  );
}

export async function POST(req: NextRequest) {
  try {
    const body: Payload = await req.json();

    console.log("Received callback payload:", body);

    if (body.data.txstatus !== 1) {
      return NextResponse.json(
        { success: false, message: body.message },
        { status: 400 }
      );
    }

    // const statusResponse = await fetch(
    //   `https://transakt.offgridlabs.org/collections/mobile-money/status`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       "X-TRANSAKT-API-KEY": TRANSACT_API_KEY!,
    //       "X-TRANSAKT-API-SECRET": TRANSACT_SECRET_KEY!,
    //     },
    //     body: JSON.stringify({ refId: body.data }),
    //   }
    // );

    // const statusData: Status = await statusResponse.json();

    if (body.status == 1) {
      // console.log("Status data retrieved successfully:", statusData);

      await processTransaction(body, body.status, body.data.externalref);

      return NextResponse.json({
        success: true,
        message: "Transaction processed successfully",
      });
    } else {
      console.error("Failed to fetch transaction status:", body);
      return NextResponse.json(
        { success: false, message: "Failed to fetch transaction status" },
        { status: body.status }
      );
    }
  } catch (error) {
    console.error("Error handling callback:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function processTransaction(
  statusData: Payload,
  txStatus: number,
  transactionId: string
) {
  try {
    const { data, error } = await supabase
      .from("collection")
      .select("address, merchantAddress")
      .eq("transactionId", transactionId)
      .single();

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    const address = data?.address;
    const merchantAddress = data?.merchantAddress;

    if (!isAddress(address)) {
      throw new Error("invalid address provided");
    }

    const cediAmount = statusData.data.amount;
    const pricePerToken = 5;
    // const amount = parseFloat(cediAmount) / pricePerToken;
    // const bigintAmount = toUwei(`${amount}`);
    const sendingAmount = calculateSendingAmount(cediAmount, pricePerToken);

    await supabase
      .from("collection")
      .update({ txstatus: 2 })
      .eq("transactionId", transactionId);

    if (txStatus === 1) {
      const cookieStore = await cookies();
      const selectedChainSymbol =
        cookieStore.get("selectedChainSymbol")?.value || "None";
      const { ContractAddress, chainId } = getChainInfo(selectedChainSymbol);
      const tx = await fetch(
        `${ENGINE_URL}/contract/${chainId}/${ContractAddress}/write`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ENGINE_ACCESS_TOKEN}`,
            "x-backend-wallet-address": BACKEND_WALLET_ADDRESS!,
          },
          body: JSON.stringify({
            functionName: "buyCryptoWithFiat",
            args: [
              `${address}`,
              sendingAmount.toString(),
              `${merchantAddress}`,
            ],
          }),
        }
      );

      if (!tx.ok) {
        const errorResponse = await tx.json();

        console.error("Error processing transaction:", errorResponse);
        await supabase
          .from("collection")
          .update({ txstatus: 4 })
          .eq("transactionId", transactionId);
        throw new Error("Failed to send transaction tokens");
      } else {
        await supabase
          .from("collection")
          .update({ txstatus: 3 })
          .eq("transactionId", transactionId);
      }

      const chainResponse: ChainResponse = await tx.json(); // Assuming tx.json() is how you get the chain response

      const { queueId } = chainResponse.result;

      // Insert the queueId into the 'collection' table for the specific transactionId
      const { data, error } = await supabase
        .from("collection")
        .upsert([
          {
            transactionId: transactionId, // the specific transactionId
            queueId: queueId, // the queueId from the response
          },
        ])
        .select()
        .single(); // .single() returns only one row (if you're expecting a single entry)

      if (error) {
        throw new Error(error.message);
      }

      const { data: balance, error: balanceError } = await supabase.rpc(
        "increment_balance",
        {
          merchant_id: merchantAddress,
          amount: cediAmount,
        }
      );

      if (balanceError) {
        console.error("Error incrementing balance:", balanceError);
      } else {
        console.log("Balance incremented successfully:", balance);
      }
      // Update transaction status to 'success'
      await supabase
        .from("collection")
        .update({ txstatus: 3 })
        .eq("transactionId", transactionId);

      console.log("Transaction sent successfully");
    } else {
      console.log("Transaction not in a processable state:", txStatus);
      await supabase
        .from("collection")
        .update({ txstatus: 4 })
        .eq("transactionId", transactionId);
    }
  } catch (error) {
    console.error("Error processing final transaction:", error);
    await supabase
      .from("collection")
      .update({ txstatus: 4 })
      .eq("transactionId", transactionId);
    throw error;
  }
}
