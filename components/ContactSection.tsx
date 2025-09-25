"use client";
import Image from "next/image";
import { useState } from "react";
import Button from "../components/ui/Button";
import { imageMap } from "@/libs/imageMap";
import contactData from "@/json/contact.json";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("submit", formData);
  };

  return (
    <section className="relative w-full">
      {/* Background image */}
      <div className="absolute inset-0 -z-20">
        <Image
          src={imageMap.bannerContact}
          alt="contact background"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 -z-10 bg-black/30" />

      <div className="w-full max-w-[1440px] mx-auto px-14 sm:px-8 lg:px-14 pt-[70px] pb-[70px]">
        <div className="flex flex-col lg:flex-row justify-center items-end w-full mt-[46px]">
          <div className="flex flex-col lg:flex-row justify-center items-start w-full lg:w-[84%] mx-auto">
            {/* Left Content */}
            <div className="flex flex-col justify-start items-start w-full lg:flex-1 mb-12 lg:mb-0">
              <h2 className="text-[20px] font-normal leading-[27px] text-[#e6e0da]">
                {contactData.title}
              </h2>
              <p className="text-[28px] sm:text-[34px] md:text-[38px] font-light leading-[38px] md:leading-[44px] text-[#ffdc81] w-full lg:w-[80%] mt-3">
                {contactData.subtitle}
              </p>

              <div className="mt-[126px]">
                <p className="text-[20px] font-normal leading-[27px] text-[#fafafa]">
                  {contactData.emailLabel}
                </p>
                <a
                  href={`mailto:${contactData.email}`}
                  className="text-[20px] font-normal leading-[27px] text-[#ffdc81] underline hover:text-[#ffeec0] transition-colors"
                >
                  {contactData.email}
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="w-full lg:w-[38%] lg:self-center">
              <div className="glass-border rounded-[24px] p-[2px]">
                <div className="backdrop-blur-md bg-white/5 rounded-[22px] p-10">
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-[56px] justify-start items-center w-full"
                  >
                    <div className="flex flex-col gap-[38px] justify-start items-center w-full mt-9">
                      <div className="flex flex-col gap-9 justify-start items-center w-full">
                        {/* Name */}
                        <div className="w-full">
                          <input
                            id="contact-name"
                            name="name"
                            type="text"
                            placeholder={contactData.form.namePlaceholder}
                            value={formData.name}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                            className="w-full bg-transparent border-b border-[#8e8e8e] placeholder:text-[#8e8e8e] text-[20px] font-light text-[#fafafa] focus:outline-none focus:border-[#ffdc81] px-0 py-3"
                          />
                        </div>

                        {/* Email */}
                        <div className="w-full">
                          <input
                            id="contact-email"
                            name="email"
                            type="email"
                            placeholder={contactData.form.emailPlaceholder}
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            className="w-full bg-transparent border-b border-[#8e8e8e] placeholder:text-[#8e8e8e] text-[20px] font-light text-[#fafafa] focus:outline-none focus:border-[#ffdc81] px-0 py-3"
                          />
                        </div>
                      </div>

                      {/* Message */}
                      <div className="flex flex-col gap-[16px] justify-start items-start w-full">
                        <textarea
                          id="contact-message"
                          name="message"
                          placeholder={contactData.form.messagePlaceholder}
                          value={formData.message}
                          onChange={(e) =>
                            handleInputChange("message", e.target.value)
                          }
                          rows={6}
                          className="w-full resize-none bg-transparent border-b border-[#8e8e8e] placeholder:text-[#8e8e8e] text-[18px] font-light text-[#fafafa] focus:outline-none focus:border-[#ffdc81] px-0 py-3"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="w-full">
                      <Button
                        text={contactData.form.submitText}
                        text_font_size="text-[20px]"
                        text_font_weight="font-normal"
                        text_line_height="leading-[27px]"
                        text_color="text-[#fff]"
                        border_border_radius="rounded-full"
                        layout_width="100%"
                        padding="22px 34px"
                        variant="gradient"
                        size="medium"
                        type="submit"
                        className="glass-border-button"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
