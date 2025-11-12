// components/ContactSection.tsx (SERVER)
import ContactForm from "./ui/ContactForm";
import { imageMap } from "@/libs/imageMap";

export interface ContactFormData {
  namePlaceholder: string;
  emailPlaceholder: string;
  contactNumberPlaceholder: string;
  cityPlaceholder: string;
  serviceInterests: string[];
  assetRanges: string[];
  submitText: string;
}

export interface ContactData {
  title: string;
  subtitle: string;
  emailLabel: string;
  email: string;
  form: ContactFormData;
}

export default function ContactSection({ data }: { data: ContactData }) {
  return (
    <section className="relative w-full" data-theme="dark">
      {/* Background Gradient */}
      <section
        className="relative w-full min-h-screen"
        style={{
          backgroundImage: `url(${
            typeof imageMap.contactUsBg === "string"
              ? imageMap.contactUsBg
              : imageMap.contactUsBg?.src || "/fallback-image.jpg"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Content Wrapper */}
        <div className="relative z-10 w-full max-w-[100.000vw] mx-auto px-4 sm:px-4 lg:px-[120px] pt-[40px] lg:pt-[8.33vw] pb-[40px] 2xl:pb-[4.861vw]">
          <div className="flex flex-col lg:flex-row justify-between items-start w-full gap-10 lg:gap-16 2xl:gap-[4.444vw]">
            {/* Left: Title and Email */}
            <div className="w-full lg:w-[45%] flex flex-col">
              <h2 className="text-[20px] sm:text-[20px] 2xl:text-[1.39vw] font-regular text-[#E6E0DA] mb-6 2xl:mb-[1.667vw]">
                {data.title}
              </h2>
              <p className="text-[38px] 2xl:text-[2.64vw] sm:text-[38px] font-light leading-[40px] 2xl:leading-[2.778vw] text-[#FFDC81] w-full lg:w-[93%]">
                {data.subtitle}
              </p>

              <div className="mt-24 sm:mt-36 lg:mt-[12.5vw]">
                <p className="text-[16px] sm:text-[18px] md:text-[20px] 2xl:text-[1.39vw] font-regular text-[#fbfbfb] mb-2 2xl:mb-[0.14vw]">
                  {data.emailLabel}
                </p>
                <a
                  href={`mailto:${data.email}`}
                  className="text-[18px] sm:text-[20px] 2xl:text-[1.25vw] text-[#ffdc81] font-regular underline hover:text-[#ffeec0] transition-colors duration-200"
                >
                  {data.email}
                </a>
              </div>
            </div>

            {/* Right: Form */}
            <div className="w-full lg:w-[55%] flex justify-center lg:justify-end">
              <div className="md:p-0 w-full">
                <ContactForm data={data.form} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
