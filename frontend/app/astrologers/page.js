"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function AstrologersPage() {
  const { user } = useUser();
  const [astrologers, setAstrologers] = useState([]);
  const [wallet, setWallet] = useState(0);
  const [loading, setLoading] = useState(true);

  const backend =
    (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000").replace(
      /\/$/,
      ""
    );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const astroRes = await fetch(
        `${backend}/api/v1/astrologers?online=true`
      );
      const astroJson = await astroRes.json();

      if (astroJson.success) {
        setAstrologers(astroJson.data || []);
      }

      if (user) {
        const walletRes = await fetch(
          `${backend}/api/payment/balance?clerkId=${user.id}`
        );
        const walletJson = await walletRes.json();
        if (walletJson.success) setWallet(walletJson.wallet || 0);
      }
    } catch (err) {
      console.error("Failed loading astrologers:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF7E6] flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FFA726]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF7E6]">
      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-r from-[#FFA726] to-[#FFB300] py-14 text-center">
        <h1 className="text-4xl font-bold text-white">
          Talk to Online Astrologers
        </h1>
        <p className="text-white/90 mt-2">
          Only verified & currently available experts
        </p>

        <div className="flex justify-center gap-4 mt-6">
          <div className="bg-white/20 px-6 py-2 rounded-xl text-white">
            Balance: ₹{wallet}
          </div>
          <Link href="/wallet">
            <Button className="bg-white text-[#0A1A2F] rounded-xl">
              Recharge
            </Button>
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {astrologers.length === 0 ? (
          <div className="text-center text-gray-600">
            No astrologers online right now
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {astrologers.map((a) => (
              <Card
                key={a._id}
                className="hover:shadow-xl transition bg-white rounded-[20px]"
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="relative mx-auto w-20 h-20">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={a.image} />
                      <AvatarFallback>
                        {a.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                  </div>

                  <h3 className="text-lg font-semibold">{a.name}</h3>
                  <p className="text-sm text-gray-600">{a.expertise}</p>

                  <div className="flex justify-center gap-2">
                    <Badge>₹{a.pricePerMin}/min</Badge>
                    {a.verified && <Badge variant="secondary">Verified</Badge>}
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/astrologers/${a._id}`} className="flex-1">
                      <Button className="w-full">View</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
