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

    // store originals for restoration
    const origScrollRestoration = (typeof history !== 'undefined' && 'scrollRestoration' in history) ? history.scrollRestoration : undefined;
    const origScrollTo = window.scrollTo?.bind(window);
    const origScrollIntoView = Element.prototype.scrollIntoView;

    // attach normal scroll listener for header appearance
    window.addEventListener('scroll', handleScroll);

    // set manual scroll restoration to avoid browser restoring previous scroll automatically
    try {
      if (typeof history !== 'undefined' && 'scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
    } catch (e) {}

    // disable CSS smooth scrolling
    try {
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.scrollBehavior = 'auto';
    } catch (e) {}

    // override programmatic scrolls to prevent auto-jump (restore on cleanup)
    try {
      window.scrollTo = (..._args) => { /* suppressed to prevent auto-scroll */ };
      Element.prototype.scrollIntoView = function (_arg) { /* suppressed to prevent auto-scroll */ };
    } catch (e) {}

    // ensure hash changes don't trigger smooth scroll
    const handleHashChange = () => {
      try {
        document.documentElement.style.scrollBehavior = 'auto';
        document.body.style.scrollBehavior = 'auto';
      } catch (e) {}
    };
    window.addEventListener('hashchange', handleHashChange);

    // cleanup + restore originals
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
      try {
        if (origScrollTo) window.scrollTo = origScrollTo;
        if (origScrollIntoView) Element.prototype.scrollIntoView = origScrollIntoView;
      } catch (e) {}
      try {
        if (typeof history !== 'undefined' && origScrollRestoration !== undefined && 'scrollRestoration' in history) {
          history.scrollRestoration = origScrollRestoration;
        }
      } catch (e) {}
    };
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
          <Link href="/" scroll={false} className="flex items-center" data-cursor="pointer">
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
              scroll={false}
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-200"
              data-cursor="pointer"
            >
              Home
            </Link>
            <Link 
              href="/services" 
              scroll={false}
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-200"
              data-cursor="pointer"
            >
              Services
            </Link>
            <Link 
              href="/horoscope" 
              scroll={false}
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-200"
              data-cursor="pointer"
            >
              Horoscope
            </Link>
            <Link 
              href="/astrologers" 
              scroll={false}
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-200"
              data-cursor="pointer"
            >
              Astrologers
            </Link>
            <Link 
              href="/about" 
              scroll={false}
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
                <Button variant="ghost" className="text-gray-700 hover:text-orange-600">
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
            >
              Talk to Astrologer
            </Button>
            
            <Button 
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
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
