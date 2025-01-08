import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase-server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const transactionId = searchParams.get("transactionId");

  if (!transactionId) {
    return NextResponse.json(
      { message: "Invalid transaction ID" },
      { status: 400 }
    );
  }

  try {
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

    return NextResponse.json({
      success: true,
      data: {
        transactionId: data.transactionId,
        status: status,
        amount: data.amount,
        address: data.address,
        // Add any other relevant fields you want to return
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
