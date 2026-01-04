"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserContext } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { user: userData, role, loading: contextLoading } = useUserContext();
  const router = useRouter();

  // Role-based redirect
  useEffect(() => {
    if (contextLoading || !isLoaded) return;
    
    if (!isSignedIn || !user) {
      router.replace("/");
      return;
    }
    
    if (role === "ASTROLOGER") {
      router.replace("/astrologer/dashboard");
      return;
    }
    if (role === "ADMIN") {
      router.replace("/admin");
      return;
    }
  }, [role, contextLoading, isLoaded, isSignedIn, user, router]);

  if (!isLoaded || contextLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FFA726]"></div>
          <p className="mt-4 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn || !user) {
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

  const walletBalance = userData?.walletBalance ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1A2F] via-[#101D35] to-[#0A1A2F] py-16 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
          <p className="text-sm uppercase tracking-[0.4em] text-white/60">Dashboard</p>
          <h1 className="mt-4 text-3xl sm:text-4xl font-semibold">
            Welcome back, {userData?.name || user?.firstName || "Explorer"}
          </h1>
          <p className="mt-3 text-white/70 max-w-3xl">
            Manage sessions, wallet and consultations from a single calm control center designed for clarity.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 px-6 py-4">
              <p className="text-xs uppercase tracking-widest text-white/60">Wallet Balance</p>
              <p className="text-3xl font-semibold mt-2 text-[#FFD56B]">₹{walletBalance.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-6 py-4">
              <p className="text-xs uppercase tracking-widest text-white/60">Active Session</p>
              <p className="text-lg font-medium mt-2">
                {userData?.activeSession ? "In progress" : "No active sessions"}
              </p>
              <p className="text-sm text-white/60">
                {userData?.activeSession ? userData.activeSession?.type : "Start a new consultation anytime"}
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 px-6 py-4">
              <p className="text-xs uppercase tracking-widest text-white/60">Next Step</p>
              <p className="text-lg font-medium mt-2">Recharge & connect</p>
              <Link href="/wallet" className="inline-block mt-2">
                <Button className="bg-[#FFA726] hover:bg-[#FF8F00] text-[#0A1A2F]">Recharge Wallet</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <Card className="bg-white/10 border-white/10 text-white">
            <CardHeader>
              <CardTitle className="text-white">Session Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-white/80">
              <div className="flex justify-between">
                <span>Last Consultation</span>
                <span>{userData?.lastSessionDate || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span>Preferred Expert</span>
                <span>{userData?.favoriteAstrologer || "Not set"}</span>
              </div>
              <div className="flex justify-between">
                <span>Consultation Mode</span>
                <span>{userData?.preferredMode || "Flexible"}</span>
              </div>
              <Link href="/astrologers">
                <Button className="w-full mt-4 bg-[#FFD56B] text-[#0A1A2F] hover:bg-[#FFC447]">
                  Book New Session
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/10 text-white md:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link href="/astrologers" className="block">
                  <Button className="w-full h-full bg-gradient-to-r from-[#FFA726] to-[#FFB300] text-[#0A1A2F] shadow-lg">
                    Browse Astrologers
                  </Button>
                </Link>
                <Link href="/services" className="block">
                  <Button variant="outline" className="w-full h-full border-white/40 text-white hover:bg-white/10">
                    Book Puja / Ritual
                  </Button>
                </Link>
                <Link href="/kundli" className="block">
                  <Button variant="outline" className="w-full h-full border-white/40 text-white hover:bg-white/10">
                    Generate Kundli
                  </Button>
                </Link>
                <Link href="/wallet" className="block">
                  <Button variant="outline" className="w-full h-full border-white/40 text-white hover:bg-white/10">
                    View Wallet & History
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">Wallet health</p>
              <h2 className="text-2xl font-semibold mt-2">Recharge & keep sessions uninterrupted</h2>
              <p className="text-white/70 mt-1">
                Transactions, recharges and deductions stay synced with your wallet. Review anytime.
              </p>
            </div>
            <Link href="/wallet">
              <Button className="bg-white text-[#0A1A2F] hover:bg-[#FFD56B]">Open Wallet</Button>
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-widest text-white/60">Recent Recharge</p>
              <p className="text-xl font-semibold mt-2">{userData?.lastRecharge || "No data"}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-widest text-white/60">Coins Spent this week</p>
              <p className="text-xl font-semibold mt-2">{userData?.weeklySpend || "—"}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-widest text-white/60">Trust & Safety</p>
              <p className="text-sm mt-2 text-white/70">
                All calls & chats are encrypted and billed transparently via your wallet balance.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}