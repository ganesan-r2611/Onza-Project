'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import ServicesCarouselSection from './ServiceCarousel'

interface FlarePosition {
  x: number
  y: number
  time: number
}

export default function ScrollZoomComponent({data}) {
  const [scrollY, setScrollY] = useState(0)
  const [targetScrollY, setTargetScrollY] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [flarePositions, setFlarePositions] = useState<FlarePosition[]>([
    { x: 20, y: 30, time: 0 },
    { x: 60, y: 50, time: (2 * Math.PI / 3) },
    { x: 40, y: 70, time: (4 * Math.PI / 3) }
  ])

  // Handle scroll - Find the actual scrolling element
  useEffect(() => {
    const findScrollParent = () => {
      let element = containerRef.current
      while (element) {
        const style = window.getComputedStyle(element)
        const overflowY = style.overflowY
        const scrollHeight = element.scrollHeight
        const clientHeight = element.clientHeight
        
        if ((overflowY === 'auto' || overflowY === 'scroll') && scrollHeight > clientHeight) {
          return element
        }
        element = element.parentElement
      }
      return window
    }
    
    const scrollElement = findScrollParent()
    
    let rafId: number
    
    const checkScroll = () => {
      let scrollTop = 0
      
      if (scrollElement === window) {
        scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      } else if (scrollElement instanceof HTMLElement) {
        scrollTop = scrollElement.scrollTop
      }
      
      if (!containerRef.current) {
        rafId = requestAnimationFrame(checkScroll)
        return
      }
      
      const rect = containerRef.current.getBoundingClientRect()
      const relativeScroll = Math.max(0, -rect.top)
      
      setTargetScrollY(relativeScroll)
      
      rafId = requestAnimationFrame(checkScroll)
    }
    
    rafId = requestAnimationFrame(checkScroll)
    
    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [])

  // Smooth scroll with delay using RAF
  useEffect(() => {
    let rafId: number
    const smoothScroll = () => {
      setScrollY(prev => {
        const diff = targetScrollY - prev
        const speed = diff * 0.03
        
        if (Math.abs(diff) < 0.5) {
          return targetScrollY
        }
        
        return prev + speed
      })
      
      rafId = requestAnimationFrame(smoothScroll)
    }
    
    rafId = requestAnimationFrame(smoothScroll)
    return () => cancelAnimationFrame(rafId)
  }, [targetScrollY])

  // Animate lens flares
  useEffect(() => {
    const interval = setInterval(() => {
      setFlarePositions(prev => prev.map((flare, index) => {
        const speed = 0.015
        const newTime = flare.time + speed
        
        const baseAngle = (index * (2 * Math.PI / 3)) + newTime
        const orbitRadius = 65
        
        const x = 50 + Math.cos(baseAngle) * orbitRadius
        const y = 50 + Math.sin(baseAngle) * orbitRadius
        
        return { x, y, time: newTime }
      }))
    }, 50)

    return () => clearInterval(interval)
  }, [])

  // Calculate zoom scale based on scroll
  const maxZoom = 3
  const zoomThreshold = typeof window !== 'undefined' ? window.innerHeight * 3.5 : 3500
  const imageScale = Math.min(1 + (scrollY / zoomThreshold) * (maxZoom - 1), maxZoom)

  // Calculate color transition for Section 2
  const section2Start = typeof window !== 'undefined' ? window.innerHeight * 0.5 : 500
  const section2Transition = typeof window !== 'undefined' ? window.innerHeight * 0.4 : 400
  const section2Progress = Math.max(0, Math.min(1, (scrollY - section2Start) / section2Transition))

  // Calculate color transition for Section 3
  const section3Start = typeof window !== 'undefined' ? window.innerHeight * 1.5 : 1500
  const section3Transition = typeof window !== 'undefined' ? window.innerHeight * 0.4 : 400
  const section3Progress = Math.max(0, Math.min(1, (scrollY - section3Start) / section3Transition))

  // Calculate opacity for fixed background
  const componentHeight = typeof window !== 'undefined' ? window.innerHeight * 3.5 : 3500
  const fadeStart = componentHeight * 0.7
  const fadeDuration = componentHeight * 0.3
  const fadeProgress = scrollY > fadeStart 
    ? Math.min(1, (scrollY - fadeStart) / fadeDuration)
    : 0
  const fixedOpacity = 1 - fadeProgress

  return (
    <div ref={containerRef} id="scroll-zoom-container" className="relative" style={{ height: '400vh' }}>
      {/* Fixed gradient background with moving lens flares */}
      <div 
        className="fixed inset-0 -z-30 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, #0f3333, #0a2828, #051a1a, #020f0f)',
          opacity: fixedOpacity,
          pointerEvents: fixedOpacity === 0 ? 'none' : 'auto',
          visibility: fixedOpacity === 0 ? 'hidden' : 'visible'
        }}
      >
        {/* Lens flare 1 */}
        <div
          className="absolute rounded-full blur-3xl opacity-70 z-0"
          style={{
            width: 'clamp(750px, 75vw, 1200px)',
            height: 'clamp(750px, 75vw, 1200px)',
            left: `${flarePositions[0].x}%`,
            top: `${flarePositions[0].y}%`,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(120, 240, 240, 0.8) 0%, rgba(100, 220, 220, 0.6) 30%, rgba(80, 180, 180, 0.3) 60%, transparent 80%)',
            transition: 'all 0.5s ease-out'
          }}
        />
        
        {/* Lens flare 2 */}
        <div
          className="absolute rounded-full blur-3xl opacity-60 z-0"
          style={{
            width: 'clamp(750px, 75vw, 1200px)',
            height: 'clamp(750px, 75vw, 1200px)',
            left: `${flarePositions[1].x}%`,
            top: `${flarePositions[1].y}%`,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(140, 250, 250, 0.7) 0%, rgba(120, 230, 230, 0.5) 30%, rgba(90, 190, 190, 0.3) 60%, transparent 80%)',
            transition: 'all 0.5s ease-out'
          }}
        />
        
        {/* Lens flare 3 */}
        <div
          className="absolute rounded-full blur-3xl opacity-50 z-0"
          style={{
            width: 'clamp(750px, 75vw, 1200px)',
            height: 'clamp(750px, 75vw, 1200px)',
            left: `${flarePositions[2].x}%`,
            top: `${flarePositions[2].y}%`,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(100, 220, 220, 0.6) 0%, rgba(80, 200, 200, 0.4) 30%, rgba(70, 170, 170, 0.2) 60%, transparent 80%)',
            transition: 'all 0.5s ease-out'
          }}
        />
      </div>

      {/* Image section - stays circular, zooms to fill viewport */}
      <div 
        className="fixed inset-0 flex items-center justify-center pointer-events-none overflow-hidden -z-30 transition-opacity duration-500"
        style={{
          opacity: fixedOpacity,
          visibility: fixedOpacity === 0 ? 'hidden' : 'visible'
        }}
      >
        <div 
          className="relative overflow-hidden rounded-full shadow-2xl"
          style={{
            width: '40vw',
            height: '40vw',
            maxWidth: '500px',
            maxHeight: '500px',
            transform: `scale(${imageScale})`,
            transition: 'transform 0.1s linear'
          }}
        >
          {/* First gradient - top-left to bottom-right */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #3cc2cc 0%, #13181c 100%)',
              mixBlendMode: 'multiply',
              opacity: 0.7
            }}
          />
          {/* Second gradient - top-right to bottom-left */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(225deg, #3cc2cc 0%, #13181c 100%)',
              mixBlendMode: 'multiply',
              opacity: 0.7
            }}
          />
          {/* Third gradient - radial at top */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 120% 80% at 50% 0%, #3cc2cc 0%, rgba(60, 194, 204, 0.5) 40%, transparent 70%)',
              mixBlendMode: 'lighten',
              opacity: 0.8
            }}
          />
          {/* Fourth gradient - radial at bottom */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 50% 35% at 50% 100%, #3cc2cc 0%, rgba(60, 194, 204, 0.7) 20%, rgba(60, 194, 204, 0.4) 40%, rgba(60, 194, 204, 0.15) 65%, transparent 85%)',
              mixBlendMode: 'lighten',
              opacity: 0.8
            }}
          />
          {/* Diamond shaped overlay */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
          >
            <div
              style={{
                width: '65%',
                height: '65%',
                background: 'linear-gradient(135deg, rgb(59, 104, 108) 0%, rgb(39, 84, 88) 50%, rgb(19, 64, 68) 100%)',
                transform: 'rotate(45deg)',
                borderRadius: '8%'
              }}
            />
          </div>
        </div>
      </div>

      {/* Content container */}
      <div className="relative z-20">
        {/* Section 1 */}
        <div className="relative h-screen flex items-center justify-between z-10 px-8">
          {/* Left side - Main heading */}
          <div className="text-left text-white max-w-2xl">
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-tight drop-shadow-2xl">
              Crafting<br/>
              Pathways,<br/>
              That Endure
            </h2>
          </div>
          
          {/* Right side bottom - Tagline */}
            <div className="text-right text-white max-w-md self-end pb-8">
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl drop-shadow-lg leading-relaxed">
              Discreet and discerning guidance for those whose decisions define tomorrow&apos;s world.
            </p>
          </div>
        </div>

      

        {/* Section 2 */}
        <div className="relative h-screen flex items-center justify-start z-10 mt-[25vh] pl-8">
          <div className="text-left px-4 sm:px-6 md:px-8 max-w-3xl">
            {/* <div className="relative">
              <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-4 md:mb-6 drop-shadow-2xl text-black">
                Section Two
              </h2>
              <h2 
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-4 md:mb-6 drop-shadow-2xl text-white absolute top-0 left-0"
                style={{
                  clipPath: `inset(0 ${100 - section2Progress * 100}% 0 0)`
                }}
              >
                Section Two
              </h2>
            </div> */}
            
            <div className="relative">
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl drop-shadow-lg mb-4 text-black">
                Our Ethos
              </p>
              <p 
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl drop-shadow-lg mb-4 text-white absolute top-0 left-0"
                style={{
                  clipPath: `inset(0 ${100 - section2Progress * 100}% 0 0)`
                }}
              >
                Our Ethos
              </p>
            </div>
            
            <div className="relative">
              <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl drop-shadow-lg mb-4 text-black">
                Lorem ipsum dolor sit amet consectetur. Egestas urna faucibus sit nibh augue morbi diam aliquet aenean. Mattis volutpat maecenas placerat orci. Sapien morbi ut tempus facilisis.
              </p>
              <p 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl drop-shadow-lg mb-4 text-white absolute top-0 left-0"
                style={{
                  clipPath: `inset(0 ${100 - section2Progress * 100}% 0 0)`
                }}
              >
                Lorem ipsum dolor sit amet consectetur. Egestas urna faucibus sit nibh augue morbi diam aliquet aenean. Mattis volutpat maecenas placerat orci. Sapien morbi ut tempus facilisis.
              </p>
            </div>
            
            <div className="relative">
              <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl drop-shadow-lg text-black">
                Each moment is carefully crafted to maintain visual interest while guiding 
                your journey through this immersive digital experience.
              </p>
              <p 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl drop-shadow-lg text-white absolute top-0 left-0"
                style={{
                  clipPath: `inset(0 ${100 - section2Progress * 100}% 0 0)`
                }}
              >
                Each moment is carefully crafted to maintain visual interest while guiding 
                your journey through this immersive digital experience.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="relative h-screen flex items-center justify-start z-10 pl-8">
          <div className="text-left px-4 sm:px-6 md:px-8 max-w-3xl">
            {/* <div className="relative">
              <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-4 md:mb-6 drop-shadow-2xl text-black">
                Section Three
              </h2>
              <h2 
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-4 md:mb-6 drop-shadow-2xl text-white absolute top-0 left-0"
                style={{
                  clipPath: `inset(0 ${100 - section3Progress * 100}% 0 0)`
                }}
              >
                Section Three
              </h2>
            </div> */}
            
            <div className="relative">
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl drop-shadow-lg mb-4 text-black">
                Our Advisory Philosophy
              </p>
              <p 
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl drop-shadow-lg mb-4 text-white absolute top-0 left-0"
                style={{
                  clipPath: `inset(0 ${100 - section3Progress * 100}% 0 0)`
                }}
              >
                Our Advisory Philosophy
              </p>
            </div>
            
            <div className="relative">
              <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl drop-shadow-lg mb-4 text-black">
                Our approach begins with your real-life goals, not just financial metrics. Whether it's legacy building, education, lifestyle security, or intergenerational wealth, our strategies are:
              </p>
              <p 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl drop-shadow-lg mb-4 text-white absolute top-0 left-0"
                style={{
                  clipPath: `inset(0 ${100 - section3Progress * 100}% 0 0)`
                }}
              >
                Our approach begins with your real-life goals, not just financial metrics. Whether it's legacy building, education, lifestyle security, or intergenerational wealth, our strategies are:
              </p>
            </div>
            
            <div className="relative">
              <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl drop-shadow-lg text-black">
                This is where stories conclude and new possibilities begin, leaving a lasting 
                impression that resonates long after the scroll ends.
              </p>
              <p 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl drop-shadow-lg text-white absolute top-0 left-0"
                style={{
                  clipPath: `inset(0 ${100 - section3Progress * 100}% 0 0)`
                }}
              >
                This is where stories conclude and new possibilities begin, leaving a lasting 
                impression that resonates long after the scroll ends.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <section data-theme="light">
        <ServicesCarouselSection data={data} />
      </section>
    </div>
  )
}