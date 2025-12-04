"use client";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";

export default function UserSync() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

    // Prepare user object for backend sync
    const payload = {
      clerkId: user.id,
      fullName:
        user.fullName ||
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.primaryEmailAddress?.emailAddress?.split("@")[0],
      email: user.primaryEmailAddress?.emailAddress || "",
      profileImage: user.imageUrl || "",
    };

    // ---- 1) SYNC USER WITH BACKEND ----
    fetch(`${backend}/api/v1/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => {
        // ---- 2) CHECK IF USER IS ASTROLOGER ----
        fetch(`${backend}/api/v1/astrologers/check/${user.id}`)
          .then((res) => res.json())
          .then((data) => {
            const isAstrologer = data?.exists;

            // 🌕 ASTROLOGER LOGIN FLOW
            if (isAstrologer) {
              if (!pathname.startsWith("/astrologer")) {
                router.replace("/astrologer/dashboard");
              }
              return;
            }

            // 🌑 NORMAL USER LOGIN FLOW
            const loginPages = ["/login", "/sign-in", "/register", "/sign-up"];

            const isLoginPage = loginPages.some((p) =>
              pathname.startsWith(p)
            );

            if (isLoginPage) {
              router.replace("/dashboard");
            }
          })
          .catch((err) => console.log("Role check error", err));
      })
      .catch((err) => console.log("Sync error:", err));
  }, [isLoaded, isSignedIn, user, pathname, router]);

  return null;
}
