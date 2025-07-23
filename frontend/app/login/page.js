"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">🔮 Welcome to Astrousers</h1>
        <button
          onClick={() => signIn("google")}
          className="bg-purple-600 px-4 py-2 rounded text-white"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
