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
    <div className="w-full mx-auto lg:px-7 xl:pb-24">
      {/* --- Tabs Navigation (glassy) --- */}
      <div className="relative bg-[#ffffff26] border border-[#ffffff21] md:rounded-t-[16px] lg:rounded-t-[16px] shadow-[0px_4px_176px_#888888ff] ">
        <div className="flex flex-col w-full h-[51px] lg:h-full px-5 pt-2">
          {/* OUTER scroller */}
          <div
            ref={scrollerRef}
            className="w-full overflow-x-auto scrollbar-hide"
            style={{ overscrollBehaviorX: "contain" }}
            role="tablist"
          >
            <div className="relative flex gap-2 sm:gap-8 md:gap-12 lg:gap-24 w-max">
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
        className="w-full lg:rounded-b-[24px] bg-gradient-to-r from-[#13181ccc] via-[#ffdc81cc] to-[#f2e9dacc] pt-5 lg:pt-0"
        onTouchStart={onStart}
        onTouchEnd={onEnd}
      >
        <div className="flex flex-col lg:flex-row justify-center items-center w-full px-12 lg:px-[56px]">
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
                <div className="flex flex-col gap-2 items-start w-full lg:w-[60%] mb-8 lg:mb-0">
                  <h3 className="text-[20px] sm:text-[32px] font-regular leading-[42px] text-[#ffdc81]">
                    {activeTab.title}
                  </h3>
                  <p className="text-[18px] sm:text-[18px] font-light leading-[27px] text-[#fafafa] w-full lg:w-[66%]">
                    {activeTab.content}
                  </p>
                </div>

                {/* Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.28 }}
                  className="w-full lg:w-[50%] flex justify-between items-center"
                >
                  <Image
                    src={imageMap[activeTab.imageKey]}
                    alt={activeTab.title}
                    width={360}
                    height={315}
                    className="object-cover rounded-lg w-[360px] h-[315px] md:w-[340px] md:h-[500px] lg:w-[368px] lg:h-[532px]"
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
