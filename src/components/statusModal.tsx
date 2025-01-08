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
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

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
        "Your crypto transaction is in progress. This may take a few moments...",
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="p-6">
          <h2 id="modal-title" className="text-lg font-semibold mb-4">
            {currentStatus.title}
          </h2>
          <div className="flex flex-col items-center justify-center space-y-4">
            {currentStatus.icon}
            <p className="text-center text-sm text-gray-500">
              {currentStatus.message}
            </p>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
