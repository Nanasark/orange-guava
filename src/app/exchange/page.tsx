"use client";
import React, { useState } from "react";
import { baseUrl } from "../strings";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { client } from "../client";
import { polygonAmoy } from "thirdweb/chains";

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
    <div className="min-h-screen bg-blue-200 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-600">
          Crypto Exchange
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="phoneNumber" className="sr-only">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Phone Number"
              />
            </div>
            <div>
              <label htmlFor="accountName" className="sr-only">
                Account Name
              </label>
              <input
                id="accountName"
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Account Name"
              />
            </div>
            <div>
              <label htmlFor="amount" className="sr-only">
                Amount of token to Buy
              </label>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Amount of token to Buy"
              />
            </div>
            <div>
              <label htmlFor="network" className="sr-only">
                Network
              </label>
              <select
                id="network"
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              >
                <option value="">Select a network</option>
                <option value="MTN">MTN</option>
                <option value="Vodafone">Vodafone</option>
                <option value="AirtelTigo">AirtelTigo</option>
              </select>
            </div>
          </div>
          <p className="mt-4 text-sm text-blue-600">
            You are paying {payingAmount} GHS at rate of 20GHS per token
          </p>

          <div>
            {address ? (
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Initiate Transaction
              </button>
            ) : (
              <ConnectButton
                client={client}
                chain={polygonAmoy}
                signInButton={{ label: "Sign In" }}
                supportedTokens={{
                  80002: [
                    {
                      name: "usdc",
                      address: "0x852e64595771b938B970e1Dc87C69A0f66bb4dD4",
                      symbol: "usdc",
                    },
                  ],
                }}
              />
            )}
          </div>
        </form>

        {transactionId && (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-gray-600">
              Transaction ID: {transactionId}
            </p>
            <button
              onClick={checkStatus}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Check Status
            </button>
            {status && (
              <p className="text-sm text-gray-600">Status: {status}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
