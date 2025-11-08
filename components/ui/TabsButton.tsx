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
  const internalButtonRef = useRef<HTMLButtonElement>(null);
  const [buttonWidth, setButtonWidth] = useState<number>(160); // Default w-32

  useEffect(() => {
    if (textRef.current && internalButtonRef.current) {
      // Get computed styles to extract padding
      const computedStyles = window.getComputedStyle(internalButtonRef.current);
      const paddingLeft = parseFloat(computedStyles.paddingLeft);
      const paddingRight = parseFloat(computedStyles.paddingRight);
      const totalPadding = paddingLeft + paddingRight;

      // Get the actual text width and add padding
      const textWidth = textRef.current.scrollWidth;
      const totalWidth = textWidth + totalPadding;
      setButtonWidth(totalWidth);
    }
  }, [label]);

  // Handle both internal and external refs
  const handleRef = (el: HTMLButtonElement | null) => {
    internalButtonRef.current = el;
    if (buttonRef) {
      buttonRef(el);
    }
  };

  return (
    <motion.button
      ref={handleRef}
      onClick={() => onClick(id)}
      data-tab-id={id}
      type="button"
      aria-pressed={active}
      whileTap={{ scale: 0.98 }}
      className="relative flex items-center justify-center px-4 2xl:px-[1.39vw] py-4 2xl:py-[1.39vw] text-[16px] md:text-[18px] lg:text-[22px] xl:text-[22px] 2xl:text-[1.53vw] transition-colors flex-shrink-0"
      style={{
        width: `${buttonWidth}px`,
        minWidth: '8rem', // Fallback min-width (w-32)
      }}
    >
      {active && (
        <motion.span
          layoutId="active-tab-pill"
          className="absolute inset-0 rounded-t-[30px] 2xl:rounded-t-[2.08vw] bg-[#ffdc81] w-full h-full"
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
        <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-1 h-[2px] 2xl:h-[0.14vw] w-0 group-hover:w-2/3 transition-all duration-200 bg-white/60" />
      )}
    </motion.button>
  );
}