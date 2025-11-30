"use client";

import { SignUp } from "@clerk/nextjs";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="p-6 rounded-2xl shadow-xl bg-gray-900 border border-gray-800">
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition",
              card: "bg-gray-900 text-white border border-gray-800 rounded-2xl shadow-xl",
              headerTitle: "text-2xl font-bold text-center text-pink-400",
              headerSubtitle: "text-gray-400 text-center",
              socialButtonsBlockButton:
                "bg-gray-800 hover:bg-gray-700 text-white font-medium",
            },
          }}
          path="/register"
          routing="path"
          signInUrl="/login"
          afterSignUpUrl="/" // UserSync component will handle redirect
        />
      </div>
    </div>
  );
}
