// components/SharePopUp.tsx (Enhanced Mobile Version)
"use client";
import { imageMap } from '@/libs/imageMap';
import type { NextPage } from 'next';
import Image from "next/image";
import { useState, useRef, useEffect } from 'react';

const SharePopUp: NextPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const togglePopup = () => {
    setIsVisible(!isVisible);
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      console.log('Link copied to clipboard!');
      setIsVisible(false);
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = document.title;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    };

    if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400');
      setIsVisible(false);
    }
  };

  return (
    <div className="relative" ref={popupRef}>
      {/* Share Button */}
      <div 
        className="flex items-center gap-[1.11vw] lg:gap-[0.56vw] 2xl:gap-[0.56vw] text-[2.78vw] lg:text-[0.83vw] 2xl:text-[0.83vw] font-regular text-[#777] cursor-pointer hover:opacity-80 transition-opacity relative z-40"
        onClick={togglePopup}
      >
        <span className="whitespace-nowrap">Share</span>
        <Image
          src={imageMap.export_img}
          alt="Share"
          width={16}
          height={16}
          className="w-[4.44vw] lg:w-[1.11vw] 2xl:w-[1.11vw] h-[4.44vw] lg:h-[1.11vw] 2xl:h-[1.11vw]"
        />
      </div>

      {/* Popup */}
      {isVisible && (
        <>
          {/* Mobile Overlay */}
          <div 
            className="fixed inset-0 bg-black/20 lg:bg-transparent z-[998] lg:hidden" 
            onClick={() => setIsVisible(false)}
          ></div>
          
          {/* Popup Content */}
          <div className="fixed lg:absolute top-1/2 lg:top-full left-1/2 lg:left-1/2 transform -translate-x-1/2 -translate-y-1/2 lg:translate-y-0 mt-0 lg:mt-3 w-[90vw] max-w-[320px] lg:w-[280px] bg-white/15 backdrop-blur-[50.4px] rounded-lg border border-white/20 shadow-lg z-[999] mx-4 lg:mx-0">
            {/* Arrow - Only show on desktop */}
            <div className="hidden lg:block absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white/15 border-l border-t border-white/20 rotate-45 rounded-tl"></div>
            
            <div className="p-4 lg:p-4">
              <div className="flex flex-col gap-2 lg:gap-2">
                {/* Copy Link */}
                <button 
                  className="flex items-center gap-3 p-3 lg:p-3 rounded-lg hover:bg-white/10 transition-colors w-full text-left group"
                  onClick={handleCopyLink}
                >
                  <Image 
                    src={imageMap.copy_btn}
                    alt="Copy Link" 
                    width={20} 
                    height={20}
                    className="w-5 h-5 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform"
                  />
                  <span className="text-[16px] lg:text-[14px] text-[#777] font-light group-hover:text-[#555] transition-colors">Copy link</span>
                </button>

                {/* Share on X */}
                <button 
                  className="flex items-center gap-3 p-3 lg:p-3 rounded-lg hover:bg-white/10 transition-colors w-full text-left group"
                  onClick={() => handleShare('twitter')}
                >
                  <Image 
                    src={imageMap.twitter_black_btn}
                    alt="Share on X" 
                    width={20} 
                    height={20}
                    className="w-5 h-5 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform"
                  />
                  <span className="text-[16px] lg:text-[14px] text-[#777] font-light group-hover:text-[#555] transition-colors">Share on X</span>
                </button>

                {/* Share on LinkedIn */}
                <button 
                  className="flex items-center gap-3 p-3 lg:p-3 rounded-lg hover:bg-white/10 transition-colors w-full text-left group"
                  onClick={() => handleShare('linkedin')}
                >
                  <Image 
                    src={imageMap.linkedin_black_btn}
                    alt="Share on LinkedIn" 
                    width={20} 
                    height={20}
                    className="w-5 h-5 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform"
                  />
                  <span className="text-[16px] lg:text-[14px] text-[#777] font-light group-hover:text-[#555] transition-colors">Share on LinkedIn</span>
                </button>

                {/* Share on Facebook */}
                <button 
                  className="flex items-center gap-3 p-3 lg:p-3 rounded-lg hover:bg-white/10 transition-colors w-full text-left group"
                  onClick={() => handleShare('facebook')}
                >
                  <Image 
                    src={imageMap.facebook_black_btn}
                    alt="Share on Facebook" 
                    width={20} 
                    height={20}
                    className="w-5 h-5 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform"
                  />
                  <span className="text-[16px] lg:text-[14px] text-[#777] font-light group-hover:text-[#555] transition-colors">Share on Facebook</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SharePopUp;