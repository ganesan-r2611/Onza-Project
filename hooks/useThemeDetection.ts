// hooks/useThemeDetection.ts
import { useState, useEffect, useCallback, useRef } from 'react';

export const useThemeDetection = () => {
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>('dark');
  const [isScrolling, setIsScrolling] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Method 1: Intersection Observer (Primary)
  const setupIntersectionObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const sections = document.querySelectorAll('section[data-theme]');
    if (sections.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const theme = entry.target.getAttribute('data-theme') as 'dark' | 'light';
            if (theme) {
              setCurrentTheme(theme);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: [0.1, 0.5, 0.9] // Multiple thresholds for better detection
      }
    );

    sections.forEach((section) => {
      observerRef.current?.observe(section);
    });
  }, []);

  // Method 2: Viewport Center Detection (Fallback)
  const detectThemeByViewportCenter = useCallback(() => {
    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;

    const element = document.elementFromPoint(viewportCenterX, viewportCenterY);
    if (element) {
      const section = element.closest('section[data-theme]');
      const theme = section?.getAttribute('data-theme') as 'dark' | 'light';
      if (theme) {
        setCurrentTheme(theme);
      }
    }
  }, []);

  // Method 3: Active Section Detection (For manual scroll containers)
  const detectActiveSection = useCallback(() => {
    const sections = document.querySelectorAll('section[data-theme]');
    let maxVisibleArea = 0;
    let activeTheme: 'dark' | 'light' = 'dark';

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      const visibleWidth = Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0);
      const visibleArea = visibleHeight * visibleWidth;

      if (visibleArea > maxVisibleArea && visibleArea > 0) {
        maxVisibleArea = visibleArea;
        const theme = section.getAttribute('data-theme') as 'dark' | 'light';
        if (theme) {
          activeTheme = theme;
        }
      }
    });

    if (maxVisibleArea > 0) {
      setCurrentTheme(activeTheme);
    }
  }, []);

  // Combined detection function
  const detectTheme = useCallback(() => {
    // Try intersection observer first
    if (observerRef.current) {
      return; // Let intersection observer handle it
    }
    
    // Fallback to manual detection
    detectActiveSection();
  }, [detectActiveSection]);

  // Scroll handler with multiple strategies
  const handleScroll = useCallback(() => {
    setIsScrolling(true);
    
    // Use requestAnimationFrame for smooth detection
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      detectTheme();
    });
  }, [detectTheme]);

  // Manual theme setter for programmatic control
  const setTheme = useCallback((theme: 'dark' | 'light') => {
    setCurrentTheme(theme);
  }, []);

  // Initialize and setup
  useEffect(() => {
    // Initial detection
    detectTheme();

    // Setup intersection observer
    setupIntersectionObserver();

    // Add scroll event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Also listen for resize events
    window.addEventListener('resize', detectTheme, { passive: true });

    // Scroll end detection
    let scrollTimeout: NodeJS.Timeout;
    const handleScrollEnd = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
        detectTheme(); // Final detection after scroll ends
      }, 150);
    };

    window.addEventListener('scroll', handleScrollEnd, { passive: true });

    // Mutation observer for dynamic content
    const mutationObserver = new MutationObserver((mutations) => {
      let shouldReconnect = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement && 
                (node.tagName === 'SECTION' || node.querySelector('section[data-theme]'))) {
              shouldReconnect = true;
            }
          });
        }
      });

      if (shouldReconnect) {
        setupIntersectionObserver();
        // Small delay to ensure DOM is fully updated
        setTimeout(detectTheme, 100);
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      // Cleanup
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScrollEnd);
      window.removeEventListener('resize', detectTheme);
      mutationObserver.disconnect();
      clearTimeout(scrollTimeout);
    };
  }, [detectTheme, handleScroll, setupIntersectionObserver]);

  return {
    currentTheme,
    isDark: currentTheme === 'dark',
    isLight: currentTheme === 'light',
    isScrolling,
    setTheme // For manual control
  };
};