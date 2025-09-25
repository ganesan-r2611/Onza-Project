"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { imageMap } from "@/libs/imageMap";
import TabButton from "./ui/TabsButton";

export type ServiceTab = {
  id: string;
  label: string;
  title: string;
  content: string;
  imageKey: string;
};

export default function ServicesTabs({ tabs }: { tabs: ServiceTab[] }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");
  const activeTab = tabs.find((t) => t.id === activeId);

  const [underlineStyle, setUnderlineStyle] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const activeEl = containerRef.current.querySelector<HTMLButtonElement>(
      `[data-tab-id="${activeId}"]`
    );
    if (activeEl) {
      const { offsetLeft, offsetWidth } = activeEl;
      setUnderlineStyle({ left: offsetLeft, width: offsetWidth });

      activeEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeId, tabs]);

  const startX = useRef(0);
  const endX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const delta = startX.current - endX.current;
    const currentIndex = tabs.findIndex((t) => t.id === activeId);

    if (delta > 50 && currentIndex < tabs.length - 1) {
      // swipe left → next
      setActiveId(tabs[currentIndex + 1].id);
    } else if (delta < -50 && currentIndex > 0) {
      // swipe right → prev
      setActiveId(tabs[currentIndex - 1].id);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    endX.current = e.touches[0].clientX;
  };

  return (
    <div className="w-full max-w-[1360px] mx-auto">
      {/* Tab navigation */}
      <div className="bg-[#ffffff26] border border-[#ffffff21] rounded-t-[16px] shadow-[0px_4px_176px_#888888ff]">
        <div className="flex flex-col justify-start items-start w-full px-[20px] pt-2">
          <div
            ref={containerRef}
            className="relative flex w-full gap-6 overflow-x-auto scrollbar-hide"
          >
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                id={tab.id}
                label={tab.label}
                active={tab.id === activeId}
                onClick={setActiveId}
                data-tab-id={tab.id}
              />
            ))}

            {/* underline */}
            {underlineStyle.width > 0 && (
              <motion.div
                className="absolute bottom-0 h-[2px] bg-[#ffdc81]"
                animate={{
                  left: underlineStyle.left,
                  width: underlineStyle.width,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Tab content with swipe */}
      <div
        className="w-full rounded-b-[24px] bg-gradient-to-r from-[#13181ccc] via-[#ffdc81cc] to-[#f2e9dacc]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex flex-col lg:flex-row justify-center items-center w-full px-[56px] py-[40px]">
          {activeTab ? (
            <>
              <div className="flex flex-col gap-1.5 justify-start items-start w-full lg:w-[58%] mb-8 lg:mb-0">
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
          ) : null}
        </div>
      </div>
    </div>
  );
}
