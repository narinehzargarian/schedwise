import { XCircle } from "lucide-react";
import React, { useEffect } from "react";

export default function ErrorDialog({children, onClose, title= "Error" }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);
  
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 backdrop-blur-sm z-40"
      />

      {/* Alert Dialog */}
      <div
        role="alertdialog"
        aria-modal="true"
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
      >
        <div className="bg-white border border-red-400 text-red-800 rounded-lg shadow-lg w-full max-w-sm overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between bg-red-100 px-4 py-2">
            <div className="flex items-center gap-2">
              <XCircle className="w-6 h-6 text-red-600" />
              <h2 className="text-lg font-semibold">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-red-600 hover:text-red-800"
              aria-label="Close error dialog"
            >
              &times;
            </button>
          </div>

          {/* Body */}
          <div className="p-4 text-sm">
            {children}
          </div>

          {/* Actions */}
          <div className="px-4 pb-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </>
  );
}