import { chainId } from "@/app/chain";
// import TransactionStorage from "@/app/transactionStorage";
import { NextRequest, NextResponse } from "next/server";
import { toWei } from "thirdweb";
import { isAddress } from "thirdweb";
import { supabase } from "@/utils/supabase-server";

const { TRANSACT_SECRET_KEY, TRANSACT_API_KEY } = process.env;

if (!TRANSACT_SECRET_KEY || !TRANSACT_API_KEY) {
  throw new Error(
    `Server misconfigured. Missing environment variables: 
   
    ${!TRANSACT_SECRET_KEY ? "TRANSACT_SECRET_KEY" : ""}
    ${!TRANSACT_API_KEY ? "TRANSACT_API_KEY" : ""}`
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload = req.body;
    console.log("Received callback:", payload);
    console.log("Received callback payload:", body);

    const { transactionId, success } = body;

    if (success === undefined) {
      return NextResponse.json(
        { success: false, message: "Missing success field in payload" },
        { status: 400 }
      );
    }

    if (!transactionId) {
      return NextResponse.json(
        { success: false, message: "Missing transactionId in payload" },
        { status: 400 }
      );
    }

    if (success) {
      console.log("Transaction was successful:", transactionId);
      return NextResponse.json(
        { success: true, message: "Transaction processed successfully" },
        { status: 200 }
      );
    } else {
      console.log("Transaction was not successful:", transactionId);
      return NextResponse.json(
        { success: false, message: "Transaction failed" },
        { status: 400 }
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
