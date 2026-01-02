"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export const useUserRole = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn || !user) {
      setRole(null);
      setLoading(false);
      return;
    }

    const backend = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");

    const checkRole = async () => {
      try {
        const res = await fetch(`${backend}/api/v1/astrologers/check/${user.id}`);
        const data = await res.json();

        if (data?.exists) {
          setRole("astrologer");
        } else {
          setRole("user");
        }
      } catch (err) {
        console.error("Role check failed:", err);
        setRole("user");
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, [isLoaded, isSignedIn, user]);

  return { role, loading };
};
