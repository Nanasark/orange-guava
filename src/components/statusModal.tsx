import React, { useEffect, useRef } from "react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: "pending" | "in_progress" | "success" | "error";
}

 const StatusModal: React.FC<StatusModalProps> = ({
   isOpen,
   onClose,
   status,
 }) => {
   const statusConfig = {
     pending: {
       title: "Transaction Pending",
       icon: <Loader2 className="h-8 w-8 animate-spin text-blue-500" />,
       message: "Your transaction is being processed. Please wait...",
     },
     in_progress: {
       title: "Transaction In Progress",
       icon: <Loader2 className="h-8 w-8 animate-spin text-blue-500" />,
       message:
         "Your transaction is in progress. This may take a few moments...",
     },
     success: {
       title: "Transaction Successful",
       icon: <CheckCircle className="h-8 w-8 text-green-500" />,
       message: "Your transaction has been completed successfully!",
     },
     error: {
       title: "Transaction Failed",
       icon: <AlertCircle className="h-8 w-8 text-red-500" />,
       message:
         "There was an error processing your transaction. Please try again.",
     },
   };

   const currentStatus = statusConfig[status];

   if (!isOpen) return null;

   return (
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
       <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
         <div className="text-center">
           <h2 className="text-xl font-semibold text-gray-800">
             {currentStatus.title}
           </h2>
         </div>
         <div className="flex flex-col items-center justify-center space-y-4 py-6">
           {currentStatus.icon}
           <p className="text-center text-sm text-gray-500">
             {currentStatus.message}
           </p>
         </div>
         <div className="mt-4 text-center">
           <button
             onClick={onClose}
             className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
           >
             Close
           </button>
         </div>
       </div>
     </div>
   );
 };


export default StatusModal;
