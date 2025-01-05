import { supabase } from "@/utils/supabase-server";

export async function GET(
  request: Request,
  { params }: { params: { merchantId: string } }
) {
  const { merchantId } = params; // Extract merchantId from URL params

  try {
    // Fetch merchant data
    const { data: merchantData, error: merchantError } = await supabase
      .from("merchantsMainnet")
      .select("*")
      .eq("address", merchantId)
      .single(); // Fetch a single merchant by ID

    if (merchantError) {
      if (
        merchantError.message ===
        "JSON object requested, multiple (or no) rows returned"
      ) {
        console.warn(`No merchant found for address: ${merchantId}`);
      } else {
        throw new Error(`Error fetching merchant: ${merchantError.message}`);
      }
    }

    // Fetch the networks related to the merchant
    const { data: networksData, error: networksError } = await supabase
      .from("networks")
      .select("*")
      .eq("address", merchantId); // Fetch networks for the merchant

    if (networksError) {
      console.warn(`Error fetching networks for merchant: ${merchantId}`);
    }

    // Prepare response with default values for missing data
    return new Response(
      JSON.stringify({
        merchant: merchantData || {
          address: merchantId,
          business_name: "Unknown Merchant",
          description: "No data available",
          email: "N/A",
          phone_number: "N/A",
          created_at: null,
        },
        networks: networksData || [],
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Error fetching merchant or network data: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
