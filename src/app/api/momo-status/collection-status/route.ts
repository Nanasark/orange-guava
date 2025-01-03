import { chainId } from "@/app/chain";
import { NextRequest, NextResponse } from "next/server";
import { toWei } from "thirdweb";
import { isAddress } from "thirdweb";
import { supabase } from "@/utils/supabase-server";

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

    if (body.status ==1) {
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
      throw new Error("Invalid or missing address provided");
    }

    const cediAmount = statusData.data?.amount;
    const pricePerToken = 0.000001;
    const amount = Math.floor(parseFloat(cediAmount) / pricePerToken);
    const sendingAmount = toWei(`${amount}`);

    if (txStatus === 1) {
      // Assuming 1 indicates a PENDING transaction
      const tx = await fetch(
        `${ENGINE_URL}/contract/${chainId}/${NEXT_PUBLIC_ICO_CONTRACT}/write`,
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
        throw new Error("Failed to send transaction tokens");
      }

      console.log("Transaction sent successfully");
    } else {
      console.log("Transaction not in a processable state:", txStatus);
    }
  } catch (error) {
    console.error("Error processing transaction:", error);
    throw error;
  }
}
