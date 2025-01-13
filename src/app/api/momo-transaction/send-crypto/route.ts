import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase-server";

//This api sends crypto to user after he has paid fiat to merchant

interface RequestData {
  channel: number;
  amount: number;
  callbackUrl: string;
  address: string;
  merchantAddress: string;
  phoneNumber: string;
  reference: string;
}

const {
  ENGINE_URL,
  ENGINE_ACCESS_TOKEN,
  NEXT_PUBLIC_ICO_CONTRACT,
  BACKEND_WALLET_ADDRESS,
  TRANSACT_SECRET_KEY,
  TRANSACT_API_KEY,
} = process.env;

export async function POST(request: NextRequest) {
  if (
    !ENGINE_URL ||
    !ENGINE_ACCESS_TOKEN ||
    !NEXT_PUBLIC_ICO_CONTRACT ||
    !BACKEND_WALLET_ADDRESS ||
    !TRANSACT_SECRET_KEY ||
    !TRANSACT_API_KEY
  ) {
    throw "server misconfigured check your env file";
  }

  try {
    const data: RequestData = await request.json();
    const {
      reference,
      amount,
      address,
      merchantAddress,
      channel,
      phoneNumber,
    } = data;
    console.log(TRANSACT_SECRET_KEY);
    const response = await fetch(
      "https://transakt.offgridlabs.org/collections/mobile-money",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-TRANSAKT-API-KEY": TRANSACT_API_KEY!,
          "X-TRANSAKT-API-SECRET": TRANSACT_SECRET_KEY!,
        },
        body: JSON.stringify({
          channel: channel,
          currency: "GHS",
          payer: phoneNumber,
          amount: amount,
          otpcode: "",
          reference: reference,
          merchantId: "496b952f-548b-4620-b2b7-d78d72a90b5c",
        }),
      }
    );

    console.log(
      channel,

      phoneNumber,

      reference,
      amount
    );

    const responseData = await response.json();
    console.log(responseData);

    if (response.ok) {
      const metadata = {
        transactionId: `${responseData.data}`,
        address: `${address}`,
        amount: `GHS ${amount}`,
        merchantAddress: `${merchantAddress}`,
        txstatus: 1,
      };

      const { data, error } = await supabase
        .from("collection")
        .insert(metadata)
        .select()
        .single();
        if (error) {
          throw new Error(`Supabase error: ${error.message}`);
        }


      console.log(responseData);

      return NextResponse.json({
        success: true,
        message: "Transaction initiated successfully",
        data: responseData,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Operation completed successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error initiating mobile money collection:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error initiating mobile money collection",
        data: {},
      },
      { status: 500 }
    );
  }
}
