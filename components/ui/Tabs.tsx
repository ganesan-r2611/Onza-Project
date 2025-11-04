"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { imageMap } from "@/libs/imageMap";
import TabButton from "./TabsButton";

export type ServiceTab = {
  id: string;
  label: string;
  title: string;
  content: string;
  imageKey: keyof typeof imageMap;
};

type ButtonRefMap = Record<string, HTMLButtonElement | null>;

export default function ServicesTabs({ tabs }: { tabs: ServiceTab[] }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");
  const activeTab = tabs.find((t) => t.id === activeId);

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const btnRefs = useRef<ButtonRefMap>({});
  const hasMounted = useRef(false);

  /** Center the active tab horizontally inside the scroller */
  const centerActiveInContainer = useCallback(() => {
    const container = scrollerRef.current;
    const el = btnRefs.current[activeId];
    if (!container || !el) return;

    const { offsetLeft, offsetWidth } = el;
    const desired = offsetLeft - (container.clientWidth - offsetWidth) / 2;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const clamped = Math.max(0, Math.min(desired, maxScroll));
    container.scrollTo({ left: clamped, behavior: "smooth" });
  }, [activeId]);

  useLayoutEffect(() => {}, [activeId]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    centerActiveInContainer();
  }, [activeId, centerActiveInContainer]);

  useEffect(() => {
    const onResize = () => centerActiveInContainer();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [centerActiveInContainer]);

  /** Swipe gesture for mobile (content area) */
  const startX = useRef(0);
  const onStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };
  const onEnd = (e: React.TouchEvent) => {
    const delta = startX.current - e.changedTouches[0].clientX;
    const idx = tabs.findIndex((t) => t.id === activeId);
    if (delta > 50 && idx < tabs.length - 1) setActiveId(tabs[idx + 1].id);
    if (delta < -50 && idx > 0) setActiveId(tabs[idx - 1].id);
  };

  return (
    <div className="w-full mx-auto xl:pb-24">
      {/* --- Tabs Navigation (glassy) --- */}
      <div className="relative bg-[#ffffff26] border border-[#ffffff21] md:rounded-t-[16px] 2xl:rounded-t-[1.111vw] lg:rounded-t-[16px] 2xl:rounded-t-[1.111vw] shadow-[0px_4px_176px_#888888ff] ">
        <div className="flex flex-col w-full h-[51px] 2xl:h-[3.542vw] lg:h-full px-6 2xl:px-6 2xl:px-6-[1.667vw]-[1.667vw] pt-2">
          {/* OUTER scroller */}
          <div
            ref={scrollerRef}
            className="w-full overflow-x-auto scrollbar-hide"
            style={{ overscrollBehaviorX: "contain" }}
            role="tablist"
          >
            <div className="relative flex gap-2 sm:gap-1 md:gap-9 lg:gap-12 2xl:gap-12-[3.333vw] w-max">
              {tabs.map((tab) => (
                <TabButton
                  key={tab.id}
                  id={tab.id}
                  label={tab.label}
                  active={tab.id === activeId}
                  onClick={setActiveId}
                  buttonRef={(el) => {
                    btnRefs.current[tab.id] = el;
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ✅ White divider line UNDER the glassy outline, BEFORE content */}
        <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-px bg-white/100" />
      </div>

      {/* --- Content Section --- */}
      <div
        className="w-full lg:rounded-b-[24px] 2xl:rounded-b-[1.667vw] lg:pt-0"
        onTouchStart={onStart}
        onTouchEnd={onEnd}
      >
        <div
          className="flex flex-col lg:flex-row justify-center items-center w-full px-6 lg:px-[56px] 2xl:px-[3.889vw] rounded-b-none md:rounded-b-[24px] 2xl:rounded-b-[1.667vw] lg:rounded-b-[24px] 2xl:rounded-b-[1.667vw] h-auto lg:h-[532px] 2xl:h-[36.944vw] min-h-[532px] 2xl:min-h-[36.944vw] lg:min-h-[532px] 2xl:min-h-[36.944vw]"
          style={{
            backgroundImage: `
      linear-gradient(116deg, rgba(0, 0, 0, 1) 9%, rgba(19, 159, 140, 1) 53%, rgba(255, 220, 129, 1) 93%),
      url(${imageMap.backgroundOZ.src || imageMap.backgroundOZ})
    `,
            backgroundSize: "cover, cover",
            backgroundPosition: "center, center",
            backgroundRepeat: "no-repeat, no-repeat",
            backgroundBlendMode: "multiply, normal",
            overflow: "hidden",
          }}
        >
          <AnimatePresence mode="wait">
            {activeTab && (
              <motion.div
                key={activeTab.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="contents"
              >
                {/* Text */}
                <div className="flex flex-col gap-2 items-start w-full lg:w-[60%] mb-8 lg:mb-0 mt-10 2xl:mt-10-[2.778vw] lg:mt-0">
                  <h3 className="text-[20px] sm:text-[32px] font-regular leading-[42px] text-[#ffdc81]">
                    {activeTab.title}
                  </h3>
                  <p className="text-[18px] 2xl:18-[360.833vw] sm:text-[17px] 2xl:17-[361.875vw] font-light leading-[27px] 2xl:leading-[1.875vw] text-[#fafafa] w-full lg:w-[66%]">
                    {activeTab.content}
                  </p>
                </div>

                {/* Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.28 }}
                  className="w-full md:w-[75%] lg:w-[50%] flex justify-between items-center md:pl-[50px] 2xl:pl-[3.472vw] lg:pl-0"
                >
                  <Image
                    src={imageMap[activeTab.imageKey]}
                    alt={activeTab.title}
                    className="object-cover rounded-lg w-[360px] 2xl:w-[25.000vw] h-[420px] 2xl:h-[29.167vw] md:w-[340px] 2xl:w-[23.611vw] md:h-[520px] 2xl:h-[36.111vw] lg:w-[368px] 2xl:w-[25.556vw] lg:h-[532px] 2xl:h-[36.944vw]"
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
