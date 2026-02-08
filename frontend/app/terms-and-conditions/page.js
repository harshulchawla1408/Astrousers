"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function TermsAndConditions() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 scroll-smooth py-16">
      <motion.div
        className="max-w-4xl mx-auto p-8 text-gray-200"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-white">Terms and Conditions</h1>
        <p className="mb-4">
          Welcome to Astrousers! By accessing or using our platform, you agree to comply with the
          following terms and conditions. Please read them carefully.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">1. Service Overview</h2>
        <p>
          Astrousers provides astrology consultations via chat, audio, and video. These services
          are for informational purposes only.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">2. User Responsibilities</h2>
        <p>
          You must provide accurate information and maintain confidentiality of your login details.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">3. Payment and Wallet</h2>
        <p>
          All payments are processed via Razorpay. Coins are non-transferable and non-refundable
          except as defined in the cancellation policy.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">4. Limitation of Liability</h2>
        <p>
          Astrousers is not responsible for personal or financial losses based on consultation
          advice. Services are provided “as is”.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">5. Amendments</h2>
        <p>
          We may update these terms anytime. Continued use means acceptance of changes.
        </p>

        <p className="mt-8 text-gray-400">Last updated: October 2025</p>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-white">← Back to Home</Link>
        </div>
      </motion.div>
    </main>
  );
}
