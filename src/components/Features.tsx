
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Shield, Brain, Palette, Zap } from 'lucide-react';
import { GlowingCard } from '@/components/ui/glowing-card';

// Improved window size hook with better SSR handling
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: 1024, // Default values
    height: 850,
  });

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial size
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

const Features = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTimeRef = useRef(0);
  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth < 768;

  // Common gradient values
  const gradientSecondary = 'radial-gradient(100% 100% at 0% 0%, rgb(255, 255, 255) 0%, rgb(235, 235, 244) 100%)';

  // Data for each section
  const sectionsData = [
    {
      id: 'privacy',
      smallIcon: <Shield className="w-16 h-16 md:w-20 md:h-20 text-white" />,
      title: 'Privacy by Default',
      description: 'Auto-destroy ads/trackers, encrypted DNS, and zero data logging. You are digitally invisible with always-on zero-trace mode and automatic tracker blocking.',
      largeIcon: <Shield className="w-96 h-96 md:w-[600px] md:h-[600px] text-white" />,
      contentPosition: 'left',
      titleGradient: gradientSecondary,
      largeSymbolGradient: 'linear-gradient(315deg, rgba(140, 140, 217, 0.3) 5%, rgba(235, 71, 96, 0.3) 95%)',
    },
    {
      id: 'ai',
      smallIcon: <Brain className="w-16 h-16 md:w-20 md:h-20 text-white" />,
      title: 'Smart Tab Navigation',
      description: 'Intuitive AI declutters your workspace automatically. Think of it as your second brain for browsing - intelligently prioritizes, organizes, and surfaces tabs based on your behavior.',
      largeIcon: <Brain className="w-96 h-96 md:w-[600px] md:h-[600px] text-white" />,
      contentPosition: 'right',
      titleGradient: gradientSecondary,
      largeSymbolGradient: 'linear-gradient(315deg, rgba(255, 255, 255, 0.3) 0%, rgba(235, 235, 244, 0.3) 100%)',
    },
    {
      id: 'ui',
      smallIcon: <Palette className="w-16 h-16 md:w-20 md:h-20 text-white" />,
      title: 'Minimal Interface',
      description: 'Designed to disappear, so you can focus on what matters. No bloated menus, no distractions, just pure focus and intelligent performance that stays out of your way.',
      largeIcon: <Palette className="w-96 h-96 md:w-[600px] md:h-[600px] text-white" />,
      contentPosition: 'left',
      titleGradient: gradientSecondary,
      largeSymbolGradient: 'linear-gradient(315deg, rgba(140, 140, 217, 0.3) 5%, rgba(235, 71, 96, 0.3) 95%)',
    },
    {
      id: 'performance',
      smallIcon: <Zap className="w-16 h-16 md:w-20 md:h-20 text-white" />,
      title: 'Featherlight Build',
      description: 'Loads pages in 1.2s, uses 50% less RAM, runs smooth on decade-old hardware. Streamlined rendering engine optimized for real-world speed, not just benchmarks.',
      largeIcon: <Zap className="w-96 h-96 md:w-[600px] md:h-[600px] text-white" />,
      contentPosition: 'right',
      titleGradient: gradientSecondary,
      largeSymbolGradient: 'linear-gradient(315deg, rgba(255, 255, 255, 0.3) 0%, rgba(235, 235, 244, 0.3) 100%)',
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || isTransitioning) return;

      const now = Date.now();
      if (now - lastScrollTimeRef.current < 100) return; // Throttle scroll events
      lastScrollTimeRef.current = now;

      const rect = containerRef.current.getBoundingClientRect();
      const containerTop = rect.top;
      const viewportHeight = window.innerHeight;

      // Check if features section is in view
      if (containerTop <= viewportHeight * 0.5 && containerTop >= -viewportHeight * 0.5) {
        const section = containerRef.current.closest('section');
        if (section) {
          const sectionRect = section.getBoundingClientRect();
          const sectionTop = sectionRect.top;
          
          // Calculate which slide should be active based on scroll position
          const scrolledIntoSection = Math.abs(sectionTop);
          const slideHeight = viewportHeight;
          const newSlide = Math.min(Math.floor(scrolledIntoSection / slideHeight), sectionsData.length - 1);
          
          if (newSlide !== currentSlide && newSlide >= 0) {
            setIsTransitioning(true);
            setCurrentSlide(newSlide);
            
            // Clear transition state after animation completes
            setTimeout(() => {
              setIsTransitioning(false);
            }, 800);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentSlide, isTransitioning, sectionsData.length]);

  const renderSection = (section: typeof sectionsData[0], index: number) => {
    const isActive = index === currentSlide;
    const isVisible = index <= currentSlide;
    
    // Animation states
    let opacity = 0;
    let translateY = 100;
    let scale = 0.9;
    
    if (index === 0) {
      // First slide is always visible
      opacity = 1;
      translateY = 0;
      scale = 1;
    } else if (isActive) {
      // Current active slide
      opacity = 1;
      translateY = 0;
      scale = 1;
    } else if (isVisible && index < currentSlide) {
      // Previous slides (visible but inactive)
      opacity = 0.3;
      translateY = -20;
      scale = 0.95;
    }

    return (
      <div
        key={section.id}
        className="feature-section-overlay"
        style={{
          position: 'absolute',
          top: 120,
          left: 0,
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '"SF Pro Rounded Semibold", "SF Pro Rounded Semibold Placeholder", "-apple-system", "BlinkMacSystemFont", sans-serif',
          background: 'rgb(0, 0, 0)',
          opacity,
          transform: `translateY(${translateY}px) scale(${scale})`,
          zIndex: 10 + index,
          transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'transform, opacity',
        }}
      >
        {/* Background Effects */}
        <div
          className="bg-effect"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          {/* Background blur elements */}
          <div
            className="bg-blur-r"
            style={{
              position: 'absolute',
              background: 'rgba(140, 140, 217, 0.1)',
              width: '30%',
              height: '60%',
              borderRadius: '50%',
              filter: 'blur(100px)',
              opacity: 0.3,
              right: section.contentPosition === 'left' ? '-10%' : 'auto',
              left: section.contentPosition === 'right' ? '-10%' : 'auto',
              top: '5%',
              zIndex: 1,
              transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          <div
            className="bg-blur-b"
            style={{
              position: 'absolute',
              background: 'rgba(235, 71, 96, 0.1)',
              width: '40%',
              height: '70%',
              borderRadius: '50%',
              filter: 'blur(120px)',
              opacity: 0.3,
              left: section.contentPosition === 'left' ? '-15%' : 'auto',
              right: section.contentPosition === 'right' ? '-15%' : 'auto',
              bottom: '10%',
              zIndex: 1,
              transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </div>

        {/* Main Container Box with Glowing Effect */}
        <GlowingCard
          glowColor="#8c8cd9"
          hoverEffect={true}
          className="p-0 border-0 bg-transparent"
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: isMobile ? '90%' : '75%',
            maxWidth: '1200px',
            height: isMobile ? '390px' : '480px',
            padding: '1.5rem',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '1.5rem' : '2.5rem',
          }}
        >
          {/* Box gradient overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.1) 100%)',
              borderRadius: '20px',
              zIndex: -1,
            }}
          />

          {/* Content Side */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: isMobile ? 'center' : (section.contentPosition === 'left' ? 'flex-start' : 'flex-end'),
              textAlign: isMobile ? 'center' : (section.contentPosition === 'left' ? 'left' : 'right'),
              flex: 1,
              order: isMobile ? 2 : (section.contentPosition === 'left' ? 1 : 2),
            }}
          >
            {/* Small Icon */}
            <div
              style={{
                display: 'flex',
                justifyContent: isMobile ? 'center' : (section.contentPosition === 'left' ? 'flex-start' : 'flex-end'),
                marginBottom: '1.5rem',
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'translateY(0px)' : 'translateY(20px)',
                transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) 200ms, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) 200ms',
              }}
            >
              <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 inline-flex">
                {section.smallIcon}
              </div>
            </div>

            {/* Text Content */}
            <div>
              <h2
                className="text-xl md:text-2xl lg:text-3xl font-semibold mb-4"
                style={{
                  margin: '0 0 1rem 0',
                  background: section.titleGradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateY(0px)' : 'translateY(20px)',
                  transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) 300ms, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) 300ms',
                }}
              >
                {section.title}
              </h2>
              <p
                className="text-sm md:text-base text-gray-300 leading-relaxed"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateY(0px)' : 'translateY(20px)',
                  transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) 400ms, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) 400ms',
                  maxWidth: isMobile ? '100%' : '440px',
                }}
              >
                {section.description}
              </p>
            </div>
          </div>

          {/* Icon Side */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: isMobile ? 0 : 1,
              order: isMobile ? 1 : (section.contentPosition === 'left' ? 2 : 1),
              opacity: isActive ? 0.4 : 0,
              transform: isActive ? 'scale(1)' : 'scale(0.8)',
              transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) 400ms, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) 400ms',
            }}
          >
            <div 
              style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: isMobile ? '80px' : '200px',
                height: isMobile ? '80px' : '200px',
              }}
            >
              {React.cloneElement(section.largeIcon, {
                className: isMobile ? 'w-20 h-20 text-white' : 'w-50 h-50 text-white'
              })}
            </div>
          </div>
        </GlowingCard>
      </div>
    );
  };

  return (
    <section id="features" className="relative">
      <div
        ref={containerRef}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <div className="absolute top-20 left-0 right-0 text-center z-50">
          <h1 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-600 to-white text-4xl md:text-7xl font-sans relative z-20 font-bold tracking-tight mt-10 mb-34 md:mb-32">
            Features
          </h1>
        </div>

        {sectionsData.map((section, index) => renderSection(section, index))}
      </div>
      
      <div style={{ height: `${(sectionsData.length - 1) * 100}vh` }} />
    </section>
  );
};

export default Features;
