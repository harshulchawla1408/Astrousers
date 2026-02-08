"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CancellationRefund() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 scroll-smooth py-16">
      <motion.div
        className="max-w-4xl mx-auto p-8 text-gray-200"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-white">Cancellation and Refund Policy</h1>
        <p className="mb-4">
          Astrousers aims to deliver the best consultation experience. This policy outlines our
          procedure for cancellations and refunds.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">1. Service Cancellations</h2>
        <p>
          Users can cancel booked consultations up to 1 hour before the scheduled time. Once a
          consultation begins, cancellations are not allowed.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">2. Refund Policy</h2>
        <ul className="list-disc pl-5 mt-2">
          <li>The astrologer fails to attend the session.</li>
          <li>A technical error prevents service completion.</li>
          <li>Duplicate payment is made by mistake.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-3">3. Coins & Wallet</h2>
        <p>
          Coins purchased via Razorpay are non-transferable and non-refundable, except for cases
          listed above. Refunds, if applicable, will be credited within 5–7 business days.
        </p>

        <p className="mt-8 text-gray-400">Last updated: October 2025</p>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-white">← Back to Home</Link>
        </div>
      </motion.div>
    </main>
  );
}
