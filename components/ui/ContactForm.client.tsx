"use client";
import { useState } from "react";
import Button from "./Button";

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
    <form onSubmit={onSubmit} className="flex flex-col gap-8 2xl:gap-[2.222vw] mx-auto">
      {/* Two Column Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 2xl:gap-[3.333vw]">
        <div className="flex flex-col gap-10 2xl:gap-[0.69vw]">
          <input
            type="text"
            placeholder={data.namePlaceholder}
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value)}
            className="w-[291px] 2xl:w-[20.21vw] h-[70px] 2xl:h-[4.86vw] bg-transparent border-b border-[#0A5060] placeholder:text-[#8e8e8e] text-[16px]  2xl:text-[1.11vw] font-light text-[#A4A4A4] focus:outline-none focus:border-[#ffdc81] py-3 2xl:py-[0.21vw]"
          />
          <input
            type="text"
            placeholder={data.contactNumberPlaceholder}
            value={formData.contactNumber}
            onChange={(e) => onChange("contactNumber", e.target.value)}
            className="w-[291px] 2xl:w-[20.21vw] h-[70px] 2xl:h-[4.86vw] bg-transparent border-b border-[#0A5060] placeholder:text-[#8e8e8e] text-[16px]  2xl:text-[1.11vw] font-light text-[#A4A4A4] focus:outline-none focus:border-[#ffdc81] py-3 2xl:py-[0.21vw]"
          />
        </div>
        <div className="flex flex-col gap-10">
          <input
            type="email"
            placeholder={data.emailPlaceholder}
            value={formData.email}
            onChange={(e) => onChange("email", e.target.value)}
            className="w-[291px] 2xl:w-[20.21vw] h-[70px] 2xl:h-[4.86vw] bg-transparent border-b border-[#0A5060] placeholder:text-[#8e8e8e] text-[16px] 2xl:text-[1.11vw] font-light text-[#A4A4A4] focus:outline-none focus:border-[#ffdc81] py-3 2xl:py-[0.21vw]"
          />
          <input
            type="text"
            placeholder={data.cityPlaceholder}
            value={formData.city}
            onChange={(e) => onChange("city", e.target.value)}
            className="w-[291px] 2xl:w-[20.21vw] h-[70px] 2xl:h-[4.86vw] bg-transparent border-b border-[#0A5060] placeholder:text-[#8e8e8e] text-[16px] 2xl:text-[1.11vw] font-light text-[#A4A4A4] focus:outline-none focus:border-[#ffdc81] py-3 2xl:py-[0.21vw]"
          />
        </div>
      </div>

      {/* Service Interests */}
      <div className="w-full">
        <label className="text-[14px] 2xl:text-[0.97vw] font-light text-[#A4A4A4] mb-4 2xl:mb-[1.111vw] block">
          Select Your Interest of Service
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 2xl:gap-3 2xl:gap-3-[0.833vw]-[0.833vw] mt-3 2xl:mt-3 2xl:mt-3-[0.833vw]-[0.833vw]">
          {formData.serviceInterests.map((interest) => (
            <label
              key={interest.id}
              className="flex items-center gap-3 2xl:gap-3 2xl:gap-3-[0.833vw]-[0.833vw] text-[16px] text-[#A4A4A4] font-light cursor-pointer"
            >
              <input
                type="checkbox"
                checked={interest.checked}
                onChange={() => handleServiceInterestChange(interest.id)}
                className="w-5 2xl:w-5-[1.389vw] h-5 2xl:h-5-[1.389vw] bg-transparent border border-[#0A5060] rounded focus:ring-[#0A5060] focus:border-[#0A5060] checked:bg-[#ffdc81] checked:border-[#ffdc81] appearance-none relative cursor-pointer"
              />
              {interest.label}
            </label>
          ))}
        </div>
      </div>

      {/* Asset Range */}
      <div className="w-full">
        <label className="text-[16px] font-regular text-[#A4A4A4] mb-4 2xl:mb-4 2xl:mb-4-[1.111vw]-[1.111vw] block">
          Choose Your Investable Assets
        </label>
        <div className="relative mt-3 2xl:mt-3 2xl:mt-3-[0.833vw]-[0.833vw]">
          <select
            value={formData.assetRange}
            onChange={(e) => handleAssetRangeChange(e.target.value)}
            className="custom-select w-full bg-transparent border-b border-[#0A5060] text-[16px] font-light text-[#A4A4A4] focus:outline-none focus:border-[#ffdc81] py-3 appearance-none cursor-pointer"
          >
            <option value="">Select your asset range</option>
            {data.assetRanges.map((range) => (
              <option key={range} value={range}>
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
      <p className="text-[12px] font-medium text-center text-[#F2E9DA] mt-4">
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
