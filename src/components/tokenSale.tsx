import { contract } from "@/app/contract";
import React from "react";
import { toEther } from "thirdweb";
import { useReadContract } from "thirdweb/react";

export default function TokenSale() {
  const { data: rate } = useReadContract({
    contract: contract,
    method: "rate",
    params: [],
  });
  const { data: bnbRaised, isLoading:loading, isError:error } = useReadContract({
    contract: contract,
    method: "weiRaised",
    params: [],
  });

  const rateInEther = rate ? toEther(rate) : 610;

  if (bnbRaised) {
    console.log("raised:", bnbRaised);
  }

  const BNBRaised = bnbRaised ? toEther(bnbRaised) : "0";
  console.log("raised:", BNBRaised);
  const sold = Number(BNBRaised) * Number(rateInEther);

  return (
    <main className="w-full bg-white rounded-lg shadow-md overflow-hidden">
      <h2 className="text-2xl font-bold text-blue-900 p-6 border-b">
        Token Sale Summary
      </h2>

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                  Metric
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-blue-100">
              <tr className="hover:bg-blue-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">
                  Total BNB Raised
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">
                  {BNBRaised}
                </td>
              </tr>
              <tr className="hover:bg-blue-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">
                  Total Token Sold
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">
                  {sold.toString()}
                </td>
              </tr>
              {/* Uncomment and add more rows as needed */}
              {/* <tr className="hover:bg-blue-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">
              Current Token Price
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">
              {token_price.toString()}
            </td>
          </tr> */}
            </tbody>
          </table>
        </div>
      )}

      {loading && <p className="text-blue-500 p-6">Loading...</p>}
      {error && <p className="text-red-500 p-6">Error: {error}</p>}
    </main>
  );
}
