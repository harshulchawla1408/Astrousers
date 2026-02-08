'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";

const Hero = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const texts = [
    "Find clarity. Get guidance. Own your path.",
    "Trusted by thousands monthly",
    "24/7 live astrologers available",
    "Secure & private consultations",
    "Expert guidance when you need it"
  ];

  useEffect(() => {
    const currentText = texts[currentIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (displayedText.length < currentText.length) {
          setDisplayedText(currentText.slice(0, displayedText.length + 1));
        } else {
          // Finished typing, wait then start deleting
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting
        if (displayedText.length > 0) {
          setDisplayedText(currentText.slice(0, displayedText.length - 1));
        } else {
          // Finished deleting, move to next text
          setIsDeleting(false);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }
      }
    }, isDeleting ? 50 : 100); // Faster typing, slower deleting

    return () => clearTimeout(timeout);
  }, [displayedText, currentIndex, isDeleting, texts]);

  const heroContent = {
    image: "/slider-02.png",
    subtitle: "Personalized astrology, professional astrologers, and practical remedies — crafted for today's fast lives.",
    cta: "Get My Free Birth Chart",
    secondaryCta: "Talk to an Astrologer"
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden hero-gradient">
      {/* Background Pattern - Subtle astrological symbols */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#FFA726] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#FFB300] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#FFD56B] rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="min-h-[120px] md:min-h-[150px] flex items-center">
                <h1 className="text-4xl md:text-6xl font-bold text-[#0A1A2F] leading-tight">
                  <span className="bg-gradient-to-r from-[#FFA726] to-[#FFB300] bg-clip-text text-transparent">
                    {displayedText}
                  </span>
                  <span className="animate-pulse text-[#FFA726]">|</span>
                </h1>
              </div>
              <p className="text-xl text-[#0A1A2F]/80 leading-relaxed">
                {heroContent.subtitle}
              </p>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-[#0A1A2F]/70">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#FFA726] rounded-full"></div>
                <span>Trusted by thousands monthly</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#FFB300] rounded-full"></div>
                <span>24/7 live astrologers</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#FFD56B] rounded-full"></div>
                <span>Secure & private</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-[#FFA726] to-[#FFB300] hover:from-[#FF8F00] hover:to-[#FFA726] text-white shadow-lg hover:shadow-xl transition-all duration-200 text-lg px-8 py-4 rounded-xl"
              >
                {heroContent.cta}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-[#0A1A2F] text-[#0A1A2F] hover:bg-[#0A1A2F] hover:text-white text-lg px-8 py-4 rounded-xl transition-all duration-200"
              >
                {heroContent.secondaryCta}
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative rounded-[30px] overflow-hidden shadow-2xl">
              <Image
                src={heroContent.image}
                alt="Astrology consultation"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                priority
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A2F]/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
