// components/ui/ContactForm.tsx
"use client";

import { useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { imageMap } from "@/libs/imageMap";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = (k: string, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
  };

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Form submitted:", formData);
      // Add your form submission logic here
      // await submitForm(formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Reset form after successful submission
      setForm({
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
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-8 2xl:gap-[3vw] mx-auto w-full"
    >
      {/* Two Column Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 2xl:gap-[3.333vw]">
        <div className="flex flex-col gap-10 2xl:gap-[2.778vw]">
          {/* Name Input */}
          <div className="relative group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="peer w-full h-[70px] 2xl:h-[4.86vw] bg-transparent text-[16px] 2xl:text-[1.11vw] font-light text-[#F2E9DA] focus:outline-none py-3 2xl:py-[0.21vw] px-0 border-b-2 border-[#0A5060] transition-all duration-300 focus:border-[#3CC2CC] hover:border-[#3CC2CC]"
              placeholder=" "
            />
            <label className="absolute left-0 top-1/2 -translate-y-1/2 text-[16px] 2xl:text-[1.11vw] font-light text-[#F2E9DA] transition-all duration-300 pointer-events-none peer-focus:top-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-[#3CC2CC] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:text-[#ffdc81] origin-left">
              {data.namePlaceholder}
            </label>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3CC2CC] transition-all duration-300 peer-focus:w-full group-hover:w-full"></div>
          </div>

          {/* Contact Number Input */}
          <div className="relative group">
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={(e) => onChange("contactNumber", e.target.value)}
              className="peer w-full h-[70px] 2xl:h-[4.86vw] bg-transparent text-[16px] 2xl:text-[1.11vw] font-light text-[#F2E9DA] focus:outline-none py-3 2xl:py-[0.21vw] px-0 border-b-2 border-[#0A5060] transition-all duration-300 focus:border-[#3CC2CC] hover:border-[#3CC2CC]"
              placeholder=" "
            />
            <label className="absolute left-0 top-1/2 -translate-y-1/2 text-[16px] 2xl:text-[1.11vw] font-light text-[#F2E9DA] transition-all duration-300 pointer-events-none peer-focus:top-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-[#3CC2CC] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:text-[#ffdc81] origin-left">
              {data.contactNumberPlaceholder}
            </label>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3CC2CC] transition-all duration-300 peer-focus:w-full group-hover:w-full"></div>
          </div>
        </div>

        <div className="flex flex-col gap-10 2xl:gap-[2.778vw]">
          {/* Email Input */}
          <div className="relative group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => onChange("email", e.target.value)}
              className="peer w-full h-[70px] 2xl:h-[4.86vw] bg-transparent text-[16px] 2xl:text-[1.11vw] font-light text-[#F2E9DA] focus:outline-none py-3 2xl:py-[0.21vw] px-0 border-b-2 border-[#0A5060] transition-all duration-300 focus:border-[#3CC2CC] hover:border-[#3CC2CC]"
              placeholder=" "
            />
            <label className="absolute left-0 top-1/2 -translate-y-1/2 text-[16px] 2xl:text-[1.11vw] font-light text-[#F2E9DA] transition-all duration-300 pointer-events-none peer-focus:top-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-[#3CC2CC] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:text-[#ffdc81] origin-left">
              {data.emailPlaceholder}
            </label>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3CC2CC] transition-all duration-300 peer-focus:w-full group-hover:w-full"></div>
          </div>

          {/* City Dropdown */}
          <div className="relative group">
            <FormControl
              variant="standard"
              fullWidth
              sx={{
                marginTop: "0px",
                "& .MuiInputBase-root": {
                  marginTop: "0px",
                },
              }}
            >
              <InputLabel
                id="city-select-label"
                sx={{
                  color: "#F2E9DA",
                  fontSize: { xs: "16px", lg: "1.11vw" },
                  fontFamily: "inherit",
                  fontWeight: 300,
                  "&.Mui-focused": {
                    color: "#F2E9DA",
                  },
                }}
              >
                {data.cityPlaceholder}
              </InputLabel>
              <Select
                labelId="city-select-label"
                id="city-select"
                name="city"
                value={formData.city}
                onChange={(e) => onChange("city", e.target.value)}
                label={data.cityPlaceholder}
                IconComponent={(props) => (
                  <svg
                    {...props}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    style={{
                      right: "8px",
                      position: "absolute",
                      pointerEvents: "none",
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
                sx={{
                  color: "#F2E9DA",
                  fontSize: { xs: "16px", lg: "1.11vw" },
                  fontFamily: "inherit",
                  fontWeight: 300,
                  height: { xs: "70px", lg: "4.86vw" },
                  "&:before": {
                    borderBottomColor: "#0A5060",
                    borderBottomWidth: "2px",
                  },
                  "&:after": {
                    borderBottomColor: "#3CC2CC",
                  },
                  "&:hover:not(.Mui-disabled):before": {
                    borderBottomColor: "#3CC2CC",
                  },
                  "& .MuiSelect-icon": {
                    color: "#A4A4A4",
                    transition: "color 0.3s ease",
                  },
                  "&.Mui-focused .MuiSelect-icon": {
                    color: "#3CC2CC",
                  },
                  "&:hover .MuiSelect-icon": {
                    color: "#3CC2CC",
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: "#0A5060",
                      "& .MuiMenuItem-root": {
                        color: "#F2E9DA",
                        fontSize: { xs: "16px", lg: "1.11vw" },
                        "&:hover": {
                          bgcolor: "#ffdc81",
                          color: "#000000",
                        },
                        "&.Mui-selected": {
                          bgcolor: "#ffdc81",
                          color: "#000000",
                        },
                        "&.Mui-selected:hover": {
                          bgcolor: "#ffdc81",
                          color: "#000000",
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="Bengaluru">Bengaluru</MenuItem>
                <MenuItem value="Delhi">Delhi</MenuItem>
                <MenuItem value="Mumbai">Mumbai</MenuItem>
                <MenuItem value="Chennai">Chennai</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      </div>

      {/* Service Interests */}
      <div className="w-full">
        <label className="text-[14px] 2xl:text-[1vw] font-light text-[#F2E9DA] mb-4 2xl:mb-[1.111vw] block">
          Select Your Interest of Service
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-[2.19vw] mt-3 2xl:mt-[0.833vw]">
          {formData.serviceInterests.map((interest) => (
            <label
              key={interest.id}
              className="flex items-center gap-3 lg:gap-[0.833vw] text-[16px] 2xl:text-[1.11vw] text-[#F2E9DA] font-light cursor-pointer hover:text-[#ffdc81] transition-colors duration-200 group"
            >
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  name="serviceInterests"
                  checked={interest.checked}
                  onChange={() => handleServiceInterestChange(interest.id)}
                  className="w-5 2xl:w-[1.74vw] h-5 2xl:h-[1.74vw] bg-transparent border-2 border-[#0A5060] rounded 2xl:rounded-[0.35vw] focus:ring-2 focus:ring-[#0A5060] focus:border-[#0A5060] checked:bg-[#0A5060] checked:border-[#0A5060] appearance-none cursor-pointer transition-all duration-200 flex-shrink-0"
                />
                {/* Custom checkmark */}
                <svg
                  className={`absolute w-3 2xl:w-[1.04vw] h-3 2xl:h-[1.04vw] text-[#000000] pointer-events-none transition-opacity duration-200 ${
                    interest.checked ? "opacity-100" : "opacity-0"
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="whitespace-wrap">{interest.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Asset Range */}
      <div className="w-full">
        <div className="relative group">
          <FormControl
            variant="standard"
            fullWidth
            sx={{
              marginTop: "0px",
              "& .MuiInputBase-root": {
                marginTop: "0px",
              },
            }}
          >
            <InputLabel
              id="asset-range-select-label"
              sx={{
                color: "#F2E9DA",
                fontSize: { xs: "16px", lg: "1.11vw" },
                fontFamily: "inherit",
                fontWeight: 300,
                "&.Mui-focused": {
                  color: "#3CC2CC",
                },
                "&.MuiInputLabel-shrink": {
                  transform: "translate(0, -1.5px) scale(0.75)",
                  transformOrigin: "top left",
                },
              }}
            >
              Choose Your Investable Assets
            </InputLabel>
            <Select
              labelId="asset-range-select-label"
              id="asset-range-select"
              name="assetRange"
              value={formData.assetRange}
              onChange={(e) => handleAssetRangeChange(e.target.value)}
              label="Choose Your Investable Assets"
              IconComponent={(props) => (
                <svg
                  {...props}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  style={{
                    right: "8px",
                    position: "absolute",
                    pointerEvents: "none",
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              )}
              sx={{
                color: formData.assetRange ? "#F2E9DA" : "#8e8e8e",
                fontSize: { xs: "16px", lg: "1.11vw" },
                fontFamily: "inherit",
                fontWeight: 300,
                height: { xs: "70px", lg: "4.86vw" },
                "&:before": {
                  borderBottomColor: "#0A5060",
                  borderBottomWidth: "2px",
                },
                "&:after": {
                  borderBottomColor: "#3CC2CC",
                },
                "&:hover:not(.Mui-disabled):before": {
                  borderBottomColor: "#3CC2CC",
                },
                "& .MuiSelect-icon": {
                  color: formData.assetRange ? "#3CC2CC" : "#A4A4A4",
                  transition: "color 0.3s ease",
                  "&:hover": {
                    color: "#3CC2CC",
                  },
                },
                "&.Mui-focused .MuiSelect-icon": {
                  color: "#3CC2CC",
                },
                "&:hover .MuiSelect-icon": {
                  color: "#3CC2CC",
                },
                "& .MuiSelect-select": {
                  paddingBottom: "8px",
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "#0A5060",
                    maxHeight: { xs: "300px", lg: "20.833vw" },
                    "& .MuiMenuItem-root": {
                      color: "#A4A4A4",
                      fontSize: { xs: "16px", lg: "1.11vw" },
                      padding: { xs: "12px 16px", lg: "0.833vw 1.111vw" },
                      "&:hover": {
                        bgcolor: "#ffdc81",
                        color: "#000000",
                      },
                      "&.Mui-selected": {
                        bgcolor: "#ffdc81",
                        color: "#000000",
                      },
                      "&.Mui-selected:hover": {
                        bgcolor: "#ffdc81",
                        color: "#000000",
                      },
                    },
                    "&::-webkit-scrollbar": {
                      width: "8px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "#0A5060",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "#ffdc81",
                      borderRadius: "4px",
                    },
                  },
                },
              }}
            >
              {data.assetRanges.map((range) => (
                <MenuItem key={range} value={range}>
                  {range}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Optional: Add the underline effect */}
          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3CC2CC] transition-all duration-300 group-focus-within:w-full group-hover:w-full"></div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex flex-col justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 2xl:h-[3.82vw] rounded-[24px] 2xl:rounded-[1.67vw] flex items-center justify-center cursor-pointer transition-all duration-300 bg-gradient-to-r from-[#ffdc81] to-[#3cc2cc] hover:bg-[#3cc2cc] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundImage: `url(${
              typeof imageMap.submit_btn === "string"
                ? imageMap.submit_btn
                : imageMap.submit_btn?.src || "/submit_btn.png"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></button>
        {/* Privacy Policy */}
        <p className="text-[12px] 2xl:text-[0.833vw] font-medium text-left leading-[18px] 2xl:leading-[1.25vw] text-[#F2E9DA] mt-2 2xl:mt-[0.69vw]">
          By submitting this form you agree to our friendly {" "}
          <a
            href="#"
            className="underline hover:no-underline transition-all duration-200 text-[#ffdc81] hover:text-[#ffeec0]"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </form>
  );
}
