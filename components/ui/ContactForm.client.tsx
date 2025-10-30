"use client";
import { useState } from "react";
import Button from "./Button";

interface ServiceInterest {
  id: string;
  label: string;
  checked: boolean;
}

interface AssetRange {
  id: string;
  label: string;
  checked: boolean;
}

export default function ContactForm({
  data,
}: {
  data: {
    namePlaceholder: string;
    emailPlaceholder: string;
    contactNumberPlaceholder: string;
    cityPlaceholder: string;
    serviceInterests: string[];
    assetRanges: string[];
    submitText: string;
  };
}) {
  const [formData, setForm] = useState({
    name: "",
    email: "",
    contactNumber: "",
    city: "",
    serviceInterests: data.serviceInterests.map((interest) => ({
      id: interest.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      label: interest,
      checked: false,
    })),
    assetRange: "",
  });

  const onChange = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleServiceInterestChange = (id: string) => {
    setForm((prev) => ({
      ...prev,
      serviceInterests: prev.serviceInterests.map((interest) =>
        interest.id === id
          ? { ...interest, checked: !interest.checked }
          : interest
      ),
    }));
  };

  const handleAssetRangeChange = (range: string) => {
    setForm((prev) => ({ ...prev, assetRange: range }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("submit", formData);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-8 w-full max-w-[520px] mx-auto"
    >
      {/* Two Column Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <div className="flex flex-col gap-6">
          <input
            type="text"
            placeholder={data.namePlaceholder}
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value)}
            className="w-full bg-transparent border-b border-[#8e8e8e] placeholder:text-[#8e8e8e] text-[16px] font-light text-[#A4A4A4] focus:outline-none focus:border-[#ffdc81] py-3"
          />
          <input
            type="text"
            placeholder={data.contactNumberPlaceholder}
            value={formData.contactNumber}
            onChange={(e) => onChange("contactNumber", e.target.value)}
            className="w-full bg-transparent border-b border-[#8e8e8e] placeholder:text-[#8e8e8e] text-[16px] font-light text-[#A4A4A4] focus:outline-none focus:border-[#ffdc81] py-3"
          />
        </div>
        <div className="flex flex-col gap-6">
          <input
            type="email"
            placeholder={data.emailPlaceholder}
            value={formData.email}
            onChange={(e) => onChange("email", e.target.value)}
            className="w-full bg-transparent border-b border-[#8e8e8e] placeholder:text-[#8e8e8e] text-[16px] font-light text-[#A4A4A4] focus:outline-none focus:border-[#ffdc81] py-3"
          />
          <input
            type="text"
            placeholder={data.cityPlaceholder}
            value={formData.city}
            onChange={(e) => onChange("city", e.target.value)}
            className="w-full bg-transparent border-b border-[#8e8e8e] placeholder:text-[#8e8e8e] text-[16px] font-light text-[#A4A4A4] focus:outline-none focus:border-[#ffdc81] py-3"
          />
        </div>
      </div>

      {/* Service Interests */}
      <div className="w-full">
        <label className="text-[16px] font-regular text-[#A4A4A4] mb-4 block">
          Select Your Interest of Service
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          {formData.serviceInterests.map((interest) => (
            <label
              key={interest.id}
              className="flex items-center gap-3 text-[14px] text-[#A4A4A4] font-light cursor-pointer"
            >
              <input
                type="checkbox"
                checked={interest.checked}
                onChange={() => handleServiceInterestChange(interest.id)}
                className="w-4 h-4 bg-transparent border border-[#0A5060] rounded focus:ring-[#ffdc81] focus:border-[#ffdc81] checked:bg-[#0A5060] checked:border-[#0A5060] appearance-none relative cursor-pointer"
              />
              {interest.label}
            </label>
          ))}
        </div>
      </div>

      {/* Asset Range */}
      <div className="w-full">
        <label className="text-[16px] font-regular text-[#A4A4A4] mb-4 block">
          Choose Your Investable Assets
        </label>
        <div className="relative mt-3">
          <select
            value={formData.assetRange}
            onChange={(e) => handleAssetRangeChange(e.target.value)}
            className="w-full bg-transparent border-b border-[#8e8e8e] text-[16px] font-light text-[#A4A4A4] focus:outline-none focus:border-[#ffdc81] py-3 appearance-none cursor-pointer"
          >
            <option value="" className="bg-[#1a1a1a] text-[#A4A4A4]">
              Select your asset range
            </option>
            {data.assetRanges.map((range) => (
              <option
                key={range}
                value={range}
                className="bg-[#1a1a1a] text-[#A4A4A4]"
              >
                {range}
              </option>
            ))}
          </select>
          {/* Custom dropdown arrow */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg
              className="w-4 h-4 text-[#A4A4A4]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        text={data.submitText}
        text_font_size="text-[16px]"
        text_font_weight="font-normal"
        text_line_height="leading-[24px]"
        text_color="text-[#A4A4A4]"
        layout_width="100%"
        padding="16px 24px"
        variant="gradient"
        size="medium"
        type="submit"
        className="glass-border-button w-full mt-4"
        style={{
          background:
            "linear-gradient(8deg,rgba(255, 220, 129, 1) 0%, rgba(60, 194, 204, 1) 100%)",
        }}
      />

      {/* Privacy Policy */}
      <p className="text-[12px] font-light text-center mt-4">
        By submitting this form you agree to our{" "}
        <a
          href="#"
          className="underline hover:no-underline transition-all duration-200 text-[#ffdc81]"
        >
          Privacy Policy
        </a>
      </p>
    </form>
  );
}
