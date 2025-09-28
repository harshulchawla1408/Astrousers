"use client";

import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="p-6 rounded-2xl shadow-xl bg-gray-900 border border-gray-800">
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition",
              card: "bg-gray-900 text-white border border-gray-800 rounded-2xl shadow-xl",
              headerTitle: "text-2xl font-bold text-center text-purple-400",
              headerSubtitle: "text-gray-400 text-center",
              socialButtonsBlockButton:
                "bg-gray-800 hover:bg-gray-700 text-white font-medium",
            },
          }}
          path="/login"
          routing="path"
          signUpUrl="/register"
          afterSignInUrl="/"
        />
      </div>
    </div>
  );
}
