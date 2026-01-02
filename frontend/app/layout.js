'use client';

import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import "./globals.css";
import { UserProvider } from "@/contexts/UserContext";
import UserSync from "@/components/UserSync";
import { CartProvider } from "@/contexts/CartContext";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <head>
          <title>Astrousers | Personalized Birth Chart & Astrology</title>
          <meta
            name="description"
            content="Find clarity. Get guidance. Own your path. Personalized astrology, professional astrologers, and practical remedies — crafted for today's fast lives."
          />
          <meta
            name="keywords"
            content="astrology, birth chart, kundli, horoscope, astrologer consultation, vedic astrology, numerology, tarot"
          />

          {/* Razorpay */}
          <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="beforeInteractive"
          />
        </head>

        <body className="antialiased bg-[#FFF7E6] text-[#0A1A2F]">
          <UserProvider>
            <CartProvider>
              <UserSync />
              {children}
            </CartProvider>
          </UserProvider>

          {/* ✅ CHATBASE CHATBOT */}
          <Script
            id="chatbase-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function () {
                  if (!window.chatbase || window.chatbase("getState") !== "initialized") {
                    window.chatbase = (...args) => {
                      if (!window.chatbase.q) {
                        window.chatbase.q = [];
                      }
                      window.chatbase.q.push(args);
                    };
                    window.chatbase = new Proxy(window.chatbase, {
                      get(target, prop) {
                        if (prop === "q") {
                          return target.q;
                        }
                        return (...args) => target(prop, ...args);
                      },
                    });
                  }

                  const onLoad = function () {
                    const script = document.createElement("script");
                    script.src = "https://www.chatbase.co/embed.min.js";
                    script.id = "vgp0eu5L4rqX6ySVq0m19"; // your chatbot ID
                    script.domain = "www.chatbase.co";
                    document.body.appendChild(script);
                  };

                  if (document.readyState === "complete") {
                    onLoad();
                  } else {
                    window.addEventListener("load", onLoad);
                  }
                })();
              `,
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
