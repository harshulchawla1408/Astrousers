"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { getSocket as initSocket, disconnectSocket } from "@/lib/socketClient";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const { user, isLoaded } = useUser();
  const { signOut, getToken } = useAuth(); // ✅ getToken FROM useAuth

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
  ========================================
  FETCH + SYNC USER PROFILE
  ========================================
  */
  useEffect(() => {
    if (!isLoaded) return;

    // User logged out
    if (!user) {
      setProfile(null);
      setLoading(false);
      disconnectSocket();
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);

        // 1️⃣ Sync user to backend (NO AUTH REQUIRED - must work for new users)
        const syncRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/sync`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              clerkId: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              name: user.fullName,
              avatar: user.imageUrl
            })
          }
        );

        if (!syncRes.ok) {
          const errText = await syncRes.text();
          console.error("❌ User sync failed:", errText);
          // Don't throw - allow app to continue even if sync fails
          // The user might still be able to use the app
        } else {
          // Verify sync response is JSON (not HTML error page)
          const syncContentType = syncRes.headers.get("content-type");
          if (!syncContentType || !syncContentType.includes("application/json")) {
            const errText = await syncRes.clone().text();
            console.error("❌ User sync returned non-JSON:", syncContentType, errText.substring(0, 100));
          }
        }

        // 2️⃣ Get Clerk JWT for authenticated requests
        const token = await getToken();
        if (!token) {
          console.warn("⚠️ No auth token available");
          setLoading(false);
          return;
        }

        // 3️⃣ Fetch profile from backend (AUTH REQUIRED)
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "x-user-id": user.id
            }
          }
        );

        if (!res.ok) {
          const errText = await res.text();
          console.error("❌ Failed to fetch user profile:", errText);
          setLoading(false);
          return;
        }

        // Safely parse JSON - handle HTML error pages
        // Read as text first to check if it's HTML or JSON
        const responseText = await res.text();
        
        // Check if response is HTML (error page)
        if (responseText.trim().startsWith("<!DOCTYPE") || responseText.trim().startsWith("<html")) {
          console.error("❌ Backend returned HTML instead of JSON. Response preview:", responseText.substring(0, 200));
          setLoading(false);
          return;
        }

        // Try to parse as JSON
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseErr) {
          console.error("❌ Failed to parse JSON response:", parseErr.message);
          console.error("Response preview:", responseText.substring(0, 200));
          setLoading(false);
          return;
        }

        if (data.success && data.user) {
          setProfile(data.user);

          // 🔌 Init socket AFTER profile exists
          initSocket(user.id);
        }
      } catch (err) {
        console.error("❌ UserContext error:", err);
        // Don't crash the app - set profile to null but allow app to continue
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isLoaded, user, getToken]);

  /*
  ========================================
  LOGOUT
  ========================================
  */
  const logout = async () => {
    disconnectSocket();
    setProfile(null);
    await signOut();
  };

  return (
    <UserContext.Provider
      value={{
        user: profile,
        role: profile?.role || null,
        walletBalance: profile?.walletBalance || 0,
        loading,
        logout
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

/*
========================================
CUSTOM HOOK
========================================
*/
export const useUserContext = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUserContext must be used within UserProvider");
  }
  return ctx;
};
