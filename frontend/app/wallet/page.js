"use client";

import React, { useState } from "react";
import WalletCard from "@/components/wallet/WalletCard";
import RechargeButton from "@/components/wallet/RechargeButton";
import TransactionHistory from "@/components/wallet/TransactionHistory";
import { useUserContext } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";

export default function WalletPage() {
  const { user, loading } = useUserContext();
  const [activeTab, setActiveTab] = useState("overview");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-64 bg-gray-200 rounded" />
            <div className="h-64 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-6">
            Please sign in to access your wallet
          </p>
          <Button onClick={() => window.dispatchEvent(new Event("open-signin"))}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wallet</h1>
          <p className="text-gray-600">
            Manage your coins and view transaction history
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {["overview", "recharge", "history"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab === "overview"
                  ? "Overview"
                  : tab === "recharge"
                  ? "Recharge"
                  : "Transaction History"}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <WalletCard />
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setActiveTab("recharge")}
                  >
                    Recharge Wallet
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setActiveTab("history")}
                  >
                    View Transaction History
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "recharge" && <RechargeButton />}

          {activeTab === "history" && <TransactionHistory />}
        </div>
      </div>
    </div>
  );
}
