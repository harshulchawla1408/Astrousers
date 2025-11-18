"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useUser } from "@clerk/nextjs";

export default function RechargeButton() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handlePayment = async (amount) => {
    if (!user) {
      setError("Please sign in to recharge your wallet");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const token = await user.getToken();

      // Step 1: Create Razorpay order
      const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ amount }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.message || "Failed to create order");
      }

      // Step 2: Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Astrousers",
        description: `Wallet Recharge - ₹${amount}`,
        order_id: orderData.order.id,
        handler: async (response) => {
          try {
            // Step 3: Verify payment
            const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({
                ...response,
                amount,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              setSuccess(`Recharge successful! New balance: ₹${verifyData.newBalance}`);
              // Refresh the page or update balance in parent component
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            } else {
              setError(verifyData.message || "Payment verification failed");
            }
          } catch (verifyError) {
            console.error("Payment verification error:", verifyError);
            setError("Payment verification failed. Please contact support.");
          }
        },
        theme: {
          color: "#5E17EB",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          }
        }
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const rechargeAmounts = [
    { amount: 100, label: "₹100", coins: "100 Coins" },
    { amount: 500, label: "₹500", coins: "500 Coins" },
    { amount: 1000, label: "₹1000", coins: "1000 Coins" },
    { amount: 2000, label: "₹2000", coins: "2000 Coins" },
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Recharge Your Wallet</CardTitle>
        <p className="text-sm text-gray-600">
          Add coins to your wallet to start consulting with astrologers
        </p>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {rechargeAmounts.map((item) => (
            <Button
              key={item.amount}
              onClick={() => handlePayment(item.amount)}
              disabled={loading}
              className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-purple-50 hover:border-purple-200 border-2 border-transparent transition-all"
              variant="outline"
            >
              <div className="text-lg font-semibold">{item.label}</div>
              <div className="text-sm text-gray-500">{item.coins}</div>
            </Button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Payment Information</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 1 INR = 1 Coin</li>
            <li>• Secure payment via Razorpay</li>
            <li>• Instant coin credit</li>
            <li>• No transaction fees</li>
          </ul>
        </div>

        {loading && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
              <span className="text-sm text-gray-600">Processing payment...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
