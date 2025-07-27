
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Shield, Brain, Palette, Zap } from 'lucide-react';

// Custom hook for window dimensions
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once to set initial size

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

interface FeaturesSectionProps {}

const Features: React.FC<FeaturesSectionProps> = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visibleSections, setVisibleSections] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth < 768;

  // Common gradient values
  const gradientPrimary = 'linear-gradient(315deg, rgb(140, 140, 217) 5%, rgb(235, 71, 96) 95%)';
  const gradientSecondary = 'radial-gradient(100% 100% at 0% 0%, rgb(255, 255, 255) 0%, rgb(235, 235, 244) 100%)';

  // Data for each section using existing Features content
  const sectionsData = [
    {
      id: 'privacy',
      smallIcon: <Shield className="w-16 h-16 md:w-20 md:h-20 text-white" />,
      title: 'Privacy by Default',
      description: 'Auto-destroy ads/trackers, encrypted DNS, and zero data logging. You are digitally invisible with always-on zero-trace mode and automatic tracker blocking.',
      largeIcon: <Shield className="w-96 h-96 md:w-[600px] md:h-[600px] text-white" />,
      contentPosition: 'left',
      titleGradient: gradientPrimary,
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
      titleGradient: gradientPrimary,
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
      if (!containerRef.current || isScrolling.current) return;

      requestAnimationFrame(() => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const containerTop = rect.top;
        const viewportHeight = window.innerHeight;

        // Calculate scroll progress when container is sticky (top = 0)
        if (containerTop <= 0) {
          // Get the parent section to calculate total scroll distance
          const section = containerRef.current.closest('section');
          if (section) {
            const sectionRect = section.getBoundingClientRect();
            const sectionTop = sectionRect.top;
            const totalScrollDistance = (sectionsData.length - 1) * viewportHeight;
            
            // Calculate progress based on how much we've scrolled into the section
            const scrolledIntoSection = Math.abs(sectionTop);
            const progress = Math.min(Math.max(scrolledIntoSection / totalScrollDistance, 0), 1);
            
            setScrollProgress(progress);

            // Calculate which sections should be visible based on scroll progress
            const totalSections = sectionsData.length;
            const sectionsToShow = Math.floor(progress * totalSections);
            const newVisibleSections: number[] = [];
            
            for (let i = 0; i <= Math.min(sectionsToShow, totalSections - 1); i++) {
              newVisibleSections.push(i);
            }
            
            setVisibleSections(newVisibleSections);
          }
        } else {
          // Reset when not in sticky mode
          setScrollProgress(0);
          setVisibleSections([]);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionsData.length]);

  const renderSection = (section: typeof sectionsData[0], index: number) => {
    const isVisible = visibleSections.includes(index);
    const sectionProgress = Math.max(0, (scrollProgress * sectionsData.length * 1.2) - index);
    const animationProgress = Math.min(sectionProgress, 1);
    
    // Calculate animation values
    const opacity = isVisible ? animationProgress : 0;
    const translateY = isVisible ? (1 - animationProgress) * 60 : 60;
    const scale = isVisible ? 0.9 + (animationProgress * 0.1) : 0.9;
    
    // Stagger delay for smooth sequential animation
    const delay = index * 200; // 200ms delay between sections

    return (
      <div
        key={section.id}
        className="feature-section-overlay"
        style={{
          position: 'absolute',
          top: 0,
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
          transition: `opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
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
          <div
            className="bg-blur-r"
            style={{
              position: 'absolute',
              background: 'rgba(140, 140, 217, 0.1)',
              width: '30%',
              height: '60%',
              borderRadius: '50%',
              filter: 'blur(100px)',
              opacity: 0.3 * animationProgress,
              right: section.contentPosition === 'left' ? '-10%' : 'auto',
              left: section.contentPosition === 'right' ? '-10%' : 'auto',
              top: '5%',
              zIndex: 1,
              transition: `opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay + 200}ms`,
            }}
          ></div>
          <div
            className="bg-blur-b"
            style={{
              position: 'absolute',
              background: 'rgba(235, 71, 96, 0.1)',
              width: '40%',
              height: '70%',
              borderRadius: '50%',
              filter: 'blur(120px)',
              opacity: 0.3 * animationProgress,
              left: section.contentPosition === 'left' ? '-15%' : 'auto',
              right: section.contentPosition === 'right' ? '-15%' : 'auto',
              bottom: '10%',
              zIndex: 1,
              transition: `opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay + 300}ms`,
            }}
          ></div>

          {/* Large Icon in Background */}
          <div
            className="large-icon-bg"
            style={{
              outline: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flexShrink: 0,
              transform: 'none',
              position: 'absolute',
              width: '100%',
              height: '100%',
              alignItems: isMobile 
                ? (section.contentPosition === 'left' ? 'flex-start' : 'flex-end')
                : (section.contentPosition === 'left' ? 'flex-end' : 'flex-start'),
              paddingRight: isMobile 
                ? (section.contentPosition === 'left' ? '0' : '5%')
                : (section.contentPosition === 'left' ? '5%' : '0'),
              paddingLeft: isMobile 
                ? (section.contentPosition === 'left' ? '5%' : '0')
                : (section.contentPosition === 'right' ? '5%' : '0'),
              zIndex: 2,
            }}
          >
            <div 
              className="w-32 h-32 md:w-96 md:h-96 lg:w-[600px] lg:h-[600px]"
              style={{ 
                opacity: 0.4 * animationProgress,
                transform: `scale(${0.8 + (animationProgress * 0.2)})`,
                transition: `opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay + 400}ms, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay + 400}ms`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div className="w-full h-full flex items-center justify-center text-white">
                {React.cloneElement(section.largeIcon as React.ReactElement, {
                  className: "w-full h-full"
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          className="content"
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            justifyContent: isMobile 
              ? (section.contentPosition === 'left' ? 'flex-end' : 'flex-start')
              : (section.contentPosition === 'left' ? 'flex-start' : 'flex-end'),
            alignItems: 'center',
            width: '100%',
            height: '100%',
            padding: '0 5%',
          }}
        >
          <div
            className="content-inner"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: isMobile 
                ? (section.contentPosition === 'left' ? 'flex-end' : 'flex-start')
                : (section.contentPosition === 'left' ? 'flex-start' : 'flex-end'),
              textAlign: isMobile 
                ? (section.contentPosition === 'left' ? 'right' : 'left')
                : (section.contentPosition === 'left' ? 'left' : 'right'),
              width: isMobile ? '60%' : '50%',
              maxWidth: '600px',
              marginLeft: isMobile 
                ? (section.contentPosition === 'left' ? 'auto' : '0')
                : (section.contentPosition === 'right' ? 'auto' : '0'),
              marginRight: isMobile 
                ? (section.contentPosition === 'left' ? '0' : 'auto')
                : (section.contentPosition === 'left' ? 'auto' : '0'),
              transform: `translateY(${isVisible ? 0 : 40}px)`,
              transition: `transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay + 100}ms`,
              zIndex: 20,
            }}
          >
            {/* Small Icon */}
            <div
              className="small-icon"
              style={{
                outline: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flexShrink: 0,
                opacity: animationProgress,
                transform: `translateY(${(1 - animationProgress) * 20}px)`,
                marginBottom: '1.5rem',
                transition: `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay + 200}ms, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay + 200}ms`,
              }}
            >
              <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 inline-flex">
                {section.smallIcon}
              </div>
            </div>

            {/* Text Content */}
            <div className="text-content">
              <div
                style={{
                  outline: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  flexShrink: 0,
                  opacity: animationProgress,
                  transform: `translateY(${(1 - animationProgress) * 30}px)`,
                  transition: `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay + 300}ms, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay + 300}ms`,
                }}
              >
                <h2
                  className="text-xl md:text-2xl lg:text-4xl font-semibold text-white mb-4"
                  style={{
                    textAlign: isMobile 
                      ? (section.contentPosition === 'left' ? 'right' : 'left')
                      : (section.contentPosition === 'left' ? 'left' : 'right'),
                    margin: '0 0 1rem 0',
                    background: section.titleGradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {section.title}
                </h2>
                <p
                  className="text-sm md:text-base text-gray-300 leading-relaxed max-w-md"
                  style={{
                    textAlign: isMobile 
                      ? (section.contentPosition === 'left' ? 'right' : 'left')
                      : (section.contentPosition === 'left' ? 'left' : 'right'),
                    opacity: animationProgress,
                    transform: `translateY(${(1 - animationProgress) * 20}px)`,
                    transition: `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay + 400}ms, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay + 400}ms`,
                  }}
                >
                  {section.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="features" className="relative">
      {/* Features Container with Sticky Behavior */}
      <div
        ref={containerRef}
        className="features-sections-container"
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Features Title */}
        <div className="absolute top-15 left-0 right-0 text-center z-50">
          <h1 className="md:text-6xl text-3xl font-sans font-semibold tracking-tight text-white mb-4">
            Features
          </h1>
        </div>

        {sectionsData.map((section, index) => renderSection(section, index))}
      </div>
      
      {/* Spacer to create scroll distance for all sections */}
      <div style={{ height: `${(sectionsData.length - 1) * 100}vh` }} />
    </section>
  );
};

export default Features;
