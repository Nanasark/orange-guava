import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase-server";

export async function POST(req:NextRequest) {
  try {
    // Parse the incoming request body
    const details = await req.json();

    const { data, error, status } = await supabase
      .from("merchantsMainnet")
      .insert(details)
      .select()
      .single();

    // Check for Supabase errors
    if (error) {
      console.error("Error inserting data into 'merchant':", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status }
      );
    }

    // Respond with the inserted data if successful
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    // Handle unexpected errors
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
