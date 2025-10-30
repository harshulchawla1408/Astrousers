import { motion } from "framer-motion";
import Link from "next/link";

export const metadata = {
  title: "Contact — Astrousers",
  description: "Contact Astrousers support for questions, feedback or help with consultations and payments.",
};

export default function Contact() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 scroll-smooth py-16">
      <motion.div
        className="max-w-4xl mx-auto p-8 text-gray-200"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-white">Contact Us</h1>
        <p className="mb-4">
          Have questions, feedback, or need support? We’d love to hear from you. Reach out to our team
          using the contact details below.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Customer Support</h2>
        <p>
          Email:{" "}
          <a href="mailto:support@astrousers.com" className="text-blue-400 underline">
            support@astrousers.com
          </a>
          <br />
          Phone: +91-98765-43210 (Mon–Sat, 10 AM – 6 PM)
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Office Address</h2>
        <p>
          Astrousers Technologies Pvt. Ltd. <br />
          21, Indiranagar, Bengaluru, India – 560038
        </p>

        <p className="mt-8 text-gray-400">We aim to respond within 24 hours.</p>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-white">← Back to Home</Link>
        </div>
      </motion.div>
    </main>
  );
}
