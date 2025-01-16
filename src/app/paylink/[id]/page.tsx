import { notFound } from "next/navigation";
import PaymentForm from "@/components/PayInvoiceForm";
import { baseUrl } from "@/app/strings";

interface PaymentPageProps {
  params: {
    id: string;
  };
}

async function getInvoiceData(id: string) {
  try {
    const response = await fetch(`${baseUrl}/api/invoice/get-invoice/${id}`, {
      next: { revalidate: 0 }, // Don't cache this request
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return null;
  }
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const invoiceData = await getInvoiceData(params.id);

  if (!invoiceData || !invoiceData.data) {
    notFound();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <PaymentForm
        invoiceId={params.id}
        receiverAddress={invoiceData.data.receiverAddress}
        merchantAddress={invoiceData.data.merchantAddress}
        title = {invoiceData.data.title}
      />
    </div>
  );
}
