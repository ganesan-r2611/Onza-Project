"use client";
import React from "react";

type Props = {
  id: string;
  label: string;
  active: boolean;
  onClick: (id: string) => void;
  // allow parent to capture the button node
  buttonRef?: (el: HTMLButtonElement | null) => void;
  [data: string]: any; // for data-tab-id passthrough
};

export default function TabButton({
  id,
  label,
  active,
  onClick,
  buttonRef,
  ...rest
}: Props) {
  return (
    <button
      ref={buttonRef}
      onClick={() => onClick(id)}
      className={`px-[34px] py-[14px] text-[22px] font-normal leading-[29px] text-center transition-all whitespace-nowrap ${
        active
          ? "bg-[#ffdc81] text-[#4a4a4a] rounded-t-[24px]"
          : "text-[#a4a4a4] hover:text-[#fafafa]"
      }`}
      aria-pressed={active}
      type="button"
      {...rest}
    >
      {label}
    </button>
  );
}
