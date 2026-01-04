"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export const useWallet = () => {
  const { user, isLoaded } = useUser();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const backend = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");

  const fetchBalance = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const res = await fetch(`${backend}/api/payment/balance?clerkId=${user.id}`);
      const data = await res.json();

      if (!data.success) throw new Error(data.message);
      setBalance(data.wallet || 0);
    } catch (err) {
      console.error("Wallet fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkBalance = async (requiredCoins) => {
    try {
      const res = await fetch(`${backend}/api/payment/balance?clerkId=${user.id}`);
      const data = await res.json();

      return {
        hasEnough: data.wallet >= requiredCoins,
        balance: data.wallet,
        required: requiredCoins,
      };
    } catch (err) {
      return { hasEnough: false, balance: 0 };
    }
  };

  useEffect(() => {
    if (isLoaded && user) fetchBalance();
  }, [isLoaded, user]);

  return {
    balance,
    loading,
    error,
    fetchBalance,
    checkBalance,
    isAuthenticated: !!user,
  };
};
