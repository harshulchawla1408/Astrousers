"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-[#0A1A2F] text-white py-8">
      {/* Top Callout */}
      <div className="bg-gradient-to-r from-[#FFA726] to-[#FFB300] py-8 relative overflow-hidden">
        {/* Subtle astrological pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-4xl">⭐</div>
          <div className="absolute top-20 right-20 text-3xl">🌙</div>
          <div className="absolute bottom-10 left-1/4 text-3xl">☀️</div>
          <div className="absolute bottom-20 right-10 text-4xl">✨</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h3 className="text-2xl font-bold text-white mb-4">
            Need help? Talk to our astrologers 24/7
          </h3>
          <Button
            size="lg"
            className="bg-white text-[#0A1A2F] hover:bg-[#FFF7E6] shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
          >
            Talk Now
          </Button>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company */}
            <div className="space-y-6">
              <div className="flex items-center">
                <Image
                  src="/logo.jpg"
                  alt="Astrousers"
                  width={170}
                  height={100}
                  className="rounded-full"
                />
              </div>
              <p className="text-white/70 leading-relaxed">
                Your personal astrology companion for the modern world.
                Discover, explore, and embrace your cosmic destiny.
              </p>
              <div className="flex space-x-4">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#FFD56B] transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-5 h-5 text-white group-hover:text-[#0A1A2F]"
                  >
                    <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10zm-5 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm4.75-.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://www.youtube.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#FFD56B] transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-6 h-6 text-white group-hover:text-[#0A1A2F]"
                  >
                    <path d="M19.615 3.184A3.002 3.002 0 0 0 17.5 2.5C15.067 2.5 12.634 2.5 10.2 2.5H6.5C4.014 2.5 2 4.514 2 7v10c0 2.486 2.014 4.5 4.5 4.5h10c2.486 0 4.5-2.014 4.5-4.5V7c0-.665-.133-1.316-.385-1.816zM10 9l6 3-6 3V9z" />
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#FFD56B] transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-5 h-5 text-white group-hover:text-[#0A1A2F]"
                  >
                    <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 2 .1v2.3h-1.1c-1.1 0-1.4.7-1.4 1.3V12h2.5l-.4 3h-2.1v7A10 10 0 0 0 22 12z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Company Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#FFD56B]">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-white/70 hover:text-[#FFD56B] transition-colors duration-200"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-white/70 hover:text-[#FFD56B] transition-colors duration-200"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/press"
                    className="text-white/70 hover:text-[#FFD56B] transition-colors duration-200"
                  >
                    Press
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#FFD56B]">Services</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/kundli"
                    className="text-white/70 hover:text-[#FFD56B] transition-colors duration-200"
                  >
                    Birth Chart
                  </Link>
                </li>
                <li>
                  <Link
                    href="/compatibility"
                    className="text-white/70 hover:text-[#FFD56B] transition-colors duration-200"
                  >
                    Compatibility
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tarot"
                    className="text-white/70 hover:text-[#FFD56B] transition-colors duration-200"
                  >
                    Tarot
                  </Link>
                </li>
                <li>
                  <Link
                    href="/numerology"
                    className="text-white/70 hover:text-[#FFD56B] transition-colors duration-200"
                  >
                    Numerology
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#FFD56B]">Support</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/faq"
                    className="text-white/70 hover:text-[#FFD56B] transition-colors duration-200"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-white/70 hover:text-[#FFD56B] transition-colors duration-200"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-white/70 hover:text-[#FFD56B] transition-colors duration-200"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-and-conditions"
                    className="text-white/70 hover:text-[#FFD56B] transition-colors duration-200"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-[#FFD56B] mb-4">
                  Contact Information
                </h4>
                <div className="space-y-2 text-white/70">
                  <p>Email: support@Astrousers.com</p>
                  <p>Phone: +91 98765 43210</p>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-[#FFD56B] mb-4">
                  Newsletter
                </h4>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#FFD56B] transition-colors duration-200"
                  />
                  <Button className="bg-gradient-to-r from-[#FFA726] to-[#FFB300] hover:from-[#FF8F00] hover:to-[#FFA726] text-white rounded-xl">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#081423] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-white/70 text-sm">
              Copyright © {new Date().getFullYear()} astrousers.com / Powered by
              Burger Software
            </div>
            <div className="flex items-center space-x-4 text-sm text-white/70">
              <span>Made with ❤️ for astrology lovers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
