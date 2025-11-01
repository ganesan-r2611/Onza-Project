"use client";

import React from "react";
import { motion } from "framer-motion";

type Props = {
  id: string;
  label: string;
  active: boolean;
  onClick: (id: string) => void;
  buttonRef?: (el: HTMLButtonElement | null) => void;
};

/**
 * Animated tab with shared-layout "pill" that slides/reshapes between active tabs.
 */
export default function TabButton({
  id,
  label,
  active,
  onClick,
  buttonRef,
}: Props) {
  return (
    <motion.button
      ref={buttonRef}
      onClick={() => onClick(id)}
      data-tab-id={id}
      type="button"
      aria-pressed={active}
      whileTap={{ scale: 0.98 }}
      className="relative flex items-center justify-center md:w-48 lg:w-56 px-4 py-4 text-[16px] md:text-[20px] lg:text-[22px] transition-colors"
    >
      {active && (
        <motion.span
          layoutId="active-tab-pill"
          className="absolute inset-0 rounded-t-[30px] bg-[#ffdc81] w-full h-full"
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
        />
      )}

      <span
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
