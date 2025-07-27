"use client";

import React from "react";
import Carousel3D, { CarouselCard } from "@/components/ui/carousel-3d";
import {
  Zap,
  Shield,
  Code,
  Palette,
} from "lucide-react";

const Reviews = () => {
  const developerCards: CarouselCard[] = [
    {
      id: "d1",
      category: "DEVELOPER INSIGHT",
      title: "Morgan Wallen",
      icon: <Zap className="w-6 h-6" />,
      preview: "Performance Lead",
      content: "Modern browsers feel like operating systems. Trowser feels like a tool — and that's the point.",
    },
    {
      id: "d2", 
      category: "DEVELOPER INSIGHT",
      title: "Sibhi Balamurugan",
      icon: <Shield className="w-6 h-6" />,
      preview: "Privacy & Security Engineer",
      content: "Our beta testers told us it feels like reading in a quiet room. That's exactly what we hoped for.",
    },
    {
      id: "d3",
      category: "DEVELOPER INSIGHT", 
      title: "Krishna Prasath R",
      icon: <Code className="w-6 h-6" />,
      preview: "Lead Systems Architect",
      content: "We didn't want to build just another browser. We wanted to build less — so you could do more.",
    },
    {
      id: "d4",
      category: "DEVELOPER INSIGHT",
      title: "Harish Kannan J.S.", 
      icon: <Palette className="w-6 h-6" />,
      preview: "UX Engineer",
      content: "Trowser is designed like an instrument, not a product — simple, precise, and ready to get out of your way.",
    },
  ];

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Hear from Our Developers
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            The future of browsing, built by those who dream beyond the tab.
          </p>
          <p className="text-sm text-gray-500 mt-4 italic">
            *These early insights come straight from the creators behind Trowser. User reviews will be published following the public launch.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Carousel3D cards={developerCards} autoRotate={true} />
        </div>
      </div>
    </section>
  );
};

export default Reviews;