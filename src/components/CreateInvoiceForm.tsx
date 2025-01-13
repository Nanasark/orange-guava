"use client";

import React, { useState } from "react";
import generateInvoiceId from "@/utils/generateInvoiceId";

export default function CreateInvoiceForm() {
  const [title, setTitle] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [merchantAddress, setMerchantAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState("");

  const invoiceId = generateInvoiceId({
    merchantAddress,
    receiverAddress,
    title,
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/invoice/create-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invoiceId,
          title,
          receiverAddress,
          merchantAddress,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setPaymentLink(data.paymentLink);
      } else {
        console.error("Failed to create invoice");
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 ">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label
          htmlFor="receiverAddress"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
         Receiver&apos;s Wallets
        </label>
        <input
          id="receiverAddress"
          type="text"
          value={receiverAddress}
          onChange={(e) => setReceiverAddress(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label
          htmlFor="merchantAddress"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Merchant Address
        </label>
        <input
          id="merchantAddress"
          type="text"
          value={merchantAddress}
          onChange={(e) => setMerchantAddress(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Invoice"}
      </button>
      {paymentLink && (
        <div className="mt-4">
          <p className="font-semibold">Payment Link:</p>
          <a
            href={paymentLink}
            className="text-blue-600 hover:underline break-all"
          >
            {paymentLink}
          </a>
        </div>
      )}
    </form>
  );
}
