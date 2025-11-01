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
  const [debugInfo, setDebugInfo] = useState('');
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const accumulatedScrollRef = useRef(0);
  const scrollStartTimeRef = useRef<number>(0);
  const isActiveScrollRef = useRef(false);
  const isTouchActiveRef = useRef(false);
  const [calculatedScrollWidths, setCalculatedScrollWidths] = useState<Map<string, number>>(new Map());
  const [isMeasuring, setIsMeasuring] = useState(true);
  const [shouldReleaseControl, setShouldReleaseControl] = useState(false);

  // Debug: Log every time horizontalProgress changes
  useEffect(() => {
    console.log('📍 horizontalProgress changed:', horizontalProgress);
  }, [horizontalProgress]);

  const { min: minThreshold, max: maxThreshold } = snapThreshold;

  // Notify parent of index changes
  useEffect(() => {
    console.log('🔢 currentIndex changed to:', currentIndex);
    if (onIndexChange) {
      onIndexChange(currentIndex);
    }
  }, [currentIndex, onIndexChange]);

  // Sync ref with state
  useEffect(() => {
    horizontalProgressRef.current = horizontalProgress;
    console.log('📍 horizontalProgress changed to:', horizontalProgress);
  }, [horizontalProgress]);

  // Check if we should release control based on scroll position
  useEffect(() => {
    const checkScrollPosition = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Find the next section (additional sections) in the DOM
      const nextSection = document.getElementById('additional-sections');
      const nextSectionRect = nextSection?.getBoundingClientRect();
      
      if (nextSectionRect) {
        // Check if any part of the additional section is visible in viewport
        const isNextSectionVisible = 
          nextSectionRect.top < windowHeight && 
          nextSectionRect.bottom > 0;
        
        if (isNextSectionVisible) {
          // Additional section is visible - keep control released
          setShouldReleaseControl(true);
          console.log('Additional section in viewport - keeping control released');
        } else {
          // Additional section is completely out of view - regain control
          setShouldReleaseControl(false);
          console.log('Additional section out of viewport - regaining control');
        }
      } else {
        // Fallback to container-based detection if additional section not found
        const nextSectionStartsEntering = containerRect.bottom < windowHeight;
        setShouldReleaseControl(nextSectionStartsEntering);
      }
    };

    window.addEventListener('scroll', checkScrollPosition);
    checkScrollPosition(); // Initial check

    return () => {
      window.removeEventListener('scroll', checkScrollPosition);
    };
  }, []);

  // Calculate scroll widths when we switch to a horizontal scroll item
  useEffect(() => {
    const currentItem = items[currentIndex];
    
    if (currentItem?.type === 'horizontal-scroll') {
      const measureContent = () => {
        const contentRef = horizontalContentRefs.current.get(currentItem.id);
        
        if (!contentRef) {
          return false;
        }

        // Look for the carousel with identifier class or flex gap
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
            console.log('✅ Measured carousel:', effectiveScrollWidth);
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
    
    // TEMPORARY: Hardcode for testing
    return 2000;
  };

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle arrow keys
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
        return;
      }

      // Check if we should release control to natural scrolling
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

      if (isHorizontalScrollItem) {
        // Horizontal scroll item - handle left/right arrows
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          const maxScroll = getHorizontalScrollWidth(currentItem.id);
          const step = 100; // Fixed step for keyboard
          let newProgress = horizontalProgress;

          if (e.key === 'ArrowLeft') {
            newProgress = Math.max(0, horizontalProgress - step);
          } else if (e.key === 'ArrowRight') {
            newProgress = Math.min(maxScroll, horizontalProgress + step);
          }

          setHorizontalProgress(newProgress);
          setTransitionDuration(200); // Fast transition for keyboard

          // Check if we should snap to next/previous section
          const tolerance = 20;
          if (e.key === 'ArrowLeft' && newProgress <= tolerance && currentIndex > 0) {
            // At start, pressing left arrow - go to previous section
            setCurrentIndex(currentIndex - 1);
            setHorizontalProgress(0);
          } else if (e.key === 'ArrowRight' && newProgress >= maxScroll - tolerance && currentIndex < items.length - 1) {
            // At end, pressing right arrow - go to next section
            setCurrentIndex(currentIndex + 1);
            setHorizontalProgress(0);
          }
        }
        
        // For vertical arrows in horizontal scroll items, allow section navigation
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          if (e.key === 'ArrowDown' && currentIndex < items.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setHorizontalProgress(0);
          } else if (e.key === 'ArrowUp' && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setHorizontalProgress(0);
          }
        }
      } else {
        // Simple item - handle up/down arrows for section navigation
        if (e.key === 'ArrowDown' && currentIndex < items.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else if (e.key === 'ArrowUp' && currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, horizontalProgress, items, shouldReleaseControl]);

  useEffect(() => {
    const viewport = stickyViewportRef.current;
    const container = containerRef.current;
    if (!viewport || !container) return;

    const handleWheel = (e: WheelEvent) => {
      // CRITICAL: Block wheel events if touch is active (mobile sometimes fires both)
      if (isTouchActiveRef.current) {
        console.log('⛔ Blocking wheel - touch is active');
        e.preventDefault();
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
          // Additional section is in viewport - don't interfere at all
          console.log('Additional section visible - allowing natural scroll');
          return;
        }
      }
      
      const containerRect = container.getBoundingClientRect();
      
      // If we've scrolled past the container, allow natural scrolling
      if (shouldReleaseControl && e.deltaY > 0) {
        console.log('Released control - allowing natural scroll down');
        return;
      }
      
      // If container is completely above viewport, don't interfere
      if (containerRect.bottom < 0) {
        return;
      }
      
      // If container hasn't entered viewport yet, don't interfere
      if (containerRect.top > window.innerHeight) {
        return;
      }

      const now = Date.now();
      const timeSinceLastScroll = now - scrollStartTimeRef.current;

      if (timeSinceLastScroll > 200 && isActiveScrollRef.current) {
        isActiveScrollRef.current = false;
        accumulatedScrollRef.current = 0;
      }

      const shouldAllowNaturalScroll = () => {
        // At the last item, scrolling down
        if (currentIndex === items.length - 1 && e.deltaY > 0) {
          const currentItem = items[currentIndex];
          const isHorizontalScrollItem = currentItem.type === 'horizontal-scroll';
          
          if (isHorizontalScrollItem) {
            const maxScroll = getHorizontalScrollWidth(currentItem.id);
            const tolerance = 10;
            // Allow natural scroll when horizontal scroll is complete
            if (horizontalProgress >= maxScroll - tolerance) {
              return true;
            }
            return false;
          }
          // Simple item at the end - allow natural scroll to exit
          return true;
        }
        
        // At the first item, scrolling up - allow natural scroll
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
        // Allow browser's natural scroll
        return;
      }

      e.preventDefault();

      if (!isActiveScrollRef.current) {
        scrollStartTimeRef.current = now;
        isActiveScrollRef.current = true;
        accumulatedScrollRef.current = 0;
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
      }

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        if (!isActiveScrollRef.current) return;

        const scrollDuration = now - scrollStartTimeRef.current;
        const distance = Math.abs(accumulatedScrollRef.current);
        const direction = accumulatedScrollRef.current > 0 ? 1 : -1;
        const velocity = distance / Math.max(scrollDuration, 1);

        const FAST_GESTURE_TIME = 150;
        const SLOW_SCROLL_TIME = 300;

        const isFastGesture = scrollDuration < FAST_GESTURE_TIME;
        const isSlowScroll = scrollDuration >= SLOW_SCROLL_TIME;

        let shouldSnap = false;
        let adaptiveTransitionDuration = 700;

        if (isFastGesture) {
          shouldSnap = distance >= 30;
          adaptiveTransitionDuration = 900;
        } else if (isSlowScroll) {
          shouldSnap = distance >= minThreshold * 0.6;
          adaptiveTransitionDuration = 600;
        } else {
          if (distance >= minThreshold) {
            shouldSnap = true;
            adaptiveTransitionDuration = 600;
          }
        }

        if (shouldSnap) {
          setTransitionDuration(adaptiveTransitionDuration);

          if (isHorizontalScrollItem) {
            const maxScroll = getHorizontalScrollWidth(currentItem.id);
            const newProgress = horizontalProgress + accumulatedScrollRef.current;
            const tolerance = 5;

            if (direction < 0) {
              if (horizontalProgress <= tolerance && currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
                setHorizontalProgress(0);
                setTransitionDuration(700);
              }
            } 
            else if (direction > 0) {
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
      }, 120);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [currentIndex, horizontalProgress, items, scrollSpeed, minThreshold, maxThreshold, calculatedScrollWidths, shouldReleaseControl]);

  // Touch events - simplified to match wheel behavior
  useEffect(() => {
    const viewport = stickyViewportRef.current;
    if (!viewport) return;

    const lastTouchYRef = { current: 0 };
    let touchStartTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (shouldReleaseControl) return;
      
      isTouchActiveRef.current = true;
      lastTouchYRef.current = e.touches[0].clientY;
      touchStartTime = Date.now();
      accumulatedScrollRef.current = 0;
      isActiveScrollRef.current = true;
      scrollStartTimeRef.current = Date.now();
      setIsScrolling(true);
      setTransitionDuration(0);
      console.log('👆 Touch start');
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (shouldReleaseControl || !isActiveScrollRef.current) return;
      
      const touchY = e.touches[0].clientY;
      
      // CRITICAL: Protect against corrupted touch values
      if (touchY === 0 || !touchY || lastTouchYRef.current === 0) {
        console.log('⚠️ Invalid touch value detected, skipping:', { touchY, lastY: lastTouchYRef.current });
        lastTouchYRef.current = touchY || lastTouchYRef.current;
        return;
      }
      
      // deltaY positive = moved down, negative = moved up
      const deltaY = (lastTouchYRef.current - touchY);
      
      // CRITICAL: Protect against huge jumps (likely corrupted data)
      if (Math.abs(deltaY) > 200) {
        console.log('⚠️ Huge delta detected, skipping:', deltaY);
        lastTouchYRef.current = touchY;
        return;
      }
      
      // Update last position for next move
      lastTouchYRef.current = touchY;

      // Prevent default to stop page scroll
      e.preventDefault();

      // Touch needs MUCH higher speed - 8x multiplier for smooth, responsive feel on mobile
      const touchMultiplier = 8;
      
      // Swipe UP (negative deltaY) should scroll LEFT (negative scroll)
      // Swipe DOWN (positive deltaY) should scroll RIGHT (positive scroll)
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
          
          setDebugInfo(`Progress: ${clampedProgress.toFixed(0)}/${maxScroll.toFixed(0)}\nDelta: ${scrollDelta.toFixed(1)}`);
          
          return clampedProgress;
        });
      } else {
        // For vertical items, accumulate for snapping
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

      console.log('🏁 Touch end:', { distance, direction, currentProgress: horizontalProgressRef.current });

      if (isHorizontalScrollItem) {
        const maxScroll = getHorizontalScrollWidth(currentItem.id);
        const currentProgress = horizontalProgressRef.current;
        
        // Check if we're truly at the edges (within 20px)
        const atStart = currentProgress <= 20;
        const atEnd = currentProgress >= maxScroll - 20;

        console.log('🏁 Touch end:', { currentProgress, maxScroll, atStart, atEnd, direction, distance });

        // Only snap to next/prev section if:
        // 1. We're at the edge AND
        // 2. We're trying to scroll further in that direction AND
        // 3. There's a decent swipe distance (> 50px)
        let shouldSnapToSection = false;

        if (distance >= 50) {
          if (direction < 0 && atStart && currentIndex > 0) {
            // At start, swiping left (back) - go to previous section
            console.log('⬅️ Snap to prev section');
            shouldSnapToSection = true;
            setCurrentIndex(currentIndex - 1);
            setHorizontalProgress(0);
            horizontalProgressRef.current = 0;
          } else if (direction > 0 && atEnd && currentIndex < items.length - 1) {
            // At end, swiping right (forward) - go to next section
            console.log('➡️ Snap to next section');
            shouldSnapToSection = true;
            setCurrentIndex(currentIndex + 1);
            setHorizontalProgress(0);
            horizontalProgressRef.current = 0;
          }
        }

        if (!shouldSnapToSection) {
          console.log('✅ Stay in carousel - not at edge or wrong direction');
        }

        setTransitionDuration(200); // Faster transition for mobile
      } else {
        // Vertical snap items - normal behavior
        const FAST_GESTURE_TIME = 150;
        const isFastGesture = touchDuration < FAST_GESTURE_TIME;
        const shouldSnap = isFastGesture ? distance >= 30 : distance >= minThreshold * 0.6;

        if (shouldSnap) {
          if (direction > 0 && currentIndex < items.length - 1) {
            setCurrentIndex(currentIndex + 1);
          } else if (direction < 0 && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
          }
        }
        
        setTransitionDuration(600);
      }

      isActiveScrollRef.current = false;
      accumulatedScrollRef.current = 0;
      
      // Keep touch active for a bit longer to block any trailing wheel events
      setTimeout(() => {
        isTouchActiveRef.current = false;
        console.log('🔓 Touch cleared - wheel enabled');
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
      return cloneElement(content as React.ReactElement<any>, {
        horizontalProgress: horizontalProgress,
        isScrolling: isScrolling,
        onMeasure: (width: number) => {
          console.log('Received measurement from carousel:', width);
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

      {/* Navigation indicators */}
      {/* <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-50">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => {
              setCurrentIndex(index);
              setHorizontalProgress(0);
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white scale-125'
                : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to section ${index + 1}`}
          />
        ))}
      </div> */}

      {/* Horizontal scroll progress indicator */}
      {/* {items[currentIndex]?.type === 'horizontal-scroll' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-64 h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-300"
            style={{
              width: `${
                (horizontalProgress /
                  (getHorizontalScrollWidth(items[currentIndex].id) || 1)) *
                100
              }%`,
            }}
          />
        </div>
      )} */}

      {/* Debug info */}
      {/* {isMeasuring && items[currentIndex]?.type === 'horizontal-scroll' && (
        <div className="fixed top-4 left-4 bg-black/80 text-white px-4 py-2 rounded text-sm">
          Measuring content...
        </div>
      )} */}
      
      {/* Mobile Debug Overlay */}
      {/* {debugInfo && (
        <div className="fixed top-4 right-4 bg-red-600/90 text-white px-3 py-2 rounded text-xs font-mono whitespace-pre z-[100]">
          {debugInfo}
        </div>
      )} */}
    </div>
  );
}