"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserContext } from "@/contexts/UserContext";

export default function Dashboard() {
  const { user, loading } = useUserContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FFA726]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Please sign in to access your dashboard
          </h1>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8EE] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#0A1A2F] mb-2">
            Welcome back, {user.name || "User"}!
          </h1>
          <p className="text-lg text-[#666]">
            Manage your astrology journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Wallet */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#0A1A2F]">
                Wallet Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#FFA726]">
                ₹{user.wallet || 0}
              </p>
              <Link href="/wallet">
                <Button variant="outline" className="mt-4">
                  Manage Wallet
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#0A1A2F]">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/kundli">
                <Button className="w-full bg-gradient-to-r from-[#FFA726] to-[#FFB300] text-white">
                  Generate Kundli
                </Button>
              </Link>
              <Link href="/astrologers">
                <Button variant="outline" className="w-full">
                  Talk to Astrologer
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" className="w-full">
                  Book E-Puja
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#0A1A2F]">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#666]">No recent activity</p>
              <p className="text-sm text-[#999] mt-2">
                Your astrology journey starts here!
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Link href="/">
            <Button variant="ghost">← Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
