"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useUserContext } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";

export default function RechargeButton({ afterSuccess } = {}) {
  const { user, refreshUser } = useUserContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const backend = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  const RAZOR_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  const handlePayment = async (amount) => {
    if (!isLoaded || !user) {
      setError("Please sign in to recharge your wallet");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // 1) Create order on backend — backend expects clerkId in body
      const orderResp = await fetch(`${backend}/api/payment/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, clerkId: user.id })
      });

      const orderJson = await orderResp.json();
      if (!orderResp.ok || !orderJson?.order) {
        throw new Error(orderJson?.message || "Failed to create order");
      }

      const razorOrder = orderJson.order;

      // 2) Build Razorpay options
      const options = {
        key: RAZOR_KEY,
        amount: razorOrder.amount,
        currency: razorOrder.currency,
        name: "Astrousers",
        description: `Wallet Recharge - ₹${amount}`,
        order_id: razorOrder.id,
        handler: async function (response) {
          // response: { razorpay_payment_id, razorpay_order_id, razorpay_signature }
          try {
            const verifyResp = await fetch(`${backend}/api/payment/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                amount,
                clerkId: user.id
              })
            });

            const verifyJson = await verifyResp.json();

            if (!verifyResp.ok || !verifyJson.success) {
              throw new Error(verifyJson?.message || "Payment verification failed");
            }

            setSuccess(`Recharge successful! New balance: ${verifyJson.newBalance} coins`);
            // optionally trigger callback
            if (afterSuccess) afterSuccess(verifyJson);
            // refresh page or router to reflect new balance
            refreshUser();
          } catch (err) {
            console.error("Verification error:", err);
            setError(err.message || "Payment verification failed");
          } finally {
            setLoading(false);
          }
        },
        theme: { color: "#5E17EB" },
        modal: {
          ondismiss: () => setLoading(false)
        }
      };

      // 3) Open Razorpay modal
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        console.error("Razorpay payment failed:", response.error);
        setError(response.error?.description || "Payment failed");
        setLoading(false);
      });

      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "Payment failed. Please try again.");
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
        <p className="text-sm text-gray-600">Add coins to your wallet to start consulting with astrologers</p>
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
              className="h-auto p-4 flex flex-col items-center space-y-2 border-2 border-transparent transition-all"
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
            <li>• Instant coin credit after verification</li>
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
