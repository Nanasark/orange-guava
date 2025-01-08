import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase-server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { transactionId } = req.query;

  if (!transactionId || typeof transactionId !== "string") {
    return res.status(400).json({ message: "Invalid transaction ID" });
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
      return res.status(404).json({ message: "Transaction not found" });
    }

    let status;
    if (data.txstatus === 1) {
      status = "pending";
    } else if (data.txstatus === 2) {
      status = "in_progress";
    } else if (data.txstatus === 3) {
      status = "success";
    } else {
      status = "error";
    }

    return res.status(200).json({
      success: true,
      data: {
        transactionId: data.transactionId,
        status: status,
        amount: data.amount,
        address: data.address,
      },
    });
  } catch (error) {
    console.error("Error retrieving transaction status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
