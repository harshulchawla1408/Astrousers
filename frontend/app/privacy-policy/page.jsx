"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 scroll-smooth py-16">
      <motion.div
        className="max-w-4xl mx-auto p-8 text-gray-200"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-white">Privacy Policy</h1>
        <p className="mb-4">
          At Astrousers, we value your privacy. This Privacy Policy explains how we collect, use,
          and protect your personal information when you use our platform.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">1. Information We Collect</h2>
        <p>
          We collect your name, email, date of birth, gender, and payment information for astrology
          consultation purposes. All sensitive data is securely stored on encrypted servers.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">2. How We Use Your Data</h2>
        <p>
          Your data is used to personalize your reports, connect you with astrologers, and process
          payments. We never sell or rent your information to third parties.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">3. Cookies</h2>
        <p>
          We use cookies to enhance user experience and analytics. You can disable cookies in your
          browser settings at any time.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">4. Data Security</h2>
        <p>
          We follow industry-standard practices including HTTPS encryption and secure databases to
          safeguard your personal information.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">5. Contact Us</h2>
        <p>
          For privacy-related questions, reach us at{" "}
          <a href="mailto:support@Astrousers.com" className="text-blue-400 underline">
            support@Astrousers.com
          </a>
        </p>

        <p className="mt-8 text-gray-400">Last updated: October 2025</p>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-white">← Back to Home</Link>
        </div>
      </motion.div>
    </main>
  );
}
