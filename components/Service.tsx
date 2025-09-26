import ServicesTabs from "./ui/Tabs";

export default function ServicesSection({ services }: { services: any }) {
  const tabs = services.items;

  return (
    <section className="py-[80px]">
      <div className="mx-auto px-6 sm:px-8">
        <div className="flex flex-col gap-[64px] items-center">
          <div className="flex flex-col lg:flex-row justify-between items-start w-full mt-[64px]">
            <h2 className="text-[20px] font-normal leading-[27px] text-[#fafafa] mb-6 lg:mb-0">
              {services.title}
            </h2>
            <p className="text-[32px] sm:text-[38px] md:text-[46px] font-light leading-tight text-[#fafafa] w-full lg:w-[52%]">
              {services.subtitle}
            </p>
          </div>

          <ServicesTabs tabs={tabs} />
        </div>
      </div>
    </section>
  );
}

