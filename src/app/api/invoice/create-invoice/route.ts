import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase-server";
import { baseUrl } from "@/app/strings";

export async function POST(request: Request) {
  const { receiverAddress, merchantAddress, invoiceId, title } =
    await request.json();

  try {
    const { data, error } = await supabase
      .from("paymentLink")
      .insert([
        {
          id: invoiceId,
          receiverAddress: receiverAddress,
          merchantAddress,
          title,
        },
      ])
      .select();

    if (error) throw error;

    const paymentLink = `${baseUrl}/paylink/${invoiceId}`;
    return NextResponse.json({ success: true, paymentLink, invoiceId });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}
