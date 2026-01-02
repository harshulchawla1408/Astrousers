"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#FFF8EE]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-24">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#0A1A2F] mb-2">
            Admin Dashboard
          </h1>
          <p className="text-[#666]">
            Manage astrologers, earnings, sessions & platform operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Astrologers */}
          <Card className="hover:shadow-xl transition">
            <CardHeader>
              <CardTitle>Astrologers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Add, edit astrologers and control availability
              </p>
              <Link href="/admin/astrologers">
                <Button className="w-full bg-gradient-to-r from-[#FFA726] to-[#FFB300] text-white">
                  Manage Astrologers
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Sessions */}
          <Card className="hover:shadow-xl transition">
            <CardHeader>
              <CardTitle>Sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                View active, ended & failed sessions
              </p>
              <Button disabled className="w-full">
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          {/* Earnings */}
          <Card className="hover:shadow-xl transition">
            <CardHeader>
              <CardTitle>Earnings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Platform revenue & astrologer payouts
              </p>
              <Button disabled className="w-full">
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          {/* Orders */}
          <Card className="hover:shadow-xl transition">
            <CardHeader>
              <CardTitle>Orders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Wallet recharges & payment logs
              </p>
              <Button disabled className="w-full">
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          {/* Users */}
          <Card className="hover:shadow-xl transition">
            <CardHeader>
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Registered users & activity
              </p>
              <Button disabled className="w-full">
                Coming Soon
              </Button>
            </CardContent>
          </Card>

        </div>
      </main>

      <Footer />
    </div>
  );
}
