"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserContext } from "@/contexts/UserContext";
import { initSocket, getSocket } from "@/lib/socketClient";

const backend =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function AstrologerDashboard() {
  const { user, role, loading } = useUserContext();
  const router = useRouter();

  const [astrologer, setAstrologer] = useState(null);
  const [pending, setPending] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [availability, setAvailability] = useState({
    chat: true,
    call: true,
    video: false,
  });

  /* -------------------------------------------------- */
  /* LOAD ASTROLOGER PROFILE */
  /* -------------------------------------------------- */
  useEffect(() => {
    if (!user || role !== "ASTROLOGER") return;

    const load = async () => {
      const res = await fetch(
        `${backend}/api/v1/astrologers/check/${user.clerkId}`
      );
      const json = await res.json();

      if (!json.exists) return;

      const prof = await fetch(
        `${backend}/api/v1/astrologers/${json.astrologer._id}`
      );
      const data = await prof.json();

      setAstrologer(data.data);
      setAvailability(data.data.availability);
    };

    load();
  }, [user, role]);

  /* -------------------------------------------------- */
  /* SOCKET: INCOMING REQUESTS */
  /* -------------------------------------------------- */
  useEffect(() => {
    if (!user || !astrologer) return;

    const socket = initSocket({ clerkId: user.clerkId });

    const onIncoming = (payload) => {
      if (payload.astrologerId !== astrologer._id) return;
      setPending((p) =>
        p.some((x) => x.sessionId === payload.sessionId)
          ? p
          : [payload, ...p]
      );
    };

    socket.on("incoming_request", onIncoming);
    return () => socket.off("incoming_request", onIncoming);
  }, [user, astrologer]);

  /* -------------------------------------------------- */
  /* STATS */
  /* -------------------------------------------------- */
  const loadStats = useCallback(async () => {
    if (!astrologer) return;
    const res = await fetch(
      `${backend}/api/v1/sessions/astrologer/${astrologer._id}`
    );
    const json = await res.json();

    const sessions = json.sessions || [];
    setActiveCount(sessions.filter((s) => s.status === "active").length);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setTodayEarnings(
      sessions
        .filter((s) => s.status === "ended" && new Date(s.endTime) >= today)
        .reduce((sum, s) => sum + (s.coinsUsed || 0), 0)
    );
  }, [astrologer]);

  useEffect(() => {
    loadStats();
    const id = setInterval(loadStats, 30000);
    return () => clearInterval(id);
  }, [loadStats]);

  /* -------------------------------------------------- */
  /* ACCEPT / REJECT */
  /* -------------------------------------------------- */
  const acceptSession = async (s) => {
    await fetch(`${backend}/api/v1/sessions/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-user-id": user.clerkId },
      body: JSON.stringify({ sessionId: s.sessionId }),
    });

    const socket = getSocket();
    socket?.emit("session:accept", { sessionId: s.sessionId });
    setPending((p) => p.filter((x) => x.sessionId !== s.sessionId));
    loadStats();
  };

  const rejectSession = async (id) => {
    await fetch(`${backend}/api/v1/sessions/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-user-id": user.clerkId },
      body: JSON.stringify({ sessionId: id }),
    });
    setPending((p) => p.filter((x) => x.sessionId !== id));
  };

  if (loading) return null;
  if (!user || role !== "ASTROLOGER") return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-white/10 border-0">
            <CardContent className="p-6">
              <p className="text-white/60 text-sm">Today's Earnings</p>
              <p className="text-white text-3xl font-bold">
                ₹{todayEarnings}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-0">
            <CardContent className="p-6">
              <p className="text-white/60 text-sm">Active Sessions</p>
              <p className="text-white text-3xl font-bold">{activeCount}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-0">
            <CardContent className="p-6">
              <p className="text-white/60 text-sm">Price / min</p>
              <p className="text-white text-3xl font-bold">
                ₹{astrologer.pricePerMin}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Incoming */}
        <Card className="bg-white/10 border-0">
          <CardHeader>
            <CardTitle className="text-white">
              Incoming Requests ({pending.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pending.length === 0 && (
              <p className="text-white/60">No pending requests</p>
            )}
            {pending.map((s) => (
              <div
                key={s.sessionId}
                className="flex justify-between items-center bg-white/5 p-4 rounded-lg"
              >
                <div>
                  <p className="text-white font-medium">{s.userName}</p>
                  <p className="text-white/60 text-sm">
                    {s.mode} consultation
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-green-500"
                    onClick={() => acceptSession(s)}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => rejectSession(s.sessionId)}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
