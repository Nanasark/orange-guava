//This api allows users to send momo to merchant and in retrun get crypto

import { NextRequest, NextResponse } from "next/server";
import { baseUrl } from "@/app/strings";
// import { validateApiKey, unauthorizedResponse } from '@/utils/apiAuth'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { customer, amount, currency, callbackUrl } = data;

    const response = await fetch(
      "https://sandbox.offgridlabs.org/payouts/mobile-money",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.TRANSACT_SECRET_KEY}`,
        },
        body: JSON.stringify({ customer, amount, currency, callbackUrl }),
      }
    );

    const responseData = await response.json();

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
