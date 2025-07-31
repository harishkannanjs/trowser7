'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Shield, Brain, Palette, Zap } from 'lucide-react';

// Improved window size hook with better SSR handling
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: 1024, // Default values
    height: 768,
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visibleSections, setVisibleSections] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth < 768;

  // Common gradient values
  const gradientPrimary = 'linear-gradient(315deg, rgb(140, 140, 217) 5%, rgb(235, 71, 96) 95%)';
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
    let timeoutId: number;

    const handleScroll = () => {
      if (!containerRef.current || isScrolling.current) return;

      // Debounce scroll handler for better performance
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const containerTop = rect.top;
        const viewportHeight = window.innerHeight;

        if (containerTop <= viewportHeight * 0.5) {
          const section = containerRef.current.closest('section');
          if (section) {
            const sectionRect = section.getBoundingClientRect();
            const sectionTop = sectionRect.top;
            const totalScrollDistance = (sectionsData.length - 1) * viewportHeight;
            
            const scrolledIntoSection = Math.abs(sectionTop);
            const progress = Math.min(Math.max(scrolledIntoSection / totalScrollDistance, 0), 1);
            
            setScrollProgress(progress);

            const totalSections = sectionsData.length;
            const sectionsToShow = Math.floor(progress * totalSections);
            const newVisibleSections: number[] = [0]; // Always show first slide
            
            for (let i = 1; i <= Math.min(sectionsToShow, totalSections - 1); i++) {
              newVisibleSections.push(i);
            }
            
            setVisibleSections(newVisibleSections);
          }
        } else {
          setScrollProgress(0);
          setVisibleSections([0]); // Always show first slide
        }
      }, 16); // ~60fps
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.clearTimeout(timeoutId);
    };
  }, [sectionsData.length]);

  const renderSection = (section: typeof sectionsData[0], index: number) => {
    const isVisible = visibleSections.includes(index);
    const sectionProgress = Math.max(0, (scrollProgress * sectionsData.length * 1.2) - index);
    const animationProgress = Math.min(sectionProgress, 1);
    
    // First slide should always be visible
    const opacity = index === 0 ? 1 : (isVisible ? animationProgress : 0);
    const translateY = index === 0 ? 0 : (isVisible ? (1 - animationProgress) * 60 : 60);
    const scale = index === 0 ? 1 : (isVisible ? 0.9 + (animationProgress * 0.1) : 0.9);
    const delay = index === 0 ? 0 : index * 200;

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
          transition: index === 0 ? 'none' : `opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
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
              opacity: index === 0 ? 0.3 : 0.3 * animationProgress,
              right: section.contentPosition === 'left' ? '-10%' : 'auto',
              left: section.contentPosition === 'right' ? '-10%' : 'auto',
              top: '5%',
              zIndex: 1,
              transition: index === 0 ? 'none' : `opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay + 200}ms`,
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
              opacity: index === 0 ? 0.3 : 0.3 * animationProgress,
              left: section.contentPosition === 'left' ? '-15%' : 'auto',
              right: section.contentPosition === 'right' ? '-15%' : 'auto',
              bottom: '10%',
              zIndex: 1,
              transition: index === 0 ? 'none' : `opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay + 300}ms`,
            }}
          />
        </div>

        {/* Main Container Box */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: isMobile ? '90%' : '80%',
            maxWidth: '1200px',
            height: isMobile ? '400px' : '500px',
            padding: '2rem',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            transform: index === 0 ? 'none' : `translateY(${isVisible ? 0 : 40}px)`,
            transition: index === 0 ? 'none' : `transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay + 100}ms`,
            overflow: 'hidden',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '2rem' : '3rem',
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
              opacity: index === 0 ? 1 : animationProgress,
              transform: index === 0 ? 'none' : `translateY(${(1 - animationProgress) * 30}px)`,
              transition: index === 0 ? 'none' : `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay + 300}ms, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay + 300}ms`,
            }}
          >
            {/* Small Icon */}
            <div
              style={{
                display: 'flex',
                justifyContent: isMobile ? 'center' : (section.contentPosition === 'left' ? 'flex-start' : 'flex-end'),
                marginBottom: '1.5rem',
                opacity: index === 0 ? 1 : animationProgress,
                transform: index === 0 ? 'none' : `translateY(${(1 - animationProgress) * 20}px)`,
                transition: index === 0 ? 'none' : `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay + 200}ms, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay + 200}ms`,
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
                }}
              >
                {section.title}
              </h2>
              <p
                className="text-sm md:text-base text-gray-300 leading-relaxed"
                style={{
                  opacity: index === 0 ? 1 : animationProgress,
                  transform: index === 0 ? 'none' : `translateY(${(1 - animationProgress) * 20}px)`,
                  transition: index === 0 ? 'none' : `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay + 400}ms, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay + 400}ms`,
                  maxWidth: isMobile ? '100%' : '400px',
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
              opacity: index === 0 ? 0.4 : 0.4 * animationProgress,
              transform: index === 0 ? 'none' : `scale(${0.8 + (animationProgress * 0.2)})`,
              transition: index === 0 ? 'none' : `opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay + 400}ms, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay + 400}ms`,
            }}
          >
            <div 
              style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: isMobile ? '96px' : '256px',
                height: isMobile ? '96px' : '256px',
              }}
            >
              {React.cloneElement(section.largeIcon, {
                className: isMobile ? 'w-24 h-24 text-white' : 'w-64 h-64 text-white'
              })}
            </div>
          </div>
        </div>
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
        <div className="absolute top-15 left-0 right-0 text-center z-50">
          <h1 className="md:text-6xl text-3xl font-sans font-semibold tracking-tight text-white mb-4">
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
