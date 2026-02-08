"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#FFF7E6]">
      <Header />
      <main className="scroll-smooth py-16">
      <motion.div
        className="max-w-4xl mx-auto p-8 text-[#0A1A2F]"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-white rounded-[30px] shadow-md border border-[#E5E5E5] p-8">
          <h1 className="text-3xl font-bold mb-6 text-[#0A1A2F]">Contact Us</h1>
          <p className="mb-4 text-[#0A1A2F]/70">
            Have questions, feedback, or need support? We'd love to hear from you.
            Reach out to our team using the contact details below.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3 text-[#0A1A2F]">Customer Support</h2>
          <p className="text-[#0A1A2F]/70">
            Email:{" "}
            <a
              href="mailto:support@Astrousers.com"
              className="text-[#FFA726] hover:text-[#FF8F00] underline"
            >
              support@Astrousers.com
            </a>
            <br />
            Phone: +91-98765-43210 (Mon–Sat, 10 AM – 6 PM)
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3 text-[#0A1A2F]">Office Address</h2>
          <p className="text-[#0A1A2F]/70">
            Astrousers Technologies Pvt. Ltd. <br />
            21, Indiranagar, Bengaluru, India – 560038
          </p>

          <p className="mt-8 text-[#0A1A2F]/60">We aim to respond within 24 hours.</p>

          <div className="mt-8 text-center">
            <Link href="/" className="text-sm text-[#FFA726] hover:text-[#FF8F00]">
              ← Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
      </main>
      <Footer />
    </div>
  );
}
