"use client";

import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF7E6] px-4">
      <div className="p-8 rounded-[30px] shadow-lg bg-white border border-[#E5E5E5] w-full max-w-md">
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-gradient-to-r from-[#FFA726] to-[#FFB300] hover:from-[#FF8F00] hover:to-[#FFA726] text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg",
              card: "bg-white text-[#0A1A2F] border-0 shadow-none rounded-[30px]",
              headerTitle: "text-2xl font-bold text-center text-[#0A1A2F]",
              headerSubtitle: "text-[#0A1A2F]/70 text-center",
              socialButtonsBlockButton:
                "bg-white border border-[#E5E5E5] hover:bg-[#FFF7E6] text-[#0A1A2F] font-medium rounded-xl transition-all duration-200",
              formFieldInput: "bg-white border border-[#E5E5E5] text-[#0A1A2F] rounded-lg focus:ring-2 focus:ring-[#FFA726]",
              formFieldLabel: "text-[#0A1A2F]",
            },
          }}
          path="/login"
          routing="path"
          signUpUrl="/register"
          afterSignInUrl="/" // UserSync component will handle redirect
        />
      </div>
    </div>
  );
}
