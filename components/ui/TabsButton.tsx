"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

type Props = {
  id: string;
  label: string;
  active: boolean;
  onClick: (id: string) => void;
  buttonRef?: (el: HTMLButtonElement | null) => void;
};

export default function TabButton({
  id,
  label,
  active,
  onClick,
  buttonRef,
}: Props) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [buttonWidth, setButtonWidth] = useState<number>(160); // Default w-32

  useEffect(() => {
    if (textRef.current) {
      // Get the actual text width and add padding
      const textWidth = textRef.current.scrollWidth;
      const totalWidth = textWidth + 32; // 32px for px-4 (16px left + 16px right)
      setButtonWidth(totalWidth);
    }
  }, [label]);

  return (
    <motion.button
      ref={buttonRef}
      onClick={() => onClick(id)}
      data-tab-id={id}
      type="button"
      aria-pressed={active}
      whileTap={{ scale: 0.98 }}
      className="relative flex items-center justify-center px-4 py-4 text-[16px] md:text-[18px] lg:text-[22px] xl:text-[22px] transition-colors flex-shrink-0"
      style={{
        width: `${buttonWidth}px`,
        minWidth: '8rem', // Fallback min-width (w-32)
      }}
    >
      {active && (
        <motion.span
          layoutId="active-tab-pill"
          className="absolute inset-0 rounded-t-[30px] bg-[#ffdc81] w-full h-full"
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
        />
      )}

      <span
        ref={textRef}
        className={`relative z-10 text-center font-regular whitespace-nowrap ${
          active ? "text-[#4a4a4a]" : "text-[#a4a4a4] hover:text-[#fafafa]"
        }`}
      >
        {label}
      </span>

      {!active && (
        <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-1 h-[2px] w-0 group-hover:w-2/3 transition-all duration-200 bg-white/60" />
      )}
    </motion.button>
  );
}