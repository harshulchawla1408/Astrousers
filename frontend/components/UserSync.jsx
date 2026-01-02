"use client";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function UserSync() {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const backend = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");

    const payload = {
      clerkId: user.id,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      fullName:
        user.fullName ||
        `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      email: user.primaryEmailAddress?.emailAddress || "",
      profileImage: user.imageUrl || "",
    };

    // 1️⃣ Sync user to backend (create or update)
    fetch(`${backend}/api/v1/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .catch((err) => console.error("User sync failed:", err));

    // 2️⃣ OPTIONAL: Warm role cache (no redirect)
    fetch(`${backend}/api/v1/astrologers/check/${user.id}`)
      .then((res) => res.json())
      .catch(() => {});
  }, [isLoaded, isSignedIn, user]);

  return null;
}
