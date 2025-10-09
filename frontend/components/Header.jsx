'use client';

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
        : 'bg-white/90 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center" data-cursor="pointer">
            <Image
              src="/logo.jpg"
              alt="Astrousers - Discover your cosmic self"
              width={170}
              height={100}
              className="rounded-full"
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-200"
              data-cursor="pointer"
            >
              Home
            </Link>
            <Link 
              href="/services" 
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-200"
              data-cursor="pointer"
            >
              Services
            </Link>
            <Link 
              href="/horoscope" 
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-200"
              data-cursor="pointer"
            >
              Horoscope
            </Link>
            <Link 
              href="/blog" 
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-200"
              data-cursor="pointer"
            >
              Astrology Blog
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-200"
              data-cursor="pointer"
            >
              About
            </Link>
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" className="text-gray-700 hover:text-orange-600" data-cursor="pointer">
                  Login
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                    userButtonPopoverCard: "bg-white border border-gray-200 shadow-lg",
                    userButtonPopoverActionButton: "text-gray-700 hover:text-orange-600 hover:bg-orange-50",
                  }
                }}
              />
            </SignedIn>
            
            <Button 
              variant="outline" 
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
              data-cursor="pointer"
            >
              Talk to Astrologer
            </Button>
            
            <Button 
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              data-cursor="pointer"
            >
              Generate Chart
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
