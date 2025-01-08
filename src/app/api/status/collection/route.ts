import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase-server";

const { ENGINE_URL, ENGINE_ACCESS_TOKEN } = process.env;

// Types for transaction status API
interface TransactionResult {
  queueId: string;
  walletAddress: string;
  contractAddress: string;
  chainId: string;
  extension: string;
  status: string; // e.g., "mined", "error"
  encodedInputData: string;
  txType: number;
  gasPrice: string;
  gasLimit: string;
  maxPriorityFeePerGas: string;
  maxFeePerGas: string;
  txHash: string;
  submittedTxNonce: number;
  createdTimestamp: string;
  txProcessedTimestamp: string;
  txSubmittedTimestamp: string;
  deployedContractAddress: string;
  contractType: string;
  errorMessage: string;
  txMinedTimestamp: string;
  blockNumber: number;
  onChainTxStatus: number; // 1: success, 2: in_progress, 3: error, etc.
}

interface TransactionApiResponse {
  result: TransactionResult;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const transactionId = searchParams.get("transactionId");

  if (!transactionId) {
    return NextResponse.json(
      { message: "Invalid transaction ID" },
      { status: 400 }
    );
  }

  console.log(transactionId);
  try {
    // Fetch transaction details from Supabase
    const { data, error } = await supabase
      .from("collection")
      .select("*")
      .eq("transactionId", transactionId)
      .single();

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    if (!data) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }

    let status;
    // Get the status of the transaction
    switch (data.txstatus) {
      case 1:
        status = "pending";
        break;
      case 2:
        status = "in_progress";
        break;
      case 3:
        status = "success";
        break;
      default:
        status = "error";
    }

    // If the transaction is in progress, fetch more data using the queueId
    let externalData: TransactionApiResponse | null = null;
    if (status === "in_progress" && data.queueId) {
      const externalResponse = await fetch(`${ENGINE_URL}/${data.queueId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ENGINE_ACCESS_TOKEN}`,
        },
      });

      externalData = await externalResponse.json();
    }

    // Return all relevant data to the frontend
    return NextResponse.json({
      success: true,
      data: {
        transactionId: data.transactionId,
        status: status,
        amount: data.amount,
        address: data.address,
        queueId: data.queueId,
        externalData: externalData ? externalData.result : null,
        // Any other relevant fields you want to return
      },
    });
  } catch (error) {
    console.error("Error retrieving transaction status:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
