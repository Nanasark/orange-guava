import { chainId } from "@/app/chain";
// import TransactionStorage from "@/app/transactionStorage";
import { NextRequest, NextResponse } from "next/server";
import { toWei } from "thirdweb";
import { isAddress } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { supabase } from "@/utils/supabase-server";

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
    const body = await req.json();
    console.log("Received callback payload:", body);

    const { transactionId } = body;

    if (!transactionId) {
      return NextResponse.json(
        { success: false, message: "Missing transactionId in payload" },
        { status: 400 }
      );
    }

    const statusResponse = await fetch(
      `https://sandbox.offgridlabs.org/collections/mobile-money/status/${transactionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-TRANSAKT-API-KEY": TRANSACT_API_KEY!,
          "X-TRANSAKT-API-SECRET": TRANSACT_SECRET_KEY!,
        },
      }
    );

    const statusData = await statusResponse.json();
    const { status } = statusData;

    if (statusResponse.ok) {
      console.log("Status data retrieved successfully:", statusData);

      await processTransaction(statusData, status, transactionId);

      return NextResponse.json({
        success: true,
        message: "Transaction processed successfully",
      });
    } else {
      console.error("Failed to fetch transaction status:", statusData);
      return NextResponse.json(
        { success: false, message: "Failed to fetch transaction status" },
        { status: statusResponse.status }
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
  statusData: any,
  status: any,
  transactionId: any
) {
  const { data, error } = await supabase
    .from("objects")
    .select("*")
    .eq("transactionId", transactionId)
    .single();

  const address = data.address;

  // const address =
  //   statusData.data?.accountName && isAddress(statusData.data.accountName)
  //     ? statusData.data.accountName
  //     : "0x54fef221d931500f8f1bc6c7ccfdaa566ac2dabe";

  if (!isAddress(address)) {
    throw new Error("Invalid address provided");
  }
  const cediAmount = statusData.data?.amount;

  if (!address) {
    throw new Error("Address not provided in transaction status");
  }
  console.log("status", status);
  console.log("statusData", statusData.data?.status);
  console.log("wallet address", address);

  const pricePerToken = 20;
  const amount = Math.floor(parseFloat(cediAmount) / pricePerToken);
  const sendingAmount = toWei(`${amount}`);

  try {
    if (statusData.data?.status === "PENDING") {
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
            functionName: "send",
            args: [`${address}`, sendingAmount.toString()],
          }),
        }
      );

      if (!tx.ok) {
        console.error("Error processing transaction:", await tx.json());
        throw new Error("Failed to send transaction tokens");
      }

      console.log("Transaction sent successfully");
    } else {
      console.log("Transaction not successful:", status);
    }
  } catch (error) {
    console.error("Error processing transaction:", error);
    throw error;
  }
}
