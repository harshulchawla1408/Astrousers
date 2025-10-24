"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export const useWallet = () => {
  const { user, isLoaded } = useUser();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBalance = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      const token = await user.getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/balance`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch balance');
      }

      const data = await response.json();
      if (data.success) {
        setBalance(data.balance);
      } else {
        throw new Error(data.message || 'Failed to fetch balance');
      }
    } catch (err) {
      console.error('Error fetching balance:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkBalance = async (requiredCoins) => {
    if (!user) return { hasEnough: false, balance: 0 };

    try {
      const token = await user.getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/balance`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch balance');
      }

      const data = await response.json();
      if (data.success) {
        return {
          hasEnough: data.balance >= requiredCoins,
          balance: data.balance,
          required: requiredCoins
        };
      } else {
        throw new Error(data.message || 'Failed to fetch balance');
      }
    } catch (err) {
      console.error('Error checking balance:', err);
      return { hasEnough: false, balance: 0, error: err.message };
    }
  };

  const startSession = async (sessionData) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const token = await user.getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionData)
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to start session');
      }

      // Update balance after successful session start
      if (data.currentBalance !== undefined) {
        setBalance(data.currentBalance);
      }

      return data;
    } catch (err) {
      console.error('Error starting session:', err);
      throw err;
    }
  };

  const endSession = async (sessionData) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const token = await user.getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions/end`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionData)
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to end session');
      }

      // Update balance after session end
      if (data.remainingBalance !== undefined) {
        setBalance(data.remainingBalance);
      }

      return data;
    } catch (err) {
      console.error('Error ending session:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchBalance();
    }
  }, [isLoaded, user]);

  return {
    balance,
    loading,
    error,
    fetchBalance,
    checkBalance,
    startSession,
    endSession,
    isAuthenticated: !!user,
    isLoaded
  };
};
