
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Sun, Moon } from "lucide-react";

export interface CarouselCard {
  id: string;
  category: string;
  title: string;
  icon: React.ReactNode;
  preview: string;
  content: string;
  imageUrl: string;
}

interface Carousel3DProps {
  cards: CarouselCard[];
  cardWidth?: number;
  cardHeight?: number;
  radius?: number;
  autoRotate?: boolean;
  autoRotateInterval?: number;
  pauseOnHover?: boolean;
  enableGlitchEffect?: boolean;
  enableGlowEffect?: boolean;
  showControls?: boolean;
  showThemeToggle?: boolean;
  dragSensitivity?: number;
  transitionDuration?: number;
  onCardClick?: (card: CarouselCard, index: number) => void;
  onCardFlip?: (card: CarouselCard, index: number, isFlipped: boolean) => void;
  onRotate?: (currentIndex: number) => void;
}

const Carousel3D: React.FC<Carousel3DProps> = ({
  cards,
  cardWidth = 300,
  cardHeight = 400,
  radius = 400,
  autoRotate = false,
  autoRotateInterval = 3000,
  pauseOnHover = true,
  enableGlitchEffect = false,
  enableGlowEffect = true,
  showControls = true,
  showThemeToggle = false,
  dragSensitivity = 0.1,
  transitionDuration = 0.5,
  onCardClick,
  onCardFlip,
  onRotate,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const containerRef = useRef<HTMLDivElement>(null);
  const autoRotateRef = useRef<NodeJS.Timeout | null>(null);

  const angleStep = (2 * Math.PI) / cards.length;

  useEffect(() => {
    if (autoRotate && !isHovered && !isDragging) {
      autoRotateRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % cards.length);
      }, autoRotateInterval);
    } else if (autoRotateRef.current) {
      clearInterval(autoRotateRef.current);
      autoRotateRef.current = null;
    }

    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
      }
    };
  }, [autoRotate, isHovered, isDragging, autoRotateInterval, cards.length]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const rotationChange = deltaX * dragSensitivity;
    
    if (Math.abs(rotationChange) > 30) {
      const direction = rotationChange > 0 ? -1 : 1;
      setCurrentIndex((prev) => (prev + direction + cards.length) % cards.length);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, dragStart, dragSensitivity, cards.length]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleCardClick = useCallback((card: CarouselCard, index: number) => {
    if (index === currentIndex) {
      setFlippedCards(prev => {
        const newSet = new Set(prev);
        if (newSet.has(index)) {
          newSet.delete(index);
        } else {
          newSet.add(index);
        }
        onCardFlip?.(card, index, !prev.has(index));
        return newSet;
      });
    } else {
      setCurrentIndex(index);
    }
    onCardClick?.(card, index);
  }, [currentIndex, onCardClick, onCardFlip]);

  const navigateToCard = useCallback((index: number) => {
    setCurrentIndex(index);
    onRotate?.(index);
  }, [onRotate]);

  const navigatePrev = useCallback(() => {
    navigateToCard((currentIndex - 1 + cards.length) % cards.length);
  }, [currentIndex, cards.length, navigateToCard]);

  const navigateNext = useCallback(() => {
    navigateToCard((currentIndex + 1) % cards.length);
  }, [currentIndex, cards.length, navigateToCard]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') navigatePrev();
      if (e.key === 'ArrowRight') navigateNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigatePrev, navigateNext]);

  const getCardStyle = (index: number) => {
    const angle = (index - currentIndex) * angleStep;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    const rotateY = (angle * 180) / Math.PI;
    
    const scale = index === currentIndex ? 1.05 : 0.85;
    const opacity = Math.abs(angle) > Math.PI / 2 ? 0.4 : 1;
    
    // Add floating animation for active card
    const floatY = index === currentIndex ? Math.sin(Date.now() * 0.002) * 5 : 0;
    
    return {
      transform: `translate3d(${x}px, ${floatY}px, ${z}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex: Math.round(100 - Math.abs(z)),
      transition: isDragging ? 'none' : `all ${transitionDuration}s cubic-bezier(0.4, 0, 0.2, 1)`,
    };
  };

  return (
    <div className={`carousel-3d ${theme}`} data-theme={theme}>
      <div
        ref={containerRef}
        className="relative w-full h-[600px] overflow-hidden perspective-1000"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setIsDragging(false);
          setIsHovered(false);
        }}
        onMouseEnter={() => setIsHovered(true)}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div className="absolute inset-0 flex items-center justify-center preserve-3d">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`absolute backface-hidden will-change-transform ${
                enableGlowEffect && index === currentIndex ? 'glow-effect' : ''
              }`}
              style={{
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                ...getCardStyle(index),
              }}
              onClick={() => handleCardClick(card, index)}
            >
              <div className={`card-container ${flippedCards.has(index) ? 'flipped' : ''}`}>
                {/* Front of card */}
                <div className="card-front">
                  <div className="relative w-full h-full rounded-xl overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
                    {/* Gradient overlay for visual depth */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20" />
                    
                    {/* Content */}
                    <div className="relative z-10 p-8 h-full flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                          {card.icon}
                        </div>
                        <span className="text-xs text-white/80 font-medium tracking-wide uppercase">
                          {card.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-4 leading-tight">
                        {card.title}
                      </h3>
                      <p className="text-sm text-white/90 leading-relaxed">
                        {card.preview}
                      </p>
                      
                      {/* Click indicator for center card */}
                      {index === currentIndex && (
                        <div className="mt-4 text-xs text-white/60 flex items-center gap-2">
                          <span>Click to read more</span>
                          <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse" />
                        </div>
                      )}
                    </div>
                    
                    {/* Subtle border glow effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 opacity-30 blur-sm" />
                  </div>
                </div>
                
                {/* Back of card */}
                <div className="card-back">
                  <div className="relative w-full h-full rounded-xl overflow-hidden bg-black/20 backdrop-blur-md border border-white/10 shadow-2xl">
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-black/30" />
                    
                    {/* Content */}
                    <div className="relative z-10 p-8 h-full flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                          {card.icon}
                        </div>
                        <span className="text-xs text-white/80 font-medium tracking-wide uppercase">
                          {card.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-4 leading-tight">
                        {card.title}
                      </h3>
                      <p className="text-sm text-white/90 leading-relaxed">
                        {card.content}
                      </p>
                      
                      {/* Click indicator */}
                      <div className="mt-4 text-xs text-white/60 flex items-center gap-2">
                        <span>Click to go back</span>
                        <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse" />
                      </div>
                    </div>
                    
                    {/* Enhanced border glow for back */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-pink-500/30 opacity-40 blur-sm" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        {showControls && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4">
            <button
              onClick={navigatePrev}
              className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={navigateNext}
              className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Theme Toggle */}
        {showThemeToggle && (
          <button
            onClick={toggleTheme}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        )}
      </div>

      <style jsx>{`
        .carousel-3d {
          --card-bg: ${theme === 'light' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.3)'};
          --card-border: ${theme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)'};
          --text-color: ${theme === 'light' ? '#000' : '#fff'};
        }
        
        .card-container {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-container.flipped {
          transform: rotateY(180deg);
        }
        
        .card-front,
        .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 0.75rem;
        }
        
        .card-back {
          transform: rotateY(180deg);
        }
        
        .glow-effect {
          filter: drop-shadow(0 0 20px rgba(147, 51, 234, 0.5));
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .preserve-3d {
          transform-style: preserve-3d;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
};

export default Carousel3D;
