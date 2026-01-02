"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const fetchUserData = async () => {
      try {
        const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
        const response = await fetch(`${backend}/api/v1/user/me`, {
          headers: {
            // Add auth headers if needed
          },
        });
        const data = await response.json();
        if (data.success) {
          setUserData(data.user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to access your dashboard</h1>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FFA726]"></div>
          <p className="mt-4 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8EE] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#0A1A2F] mb-2">
            Welcome back, {userData?.name || user?.firstName || "User"}!
          </h1>
          <p className="text-lg text-[#666]">Manage your astrology journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#0A1A2F]">Wallet Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#FFA726]">
                ₹{userData?.wallet || 0}
              </p>
              <Link href="/wallet">
                <Button variant="outline" className="mt-4">
                  Manage Wallet
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#0A1A2F]">Quick Actions</CardTitle>
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

          <Card>
            <CardHeader>
              <CardTitle className="text-[#0A1A2F]">Recent Activity</CardTitle>
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
            <Button variant="ghost">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}