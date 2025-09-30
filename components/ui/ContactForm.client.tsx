"use client";
import { useState } from "react";
import Button from "./Button";

export default function ContactForm({
  data,
}: {
  data: {
    namePlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
    submitText: string;
  };
}) {
  const [formData, setForm] = useState({ name: "", email: "", message: "" });

  const onChange = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("submit", formData);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-8 sm:gap-10 w-full max-w-[420px] mx-auto"
    >
      {/* Inputs */}
      <div className="flex flex-col gap-8 sm:gap-10 w-full mt-2">
        <div className="flex flex-col gap-8 w-full">
          <input
            type="text"
            placeholder={data.namePlaceholder}
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value)}
            className="w-full bg-transparent border-b border-[#8e8e8e] placeholder:text-[#8e8e8e] text-[16px] sm:text-[18px] font-light text-[#fafafa] focus:outline-none focus:border-[#ffdc81] py-3"
          />
          <input
            type="email"
            placeholder={data.emailPlaceholder}
            value={formData.email}
            onChange={(e) => onChange("email", e.target.value)}
            className="w-full bg-transparent border-b border-[#8e8e8e] placeholder:text-[#8e8e8e] text-[16px] sm:text-[18px] font-light text-[#fafafa] focus:outline-none focus:border-[#ffdc81] py-3"
          />
        </div>

        <textarea
          placeholder={data.messagePlaceholder}
          value={formData.message}
          onChange={(e) => onChange("message", e.target.value)}
          rows={5}
          className="w-full resize-none bg-transparent border-b border-[#8e8e8e] placeholder:text-[#8e8e8e] text-[16px] sm:text-[18px] font-light text-[#fafafa] focus:outline-none focus:border-[#ffdc81] py-3"
        />
      </div>

      {/* Submit */}
      <Button
        text={data.submitText}
        text_font_size="text-[18px] sm:text-[20px]"
        text_font_weight="font-normal"
        text_line_height="leading-[27px]"
        text_color="text-white"
        layout_width="100%"
        padding="20px 30px"
        variant="gradient"
        size="medium"
        type="submit"
        className="glass-border-button w-full"
      />
    </form>
  );
}
