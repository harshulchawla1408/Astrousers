"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SessionManager from "@/components/session/SessionManager";

export default function AstrologerDetailPage() {
  const { id } = useParams();
  const [astro, setAstro] = useState(null);
  const [mode, setMode] = useState(null);

  const backend =
    (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000").replace(
      /\/$/,
      ""
    );

  useEffect(() => {
    fetch(`${backend}/api/v1/astrologers/${id}`)
      .then((r) => r.json())
      .then((d) => setAstro(d.data));
  }, [id]);

  if (!astro) return null;

  return (
    <div className="min-h-screen bg-[#FFF7E6]">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <Card className="bg-white rounded-[20px] shadow-md">
          <CardContent className="p-8 space-y-6">
            <h1 className="text-2xl font-bold">{astro.name}</h1>
            <p className="text-gray-600">{astro.expertise}</p>

            <Badge className={astro.online ? "bg-green-500" : "bg-gray-400"}>
              {astro.online ? "Online" : "Offline"}
            </Badge>

            <p className="text-lg font-semibold">
              ₹{astro.pricePerMin}/min
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                onClick={() => setMode("chat")}
                className="bg-[#FFA726] text-white"
              >
                Chat
              </Button>

              <Button
                disabled={!astro.online || !astro.availability?.call}
                onClick={() => setMode("audio")}
              >
                Audio Call
              </Button>

              <Button
                disabled={!astro.online || !astro.availability?.video}
                onClick={() => setMode("video")}
              >
                Video Call
              </Button>
            </div>
          </CardContent>
        </Card>

        {mode && (
          <div className="mt-8">
            <SessionManager
              astrologerId={astro._id}
              astrologerName={astro.name}
              sessionType={mode}
              pricePerMin={astro.pricePerMin}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
