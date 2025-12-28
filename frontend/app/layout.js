'use client';

import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import UserSync from "@/components/UserSync";
import { CartProvider } from "@/contexts/CartContext";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <CartProvider>
      <html lang="en">
        <head>
          <title>Astrousers | Personalized Birth Chart & Astrology</title>
          <meta name="description" content="Find clarity. Get guidance. Own your path. Personalized astrology, professional astrologers, and practical remedies — crafted for today's fast lives." />
          <meta name="keywords" content="astrology, birth chart, kundli, horoscope, astrologer consultation, vedic astrology, numerology, tarot" />
          <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        </head>
        <body className="antialiased bg-[#FFF7E6] text-[#0A1A2F]">
          <UserSync />
          {children}
        </body>
      </html>
      </CartProvider>
    </ClerkProvider>
  );
}
