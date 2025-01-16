"use client";

import React, { useState } from "react";
import generateInvoiceId from "@/utils/generateInvoiceId";
import { Copy, CheckCircle, Loader2 } from "lucide-react";

export default function CreateInvoiceForm() {
  const [title, setTitle] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [merchantAddress, setMerchantAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState("");
  const [copied, setCopied] = useState(false);

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(paymentLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-8 rounded-lg shadow-md"
    >
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
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          required
        />
      </div>
      <div>
        <label
          htmlFor="receiverAddress"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Receiver&apos;s Wallet
        </label>
        <input
          id="receiverAddress"
          type="text"
          value={receiverAddress}
          onChange={(e) => setReceiverAddress(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
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
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          required
        />
      </div>

      <button
        type="submit"
        className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin inline-block mr-2" size={16} />
            Creating...
          </>
        ) : (
          "Create Invoice"
        )}
      </button>
      {paymentLink && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <p className="font-semibold text-gray-700 mb-2">Payment Link:</p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={paymentLink}
              readOnly
              className="flex-grow px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={copyToClipboard}
              className="p-2 text-indigo-600 hover:text-indigo-800 focus:outline-none"
              title="Copy to clipboard"
            >
              {copied ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
