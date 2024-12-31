"use client";

import { useState } from "react";
import { FaWallet, FaMoneyBillWave } from "react-icons/fa";
import {
  useActiveAccount,
  useSendBatchTransaction,
  useSendTransaction,
} from "thirdweb/react";
import {
  prepareContractCall,
  PreparedTransaction,
  sendTransaction,
  toWei,
} from "thirdweb";
import { approve } from "thirdweb/extensions/erc20";
import { Strings } from "../strings";
import { contract, tokenContract } from "../contract";

export default function Profile() {
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [fiatAmount, setFiatAmount] = useState("");
  const { mutateAsync: sendTx } = useSendTransaction();
  const account = useActiveAccount();
  const address = account ? account.address : "";
  let Account: any;
  if (account) {
    Account = account;
  }
  const { mutate: sendBatchTransaction, error: txError } =
    useSendBatchTransaction();
  const walletAddress = address;

  // Placeholder merchant data
  const merchant = {
    name: "Merchant Name",
    stakedBalance: 10000,
    rewardBalance: 500,
    availableBalance: 5000,
    availableFiat: 20000,
  };

  const handleStake = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const approval = approve({
        contract: tokenContract,
        spender: Strings.contractAddress,
        amount: stakeAmount,
      });
      const stake = prepareContractCall({
        contract,
        method: "stakeTokens",
        params: [toWei(stakeAmount)],
      }) as PreparedTransaction;

      await sendBatchTransaction([approval, stake], Account);
      // const approval =
      // await sendTransaction({ transaction: approval, account: Account });

      // const transaction = (await prepareContractCall({
      //   contract,
      //   method: "stakeTokens",
      //   params: [toWei(stakeAmount)],
      // })) as PreparedTransaction;

      // await sendTx(transaction);
     
    } catch (error) {
      console.log(txError);
    }

    // // Placeholder for staking logic
    // console.log("Staking:", stakeAmount);
  };

  const handleUnstake = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for unstaking logic
    console.log("Unstaking:", unstakeAmount);
  };

  const handleClaimRewards = () => {
    // Placeholder for claiming rewards
    console.log("Claiming rewards");
  };

  const handleUpdateFiat = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for updating available fiat
    console.log("Updating available fiat:", fiatAmount);
  };

  return (
    <div className="min-h-screen bg-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 border border-blue-200">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-blue-600">
              Merchant Profile
            </h1>
            <div className="flex items-center text-blue-600">
              <FaWallet className="mr-2" />
              <span className="font-medium">{walletAddress}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold text-blue-600 mb-4">
                Account Information
              </h2>
              <p className="mb-2">
                <span className="font-medium">Name:</span> {merchant.name}
              </p>
              <p className="mb-2">
                <span className="font-medium">Staked Balance:</span>{" "}
                {merchant.stakedBalance} USDC
              </p>
              <p className="mb-2">
                <span className="font-medium">Reward Balance:</span>{" "}
                {merchant.rewardBalance} USDC
              </p>
              <p className="mb-2">
                <span className="font-medium">Available Balance:</span>{" "}
                {merchant.availableBalance} USDC
              </p>
              <p>
                <span className="font-medium">Available Fiat:</span> $
                {merchant.availableFiat}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-blue-600 mb-4">
                Actions
              </h2>
              <form onSubmit={handleStake} className="mb-4">
                <div className="flex items-center">
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="Amount to stake"
                    className="flex-grow p-2 border border-blue-200 rounded-l-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded-r-md hover:bg-blue-700 transition-colors duration-300"
                  >
                    Stake
                  </button>
                </div>
              </form>

              <form onSubmit={handleUnstake} className="mb-4">
                <div className="flex items-center">
                  <input
                    type="number"
                    value={unstakeAmount}
                    onChange={(e) => setUnstakeAmount(e.target.value)}
                    placeholder="Amount to unstake"
                    className="flex-grow p-2 border border-blue-200 rounded-l-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded-r-md hover:bg-blue-700 transition-colors duration-300"
                  >
                    Unstake
                  </button>
                </div>
              </form>

              <button
                onClick={handleClaimRewards}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 mb-4"
              >
                Claim Rewards
              </button>
            </div>
          </div>

          <div className="border-t border-blue-200 pt-8">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">
              Update Available Fiat
            </h2>
            <form onSubmit={handleUpdateFiat} className="flex items-center">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMoneyBillWave className="text-gray-400" />
                </div>
                <input
                  type="number"
                  value={fiatAmount}
                  onChange={(e) => setFiatAmount(e.target.value)}
                  placeholder="Enter available fiat amount"
                  className="w-full pl-10 p-2 border border-blue-200 rounded-l-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-r-md hover:bg-blue-700 transition-colors duration-300"
              >
                Update Fiat
              </button>
            </form>
          </div>

          <div className="text-center mt-8">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
