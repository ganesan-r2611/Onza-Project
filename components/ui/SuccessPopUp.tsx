// components/ui/SuccessPopup.tsx
"use client";

import { useEffect } from "react";
import GlobalButton from "./GlobalButton";

interface SuccessPopupProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
}

export default function SuccessPopup({
  isVisible,
  onClose,
  title = "Message Sent Successfully!",
  message = "Thank you for reaching out to us. Our team will be in touch to help you get started on your portfolio.",
  buttonText = "Back to homepage"
}: SuccessPopupProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center ">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popup Content */}
      <div className="relative bg-[#121819] border border-[#ffdc81]/20 rounded-2xl shadow-2xl  md:max-w-xl w-full mx-auto z-10">
        <div className="px-[80px] py-[40px] text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#ffdc81] rounded-full flex items-center justify-center">
              <svg 
                className="w-8 h-8 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-light text-[#ffdc81] mb-4">
            {title}
          </h3>

          {/* Message */}
          <p className="text-[16px] font-light text-[#e6e0da] leading-relaxed mb-6">
            {message}
          </p>

          {/* Button */}
          <div className="flex justify-center">
            <GlobalButton
              onClick={onClose}
              width={"auto"}
              height={48}
              paddingX={32}
              paddingY={16}
              fontSize={16}
              variant="secondary"
            >
              {buttonText}
            </GlobalButton>
          </div>
        </div>
      </div>
    </div>
  );
}