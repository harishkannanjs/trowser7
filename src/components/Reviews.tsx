
"use client";

import React from "react";
import Carousel3D, { CarouselCard } from "@/components/ui/carousel-3d";
import {
  Shield,
  Brain,
  Palette,
  Zap,
  Globe,
  Lock,
  Smartphone,
  Cloud,
} from "lucide-react";

const Reviews = () => {
  const reviewCards: CarouselCard[] = [
    {
      id: "r1",
      category: "PRIVACY FOCUSED",
      title: "Zero-Trace Browsing Excellence",
      icon: <Shield className="w-6 h-6" />,
      preview: "Complete digital invisibility with enterprise-grade protection.",
      content:
        "Auto-destroy ads/trackers, encrypted DNS, and zero data logging. Experience true privacy with always-on zero-trace mode that blocks every tracker while maintaining lightning-fast performance across all your devices.",
      imageUrl: "",
    },
    {
      id: "r2",
      category: "AI POWERED",
      title: "Intelligent Tab Management",
      icon: <Brain className="w-6 h-6" />,
      preview: "Your second brain for seamless browsing organization.",
      content:
        "Advanced AI declutters your workspace automatically. Intelligently prioritizes, organizes, and surfaces tabs based on your behavior patterns, making browsing feel effortless and intuitive every single time.",
      imageUrl: "",
    },
    {
      id: "r3",
      category: "MINIMAL DESIGN",
      title: "Distraction-Free Interface",
      icon: <Palette className="w-6 h-6" />,
      preview: "Pure focus through intelligent minimalism.",
      content:
        "Designed to disappear so you can focus on what matters. No bloated menus, no distractions - just pure focus and intelligent performance that stays completely out of your way while you work.",
      imageUrl: "",
    },
    {
      id: "r4",
      category: "PERFORMANCE",
      title: "Lightning-Fast Experience",
      icon: <Zap className="w-6 h-6" />,
      preview: "Unmatched speed on any hardware configuration.",
      content:
        "Loads pages in 1.2s, uses 50% less RAM, runs smooth on decade-old hardware. Streamlined rendering engine optimized for real-world speed, not just benchmarks - experience the web at light speed.",
      imageUrl: "",
    },
    {
      id: "r5",
      category: "SECURITY",
      title: "Enterprise-Grade Protection",
      icon: <Lock className="w-6 h-6" />,
      preview: "Military-level security without compromising speed.",
      content:
        "Advanced threat detection, real-time malware blocking, and secure sandboxing. Every connection is encrypted and verified, ensuring your data remains protected against emerging cyber threats.",
      imageUrl: "",
    },
    {
      id: "r6",
      category: "CROSS-PLATFORM",
      title: "Seamless Device Sync",
      icon: <Smartphone className="w-6 h-6" />,
      preview: "Perfect synchronization across all your devices.",
      content:
        "Instant sync between desktop, mobile, and tablet. Your bookmarks, history, and preferences follow you everywhere with end-to-end encryption ensuring your data stays private and secure.",
      imageUrl: "",
    },
  ];

  return (
    <section id="reviews" className="relative py-20">
      {/* Section Title */}
      <div className="text-center mb-16">
        <h2 className="md:text-6xl text-3xl font-sans font-semibold tracking-tight text-white mb-4">
          What Makes Us Different
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Experience the future of browsing with cutting-edge features designed for modern users
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        <Carousel3D
          cards={reviewCards}
          cardWidth={600}
          cardHeight={300}
          radius={650}
          autoRotate={true}
          autoRotateInterval={4000}
          pauseOnHover={true}
          enableGlitchEffect={false}
          enableGlowEffect={true}
          showControls={true}
          showThemeToggle={false}
          dragSensitivity={0.08}
          transitionDuration={0.6}
          onCardClick={(card, index) =>
            console.log("Review card clicked:", card.title, index)
          }
          onCardFlip={(card, index, isFlipped) =>
            console.log("Review card flipped:", card.title, isFlipped)
          }
          onRotate={(currentIndex) =>
            console.log("Reviews rotated to index:", currentIndex)
          }
        />
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>
    </section>
  );
};

export default Reviews;
