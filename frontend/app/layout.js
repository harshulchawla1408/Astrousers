import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata = {
  title: "Astrousers | Personalized Birth Chart & Astrology",
  description: "Find clarity. Get guidance. Own your path. Personalized astrology, professional astrologers, and practical remedies — crafted for today's fast lives.",
  keywords: "astrology, birth chart, kundli, horoscope, astrologer consultation, vedic astrology, numerology, tarot",
  openGraph: {
    title: "Astrousers | Personalized Birth Chart & Astrology",
    description: "Find clarity. Get guidance. Own your path. Personalized astrology, professional astrologers, and practical remedies.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased bg-white text-gray-900">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
