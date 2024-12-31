import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase-server";

interface Network {
  provider: string;
}
interface Receiver {
  phoneNumber: string;
  accountName: string;
  network: Network;
}

interface RequestData {
  receiver: Receiver;
  amount: number;
  currency: string;
  callbackUrl: string;
  walletId: string;
  payerAddress: string;
  merchantAddress: string;
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
      receiver,
      amount,
      currency,
      callbackUrl,
      walletId,
      payerAddress,
      merchantAddress,
    } = data;

    const response = await fetch(
      "https://sandbox.offgridlabs.org/payouts/mobile-money",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          "X-TRANSAKT-API-KEY": TRANSACT_API_KEY!,
          "X-TRANSAKT-API-SECRET": TRANSACT_SECRET_KEY!,
        },
        body: JSON.stringify({
          receiver,
          amount,
          walletId,
          currency,
          callbackUrl,
       
        }),
      }
    );

    const responseData = await response.json();
    console.log(responseData);

    if (response.ok) {
      
      const metadata = {
        receiver: JSON.stringify(receiver),
        amount: `${currency} ${amount}`,
        walletId,
        payerAddress,
        merchantAddress,
      };

      const { data: dbData, error } = await supabase
        .from("payouts")
        .insert(metadata)
        .select()
        .single();

      if (error) {
        console.error("Database error:", error);
        return NextResponse.json(
          {
            success: false,
            message: "Failed to save payout to database",
            data: responseData,
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Payout initiated successfully",
        data: responseData,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to initiate payout",
        data: responseData,
      },
      { status: response.status }
    );
  } catch (error) {
    console.error("Error initiating payout:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error initiating payout",
        data: {},
      },
      { status: 500 }
    );
  }
}
