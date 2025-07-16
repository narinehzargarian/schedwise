import React from "react";

export default function Modal({ children, isOpen, onClose, title }) {
  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 backdrop-blur-sm z-50"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
      >
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full overflow-hidden">
          <div className="flex items-center justify-between bg-blue-500 p-4">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="text-white text-xl"
            >
              &times;
            </button>
          </div>
          <div className="p-6 text-gray-800">
            {children}
          </div>    
        </div>
      </div>
    </>
  );
}