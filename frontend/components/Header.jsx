"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useUserContext } from "@/contexts/UserContext";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { role, loading } = useUserContext();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🎯 Dashboard route based on role
  const dashboardRoute =
    role === "ADMIN"
      ? "/admin"
      : role === "ASTROLOGER"
      ? "/astrologer/dashboard"
      : "/dashboard";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#FFF8EE] shadow-md border-b border-[#F2D7A0]"
          : "bg-[#FFF4E0]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" scroll={false} className="flex items-center">
            <Image
              src="/logo.png"
              alt="Astrousers"
              width={170}
              height={90}
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {["Home", "Services", "Kundli", "Astrologers", "About"].map(
              (item) => (
                <Link
                  key={item}
                  href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  scroll={false}
                  className="text-[#0A1A2F] font-medium text-[15px] hover:text-[#FFA726] transition-colors"
                >
                  {item}
                </Link>
              )
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <SignedOut>
              <SignUpButton mode="modal">
                <Button
                  variant="ghost"
                  className="text-[#0A1A2F] hover:text-[#FFA726]"
                >
                  Register
                </Button>
              </SignUpButton>
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  className="text-[#0A1A2F] hover:text-[#FFA726]"
                >
                  Login
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              {!loading && role && (
                <Link href={dashboardRoute} scroll={false}>
                  <Button
                    variant="ghost"
                    className="text-[#0A1A2F] hover:text-[#FFA726]"
                  >
                    Dashboard
                  </Button>
                </Link>
              )}

              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9",
                    userButtonPopoverCard:
                      "bg-white shadow-xl border border-[#E5E5E5] rounded-xl",
                    userButtonPopoverActionButton:
                      "text-[#0A1A2F] hover:bg-[#FFF7E6] hover:text-[#FFA726]",
                  },
                }}
              />
            </SignedIn>

            <Link href="/astrologers" scroll={false}>
              <Button
                variant="outline"
                className="border-[#0A1A2F]/20 text-[#0A1A2F] hover:bg-[#0A1A2F] hover:text-white transition"
              >
                Talk to Astrologer
              </Button>
            </Link>

            <Link href="/services" scroll={false}>
              <Button className="bg-gradient-to-r from-[#FFA726] to-[#FFB300] hover:from-[#FF8F00] hover:to-[#FFA726] text-white shadow-md rounded-xl px-6">
                Book E-Puja
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-[#0A1A2F]"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-6 pt-4 border-t border-[#EBD6A5]">
            <nav className="flex flex-col gap-4">
              {["Home", "Services", "Kundli", "Astrologers", "About"].map(
                (item) => (
                  <Link
                    key={item}
                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    scroll={false}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[#0A1A2F] font-medium hover:text-[#FFA726]"
                  >
                    {item}
                  </Link>
                )
              )}

              <div className="pt-4 border-t border-[#EBD6A5] flex flex-col gap-3">
                <SignedOut>
                  <SignUpButton mode="modal">
                    <Button variant="ghost" className="justify-start">
                      Register
                    </Button>
                  </SignUpButton>
                  <SignInButton mode="modal">
                    <Button variant="ghost" className="justify-start">
                      Login
                    </Button>
                  </SignInButton>
                </SignedOut>

                <SignedIn>
                  {!loading && role && (
                    <Link href={dashboardRoute} scroll={false}>
                      <Button
                        variant="ghost"
                        className="justify-start w-full"
                      >
                        Dashboard
                      </Button>
                    </Link>
                  )}
                </SignedIn>

                <Link href="/services" scroll={false}>
                  <Button className="w-full bg-gradient-to-r from-[#FFA726] to-[#FFB300] text-white">
                    Book Puja
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
