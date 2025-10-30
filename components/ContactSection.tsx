// components/ContactSection.tsx (SERVER)
import ContactForm from "./ui/ContactForm.client";

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
      <div 
        className="absolute inset-0 -z-20"
        style={{
          background: "linear-gradient(135deg, #0A5060 0%, #000000 100%)",
        }}
      />

      {/* Content Wrapper */}
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-36 pt-[120px] pb-[70px]">
        <div className="flex flex-col lg:flex-row justify-between items-start w-full gap-10 lg:gap-16">
          {/* Left: Title and Email */}
          <div className="w-full lg:w-[45%] flex flex-col">
            <h2 className="text-[24px] sm:text-[24px] font-regular text-[#E6E0DA] mb-6">
              {data.title}
            </h2>
            <p className="text-[38px] sm:text-[38px] font-light leading-[40px] text-[#FFDC81] w-full lg:w-[90%]">
              {data.subtitle}
            </p>

            <div className="mt-24 sm:mt-36">
              <p className="text-[16px] sm:text-[18px] font-regular text-[#fbfbfb] mb-2">
                {data.emailLabel}
              </p>
              <a
                href={`mailto:${data.email}`}
                className="text-[18px] sm:text-[20px] text-[#ffdc81] font-regular underline hover:text-[#ffeec0]"
              >
                {data.email}
              </a>
            </div>
          </div>

          {/* Right: Form */}
          <div className="w-full lg:w-[55%] flex justify-center lg:justify-end">
            <div className="p-[2px] w-full max-w-[600px]">
              <div className="p-6 sm:p-8 md:p-10">
                <ContactForm data={data.form} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}