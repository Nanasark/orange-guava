"use client";

import { useState, useEffect } from "react";
import {
  FaExchangeAlt,
  FaDollarSign,
  FaPhoneAlt,
  FaNetworkWired,
  FaStamp,
} from "react-icons/fa";
import { useActiveAccount } from "thirdweb/react";
import ConnectWallet from "@/components/connectWallet";
import StatusModal from "@/components/statusModal";
import { calculateTotalAmount } from "@/utils/calculateFee";
import getChannel from "@/utils/getChannel";
import { DollarSign, Phone, Stamp } from "lucide-react";

interface PaymentFormProps {
  invoiceId: string;
  receiverAddress: string;
  merchantAddress: string;
  title: string;
}

export default function PaymentForm({
  invoiceId,
  receiverAddress,
  merchantAddress,
  title,
}: PaymentFormProps) {
  const address = useActiveAccount()?.address;
  const [phoneNumber, setPhoneNumber] = useState("");
  const [reference, setReference] = useState("");
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<
    "pending" | "in_progress" | "success" | "error"
  >("pending");
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const feeConfig = {
    fiatFee: 0.5,
    exchangeRate: 5,
  };

  const calculatedAmount = calculateTotalAmount(parseFloat(amount), feeConfig);
  const collection = "collection";
  const channelNumber = getChannel(network, collection);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchTransactionStatus = async () => {
      if (!transactionId) return;

      try {
        setIsPolling(true);
        const response = await fetch(`/api/status/collection/${transactionId}`);
        const data = await response.json();

        if (data.success && data.data?.status) {
          setTransactionStatus(data.data.status);

          if (["success", "error"].includes(data.data.status)) {
            clearInterval(intervalId);
          }
        } else {
          setTransactionStatus("error");
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error("Polling Error:", error);
        setTransactionStatus("error");
        clearInterval(intervalId);
      } finally {
        setIsPolling(false);
      }
    };

    if (transactionId) {
      fetchTransactionStatus();
      intervalId = setInterval(fetchTransactionStatus, 5000);
    }

    return () => clearInterval(intervalId);
  }, [transactionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTransactionStatus("pending");

    try {
      const response = await fetch("/api/momo-transaction/send-crypto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TRANSACT_KEY}`,
        },
        body: JSON.stringify({
          phoneNumber,
          amount: calculatedAmount.amountToSendInGHS,
          channel: channelNumber,
          otpcode: "",
          reference,
          address: receiverAddress,
          merchantAddress,
        }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        setTransactionId(responseData.data.data);
        setTransactionStatus("in_progress");
        setModalOpen(true);
      } else {
        setTransactionStatus("error");
      }
    } catch (error) {
      console.error("Error initiating transaction:", error);
      setTransactionStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-6xl w-full">
        <div className="flex flex-col md:flex-row">
          {/* Left column */}
          <div className="bg-blue-600 text-white p-8 md:w-1/2">
            <h1 className="text-4xl font-bold mb-6">Transakt Pay</h1>
            <div className="text-center">
              <h2
                className="text-2xl font-medium text-gray-500 mb-2"
                style={{
                  textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)", // Shadow for "Payment for"
                }}
              >
                Payment for
              </h2>
              <h2
                className="text-3xl font-bold text-white"
                style={{
                  textShadow: "2px 2px 6px rgba(0, 0, 0, 0.7)", // Stronger shadow for title
                  WebkitTextStroke: "2px black", // Black outline for the title text
                }}
              >
                {title}
              </h2>
            </div>

            <div className="mb-3">
              <svg
                className="w-80 h-80 mx-auto"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="100" cy="100" r="80" fill="#4CAF50" />
                <path
                  d="M70 100 L90 120 L130 80"
                  stroke="white"
                  strokeWidth="10"
                  fill="none"
                />
              </svg>
            </div>
            <div className="space-y-4">
              <p
                className="text-xl text-blue-300 font-semibold"
                style={{
                  textShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)", // Soft shadow
                  WebkitTextStroke: "1px #00bcd4", // Light blue stroke for outline
                }}
              >
                Fast and secure payments with USDC
              </p>
              <hr className="border-t border-blue-300" />{" "}
              {/* Divider with light blue color */}
              <p
                className="text-lg text-blue-300"
                style={{
                  textShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)", // Soft shadow
                  WebkitTextStroke: "1px #00bcd4", // Light blue stroke for outline
                }}
              >
                Experience seamless transactions across multiple networks
              </p>
              <hr className="border-t border-blue-300" />{" "}
              {/* Divider with light blue color */}
              <p
                className="text-lg text-blue-300"
                style={{
                  textShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)", // Soft shadow
                  WebkitTextStroke: "1px #00bcd4", // Light blue stroke for outline
                }}
              >
                Competitive rates: 5 GHS per USDC token
              </p>
            </div>
          </div>

          {/* right side */}
          <div className="p-8 md:w-1/2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Make a Payment
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0241182711"
                    required
                  />
                  <Phone
                    className="absolute top-3 left-3 text-gray-400"
                    size={18}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="reference"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Reference
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="reference"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Reference"
                    required
                  />
                  <Stamp
                    className="absolute top-3 left-3 text-gray-400"
                    size={18}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Amount of USDC
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter amount"
                    required
                  />
                  <DollarSign
                    className="absolute top-3 left-3 text-gray-400"
                    size={18}
                  />
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
                You are paying {calculatedAmount.totalAmountInGHS} GHS at rate
                of 5GHS per token
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

              {isPolling && (
                <p className="text-sm text-center text-gray-600">
                  Polling for transaction status...
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
      <StatusModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setTransactionId(null);
          setTransactionStatus("pending");
        }}
        status={transactionStatus}
      />
    </div>
  );
}
