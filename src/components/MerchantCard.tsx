import Link from "next/link";

interface MerchantCardProps {
  merchant: {
    id: number;
    name: string;
    availableAmount: number;
    network: string;
  };
  isBuyCrypto: boolean;
}

export default function MerchantCard({
  merchant,
  isBuyCrypto,
}: MerchantCardProps) {
  return (
    <Link href={`/merchant/${merchant.id}`}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-blue-200">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">
          {merchant.name}
        </h2>
        <p className="text-lg text-gray-700 mb-2">
          <span className="font-medium">Available:</span>{" "}
          {merchant.availableAmount} {isBuyCrypto ? "Crypto" : "Fiat"}
        </p>
        <p className="text-lg text-gray-700">
          <span className="font-medium">Network:</span> {merchant.network}
        </p>
      </div>
    </Link>
  );
}
