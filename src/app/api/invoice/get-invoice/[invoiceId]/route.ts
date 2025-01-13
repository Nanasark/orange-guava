import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase-server";

export async function GET(
  request: Request,
  { params }: { params: { invoiceId: string } }
) {
  const invoiceId = params.invoiceId;

  try {
    const { data, error } = await supabase
      .from("paymentLink")
      .select("*")
      .eq("id", invoiceId)
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch invoice" },
      { status: 500 }
    );
  }
}
