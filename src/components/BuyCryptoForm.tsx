"use client";

import React, { useState, useEffect } from "react";
import {
  FaExchangeAlt,
  FaDollarSign,
  FaPhoneAlt,
  FaUser,
  FaNetworkWired,
  FaWallet,
  FaStamp,
} from "react-icons/fa";
import { useActiveAccount } from "thirdweb/react";
import { formatPhoneNumber } from "../utils/phoneNumber";
import ConnectWallet from "./connectWallet";
import generateIdempotencyKey from "../utils/generateIdempotencykey";
import getChannel from "@/utils/getChannel";
import StatusModal from "./statusModal";

interface BuyCryptoFormProps {
  merchantAddress: string;
}

export default function BuyCryptoForm({ merchantAddress }: BuyCryptoFormProps) {
  const address = useActiveAccount()?.address;
  const [phoneNumber, setPhoneNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [reference, setReference] = useState("");
  const [walletAddress, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<
    "pending" | "in_progress" | "success" | "error"
  >("pending");
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const formattedPhone = formatPhoneNumber(phoneNumber);
  const ghsRate = "5";
  const payingAmount = (Number(amount) * parseFloat(ghsRate)).toString();
  const exref = generateIdempotencyKey({
    walletAddress: walletAddress,
    amount,
    network,
    phoneNumber,
    reference: reference,
  });
  const channelNumber = getChannel(network);

  const [isPolling, setIsPolling] = useState<boolean>(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchTransactionStatus = async () => {
      if (!transactionId) return;

      try {
        setIsPolling(true); // Start polling

        const response = await fetch(
          `/api/status/collection?transactionId=${transactionId}`
        );
        const data = await response.json();
        console.log("Polling API Response:", data); // Debugging log

        if (data.success && data.data && data.data.status) {
          setTransactionStatus(data.data.status);

          // Check for status updates to stop polling once it reaches a final state
          if (["success", "error"].includes(data.data.status)) {
            console.log("Transaction complete, stopping polling");
            clearInterval(intervalId); // Stop polling
          }
        } else {
          console.error("API response error:", data);
          setTransactionStatus("error");
          clearInterval(intervalId); // Stop polling on error
        }
      } catch (error) {
        console.error("Polling Error:", error);
        setTransactionStatus("error");
        clearInterval(intervalId); // Stop polling on error
      } finally {
        setIsPolling(false); // Stop polling flag
      }
    };

    // Poll every 5 seconds if there's a transaction ID
    if (transactionId) {
      fetchTransactionStatus(); // Initial call
      intervalId = setInterval(fetchTransactionStatus, 5000); // Poll every 5 seconds
    }

    // Cleanup interval on unmount or when transactionId changes
    return () => {
      clearInterval(intervalId);
    };
  }, [transactionId]); //
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTransactionStatus("pending"); // Start with a "pending" status

    try {
      const response = await fetch("/api/momo-transaction/send-crypto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TRANSACT_KEY}`,
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          amount: parseFloat(payingAmount),
          channel: channelNumber,
          externalref: exref,
          otpcode: "",
          reference: reference,
          address: walletAddress,
          merchantAddress: merchantAddress,
        }),
      });
      const data = await response.json();

      if (data.success) {
        setTransactionId(data.data); // Save the transaction ID
        setTransactionStatus("in_progress"); // Update the status to "in_progress"
        setModalOpen(true); // Open the modal only after transaction ID is set
        console.log("frontend transactinId", transactionId);
      } else {
        setTransactionStatus("error"); // Handle error if transaction failed
      }
    } catch (error) {
      console.error("Error initiating transaction:", error);
      setTransactionStatus("error"); // Handle error if there is a problem with the request
    } finally {
      setLoading(false); // End the loading state
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-blue-200">
      <h2 className="text-2xl font-semibold text-blue-600 mb-6">Buy Crypto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Phone Number
          </label>
          <div className="relative">
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-2 pl-10 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              placeholder="0241182711"
              required
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaPhoneAlt className="text-gray-400" />
            </div>
          </div>
        </div>
        <div>
          <label
            htmlFor="accountName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Account Name
          </label>
          <div className="relative">
            <input
              type="text"
              id="accountName"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full p-2 pl-10 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              placeholder="Enter account name"
              required
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaUser className="text-gray-400" />
            </div>
          </div>
        </div>
        <div>
          <label
            htmlFor="walletAddress"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Wallet Address
          </label>
          <div className="relative">
            <input
              type="text"
              id="walletAddress"
              value={walletAddress}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 pl-10 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              placeholder="Enter Wallet Address"
              required
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaWallet className="text-gray-400" />
            </div>
          </div>
        </div>
        <div>
          <label
            htmlFor="reference"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Reference
          </label>
          <div className="relative">
            <input
              type="text"
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full p-2 pl-10 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              placeholder="Enter Reference"
              required
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaStamp className="text-gray-400" />
            </div>
          </div>
        </div>
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Amount of token to Buy
          </label>
          <div className="relative">
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 pl-10 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              placeholder="Enter amount"
              required
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaDollarSign className="text-gray-400" />
            </div>
          </div>
        </div>
        <div>
          <label
            htmlFor="network"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Network
          </label>
          <div className="relative">
            <select
              id="network"
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className="w-full p-2 pl-10 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300 appearance-none"
              required
            >
              <option className="text-gray-800" value="">
                Select a network
              </option>
              <option className="text-gray-800" value="MTN">
                MTN
              </option>
              <option className="text-gray-800" value="Vodafone">
                Vodafone
              </option>
              <option className="text-gray-800" value="AirtelTigo">
                AirtelTigo
              </option>
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaNetworkWired className="text-gray-400" />
            </div>
          </div>
        </div>
        <p className="text-sm text-blue-600">
          You are paying {payingAmount} GHS at rate of 5GHS per token
        </p>
        <div>
          {address ? (
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
            >
              <FaExchangeAlt className="mr-2" />
              {loading ? "Processing..." : "Initiate Transaction"}
            </button>
          ) : (
            <ConnectWallet />
          )}
        </div>
        {isPolling && <p>Polling for transaction status...</p>}
      </form>

      <StatusModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setTransactionId(null); // Reset transaction ID
          setTransactionStatus("pending"); // Reset status
        }}
        status={transactionStatus}
        transactionId={transactionId}
      />
    </div>
  );
}
