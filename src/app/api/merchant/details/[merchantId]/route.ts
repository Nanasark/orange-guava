// app/api/merchant/[merchantId]/route.ts
import { supabase } from "@/utils/supabase-server";

export async function GET(
  request: Request,
  { params }: { params: { merchantId: string } }
) {
  const { merchantId } = params; // Get merchantId from URL params

  try {
    // Fetch merchant data
    const { data: merchantData, error: merchantError } = await supabase
      .from("merchants")
      .select("*")
      .eq("id", merchantId)
      .single(); // Fetch a single merchant by ID

    if (merchantError) {
      throw new Error(merchantError.message);
    }

    // Fetch the networks related to the merchant
    const { data: networksData, error: networksError } = await supabase
      .from("networks")
      .select("*")
      .eq("merchant_id", merchantId); // Fetch networks for the merchant

    if (networksError) {
      throw new Error(networksError.message);
    }

    // Return the merchant data and networks in a JSON response
    return new Response(
      JSON.stringify({
        merchant: merchantData,
        networks: networksData,
      }),
      { status: 200 }
    );
  } catch (error:any) {
    // Handle errors
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
