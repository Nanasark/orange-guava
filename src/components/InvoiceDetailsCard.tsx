import { CreditCard, DollarSign, User, Briefcase } from "lucide-react";

interface InvoiceDetailsProps {
  title: string;
  description: string;
  amount?: string;
  payerName?: string;
  merchantName?: string;
}

export function InvoiceDetailsCard({
  title,
  description,
  amount,
  payerName,
  merchantName,
}: InvoiceDetailsProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="space-y-4">
        {amount && (
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-gray-400" />
            <span>Amount: {amount}</span>
          </div>
        )}
        {payerName && (
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-400" />
            <span>Payer: {payerName}</span>
          </div>
        )}
        {merchantName && (
          <div className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5 text-gray-400" />
            <span>Merchant: {merchantName}</span>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5 text-gray-400" />
          <span>Secure Payment</span>
        </div>
      </div>
    </div>
  );
}
