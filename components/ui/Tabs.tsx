"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { imageMap } from "@/libs/imageMap";
import TabButton from "./TabsButton";

export type ServiceTab = {
  id: string;
  label: string;
  title: string;
  content: string;
  imageKey: string;
};

type ButtonRefMap = Record<string, HTMLButtonElement | null>;

export default function ServicesTabs({ tabs }: { tabs: ServiceTab[] }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");
  const activeTab = tabs.find((t) => t.id === activeId);

  const [underline, setUnderline] = useState({ left: 0, width: 0 });

  const navRef = useRef<HTMLDivElement | null>(null);
  const btnRefs = useRef<ButtonRefMap>({});

  const hasMounted = useRef(false);

  const centerActiveInContainer = () => {
    const container = navRef.current;
    const el = btnRefs.current[activeId];
    if (!container || !el) return;

    const { offsetLeft, offsetWidth } = el;
    setUnderline({ left: offsetLeft, width: offsetWidth });

    const desired =
      offsetLeft - (container.clientWidth - offsetWidth) / 2;

    const maxScroll = container.scrollWidth - container.clientWidth;
    const clamped = Math.max(0, Math.min(desired, Math.max(0, maxScroll)));

    container.scrollTo({ left: clamped, behavior: "smooth" });
  };

  useLayoutEffect(() => {
    const container = navRef.current;
    const el = btnRefs.current[activeId];
    if (!container || !el) return;
    setUnderline({ left: el.offsetLeft, width: el.offsetWidth });
  }, []);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    centerActiveInContainer();
  }, [activeId]);

  useEffect(() => {
    const onResize = () => {
      const el = btnRefs.current[activeId];
      if (!navRef.current || !el) return;
      setUnderline({ left: el.offsetLeft, width: el.offsetWidth });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeId]);

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
    <div className="w-full mx-auto">
      {/* Tabs nav */}
      <div className="bg-[#ffffff26] border border-[#ffffff21] rounded-t-[16px] shadow-[0px_4px_176px_#888888ff]">
        <div className="flex flex-col w-full px-5 pt-2">
          <div
            ref={navRef}
            className="relative flex w-full gap-6 overflow-x-auto scrollbar-hide"
            // prevent vertical scroll chaining while swiping tabs
            style={{ overscrollBehaviorX: "contain" }}
          >
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                id={tab.id}
                label={tab.label}
                active={tab.id === activeId}
                onClick={setActiveId}
                // capture each button ref
                buttonRef={(el) => {
                  btnRefs.current[tab.id] = el;
                }}
                data-tab-id={tab.id}
              />
            ))}

            {/* Animated underline */}
            {underline.width > 0 && (
              <motion.div
                className="absolute bottom-0 h-[2px] bg-[#ffdc81]"
                animate={{ left: underline.left, width: underline.width }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Content (swipeable on mobile) */}
      <div
        className="w-full rounded-b-[24px] bg-gradient-to-r from-[#13181ccc] via-[#ffdc81cc] to-[#f2e9dacc]"
        onTouchStart={onStart}
        onTouchEnd={onEnd}
      >
        <div className="flex flex-col lg:flex-row justify-center items-center w-full px-[56px] py-[40px]">
          {activeTab && (
            <>
              <div className="flex flex-col gap-1.5 items-start w-full lg:w-[58%] mb-8 lg:mb-0">
                <h3 className="text-[32px] font-normal leading-[42px] text-[#ffdc81]">
                  {activeTab.title}
                </h3>
                <p className="text-[18px] font-light leading-[27px] text-[#fafafa] w-full lg:w-[66%]">
                  {activeTab.content}
                </p>
              </div>

              <div className="w-full lg:w-[28%] flex justify-center">
                <Image
                  src={imageMap[activeTab.imageKey]}
                  alt={activeTab.title}
                  width={368}
                  height={532}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
