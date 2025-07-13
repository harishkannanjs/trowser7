
```typescriptreact
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Shield, Brain, Palette, Zap } from 'lucide-react';

interface FeaturesSectionProps {}

const Features: React.FC<FeaturesSectionProps> = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

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
        const containerHeight = rect.height;
        const viewportHeight = window.innerHeight;

        // Calculate scroll progress through the container
        if (containerTop <= 0 && containerTop > -containerHeight) {
          const progress = Math.min(Math.max(-containerTop / (containerHeight - viewportHeight), 0), 1);
          setScrollProgress(progress);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const renderSection = (section: typeof sectionsData[0], index: number) => {
    // Calculate which section should be visible based on scroll progress
    const sectionProgress = scrollProgress * (sectionsData.length - 1);
    const sectionIndex = Math.floor(sectionProgress);
    const sectionLocalProgress = sectionProgress - sectionIndex;

    // Determine visibility and transform for this section
    let opacity = 0;
    let translateY = 100;
    let zIndex = 1;

    if (index === 0) {
      // Privacy section (always visible as base)
      opacity = 1;
      translateY = 0;
      zIndex = 1;
    } else if (index === sectionIndex + 1) {
      // Currently animating in section
      opacity = sectionLocalProgress;
      translateY = (1 - sectionLocalProgress) * 100;
      zIndex = 10 + index;
    } else if (index <= sectionIndex) {
      // Fully visible section
      opacity = 1;
      translateY = 0;
      zIndex = 10 + index;
    }

    return (
      <div
        key={section.id}
        className="feature-section-overlay"
        style={{
          position: index === 0 ? 'relative' : 'absolute',
          top: index === 0 ? 'auto' : 0,
          left: index === 0 ? 'auto' : 0,
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '"SF Pro Rounded Semibold", "SF Pro Rounded Semibold Placeholder", "-apple-system", "BlinkMacSystemFont", sans-serif',
          background: 'transparent',
          opacity,
          transform: 'translateY(' + translateY + '%)',
          zIndex,
          transition: 'none',
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
              opacity: 0.3,
              right: section.contentPosition === 'left' ? '-10%' : 'auto',
              left: section.contentPosition === 'right' ? '-10%' : 'auto',
              top: '5%',
              zIndex: 1,
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
              opacity: 0.3,
              left: section.contentPosition === 'left' ? '-15%' : 'auto',
              right: section.contentPosition === 'right' ? '-15%' : 'auto',
              bottom: '10%',
              zIndex: 1,
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
              alignItems: section.contentPosition === 'left' ? 'flex-end' : 'flex-start',
              paddingRight: section.contentPosition === 'left' ? '5%' : '0',
              paddingLeft: section.contentPosition === 'right' ? '5%' : '0',
              zIndex: 2,
            }}
          >
            <div style={{ opacity: 0.4 }}>
              {section.largeIcon}
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
            justifyContent: section.contentPosition === 'left' ? 'flex-start' : 'flex-end',
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
              alignItems: section.contentPosition === 'left' ? 'flex-start' : 'flex-end',
              textAlign: section.contentPosition === 'left' ? 'left' : 'right',
              width: '50%',
              maxWidth: '600px',
              marginLeft: section.contentPosition === 'right' ? 'auto' : '0',
              marginRight: section.contentPosition === 'left' ? 'auto' : '0',
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
                opacity: 1,
                transform: 'none',
                marginBottom: '1.5rem',
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
                  opacity: 1,
                  transform: 'none',
                }}
              >
                <h2
                  className="text-2xl md:text-4xl font-semibold text-white mb-4"
                  style={{
                    textAlign: section.contentPosition === 'left' ? 'left' : 'right',
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
                    textAlign: section.contentPosition === 'left' ? 'left' : 'right',
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
    <section id="features" className="mt-20 mb-12 md:mt-20 md:mb-16">
      {/* Features Title */}
      <div className="text-center mb-12 md:mb-16 relative z-50">
        <h1 className="md:text-6xl text-3xl font-sans font-semibold tracking-tight text-white mb-4">
          Features
        </h1>
      </div>

      {/* Features Container with Overlay Animation */}
      const containerHeight = sectionsData.length * 100 + 'vh';

...

<div
  ref={containerRef}
  className="features-sections-container"
  style={{
    position: 'relative',
    height: containerHeight,
    overflow: 'hidden',
  }}
>

        {sectionsData.map((section, index) => renderSection(section, index))}
      </div>
    </section>
  );
};

export default Features;
```
