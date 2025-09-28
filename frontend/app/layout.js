import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata = {
  title: "Astrousers | The Gen Z Astro Revolution",
  description: "Cross-platform astrology app for Gen Z",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased bg-black text-white">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
