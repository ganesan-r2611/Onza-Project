"use client";
import * as React from "react";

type ButtonVariant = "solid" | "outline" | "gradient";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  variant?: ButtonVariant;
  layout_width?: string;           // e.g. "100%"
  padding?: string;                // e.g. "22px 34px"
  text_font_size?: string;         // tailwind class e.g. "text-[20px]"
  text_font_weight?: string;       // tailwind class e.g. "font-normal"
  text_line_height?: string;       // tailwind class e.g. "leading-[27px]"
  text_color?: string;             // tailwind class e.g. "text-white"
  size?: string;
}

const base =
  "inline-flex items-center justify-center rounded-full transition";

export default function Button({
  text,
  variant = "solid",
  className = "",
  layout_width,
  padding,
  text_font_size,
  text_font_weight,
  text_line_height,
  text_color,
  ...rest
}: ButtonProps) {
  const style: React.CSSProperties = {
    width: layout_width,
    padding,
  };

  const variantCls =
    variant === "outline"
      ? "border border-white/30 bg-transparent"
      : variant === "gradient"
      ? "glass-border-button" // you already have the class
      : "bg-black text-white";

  return (
    <button
      {...rest}
      style={style}
      className={[
        base,
        variantCls,
        text_font_size,
        text_font_weight,
        text_line_height,
        text_color,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {text}
    </button>
  );
}
