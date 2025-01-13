import CreateInvoiceForm from "@/components/CreateInvoiceForm";
import { InvoiceDetailsCard } from "@/components/InvoiceDetailsCard";

export default function CreateInvoicePage() {
  return (
    <div className="container mx-auto px-4 py-8 bg-slate-200">
      <h1 className="text-3xl font-bold mb-8">Create Invoice</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <InvoiceDetailsCard
            title="Create a New Invoice"
            description="Fill out the form to generate a new invoice and payment link."
          />
        </div>
        <div>
          <CreateInvoiceForm />
        </div>
      </div>
    </div>
  );
}
