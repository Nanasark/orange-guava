

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function PayInvoice() {
  const router = useRouter();
  const { invoiceId } = router.query; // Extract the invoiceId from the URL

  const [invoice, setInvoice] = useState(null);
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (invoiceId) {
      // Fetch the invoice details using the invoiceId from the URL
      const fetchInvoice = async () => {
        const response = await fetch(`/api/get-invoice/${invoiceId}`);
        const data = await response.json();

        if (data.success) {
          setInvoice(data.invoice);
        } else {
          alert("Invoice not found");
        }
      };

      fetchInvoice();
    }
  }, [invoiceId]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment processing (you can implement actual payment logic here)
    alert("Payment submitted!");
    setLoading(false);
  };

  if (!invoice) return <div>Loading...</div>;

  return (
    <div>
      <h1>Pay Invoice</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Reference"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          required
        />
        <select
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
          required
        >
          <option value="">Select Network</option>
          <option value="MTN">MTN</option>
          <option value="Vodafone">Vodafone</option>
          <option value="AirtelTigo">AirtelTigo</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Submit Payment"}
        </button>
      </form>
    </div>
  );
}
