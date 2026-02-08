"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { disconnectSocket } from "@/lib/socketClient";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const { user, isLoaded } = useUser();
  const { signOut, getToken } = useAuth(); // ✅ getToken FROM useAuth

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const retryTimeoutRef = useRef(null);

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
      // Clear any pending retry
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
      return;
    }

    // Clear any existing retry timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    const fetchProfile = async (isRetry = false) => {
      let syncData = null;
      let fullProfileFetched = false;
      
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

        if (syncRes.ok) {
          const syncContentType = syncRes.headers.get("content-type");
          if (syncContentType && syncContentType.includes("application/json")) {
            try {
              syncData = await syncRes.json();
              // Use sync response data immediately if available
              if (syncData.success && syncData.user) {
                setProfile({
                  id: syncData.user.id,
                  role: syncData.user.role,
                  name: syncData.user.name,
                  avatar: syncData.user.avatar,
                  email: user.primaryEmailAddress?.emailAddress,
                  walletBalance: syncData.user.walletBalance || 0,
                  walletTransactions: []
                });
              }
            } catch (parseErr) {
              console.error("❌ Failed to parse sync response:", parseErr);
            }
          }
        } else {
          const errText = await syncRes.text();
          console.error("❌ User sync failed:", errText);
        }

        // 2️⃣ Wait a bit for Clerk session to be fully established (for new users)
        // This is especially important for newly registered users
        await new Promise(resolve => setTimeout(resolve, 500));

        // 3️⃣ Try to get Clerk JWT and fetch full profile
        // For new users, this might fail initially, but we have sync data as fallback
        try {
          const token = await getToken();
          
          if (token) {
            // 4️⃣ Fetch full profile from backend (AUTH REQUIRED)
            // This gives us complete user data including wallet transactions
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/me`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json"
                }
              }
            );

            // Check response status BEFORE parsing
            if (res.ok) {
              const contentType = res.headers.get("content-type");
              if (contentType && contentType.includes("application/json")) {
                const data = await res.json();
                
                if (data.success && data.user) {
                  // Update profile with full data from /me endpoint
                  setProfile(data.user);
                  fullProfileFetched = true;
                  
                  setLoading(false);
                  return; // Success - exit early
                }
              }
            } else {
              // Token might be invalid for new users - that's okay, we have sync data
              const contentType = res.headers.get("content-type");
              if (contentType && contentType.includes("application/json")) {
                const errorData = await res.json();
                // Only log as warning if we have sync data (expected for new users)
                if (syncData) {
                  console.warn("⚠️ Profile fetch failed (token may need time to activate):", errorData.message);
                } else {
                  console.error("❌ Failed to fetch user profile:", errorData.message || "Unknown error");
                }
              }
            }
          } else {
            // No token available - that's okay for new users, we have sync data
            if (!syncData) {
              console.warn("⚠️ No auth token available and no sync data");
            }
          }
        } catch (tokenErr) {
          // Token fetch or profile fetch failed - that's okay if we have sync data
          if (!syncData) {
            console.error("❌ Error fetching token or profile:", tokenErr.message);
          } else {
            console.warn("⚠️ Token/profile fetch failed but sync data available:", tokenErr.message);
          }
        }

        // If we have sync data but couldn't fetch full profile, schedule a retry
        if (syncData && !isRetry && !fullProfileFetched) {
          // Retry after a delay to allow token to become valid
          retryTimeoutRef.current = setTimeout(() => {
            fetchProfile(true);
          }, 2000);
        }
        
        // If we have sync data, use it and set loading to false
        // The full profile fetch can happen later when token is ready
        if (syncData) {
          setLoading(false);
        } else {
          // No sync data and no profile - something went wrong
          setLoading(false);
        }
      } catch (err) {
        console.error("❌ UserContext error:", err);
        // If we have sync data, keep using it; otherwise clear profile
        if (!syncData) {
          setProfile(null);
          setLoading(false);
        } else {
          // Keep sync data and just set loading to false
          setLoading(false);
        }
      }
    };

    fetchProfile();

    // Cleanup function to clear timeout on unmount or dependency change
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
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
