"use client";

import { useState } from "react";
import { FaUser, FaBuilding, FaPhone, FaEnvelope } from "react-icons/fa";
import Link from "next/link";
import { formatPhoneNumber } from "@/utils/phoneNumber";
import { prepareContractCall, PreparedTransaction } from "thirdweb";
import { useSendTransaction, useActiveAccount } from "thirdweb/react";
import { contract } from "../contract";
import ConnectWallet from "@/components/connectWallet";
import { isAddress } from "thirdweb";

export default function Register() {
  const account = useActiveAccount();
  const address = account ? account.address : "";

  const {
    mutateAsync: sendTx,
    isSuccess,
    status,
    error: txError,
  } = useSendTransaction();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const transaction = prepareContractCall({
        contract,
        method: "registerMerchant",
        params: [address],
      }) as PreparedTransaction;

      await sendTx(transaction);

      // const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

      // console.log(
      //   "Submitting registration with formatted phone number:",
      //   formattedPhoneNumber
      // );

      if (status === "success" || txError === null) {
        const response = await fetch("/api/merchant/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            businessName,
            businessDescription,
            address,
            email,
            phoneNumber,
          }),
        });
        const data = await response.json();
        if (data.success) {
          alert(`${businessName} registered successfully`);
        }
      } else if (status == "error") {
        if (
          (txError.message =
            "Error - Already registered contract: 0xc0785378991C2A4eb1057bA462b71BA6348dfCA0 chainId: 80002")
        ) {
          const response = await fetch("/api/merchant/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firstName,
              lastName,
              businessName,
              businessDescription,
              address,
              email,
              phoneNumber,
            }),
          });
          const data = await response.json();
          if (data.success) {
            alert(`${businessName} registered successfully`);
          }
        } else {
          alert(txError);
        }
      }
    } catch (error) {
      console.log(txError?.message);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-600">
            Register as Merchant
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="sr-only">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="sr-only">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="businessName" className="sr-only">
                Business Name
              </label>
              <input
                id="businessName"
                name="businessName"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Business Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="businessDescription" className="sr-only">
                Business Description
              </label>
              <textarea
                id="businessDescription"
                name="businessDescription"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Business Description"
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="sr-only">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            {isAddress(address) ? (
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Register
              </button>
            ) : (
              <ConnectWallet />
            )}
          </div>
        </form>
        <div className="text-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
