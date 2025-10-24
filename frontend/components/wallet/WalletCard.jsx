"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useUser } from "@clerk/nextjs";

export default function WalletCard() {
  const { user, isLoaded } = useUser();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoaded && user) {
      fetchBalance();
    }
  }, [isLoaded, user]);

  const fetchBalance = async () => {
    try {
      setLoading(true);
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

  const getBalanceColor = (balance) => {
    if (balance < 50) return "text-red-500";
    if (balance < 100) return "text-yellow-500";
    return "text-green-500";
  };

  const getBalanceStatus = (balance) => {
    if (balance < 50) return "Low Balance";
    if (balance < 100) return "Medium Balance";
    return "Good Balance";
  };

  if (!isLoaded) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Please sign in to view your wallet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Wallet Balance</span>
          <Badge variant={balance < 50 ? "destructive" : balance < 100 ? "secondary" : "default"}>
            {getBalanceStatus(balance)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchBalance} variant="outline" size="sm">
              Retry
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className={`text-4xl font-bold ${getBalanceColor(balance)}`}>
                {balance.toLocaleString()}
              </div>
              <p className="text-sm text-gray-500 mt-1">Coins Available</p>
            </div>
            
            {balance < 50 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ Low balance! Consider recharging your wallet.
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={fetchBalance} 
                variant="outline" 
                size="sm" 
                className="flex-1"
              >
                Refresh
              </Button>
              <Button 
                onClick={() => window.location.href = '/wallet/recharge'} 
                className="flex-1"
              >
                Recharge
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
