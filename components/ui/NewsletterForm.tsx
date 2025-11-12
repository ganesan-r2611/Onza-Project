"use client";

import { imageMap } from "@/libs/imageMap";
import { useState } from "react";

export default function NewsletterForm() {
  // Newsletter form state
  const [newsletterData, setNewsletterData] = useState({
    email: "",
  });
  // const [isSubmitting, setIsSubmitting] = useState(false);
  // const [submitStatus, setSubmitStatus] = useState<
  //   "idle" | "success" | "error"
  // >("idle");

  // Handle newsletter form input change
  const onNewsletterChange = (field: string, value: string) => {
    setNewsletterData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle newsletter form submission
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // if (!newsletterData.email) {
    //   setSubmitStatus("error");
    //   return;
    // }

    // setIsSubmitting(true);
    // setSubmitStatus("idle");

    // try {
    //   // Simulate API call - replace with your actual API endpoint
    //   const response = await fetch("/api/newsletter/subscribe", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       email: newsletterData.email,
    //       source: "website_newsletter",
    //     }),
    //   });

    //   if (response.ok) {
    //     setSubmitStatus("success");
    //     setNewsletterData({ email: "" });
    //     // Reset success message after 3 seconds
    //     setTimeout(() => setSubmitStatus("idle"), 3000);
    //   } else {
    //     setSubmitStatus("error");
    //   }
    // } catch (error) {
    //   console.error("Newsletter subscription error:", error);
    //   setSubmitStatus("error");
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  return (
    <form
      onSubmit={handleNewsletterSubmit}
      className="w-full flex flex-col gap-5 2xl:gap-[1.74vw]"
    >
      {/* Email Input Field */}
      <div className="relative group">
        <input
          type="email"
          name="email"
          value={newsletterData.email}
          onChange={(e) => onNewsletterChange("email", e.target.value)}
          className="peer w-full h-[70px] 2xl:h-[4.86vw] bg-transparent text-[16px] 2xl:text-[1.11vw] font-light text-[#F2E9DA] focus:outline-none py-3 2xl:py-[1.04vw] px-0 border-b-2 2xl:border-b-[0.14vw] border-[#D2D2D2] transition-all duration-300"
          placeholder=" "
          required
        />
        <label className="absolute left-0 top-1/2 -translate-y-1/2 text-[16px] 2xl:text-[1.11vw] font-light text-[#F2E9DA] transition-all duration-300 pointer-events-none peer-focus:top-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-[#ffdc81] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:text-[#ffdc81] origin-left">
          Your email *
        </label>
        <div className="absolute bottom-0 left-0 w-0 h-0.5 2xl:h-[0.17vw]"></div>
      </div>

      {/* Status Messages */}
      {/* {submitStatus === "success" && (
        <div className="text-green-400 text-sm">
          Thank you for subscribing! Please check your email to confirm.
        </div>
      )} */}

      {/* {submitStatus === "error" && (
        <div className="text-red-400 text-sm">
          Please enter a valid email address.
        </div>
      )} */}

      {/* Subscribe Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          // disabled={isSubmitting}
          className="w-full max-w-[237px] h-11 2xl:w-[16.5vw] 2xl:h-[3.34vw] rounded-[24px] 2xl:rounded-[1.39vw] flex items-center justify-center cursor-pointer transition-all duration-300 bg-gradient-to-r from-[#ffdc81] to-[#3cc2cc] hover:bg-[#3cc2cc] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundImage: `url(${
              typeof imageMap.subscribe_btn === "string"
                ? imageMap.subscribe_btn
                : imageMap.subscribe_btn?.src || "/subscribe_btn.png"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></button>
      </div>
    </form>
  );
}
