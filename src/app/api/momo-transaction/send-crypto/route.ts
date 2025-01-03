import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase-server";

//This api sends crypto to user after he has paid fiat to merchant

interface RequestData {
  channel: number;
  amount: number;
  callbackUrl: string;
  address: string;
  merchantAddress: string;
  externalref: string;
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
      externalref,
      reference,
      amount,
      callbackUrl,
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
          amount: 0.4,
          externalref: externalref,
          otpcode: "",
          reference: reference,
          merchantId: "0ac35f21-e326-4190-abeb-97abbfed2908",
        }),
      }
    );

    const responseData = await response.json();
    console.log(responseData);
    console.log(callbackUrl);

    if (response.ok) {
      const transactionId = responseData.data.transactionId;
      const metadata = {
        transactionId: `${transactionId}`,
        address: `${address}`,
        amount: `GHS ${amount}.00`,
        merchantAddress: `${merchantAddress}`,
      };

      const { data, error } = await supabase
        .from("collection")
        .insert(metadata)
        .select()
        .single();

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
