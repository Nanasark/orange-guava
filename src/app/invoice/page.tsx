"use client";

import { useState } from "react";
import CreateInvoiceForm from "@/components/CreateInvoiceForm";
import { InvoiceDetailsCard } from "@/components/InvoiceDetailsCard";
import { FileIcon as FileInvoice, ArrowRight } from "lucide-react";

export default function CreateInvoicePage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="bg-indigo-600 text-white p-12 flex flex-col justify-between relative overflow-hidden">
            <div>
              <FileInvoice className="w-16 h-16 mb-6" />
              <h1 className="text-4xl font-bold mb-4">Create Invoice</h1>
              <p className="text-indigo-200 mb-8">
                Generate a new invoice and payment link with ease.
              </p>
            </div>
            <InvoiceDetailsCard
              title="Streamlined Process"
              description="Our intuitive form makes creating professional invoices quick and effortless."
            />
            <div className="absolute bottom-0 right-0 transform translate-y-1/3 translate-x-1/4">
              <svg
                width="300"
                height="300"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="rgba(255,255,255,0.1)"
                  d="M44.9,-76.8C59.7,-69.8,74,-59.9,83.4,-46.4C92.8,-32.8,97.3,-16.4,96.9,-0.2C96.5,15.9,91.2,31.8,82.6,46.2C74,60.7,62,73.8,47.2,81.5C32.4,89.3,16.2,91.7,0.1,91.5C-16,91.4,-32,88.6,-46.3,81.5C-60.6,74.3,-73.2,62.8,-81.9,48.5C-90.6,34.2,-95.4,17.1,-95.7,-0.2C-96,-17.5,-91.8,-34.9,-82.9,-49.5C-73.9,-64,-60.3,-75.6,-45.3,-82.6C-30.3,-89.5,-15.2,-91.8,0.3,-92.4C15.8,-93,31.5,-91.9,44.9,-76.8Z"
                  transform="translate(100 100)"
                />
              </svg>
            </div>
          </div>
          <div
            className="p-12 transition-all duration-300 ease-in-out transform"
            style={{
              transform: isHovered ? "translateY(-8px)" : "translateY(0)",
              boxShadow: isHovered ? "0 10px 30px rgba(0, 0, 0, 0.1)" : "none",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <h2 className="text-3xl font-semibold mb-6 text-gray-800 flex items-center">
              Fill Out Details
              <ArrowRight className="ml-2 w-6 h-6 text-indigo-600" />
            </h2>
            <CreateInvoiceForm />
          </div>
        </div>
      </div>
    </div>
  );
}
