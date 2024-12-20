"use client";
import React, { useState } from "react";
import { baseUrl } from "../strings";
import { useActiveAccount } from "thirdweb/react";

export default function CryptoExchange() {
  const address = useActiveAccount()?.address;
  const [phoneNumber, setPhoneNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [status, setStatus] = useState("");

  const ghsRate = 20;
  const payingAmount = (Number(amount) * ghsRate).toString();

  const { NEXT_PUBLIC_TRANSACT_KEY } = process.env;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/momo-transaction/send-crypto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${NEXT_PUBLIC_TRANSACT_KEY}`,
        },
        body: JSON.stringify({
          customer: {
            phoneNumber: `+${phoneNumber}`,
            accountName: address,
            network,
          },
          amount: parseFloat(payingAmount),
          currency: "GHS",
          callbackUrl: `${baseUrl}/api/momo-status/collection-status`,
          address: address,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setTransactionId(data.data.transactionId);
      }
    } catch (error) {
      console.error("Error initiating transaction:", error);
    }
  };

  const checkStatus = async () => {
    try {
      const response = await fetch(
        `/api/momo-status/collection-status/${transactionId}`
      );
      const data = await response.json();
      if (data.success) {
        setStatus(data.data.status);
      }
    } catch (error) {
      console.error("Error checking status:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      <form className="space-y-6">
        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            id="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="accountName"
            className="block text-sm font-medium text-gray-700"
          >
            Account Name
          </label>
          <input
            id="accountName"
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-800"
          >
            Amount of token to Buy
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="network"
            className="block text-sm font-medium text-gray-700"
          >
            Network
          </label>
          <select
            id="network"
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select a network</option>
            <option value="MTN">MTN</option>
            <option value="Vodafone">Vodafone</option>
            <option value="AirtelTigo">AirtelTigo</option>
          </select>
        </div>
        <button
          onClick={handleSubmit}
          type="button"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Initiate Transaction
        </button>
      </form>
      {transactionId && (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-gray-600">
            Transaction ID: {transactionId}
          </p>
          <button
            onClick={checkStatus}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Check Status
          </button>
          {status && <p className="text-sm text-gray-600">Status: {status}</p>}
        </div>
      )}
    </div>
  );
}
