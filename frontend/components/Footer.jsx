'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Top Callout */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Need help? Talk to our astrologers 24/7
          </h3>
          <Button 
            size="lg"
            className="bg-white text-orange-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-200"
            data-cursor="pointer"
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
              <p className="text-gray-400 leading-relaxed">
                Your personal astrology companion for the modern world. Discover, explore, and embrace your cosmic destiny.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors duration-200" data-cursor="pointer">
                  <span className="text-lg">📷</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors duration-200" data-cursor="pointer">
                  <span className="text-lg">🐦</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors duration-200" data-cursor="pointer">
                  <span className="text-lg">📺</span>
                </a>
              </div>
            </div>

            {/* Company Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-orange-400 transition-colors duration-200" data-cursor="pointer">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-400 hover:text-orange-400 transition-colors duration-200" data-cursor="pointer">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="text-gray-400 hover:text-orange-400 transition-colors duration-200" data-cursor="pointer">
                    Press
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Services</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/kundli" className="text-gray-400 hover:text-orange-400 transition-colors duration-200" data-cursor="pointer">
                    Birth Chart
                  </Link>
                </li>
                <li>
                  <Link href="/compatibility" className="text-gray-400 hover:text-orange-400 transition-colors duration-200" data-cursor="pointer">
                    Compatibility
                  </Link>
                </li>
                <li>
                  <Link href="/tarot" className="text-gray-400 hover:text-orange-400 transition-colors duration-200" data-cursor="pointer">
                    Tarot
                  </Link>
                </li>
                <li>
                  <Link href="/numerology" className="text-gray-400 hover:text-orange-400 transition-colors duration-200" data-cursor="pointer">
                    Numerology
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Support</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-orange-400 transition-colors duration-200" data-cursor="pointer">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-orange-400 transition-colors duration-200" data-cursor="pointer">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-orange-400 transition-colors duration-200" data-cursor="pointer">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-orange-400 transition-colors duration-200" data-cursor="pointer">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Contact Information</h4>
                <div className="space-y-2 text-gray-400">
                  <p>Email: support@astrousers.com</p>
                  <p>Phone: +91 98765 43210</p>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Newsletter</h4>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors duration-200"
                  />
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2025 Astrousers. All rights reserved. We do not share personal data without consent. Read our Privacy Policy.
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Made with ❤️ for astrology lovers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
