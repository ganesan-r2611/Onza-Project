'use client';

import React, { useRef, useEffect, useState, ReactNode, cloneElement, isValidElement } from 'react';

export type SnapItemType = 'simple' | 'horizontal-scroll';

export interface SnapItem {
  id: string;
  type: SnapItemType;
  content: ReactNode;
  horizontalScrollWidth?: number;
}

export interface SnapThresholdRange {
  min: number;
  max: number;
}

interface VerticalSnapScrollProps {
  items: SnapItem[];
  className?: string;
  snapItemClassName?: string;
  scrollSpeed?: number;
  snapThreshold?: SnapThresholdRange;
  onIndexChange?: (index: number) => void;
}

export default function VerticalSnapScroll({
  items,
  className = '',
  snapItemClassName = '',
  scrollSpeed = 0.5,
  snapThreshold = { min: 100, max: 400 },
  onIndexChange,
}: VerticalSnapScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyViewportRef = useRef<HTMLDivElement>(null);
  const horizontalContentRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [horizontalProgress, setHorizontalProgress] = useState(0);
  const horizontalProgressRef = useRef(0);
  const [transitionDuration, setTransitionDuration] = useState(700);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const accumulatedScrollRef = useRef(0);
  const scrollStartTimeRef = useRef<number>(0);
  const isActiveScrollRef = useRef(false);
  const isTouchActiveRef = useRef(false);
  const lastTouchYRef = useRef(0);
  const [calculatedScrollWidths, setCalculatedScrollWidths] = useState<Map<string, number>>(new Map());
  const [isMeasuring, setIsMeasuring] = useState(true);
  const [shouldReleaseControl, setShouldReleaseControl] = useState(false);
  const isMomentumScrollRef = useRef(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const hasTriggeredScrollRef = useRef(false);
  const [isMac, setIsMac] = useState(false);

  const { min: minThreshold, max: maxThreshold } = snapThreshold;
  
  // Detect device type and OS
  useEffect(() => {
    const checkDevice = () => {
      setIsDesktop(window.innerWidth >= 1024);
      // Detect Mac
      setIsMac(/Mac|iPhone|iPad|iPod/.test(navigator.platform) || /Mac/.test(navigator.userAgent));
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Notify parent of index changes
  useEffect(() => {
    if (onIndexChange) {
      onIndexChange(currentIndex);
    }
  }, [currentIndex, onIndexChange]);

  // Sync ref with state
  useEffect(() => {
    horizontalProgressRef.current = horizontalProgress;
  }, [horizontalProgress]);

  // Check if we should release control based on scroll position
  useEffect(() => {
    const checkScrollPosition = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const nextSection = document.getElementById('additional-sections');
      const nextSectionRect = nextSection?.getBoundingClientRect();
      
      if (nextSectionRect) {
        const isNextSectionVisible = 
          nextSectionRect.top < windowHeight && 
          nextSectionRect.bottom > 0;
        
        if (isNextSectionVisible) {
          setShouldReleaseControl(true);
        } else {
          setShouldReleaseControl(false);
        }
      } else {
        const nextSectionStartsEntering = containerRect.bottom < windowHeight;
        setShouldReleaseControl(nextSectionStartsEntering);
        
        // When natural scroll is enabled and we're at the end, auto-scroll to additional sections
        if (nextSectionStartsEntering && currentIndex === items.length - 1) {
          const currentItem = items[currentIndex];
          const isHorizontalScrollItem = currentItem.type === 'horizontal-scroll';
          
          if (isHorizontalScrollItem) {
            const maxScroll = getHorizontalScrollWidth(currentItem.id);
            const tolerance = 10;
            if (horizontalProgressRef.current >= maxScroll - tolerance) {
              setTimeout(() => scrollToAdditionalSections(), 100);
            }
          } else {
            setTimeout(() => scrollToAdditionalSections(), 100);
          }
        }
      }
    };

    window.addEventListener('scroll', checkScrollPosition);
    checkScrollPosition();

    return () => {
      window.removeEventListener('scroll', checkScrollPosition);
    };
  }, [currentIndex, items]);

  // Calculate scroll widths when we switch to a horizontal scroll item
  useEffect(() => {
    const currentItem = items[currentIndex];
    
    if (currentItem?.type === 'horizontal-scroll') {
      const measureContent = () => {
        const contentRef = horizontalContentRefs.current.get(currentItem.id);
        
        if (!contentRef) {
          return false;
        }

        let carouselContainer = contentRef.querySelector('.identifier') || 
                                contentRef.querySelector('[class*="flex gap"]') || 
                                contentRef.querySelector('.flex');
        
        if (!carouselContainer) {
          carouselContainer = contentRef.querySelector('.overflow-hidden > div') || contentRef;
        }

        const scrollWidth = carouselContainer.scrollWidth;
        const clientWidth = carouselContainer.clientWidth;
        const effectiveScrollWidth = Math.max(0, scrollWidth - clientWidth);

        if (effectiveScrollWidth > 10) {
          setCalculatedScrollWidths(prev => {
            const newMap = new Map(prev);
            newMap.set(currentItem.id, effectiveScrollWidth);
            return newMap;
          });
          setIsMeasuring(false);
          return true;
        }

        return false;
      };

      setIsMeasuring(true);
      const delays = [100, 300, 500, 800, 1200, 2000];
      let attemptIndex = 0;

      const attemptMeasure = () => {
        const success = measureContent();
        
        if (!success && attemptIndex < delays.length) {
          setTimeout(attemptMeasure, delays[attemptIndex]);
          attemptIndex++;
        } else if (!success) {
          setIsMeasuring(false);
        }
      };

      attemptMeasure();
    }
  }, [currentIndex, items]);

  const getHorizontalScrollWidth = (itemId: string): number => {
    const calculated = calculatedScrollWidths.get(itemId);
    if (calculated) {
      return calculated;
    }
    return 500;
  };

  // Helper to scroll to additional sections
  const scrollToAdditionalSections = () => {
    if (hasTriggeredScrollRef.current) return;
    hasTriggeredScrollRef.current = true;
    
    const additionalSection = document.getElementById('additional-sections');
    if (additionalSection) {
      additionalSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Reset after transition
      setTimeout(() => {
        hasTriggeredScrollRef.current = false;
      }, 1500);
    }
  };

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle arrow keys
      if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        return;
      }

      // Release control if additional-sections visible
      if (shouldReleaseControl) {
        return;
      }

      // Check if container is in viewport
      const container = containerRef.current;
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      if (containerRect.bottom < 0 || containerRect.top > window.innerHeight) {
        return;
      }

      e.preventDefault();

      const currentItem = items[currentIndex];
      const isHorizontalScrollItem = currentItem.type === 'horizontal-scroll';

      // ENHANCED: Horizontal scroll support on desktop only
      if (isHorizontalScrollItem && isDesktop) {
        // Handle left/right arrows for horizontal scrolling
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          const maxScroll = getHorizontalScrollWidth(currentItem.id);
          const step = 100;
          let newProgress = horizontalProgress;

          if (e.key === 'ArrowLeft') {
            newProgress = Math.max(0, horizontalProgress - step);
          } else {
            newProgress = Math.min(maxScroll, horizontalProgress + step);
          }

          setHorizontalProgress(newProgress);
          setTransitionDuration(200);

          // Snap to next/previous section at edges
          const tolerance = 20;
          if (e.key === 'ArrowLeft' && newProgress <= tolerance && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setHorizontalProgress(0);
            setTransitionDuration(700);
          } else if (e.key === 'ArrowRight' && newProgress >= maxScroll - tolerance && currentIndex < items.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setHorizontalProgress(0);
            setTransitionDuration(700);
          } else if (e.key === 'ArrowRight' && newProgress >= maxScroll - tolerance && currentIndex === items.length - 1) {
            setTimeout(() => scrollToAdditionalSections(), 100);
          }
          return;
        }
        
        // ENHANCED: Up/Down arrows also work for horizontal items (desktop only)
        if (isDesktop && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
          const maxScroll = getHorizontalScrollWidth(currentItem.id);
          const step = 100;
          let newProgress = horizontalProgress;

          if (e.key === 'ArrowUp') {
            newProgress = Math.max(0, horizontalProgress - step);
          } else {
            newProgress = Math.min(maxScroll, horizontalProgress + step);
          }

          setHorizontalProgress(newProgress);
          setTransitionDuration(200);

          // Snap to next/previous section at edges
          const tolerance = 20;
          if (e.key === 'ArrowUp' && newProgress <= tolerance && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setHorizontalProgress(0);
            setTransitionDuration(700);
          } else if (e.key === 'ArrowDown' && newProgress >= maxScroll - tolerance && currentIndex < items.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setHorizontalProgress(0);
            setTransitionDuration(700);
          } else if (e.key === 'ArrowDown' && newProgress >= maxScroll - tolerance && currentIndex === items.length - 1) {
            setTimeout(() => scrollToAdditionalSections(), 100);
          }
          return;
        }
      } else {
        // Simple item - handle up/down for section navigation
        if (e.key === 'ArrowDown' && currentIndex < items.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setTransitionDuration(700);
        } else if (e.key === 'ArrowDown' && currentIndex === items.length - 1) {
          setTimeout(() => scrollToAdditionalSections(), 100);
        } else if (e.key === 'ArrowUp' && currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
          setTransitionDuration(700);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, horizontalProgress, items, shouldReleaseControl, isDesktop]);

  // MAC-SPECIFIC: Use native scroll with wheel event tracking for snapping
  useEffect(() => {
    if (!isMac) return;

    const viewport = stickyViewportRef.current;
    const container = containerRef.current;
    if (!viewport || !container) return;

    let wheelEndTimeout: NodeJS.Timeout;
    let accumulatedDelta = 0;
    let wheelEventCount = 0;
    let snapScheduled = false;
    let lastWheelTime = 0;

    const handleWheelMac = (e: WheelEvent) => {
      // Check if we should release control
      if (shouldReleaseControl) {
        if (currentIndex === items.length - 1) {
          setTimeout(() => scrollToAdditionalSections(), 50);
        }
        return;
      }

      // Check if container is in viewport
      const containerRect = container.getBoundingClientRect();
      if (containerRect.bottom < 0 || containerRect.top > window.innerHeight) {
        return;
      }

      // Check if additional section is visible
      const nextSection = document.getElementById('additional-sections');
      if (nextSection) {
        const nextSectionRect = nextSection.getBoundingClientRect();
        const isNextSectionVisible = 
          nextSectionRect.top < window.innerHeight && 
          nextSectionRect.bottom > 0;
        
        if (isNextSectionVisible) {
          return;
        }
      }

      const now = Date.now();
      const timeSinceLastWheel = now - lastWheelTime;
      lastWheelTime = now;

      // Reset if new gesture (gap > 150ms)
      if (timeSinceLastWheel > 150) {
        wheelEventCount = 0;
        accumulatedDelta = 0;
        snapScheduled = false;
        if (wheelEndTimeout) {
          clearTimeout(wheelEndTimeout);
        }
      }

      wheelEventCount++;

      const currentItem = items[currentIndex];
      const isHorizontalScrollItem = currentItem.type === 'horizontal-scroll';

      // For horizontal scroll items on desktop, handle scrolling
      if (isHorizontalScrollItem && isDesktop) {
        e.preventDefault();
        
        const scrollDelta = e.deltaY * scrollSpeed * 1.8;
        const maxScroll = getHorizontalScrollWidth(currentItem.id);
        const newProgress = horizontalProgress + scrollDelta;
        
        setHorizontalProgress(Math.max(0, Math.min(maxScroll, newProgress)));
        setTransitionDuration(0);

        accumulatedDelta += scrollDelta;

        // Detect momentum phase
        const isInMomentum = Math.abs(e.deltaY) < 10 && wheelEventCount > 15;
        const hasEnoughDistance = Math.abs(accumulatedDelta) >= 150; // Increased threshold

        // Once in momentum with enough distance, schedule snap and don't reset
        if (isInMomentum && hasEnoughDistance && !snapScheduled) {
          snapScheduled = true;

          wheelEndTimeout = setTimeout(() => {
            const tolerance = 20;
            const direction = accumulatedDelta > 0 ? 1 : -1;

            if (direction < 0 && horizontalProgress <= tolerance && currentIndex > 0) {
              setCurrentIndex(currentIndex - 1);
              setHorizontalProgress(0);
              setTransitionDuration(700);
            } else if (direction > 0 && horizontalProgress >= maxScroll - tolerance) {
              if (currentIndex < items.length - 1) {
                setCurrentIndex(currentIndex + 1);
                setHorizontalProgress(0);
                setTransitionDuration(700);
              } else {
                setTimeout(() => scrollToAdditionalSections(), 100);
              }
            }

            accumulatedDelta = 0;
            wheelEventCount = 0;
            snapScheduled = false;
          }, 150);

          return;
        }

        // If snap already scheduled, just update progress
        if (snapScheduled) {
          return;
        }

        // Clear and reset timeout only if not scheduled
        if (wheelEndTimeout) {
          clearTimeout(wheelEndTimeout);
        }

        wheelEndTimeout = setTimeout(() => {
          const tolerance = 20;
          const direction = accumulatedDelta > 0 ? 1 : -1;

          if (direction < 0 && horizontalProgress <= tolerance && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setHorizontalProgress(0);
            setTransitionDuration(700);
          } else if (direction > 0 && horizontalProgress >= maxScroll - tolerance) {
            if (currentIndex < items.length - 1) {
              setCurrentIndex(currentIndex + 1);
              setHorizontalProgress(0);
              setTransitionDuration(700);
            } else {
              setTimeout(() => scrollToAdditionalSections(), 100);
            }
          }

          accumulatedDelta = 0;
          wheelEventCount = 0;
          snapScheduled = false;
        }, 100);

        return;
      }

      // For simple items, prevent default and handle snapping
      const shouldAllowNaturalScroll = () => {
        if (currentIndex === items.length - 1 && e.deltaY > 0) {
          setTimeout(() => scrollToAdditionalSections(), 100);
          return true;
        }
        
        if (currentIndex === 0 && e.deltaY < 0) {
          return true;
        }
        
        return false;
      };

      if (shouldAllowNaturalScroll()) {
        accumulatedDelta = 0;
        wheelEventCount = 0;
        snapScheduled = false;
        if (wheelEndTimeout) {
          clearTimeout(wheelEndTimeout);
        }
        return;
      }

      // Prevent default for simple items to control snapping
      e.preventDefault();

      accumulatedDelta += e.deltaY;

      // Detect momentum phase (small deltas, many events)
      const isInMomentum = Math.abs(e.deltaY) < 10 && wheelEventCount > 15;
      const hasEnoughDistance = Math.abs(accumulatedDelta) >= 150; // Increased threshold

      // KEY FIX: Once in momentum with enough distance, schedule snap and DON'T reset
      if (isInMomentum && hasEnoughDistance && !snapScheduled) {
        snapScheduled = true;

        wheelEndTimeout = setTimeout(() => {
          setTransitionDuration(700);
          
          if (accumulatedDelta > 0 && currentIndex < items.length - 1) {
            setCurrentIndex(currentIndex + 1);
          } else if (accumulatedDelta < 0 && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
          }

          accumulatedDelta = 0;
          wheelEventCount = 0;
          snapScheduled = false;
        }, 150);

        return; // Don't reset timeout below
      }

      // If snap already scheduled, just continue - don't reset timeout
      if (snapScheduled) {
        return;
      }

      // Clear existing timeout only if snap not scheduled
      if (wheelEndTimeout) {
        clearTimeout(wheelEndTimeout);
      }

      // Regular timeout for early phase
      wheelEndTimeout = setTimeout(() => {
        const threshold = 150; // Increased to match momentum threshold
        
        if (Math.abs(accumulatedDelta) >= threshold) {
          setTransitionDuration(700);
          
          if (accumulatedDelta > 0 && currentIndex < items.length - 1) {
            setCurrentIndex(currentIndex + 1);
          } else if (accumulatedDelta < 0 && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
          }
        }

        accumulatedDelta = 0;
        wheelEventCount = 0;
        snapScheduled = false;
      }, 100);
    };

    viewport.addEventListener('wheel', handleWheelMac, { passive: false });

    return () => {
      viewport.removeEventListener('wheel', handleWheelMac);
      if (wheelEndTimeout) {
        clearTimeout(wheelEndTimeout);
      }
    };
  }, [isMac, currentIndex, items, horizontalProgress, isDesktop, scrollSpeed, shouldReleaseControl]);

  // WHEEL EVENT HANDLER - Skip for Mac, let native behavior work
  useEffect(() => {
    // On Mac, don't intercept wheel events - let native scroll behavior handle it
    if (isMac) {
      console.log('Mac detected - skipping custom wheel handler');
      return;
    }

    const viewport = stickyViewportRef.current;
    const container = containerRef.current;
    if (!viewport || !container) return;

    const handleWheel = (e: WheelEvent) => {
      // Block if touch is active
      if (isTouchActiveRef.current) {
        e.preventDefault();
        return;
      }

      // Check if event is on our container
      const target = e.target as HTMLElement;
      if (!viewport.contains(target)) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      
      // Don't interfere if container is not in viewport
      if (containerRect.bottom < 0 || containerRect.top > window.innerHeight) {
        return;
      }

      // Check if additional section is visible
      const nextSection = document.getElementById('additional-sections');
      if (nextSection) {
        const nextSectionRect = nextSection.getBoundingClientRect();
        const isNextSectionVisible = 
          nextSectionRect.top < window.innerHeight && 
          nextSectionRect.bottom > 0;
        
        if (isNextSectionVisible) {
          return;
        }
      }

      // If we've scrolled past the container, allow natural scrolling
      if (shouldReleaseControl && e.deltaY > 0) {
        if (currentIndex === items.length - 1) {
          setTimeout(() => scrollToAdditionalSections(), 50);
        }
        return;
      }

      const now = Date.now();

      const shouldAllowNaturalScroll = () => {
        // At the last item, scrolling down
        if (currentIndex === items.length - 1 && e.deltaY > 0) {
          const currentItem = items[currentIndex];
          const isHorizontalScrollItem = currentItem.type === 'horizontal-scroll';
          
          if (isHorizontalScrollItem) {
            const maxScroll = getHorizontalScrollWidth(currentItem.id);
            const tolerance = 10;
            if (horizontalProgress >= maxScroll - tolerance) {
              setTimeout(() => scrollToAdditionalSections(), 100);
              return true;
            }
            return false;
          }
          setTimeout(() => scrollToAdditionalSections(), 100);
          return true;
        }
        
        // At the first item, scrolling up
        if (currentIndex === 0 && e.deltaY < 0) {
          const currentItem = items[currentIndex];
          const isHorizontalScrollItem = currentItem.type === 'horizontal-scroll';
          
          if (isHorizontalScrollItem) {
            return horizontalProgress <= 0;
          }
          return true;
        }
        
        return false;
      };

      if (shouldAllowNaturalScroll()) {
        isActiveScrollRef.current = false;
        accumulatedScrollRef.current = 0;
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        return;
      }

      e.preventDefault();

      if (!isActiveScrollRef.current) {
        scrollStartTimeRef.current = now;
        isActiveScrollRef.current = true;
        setIsScrolling(true);
      }

      const currentItem = items[currentIndex];
      const isHorizontalScrollItem = currentItem.type === 'horizontal-scroll';
      
      const scrollDelta = e.deltaY * scrollSpeed;
      
      accumulatedScrollRef.current += scrollDelta;

      if (isHorizontalScrollItem) {
        const maxScroll = getHorizontalScrollWidth(currentItem.id);
        
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          const newProgress = horizontalProgress + scrollDelta;
          setHorizontalProgress(Math.max(0, Math.min(maxScroll, newProgress)));
        } else {
          const horizontalScrollDelta = e.deltaX * scrollSpeed;
          const newProgress = horizontalProgress + horizontalScrollDelta;
          setHorizontalProgress(Math.max(0, Math.min(maxScroll, newProgress)));
        }
        setTransitionDuration(0);
      } else {
        setTransitionDuration(0);
      }

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      const timeoutDelay = 80;

      scrollTimeoutRef.current = setTimeout(() => {
        if (!isActiveScrollRef.current) return;

        const scrollDuration = now - scrollStartTimeRef.current;
        const distance = Math.abs(accumulatedScrollRef.current);
        const direction = accumulatedScrollRef.current > 0 ? 1 : -1;

        const FAST_GESTURE_TIME = 100;
        const SLOW_SCROLL_TIME = 300;

        const isFastGesture = scrollDuration < FAST_GESTURE_TIME;
        const isSlowScroll = scrollDuration >= SLOW_SCROLL_TIME;

        let shouldSnap = false;
        let adaptiveTransitionDuration = 800;

        const threshold = minThreshold * 0.6;

        if (isFastGesture) {
          shouldSnap = distance >= 25;
          adaptiveTransitionDuration = 700;
        } else if (isSlowScroll) {
          shouldSnap = distance >= threshold;
          adaptiveTransitionDuration = 900;
        } else {
          if (distance >= threshold) {
            shouldSnap = true;
            adaptiveTransitionDuration = 800;
          }
        }

        if (shouldSnap) {
          setTransitionDuration(adaptiveTransitionDuration);

          if (isHorizontalScrollItem) {
            const maxScroll = getHorizontalScrollWidth(currentItem.id);
            const tolerance = 20;

            if (direction < 0) {
              if (horizontalProgress <= tolerance && currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
                setHorizontalProgress(0);
                setTransitionDuration(700);
              }
            } 
            else if (direction > 0) {
              const newProgress = horizontalProgress + accumulatedScrollRef.current;
              if (newProgress >= maxScroll - tolerance) {
                if (currentIndex < items.length - 1) {
                  setCurrentIndex(currentIndex + 1);
                  setHorizontalProgress(0);
                  setTransitionDuration(700);
                } else {
                  setHorizontalProgress(maxScroll);
                }
              }
            }
          } else {
            if (direction > 0 && currentIndex < items.length - 1) {
              setCurrentIndex(currentIndex + 1);
            } else if (direction < 0 && currentIndex > 0) {
              setCurrentIndex(currentIndex - 1);
            }
          }
        }

        isActiveScrollRef.current = false;
        accumulatedScrollRef.current = 0;
        scrollStartTimeRef.current = 0;
        setIsScrolling(false);
      }, timeoutDelay);
    };

    viewport.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      viewport.removeEventListener('wheel', handleWheel);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [currentIndex, horizontalProgress, items, scrollSpeed, minThreshold, maxThreshold, calculatedScrollWidths, shouldReleaseControl, isMac]);

  // Touch events
  useEffect(() => {
    const viewport = stickyViewportRef.current;
    if (!viewport) return;

    let touchStartTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (shouldReleaseControl) {
        return;
      }

      const nextSection = document.getElementById('additional-sections');
      if (nextSection) {
        const nextSectionRect = nextSection.getBoundingClientRect();
        const isNextSectionVisible = 
          nextSectionRect.top < window.innerHeight && 
          nextSectionRect.bottom > 0;
        
        if (isNextSectionVisible) {
          return;
        }
      }

      const container = containerRef.current;
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      if (containerRect.bottom < 0 || containerRect.top > window.innerHeight) {
        return;
      }

      const isLastItem = currentIndex === items.length - 1;
      if (isLastItem) {
        const currentItem = items[currentIndex];
        const isHorizontalScrollItem = currentItem.type === 'horizontal-scroll';
        
        if (isHorizontalScrollItem) {
          const maxScroll = getHorizontalScrollWidth(currentItem.id);
          const tolerance = 100;
          if (horizontalProgressRef.current >= maxScroll - tolerance) {
            isTouchActiveRef.current = false;
            isActiveScrollRef.current = false;
            return;
          }
        }
      }

      isTouchActiveRef.current = true;
      lastTouchYRef.current = e.touches[0].clientY;
      touchStartTime = Date.now();
      accumulatedScrollRef.current = 0;
      isActiveScrollRef.current = true;
      scrollStartTimeRef.current = Date.now();
      setIsScrolling(true);
      setTransitionDuration(0);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (shouldReleaseControl) {
        if (currentIndex === items.length - 1) {
          setTimeout(() => scrollToAdditionalSections(), 100);
        }
        return;
      }

      const touchY = e.touches[0].clientY;
      
      if (touchY === 0 || !touchY || lastTouchYRef.current === 0) {
        lastTouchYRef.current = touchY || lastTouchYRef.current;
        return;
      }
      
      const deltaY = (lastTouchYRef.current - touchY);
      
      const isLastItem = currentIndex === items.length - 1;
      const isFirstItem = currentIndex === 0;

      if (isLastItem && deltaY > 3) {
        const currentItem = items[currentIndex];
        const isHorizontalScrollItem = currentItem.type === 'horizontal-scroll';
        
        if (isHorizontalScrollItem) {
          const maxScroll = getHorizontalScrollWidth(currentItem.id);
          const tolerance = 100;
          if (horizontalProgressRef.current >= maxScroll - tolerance) {
            isActiveScrollRef.current = false;
            isTouchActiveRef.current = false;
            setIsScrolling(false);
            lastTouchYRef.current = touchY;
            setTimeout(() => scrollToAdditionalSections(), 100);
            return;
          }
        } else {
          isActiveScrollRef.current = false;
          isTouchActiveRef.current = false;
          setIsScrolling(false);
          lastTouchYRef.current = touchY;
          setTimeout(() => scrollToAdditionalSections(), 100);
          return;
        }
      }
    
      if (isFirstItem && deltaY < -3) {
        const currentItem = items[currentIndex];
        const isHorizontalScrollItem = currentItem.type === 'horizontal-scroll';
        
        if (isHorizontalScrollItem && horizontalProgressRef.current <= 10) { 
          isActiveScrollRef.current = false;
          isTouchActiveRef.current = false;
          setIsScrolling(false);
          lastTouchYRef.current = touchY;
          return;
        }
      }
      
      if (!isActiveScrollRef.current) return;
      
      if (Math.abs(deltaY) > 200) {
        lastTouchYRef.current = touchY;
        return;
      }
      
      lastTouchYRef.current = touchY;
      e.preventDefault();

      const touchMultiplier = 8;
      const scrollDelta = deltaY * scrollSpeed * touchMultiplier;
      accumulatedScrollRef.current += scrollDelta;

      const currentItem = items[currentIndex];
      const isHorizontalScrollItem = currentItem.type === 'horizontal-scroll';

      if (isHorizontalScrollItem) {
        const maxScroll = getHorizontalScrollWidth(currentItem.id);
        
        setHorizontalProgress(prevProgress => {
          const newProgress = prevProgress + scrollDelta;
          const clampedProgress = Math.max(0, Math.min(maxScroll, newProgress));
          horizontalProgressRef.current = clampedProgress;
          return clampedProgress;
        });
      } else {
        const scaledDeltaY = deltaY * scrollSpeed;
        accumulatedScrollRef.current += scaledDeltaY;
      }
    };

    const handleTouchEnd = () => {
      if (!isActiveScrollRef.current) return;

      const currentItem = items[currentIndex];
      const isHorizontalScrollItem = currentItem.type === 'horizontal-scroll';
      const touchDuration = Date.now() - touchStartTime;
      const distance = Math.abs(accumulatedScrollRef.current);
      const direction = accumulatedScrollRef.current > 0 ? 1 : -1;

      if (isHorizontalScrollItem) {
        const maxScroll = getHorizontalScrollWidth(currentItem.id);
        const currentProgress = horizontalProgressRef.current;
        
        const atStart = currentProgress <= 20;
        const atEnd = currentProgress >= maxScroll - 20;

        if (distance >= 50) {
          if (direction < 0 && atStart && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setHorizontalProgress(0);
            horizontalProgressRef.current = 0;
          } else if (direction > 0 && atEnd && currentIndex < items.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setHorizontalProgress(0);
            horizontalProgressRef.current = 0;
          } else if (direction > 0 && atEnd && currentIndex === items.length - 1) {
            setTimeout(() => scrollToAdditionalSections(), 100);
          }
        }

        setTransitionDuration(200);
      } else {
        const FAST_GESTURE_TIME = 150;
        const isFastGesture = touchDuration < FAST_GESTURE_TIME;
        const shouldSnap = isFastGesture ? distance >= 30 : distance >= minThreshold * 0.6;
        
        if (shouldSnap) {
          if (direction > 0 && currentIndex < items.length - 1) {
            setCurrentIndex(currentIndex + 1);
          } else if (direction < 0 && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
          } else if (direction > 0 && currentIndex === items.length - 1) {
            setTimeout(() => scrollToAdditionalSections(), 100);
          }
        }
        
        setTransitionDuration(600);
      }

      isActiveScrollRef.current = false;
      accumulatedScrollRef.current = 0;
      
      setTimeout(() => {
        isTouchActiveRef.current = false;
      }, 300);
      
      setTimeout(() => {
        setIsScrolling(false);
      }, 50);
    };

    viewport.addEventListener('touchstart', handleTouchStart, { passive: false });
    viewport.addEventListener('touchmove', handleTouchMove, { passive: false });
    viewport.addEventListener('touchend', handleTouchEnd);

    return () => {
      viewport.removeEventListener('touchstart', handleTouchStart);
      viewport.removeEventListener('touchmove', handleTouchMove);
      viewport.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentIndex, horizontalProgress, items, scrollSpeed, minThreshold, shouldReleaseControl]);

  const renderContentWithProgress = (content: ReactNode, index: number) => {
    const isCurrentHorizontalScroll = 
      items[index].type === 'horizontal-scroll' && index === currentIndex;

    if (isCurrentHorizontalScroll && isValidElement(content)) {
      return cloneElement(content as React.ReactElement<{
        horizontalProgress?: number;
        isScrolling?: boolean;
        onMeasure?: (width: number) => void;
      }>, {
        horizontalProgress: horizontalProgress,
        isScrolling: isScrolling,
        onMeasure: (width: number) => {
          setCalculatedScrollWidths(prev => {
            const newMap = new Map(prev);
            newMap.set(items[index].id, width);
            return newMap;
          });
          setIsMeasuring(false);
        },
      });
    }

    return content;
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={{ height: `${items.length * 100}vh` }}
    >
      <div ref={stickyViewportRef} className="sticky top-0 w-full h-screen overflow-hidden">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-transform ease-out ${snapItemClassName}`}
            style={{
              transform: `translateY(${(index - currentIndex) * 100}%)`,
              transitionDuration: `${transitionDuration}ms`,
              pointerEvents: index === currentIndex ? 'auto' : 'none',
            }}
          >
            {item.type === 'horizontal-scroll' ? (
              <div 
                ref={(el) => {
                  if (el) {
                    horizontalContentRefs.current.set(item.id, el);
                  }
                }}
                className="w-full h-full overflow-hidden"
              >
                {renderContentWithProgress(item.content, index)}
              </div>
            ) : (
              <div className="w-full h-full">{item.content}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}