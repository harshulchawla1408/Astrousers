"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useUserContext } from "@/contexts/UserContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");

export default function CallEndedPage() {
  const search = useSearchParams();
  const sessionId = search.get("sessionId");
  const reportedDuration = Number(search.get("duration")) || 0;

  const { getToken } = useAuth();
  const { role } = useUserContext();

  const [sessionDetails, setSessionDetails] = useState(null);
  const [loading, setLoading] = useState(Boolean(sessionId));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const token = await getToken();
        if (!token) {
          setError("Authentication expired. Please sign in again to view details.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${backendUrl}/api/v1/sessions/details/${sessionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Unable to load session details");
        }

        const data = await res.json();
        if (data.success) {
          setSessionDetails(data.data);
        } else {
          throw new Error(data.message || "Unable to load session details");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch session details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [sessionId, getToken]);

  const astrologerName = useMemo(() => {
    return sessionDetails?.astrologerId?.name || sessionDetails?.astrologerId?.displayName || "Astrologer";
  }, [sessionDetails]);

  const durationDisplay = useMemo(() => {
    if (sessionDetails?.durationMinutes) {
      return `${sessionDetails.durationMinutes} min`;
    }
    if (reportedDuration) {
      const minutes = Math.max(1, Math.ceil(reportedDuration / 60));
      return `${minutes} min`;
    }
    return "—";
  }, [sessionDetails, reportedDuration]);

  const amountDisplay = useMemo(() => {
    if (typeof sessionDetails?.coinsUsed === "number") {
      return `₹${sessionDetails.coinsUsed}`;
    }
    return "Will reflect in wallet";
  }, [sessionDetails]);

  const dashboardHref = role === "ASTROLOGER" ? "/astrologer/dashboard" : "/dashboard";
  const consultHref = role === "ASTROLOGER" ? "/astrologer/dashboard" : "/astrologers";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1A2F] to-[#1F2A44] flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-3xl bg-white/10 border border-white/20 text-white shadow-2xl">
        <CardContent className="p-8 space-y-8">
          <div className="text-center space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-300">Session Complete</p>
            <h1 className="text-3xl md:text-4xl font-bold">Call Ended Successfully</h1>
            <p className="text-white/70 max-w-2xl mx-auto">
              Thank you for connecting{astrologerName ? ` with ${astrologerName}` : ""}. Review your session summary
              below or jump back into your dashboard any time.
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/30 border-b-transparent" />
              <p className="text-white/70">Fetching session summary...</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-100 rounded-lg p-4 text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-xs uppercase tracking-widest text-white/60">Astrologer</p>
                  <p className="text-xl font-semibold mt-2">{astrologerName}</p>
                  <p className="text-sm text-white/60 mt-1">
                    {sessionDetails?.astrologerId?.expertise?.join(", ") || "Personal Consultation"}
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-xs uppercase tracking-widest text-white/60">Duration</p>
                  <p className="text-3xl font-semibold mt-2">{durationDisplay}</p>
                  <p className="text-sm text-white/60 mt-1">Includes billing adjustments</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-xs uppercase tracking-widest text-white/60">Amount Spent</p>
                  <p className="text-3xl font-semibold mt-2">{amountDisplay}</p>
                  <p className="text-sm text-white/60 mt-1">Wallet auto-adjusted</p>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-5 border border-white/10 space-y-2">
                <p className="text-sm text-white/70">Session ID</p>
                <p className="font-mono text-lg">
                  {sessionId || "Not provided"}
                </p>
                <p className="text-xs text-white/50">
                  Keep this reference handy if you need support or follow-ups.
                </p>
              </div>
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href={dashboardHref} className="flex-1">
              <Button className="w-full bg-orange-500 hover:bg-orange-400 text-white font-semibold">
                Go to Dashboard
              </Button>
            </Link>
            <Link href={consultHref} className="flex-1">
              <Button
                variant="outline"
                className="w-full border-white/40 text-white hover:bg-white/10"
              >
                Consult Again
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
