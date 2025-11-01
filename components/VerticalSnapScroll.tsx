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
  const [calculatedScrollWidths, setCalculatedScrollWidths] = useState<Map<string, number>>(new Map());
  const [isMeasuring, setIsMeasuring] = useState(true);
  const [shouldReleaseControl, setShouldReleaseControl] = useState(false);
  const isMomentumScrollRef = useRef(false);

  const { min: minThreshold, max: maxThreshold } = snapThreshold;

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
        } else {
          // Additional section is completely out of view - regain control
          setShouldReleaseControl(false);
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
        e.preventDefault();
        return;
      }
      
      // Check if the wheel event is happening on our container
      const target = e.target as HTMLElement;
      if (!viewport.contains(target)) {
        // Event is outside our container, don't interfere
        return;
      }
      
      const containerRect = container.getBoundingClientRect();
      
      // Don't interfere if container is not in viewport at all
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
          // Additional section is in viewport - don't interfere at all
          return;
        }
      }
      
      // If we've scrolled past the container, allow natural scrolling
      if (shouldReleaseControl && e.deltaY > 0) {
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

      // Log for debugging Mac trackpad
      console.log('Wheel event:', { 
        deltaY: e.deltaY.toFixed(2), 
        deltaMode: e.deltaMode,
        accumulated: accumulatedScrollRef.current.toFixed(2)
      });

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

      // Better Mac trackpad momentum detection
      // Mac uses deltaMode 0 (pixels) and momentum has small consistent deltas
      const isLikelyMomentum = (
        e.deltaMode === 0 && // Pixel mode (trackpad)
        Math.abs(e.deltaY) < 10 && // Small delta
        Math.abs(e.deltaY) > 0.1 && // Not zero
        isActiveScrollRef.current // Already scrolling
      );
      
      isMomentumScrollRef.current = isLikelyMomentum;
      
      const timeoutDelay = isLikelyMomentum ? 50 : 150; // Shorter for momentum
      console.log('Timeout delay:', timeoutDelay, 'isMomentum:', isLikelyMomentum);

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

        // Lower threshold for momentum scrolling
        const threshold = isMomentumScrollRef.current ? minThreshold * 0.3 : minThreshold * 0.6;

        if (isFastGesture) {
          shouldSnap = distance >= 30;
          adaptiveTransitionDuration = 900;
        } else if (isSlowScroll) {
          shouldSnap = distance >= threshold;
          adaptiveTransitionDuration = 600;
        } else {
          if (distance >= threshold) {
            shouldSnap = true;
            adaptiveTransitionDuration = 600;
          }
        }
        
        console.log('Snap check:', { shouldSnap, distance, threshold, duration: scrollDuration });

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
      }, timeoutDelay);
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
      // Check if we should release control
      if (shouldReleaseControl) return;
      
      // Additional check: if container has scrolled past, don't interfere
      const container = containerRef.current;
      if (container) {
        const containerRect = container.getBoundingClientRect();
        // If container is above viewport (scrolled past), don't interfere
        if (containerRect.bottom < window.innerHeight) {
          return;
        }
      }
      
      // Check if we're at the last item and at a position where we should allow exit
      const isLastItem = currentIndex === items.length - 1;
      if (isLastItem) {
        const currentItem = items[currentIndex];
        const isHorizontalScrollItem = currentItem.type === 'horizontal-scroll';
        
        if (isHorizontalScrollItem) {
          const maxScroll = getHorizontalScrollWidth(currentItem.id);
          const tolerance = 100; // Increased tolerance
          // If at end of horizontal scroll, don't interfere - allow native scroll
          if (horizontalProgressRef.current >= maxScroll - tolerance) {
            isTouchActiveRef.current = false;
            isActiveScrollRef.current = false;
            return;
          }
        }
        // For simple items at the end, we still need to handle the touch to snap
        // but we'll release quickly if scrolling down
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
      if (shouldReleaseControl) return;
      
      const touchY = e.touches[0].clientY;
      
      // CRITICAL: Protect against corrupted touch values
      if (touchY === 0 || !touchY || lastTouchYRef.current === 0) {
        lastTouchYRef.current = touchY || lastTouchYRef.current;
        return;
      }
      
      // deltaY positive = moved down/scrolling down, negative = moved up/scrolling up
      const deltaY = (lastTouchYRef.current - touchY);
      
      // Check if we're at exit point BEFORE checking isActiveScrollRef
      const isLastItem = currentIndex === items.length - 1;
      if (isLastItem && deltaY > 3) { // Very low threshold
        const currentItem = items[currentIndex];
        const isHorizontalScrollItem = currentItem.type === 'horizontal-scroll';
        
        if (isHorizontalScrollItem) {
          const maxScroll = getHorizontalScrollWidth(currentItem.id);
          const tolerance = 100;
          if (horizontalProgressRef.current >= maxScroll - tolerance) {
            // Release completely
            isActiveScrollRef.current = false;
            isTouchActiveRef.current = false;
            setIsScrolling(false);
            lastTouchYRef.current = touchY;
            return; // Don't preventDefault
          }
        } else {
          // Simple item - release immediately
          isActiveScrollRef.current = false;
          isTouchActiveRef.current = false;
          setIsScrolling(false);
          lastTouchYRef.current = touchY;
          return; // Don't preventDefault
        }
      }
      
      if (!isActiveScrollRef.current) return;
      
      // CRITICAL: Protect against huge jumps (likely corrupted data)
      if (Math.abs(deltaY) > 200) {
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

      if (isHorizontalScrollItem) {
        const maxScroll = getHorizontalScrollWidth(currentItem.id);
        const currentProgress = horizontalProgressRef.current;
        
        // Check if we're truly at the edges (within 20px)
        const atStart = currentProgress <= 20;
        const atEnd = currentProgress >= maxScroll - 20;

        // Only snap to next/prev section if:
        // 1. We're at the edge AND
        // 2. We're trying to scroll further in that direction AND
        // 3. There's a decent swipe distance (> 50px)
        let shouldSnapToSection = false;

        if (distance >= 50) {
          if (direction < 0 && atStart && currentIndex > 0) {
            // At start, swiping left (back) - go to previous section
            shouldSnapToSection = true;
            setCurrentIndex(currentIndex - 1);
            setHorizontalProgress(0);
            horizontalProgressRef.current = 0;
          } else if (direction > 0 && atEnd && currentIndex < items.length - 1) {
            // At end, swiping right (forward) - go to next section
            shouldSnapToSection = true;
            setCurrentIndex(currentIndex + 1);
            setHorizontalProgress(0);
            horizontalProgressRef.current = 0;
          }
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