import { motion } from "framer-motion";
import Link from "next/link";

export const metadata = {
  title: "Terms and Conditions — Astrousers",
  description: "Read the Terms and Conditions for Astrousers. Important information about service usage, payments, and liability.",
};

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
          following terms and conditions. Please read them carefully before using our services.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">1. Service Overview</h2>
        <p>
          Astrousers provides astrology-based consultations through chat, audio, and video modes.
          These services are for informational and entertainment purposes only and do not substitute
          professional advice.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">2. User Responsibilities</h2>
        <p>
          You agree to provide accurate account information and maintain confidentiality of your login
          credentials. Any misuse or fraudulent activity may lead to suspension.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">3. Payment and Wallet</h2>
        <p>
          All payments are processed via Razorpay. Wallet balance (coins) are non-transferable and
          non-refundable except in cases covered under our Cancellation and Refund Policy.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">4. Limitation of Liability</h2>
        <p>
          Astrousers is not responsible for any personal, financial, or emotional decisions taken
          based on consultations. Services are offered “as is” without warranties of any kind.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">5. Amendments</h2>
        <p>
          We may modify these terms periodically. Continued use of our services implies your
          acceptance of the updated terms.
        </p>

        <p className="mt-8 text-gray-400">Last updated: October 2025</p>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-white">← Back to Home</Link>
        </div>
      </motion.div>
    </main>
  );
}
