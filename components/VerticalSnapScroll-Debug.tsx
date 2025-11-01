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
}

export default function VerticalSnapScroll({
  items,
  className = '',
  snapItemClassName = '',
  scrollSpeed = 0.5,
  snapThreshold = { min: 100, max: 400 },
}: VerticalSnapScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyViewportRef = useRef<HTMLDivElement>(null);
  const horizontalContentRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [horizontalProgress, setHorizontalProgress] = useState(0);
  const [transitionDuration, setTransitionDuration] = useState(700);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const accumulatedScrollRef = useRef(0);
  const scrollStartTimeRef = useRef<number>(0);
  const isActiveScrollRef = useRef(false);
  const [calculatedScrollWidths, setCalculatedScrollWidths] = useState<Map<string, number>>(new Map());

  const { min: minThreshold, max: maxThreshold } = snapThreshold;

  // Calculate scroll widths for horizontal-scroll items
  useEffect(() => {
    const calculateWidths = () => {
      const newScrollWidths = new Map<string, number>();

      items.forEach((item) => {
        if (item.type === 'horizontal-scroll') {
          if (item.horizontalScrollWidth !== undefined) {
            console.log(`[${item.id}] Using provided width:`, item.horizontalScrollWidth);
            newScrollWidths.set(item.id, item.horizontalScrollWidth);
          } else {
            const contentRef = horizontalContentRefs.current.get(item.id);
            console.log(`[${item.id}] Content ref:`, contentRef);
            
            if (contentRef) {
              // Log all children to debug
              console.log(`[${item.id}] Children:`, contentRef.children);
              console.log(`[${item.id}] ContentRef scrollWidth:`, contentRef.scrollWidth);
              console.log(`[${item.id}] ContentRef clientWidth:`, contentRef.clientWidth);
              
              // Try multiple ways to find the scrollable content
              let innerContent = contentRef.querySelector('[class*="flex"]');
              
              if (!innerContent) {
                // Try to find any div with large width
                const allDivs = contentRef.querySelectorAll('div');
                for (const div of allDivs) {
                  if (div.scrollWidth > window.innerWidth) {
                    innerContent = div;
                    break;
                  }
                }
              }
              
              if (!innerContent) {
                innerContent = contentRef.firstElementChild as HTMLElement;
              }
              
              console.log(`[${item.id}] Inner content found:`, innerContent);
              
              if (innerContent) {
                const scrollWidth = innerContent.scrollWidth;
                const viewportWidth = window.innerWidth;
                const effectiveScrollWidth = Math.max(0, scrollWidth - viewportWidth);
                
                console.log(`[${item.id}] Measurements:`, {
                  scrollWidth,
                  viewportWidth,
                  effectiveScrollWidth
                });
                
                newScrollWidths.set(item.id, effectiveScrollWidth);
              }
            }
          }
        }
      });

      console.log('Final calculated widths:', newScrollWidths);
      setCalculatedScrollWidths(newScrollWidths);
    };

    // Initial calculation with a delay
    const timer = setTimeout(calculateWidths, 300);
    return () => clearTimeout(timer);
  }, [items]);

  // Recalculate on window resize
  useEffect(() => {
    const handleResize = () => {
      const newScrollWidths = new Map<string, number>();

      items.forEach((item) => {
        if (item.type === 'horizontal-scroll' && !item.horizontalScrollWidth) {
          const contentRef = horizontalContentRefs.current.get(item.id);
          if (contentRef) {
            let innerContent = contentRef.querySelector('[class*="flex"]');
            
            if (!innerContent) {
              const allDivs = contentRef.querySelectorAll('div');
              for (const div of allDivs) {
                if (div.scrollWidth > window.innerWidth) {
                  innerContent = div;
                  break;
                }
              }
            }
            
            if (!innerContent) {
              innerContent = contentRef.firstElementChild as HTMLElement;
            }
            
            if (innerContent) {
              const scrollWidth = innerContent.scrollWidth;
              const viewportWidth = window.innerWidth;
              const effectiveScrollWidth = Math.max(0, scrollWidth - viewportWidth);
              newScrollWidths.set(item.id, effectiveScrollWidth);
            }
          }
        } else if (item.type === 'horizontal-scroll' && item.horizontalScrollWidth) {
          newScrollWidths.set(item.id, item.horizontalScrollWidth);
        }
      });

      setCalculatedScrollWidths(newScrollWidths);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [items]);

  const getHorizontalScrollWidth = (itemId: string): number => {
    const width = calculatedScrollWidths.get(itemId) || 0;
    console.log(`Getting scroll width for ${itemId}:`, width);
    return width;
  };

  useEffect(() => {
    console.log('Horizontal progress updated:', horizontalProgress);
  }, [horizontalProgress]);

  useEffect(() => {
    const viewport = stickyViewportRef.current;
    const container = containerRef.current;
    if (!viewport || !container) return;

    const handleWheel = (e: WheelEvent) => {
      const containerRect = container.getBoundingClientRect();
      
      if (containerRect.bottom < 0 || containerRect.top > window.innerHeight) {
        return;
      }

      const now = Date.now();
      const timeSinceLastScroll = now - scrollStartTimeRef.current;

      if (timeSinceLastScroll > 200 && isActiveScrollRef.current) {
        isActiveScrollRef.current = false;
        accumulatedScrollRef.current = 0;
      }

      const shouldAllowNaturalScroll = () => {
        if (currentIndex === items.length - 1 && e.deltaY > 0) {
          const currentItem = items[currentIndex];
          const isHorizontalScrollItem = currentItem.type === 'horizontal-scroll';
          
          if (isHorizontalScrollItem) {
            const maxScroll = getHorizontalScrollWidth(currentItem.id);
            const tolerance = 10;
            return horizontalProgress >= maxScroll - tolerance;
          }
          return true;
        }
        
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
        accumulatedScrollRef.current = 0;
      }

      const currentItem = items[currentIndex];
      const isHorizontalScrollItem = currentItem.type === 'horizontal-scroll';
      const scrollDelta = e.deltaY * scrollSpeed;
      
      accumulatedScrollRef.current += scrollDelta;

      if (isHorizontalScrollItem) {
        const maxScroll = getHorizontalScrollWidth(currentItem.id);
        
        console.log('Horizontal scroll detected:', {
          currentProgress: horizontalProgress,
          scrollDelta,
          maxScroll
        });
        
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
          adaptiveTransitionDuration = 500;
        } else {
          if (velocity > 1.5) {
            shouldSnap = distance >= minThreshold * 0.7;
            adaptiveTransitionDuration = 700;
          } else {
            shouldSnap = (distance >= minThreshold && distance <= maxThreshold) || distance > maxThreshold;
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
              }
            } 
            else if (direction > 0) {
              if (newProgress >= maxScroll - tolerance) {
                if (currentIndex < items.length - 1) {
                  setCurrentIndex(currentIndex + 1);
                  setHorizontalProgress(0);
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
      }, 120);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [currentIndex, horizontalProgress, items, scrollSpeed, minThreshold, maxThreshold, calculatedScrollWidths]);

  // Touch events (keeping original for brevity)
  useEffect(() => {
    const viewport = stickyViewportRef.current;
    if (!viewport) return;

    let touchStartY = 0;
    let touchStartX = 0;
    let touchStartTime = 0;
    let lastTouchY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      lastTouchY = touchStartY;
      touchStartTime = Date.now();
      accumulatedScrollRef.current = 0;
      isActiveScrollRef.current = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touchY = e.touches[0].clientY;
      const touchX = e.touches[0].clientX;
      const deltaY = (lastTouchY - touchY) * scrollSpeed;
      const totalDeltaY = (touchStartY - touchY) * scrollSpeed;
      const totalDeltaX = (touchStartX - touchX) * scrollSpeed;
      
      lastTouchY = touchY;

      const currentItem = items[currentIndex];
      const isHorizontalScrollItem = currentItem.type === 'horizontal-scroll';

      if (isHorizontalScrollItem) {
        const maxScroll = getHorizontalScrollWidth(currentItem.id);
        
        if (Math.abs(totalDeltaY) > Math.abs(totalDeltaX)) {
          const newProgress = horizontalProgress + deltaY;
          accumulatedScrollRef.current += deltaY;
          
          setHorizontalProgress(Math.max(0, Math.min(maxScroll, newProgress)));
        }
      } else {
        accumulatedScrollRef.current += deltaY;
      }
    };

    const handleTouchEnd = () => {
      if (!isActiveScrollRef.current) return;

      const touchDuration = Date.now() - touchStartTime;
      const distance = Math.abs(accumulatedScrollRef.current);
      const direction = accumulatedScrollRef.current > 0 ? 1 : -1;
      const velocity = distance / Math.max(touchDuration, 1);

      const currentItem = items[currentIndex];
      const isHorizontalScrollItem = currentItem.type === 'horizontal-scroll';

      const isFastSwipe = touchDuration < 200 && velocity > 1;
      const isSlowSwipe = touchDuration > 400;

      let shouldSnap = false;
      let adaptiveTransitionDuration = 700;

      if (isFastSwipe) {
        shouldSnap = distance >= minThreshold * 0.4;
        adaptiveTransitionDuration = 850;
      } else if (isSlowSwipe) {
        shouldSnap = distance >= minThreshold * 0.7;
        adaptiveTransitionDuration = 550;
      } else {
        shouldSnap = distance >= minThreshold * 0.6;
        adaptiveTransitionDuration = 700;
      }

      if (distance > maxThreshold) {
        shouldSnap = true;
      }

      if (shouldSnap) {
        setTransitionDuration(adaptiveTransitionDuration);

        if (isHorizontalScrollItem) {
          const maxScroll = getHorizontalScrollWidth(currentItem.id);
          const newProgress = horizontalProgress + accumulatedScrollRef.current;
          const tolerance = 10;

          if (direction < 0) {
            if (horizontalProgress <= tolerance && currentIndex > 0) {
              setCurrentIndex(currentIndex - 1);
              setHorizontalProgress(0);
            }
          }
          else if (direction > 0) {
            if (newProgress >= maxScroll - tolerance) {
              if (currentIndex < items.length - 1) {
                setCurrentIndex(currentIndex + 1);
                setHorizontalProgress(0);
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
    };

    viewport.addEventListener('touchstart', handleTouchStart, { passive: false });
    viewport.addEventListener('touchmove', handleTouchMove, { passive: false });
    viewport.addEventListener('touchend', handleTouchEnd);

    return () => {
      viewport.removeEventListener('touchstart', handleTouchStart);
      viewport.removeEventListener('touchmove', handleTouchMove);
      viewport.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentIndex, horizontalProgress, items, scrollSpeed, minThreshold, maxThreshold, calculatedScrollWidths]);

  // Helper function to inject horizontalProgress prop into React elements
  const renderContentWithProgress = (content: ReactNode, index: number) => {
    const isCurrentHorizontalScroll = 
      items[index].type === 'horizontal-scroll' && index === currentIndex;

    if (isCurrentHorizontalScroll && isValidElement(content)) {
      console.log(`Injecting horizontalProgress ${horizontalProgress} into content at index ${index}`);
      return cloneElement(content as React.ReactElement<any>, {
        horizontalProgress: horizontalProgress,
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
                    console.log(`Ref set for ${item.id}:`, el);
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
      <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-50">
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
      </div>

      {/* Horizontal scroll progress indicator */}
      {items[currentIndex]?.type === 'horizontal-scroll' && (
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
      )}
    </div>
  );
}