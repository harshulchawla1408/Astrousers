"use client";

import Image from "next/image";
import { SignUp } from "@clerk/nextjs";

export default function RegisterPage() {
  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">

      {/* Background Image - No Blur */}
      <Image
        src="/register.jpg"
        alt="Register Background"
        fill
        priority
        className="object-cover"
      />

      {/* Transparent dark overlay only for readability (NO BLUR) */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Center Content */}
      <div className="relative z-10 text-center px-4 flex flex-col items-center">
        
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-[#FFD56B] drop-shadow-xl tracking-wide mb-4">
          Start Your Cosmic Journey
        </h1>

        {/* Clerk Registration Box */}
        <div className="bg-white/95 rounded-[28px] p-6 md:p-8 shadow-2xl w-full max-w-md border border-[#E5E5E5]">
          <SignUp
            appearance={{
              elements: {
                card: "bg-transparent shadow-none border-none",
                formButtonPrimary:
                  "bg-gradient-to-r from-[#FFA726] to-[#FFB300] hover:from-[#FF8F00] hover:to-[#FFA726] text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-xl",
                headerTitle: "text-2xl font-bold text-[#0A1A2F]",
                headerSubtitle: "text-[#0A1A2F]/60",
                socialButtonsBlockButton:
                  "bg-white border border-[#E5E5E5] hover:bg-[#FFF7E6] text-[#0A1A2F] font-medium rounded-xl transition-all duration-200",
                formFieldInput:
                  "bg-white border border-[#E5E5E5] text-[#0A1A2F] rounded-lg focus:ring-2 focus:ring-[#FFA726] placeholder-[#999]",
                formFieldLabel: "text-[#0A1A2F]",
              },
            }}
            path="/register"
            routing="path"
            signInUrl="/login"
            afterSignUpUrl="/"
          />
        </div>
      </div>
    </div>
  );
}
