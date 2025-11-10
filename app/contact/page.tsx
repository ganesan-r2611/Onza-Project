import ContactForm from "@/components/ui/ContactForm";
import NewsletterForm from "@/components/ui/NewsletterForm";
import { getStaticData } from "@/libs/getStaticData";
import { imageMap } from "@/libs/imageMap";
import Image from "next/image";

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

export default async function ContactSection() {
  const staticData = await getStaticData();
  const data = staticData.contactData;

  return (
    <section className="relative w-full min-h-screen" data-theme="dark">
      {/* Contact Us Section*/}
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
        <div className="relative z-10 w-full max-w-[100.000vw] mx-auto px-6 sm:px-8 lg:px-[120px] pt-[80px] lg:pt-[8.33vw] pb-[70px] 2xl:pb-[4.861vw]">
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
              <div className="w-full">
                <ContactForm data={data.form} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map & Address */}
      <section
        className="relative w-full min-h-screen bg-[#F2E9DA]"
        data-theme="dark"
      >
        <div className="mx-auto px-6 md:px-10 lg:px-[120px] 2xl:px-[8.33vw] py-12 md:py-16 lg:py-[110px] 2xl:py-[7.64vw]">
          <div className="relative rounded-2xl 2xl:rounded-[1.39vw] overflow-hidden ring-1 ring-black/10 shadow-sm bg-black">
            <div className="flex flex-col xl:flex-row">
              {/* Google Maps - Takes full width on mobile, half on desktop */}
              <div className="xl:w-1/2">
                <div className="h-[400px] sm:h-[500px] md:h-[600px] xl:h-full min-h-[400px] 2xl:min-h-[27.78vw]">
                  <iframe
                    title="Onza HQ Map"
                    aria-label="Map showing the location of Onza HQ in Bengaluru"
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0047!2d77.6463!3d12.9784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15c49c040309%3A0x655343e01a3bd9b1!2sManyata%20Tech%20Park!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  />
                </div>
              </div>

              {/* Address Information - Takes full width on mobile, half on desktop */}
              <div className="xl:w-1/2 bg-black text-white p-4 md:p-6 lg:p-8 2xl:p-[2.78vw] xl:border-l xl:border-white/10 flex flex-col justify-center">
                <div className="mx-auto w-full">
                  <div className="mb-8 2xl:mb-[2.78vw]">
                    <p className="text-[20px] 2xl:text-[1.39vw] text-[#ffdc81] font-regular tracking-wider">
                      Find Us Here
                    </p>
                    <h2 className="mt-3 2xl:mt-[1.04vw] text-[32px] 2xl:text-[2.22vw] font-regular leading-tight">
                      Visit us at our office or connect with us online.
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-[32px] 2xl:text-[2.22vw] font-regular text-[#ffdc81] mb-3 2xl:mb-[1.04vw]">
                        Onza HQ
                      </h3>
                      <address className="not-italic font-light text-[14px] 2xl:text-[0.97vw] leading-relaxed">
                        262, Worldclass Tech Park
                        <br />
                        7th &ldquo; A &rdquo; Cross, Phase III
                        <br />
                        Bengaluru 560085
                      </address>
                    </div>

                    <div className="flex flex-row justify-between">
                      <div className="flex items-center gap-4 2xl:gap-[1.39vw] group">
                        <div className="w-8 h-8 2xl:w-[2.78vw] 2xl:h-[2.78vw] rounded 2xl:rounded-[0.35vw] bg-[#FFEEC01A] flex items-center justify-center group-hover:bg-[#ffdc81] transition-colors">
                          <Image
                            src={imageMap.phone}
                            alt="phone"
                             className="object-contain w-[15px] h-[15px] 2xl:w-[1.11vw] 2xl:h-[1.11vw]"
                          />
                        </div>
                        <a
                          href="tel:+9193215462169"
                          className="text-[16px] 2xl:text-[1.11vw] hover:text-[#ffdc81] transition-colors"
                        >
                          +91-321-546-2169
                        </a>
                      </div>

                      <div className="flex items-center gap-4 2xl:gap-[1.39vw] group">
                        <div className="w-8 h-8 2xl:w-[2.78vw] 2xl:h-[2.78vw] rounded 2xl:rounded-[0.35vw] bg-[#FFEEC01A] flex items-center justify-center group-hover:bg-[#ffdc81] transition-colors">
                          <Image
                            src={imageMap.mail}
                            alt="mail"
                            className="object-contain w-[15px] h-[15px] 2xl:w-[1.11vw] 2xl:h-[1.11vw]"
                          />
                        </div>
                        <a
                          href="mailto:info@onzawealth.com"
                          className="text-[16px] 2xl:text-[1.11vw] hover:text-[#ffdc81] transition-colors"
                        >
                          info@onzawealth.com
                        </a>
                      </div>
                    </div>

                    {/* Office Image */}
                    <div className="mt-8 2xl:mt-[2.78vw] rounded-xl 2xl:rounded-[1.04vw] w-full h-[218px] 2xl:h-[15.14vw] overflow-hidden ring-1 ring-white/10">
                      <Image
                        src={imageMap.findUsImg}
                        alt="Onza Office"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription Section */}
      <section className="relative w-full h-full py-20 md:py-16 lg:py-20 2xl:py-[6.94vw]">
        {/* Background with overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${
              typeof imageMap.subscribe_bg === "string"
                ? imageMap.subscribe_bg
                : imageMap.subscribe_bg?.src || "/subscribe_bg.png"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Black overlay - only on the background */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(
                to bottom,
                rgba(0, 0, 0, 0.2) 0%,
                rgba(0, 0, 0, 0.2) 33%,
                rgba(0, 0, 0, 0.2) 66%,
                rgba(0, 0, 0, 1) 100%
              )`,
            }}
          ></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full mx-auto px-6 sm:px-8 lg:px-[120px] 2xl:px-[8.33vw] flex flex-col lg:flex-row items-center gap-16 lg:gap-24 2xl:gap-[8.33vw]">
          {/* Left: Text Content */}
          <div className="w-full lg:w-[540px] 2xl:w-[37.5vw] flex flex-col items-start gap-6 2xl:gap-[2.08vw]">
            <div className="w-full">
              <div className="text-[20px] 2xl:text-[1.39vw] font-regular text-[#ffdc81] leading-[24px] 2xl:leading-[1.67vw]">
                Keen to connect?
              </div>
            </div>

            <div className="w-full">
              <div className="text-[clamp(2rem,5vw,3.5rem)] 2xl:text-[3.33vw]  font-light text-[#fbfbfb] leading-[8.94vw] 2xl:leading-[3.67vw]">
                <p className="m-0">Get More Insights Delivered Straight to</p>
                <p className="m-0">Your Inbox</p>
              </div>
            </div>
          </div>

          {/* Right: Email Subscription Form */}
          <div className="w-full lg:flex-1 flex items-center">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </section>
  );
}
