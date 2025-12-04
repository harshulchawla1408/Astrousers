"use client";
import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useSocket } from "@/lib/socketClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

export default function AstrologerDashboard() {
  const { user, isLoaded } = useUser();
  const { socket, isConnected } = useSocket();
  const router = useRouter();

  const [astrologerData, setAstrologerData] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [pendingSessions, setPendingSessions] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [availability, setAvailability] = useState({
    chat: true,
    call: true,
    video: false
  });
  const [loadingIds, setLoadingIds] = useState({}); // map sessionId => loading boolean
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  // Utility to set per-session loading
  const setSessionLoading = (sessionId, value) => {
    setLoadingIds((prev) => ({ ...prev, [sessionId]: value }));
  };

  // Fetch astrologer profile (if this Clerk user is an astrologer)
  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchAstrologer = async () => {
      try {
        const checkRes = await fetch(`${backendUrl}/api/v1/astrologers/check/${user.id}`);
        const checkData = await checkRes.json();
        if (checkData.exists && checkData.astrologer) {
          const res = await fetch(`${backendUrl}/api/v1/astrologers/${checkData.astrologer._id}`);
          const data = await res.json();
          if (data.success && data.data) {
            setAstrologerData(data.data);
            setIsOnline(Boolean(data.data.online));
            setAvailability(data.data.availability || { chat: true, call: true, video: false });
          }
        } else {
          setAstrologerData(null);
        }
      } catch (err) {
        console.error("Failed to fetch astrologer:", err);
      }
    };

    fetchAstrologer();
  }, [isLoaded, user, backendUrl]);

  // Fetch sessions & earnings for this astrologer
  const fetchSessionStats = useCallback(async () => {
    if (!astrologerData) return;
    try {
      const res = await fetch(`${backendUrl}/api/v1/sessions/astrologer/${astrologerData._id}`);
      const data = await res.json();
      if (data.success) {
        const sessions = data.sessions || [];
        const active = sessions.filter((s) => s.status === "active");
        setActiveSessions(active);

        // Today's earnings: ended sessions with endTime today
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const todaySessions = sessions.filter((s) => {
          const dt = new Date(s.endTime || s.startTime);
          return dt >= startOfToday && s.status === "ended";
        });
        const earnings = todaySessions.reduce((sum, s) => sum + (s.coinsUsed || 0), 0);
        setTodayEarnings(earnings);
      }
    } catch (err) {
      console.error("Failed fetching session stats:", err);
    }
  }, [astrologerData, backendUrl]);

  useEffect(() => {
    fetchSessionStats();
    const id = setInterval(fetchSessionStats, 30000);
    return () => clearInterval(id);
  }, [fetchSessionStats]);

  // SOCKET: incoming_request, session:accepted, session:rejected
  useEffect(() => {
    if (!socket || !astrologerData) return;

    const onIncoming = (data) => {
      // data expected: { sessionId, userId, userName, mode, channelName, astrologerId }
      if (!data || !data.sessionId) return;
      // Only accept requests targeted to this astrologer
      if (data.astrologerId && data.astrologerId !== astrologerData._id) return;

      setPendingSessions((prev) => {
        if (prev.some((p) => p.sessionId === data.sessionId)) return prev;
        return [data, ...prev];
      });
    };

    const onAccepted = (data) => {
      // Remove from pending, add to active
      if (!data?.sessionId) return;
      setPendingSessions((prev) => prev.filter((p) => p.sessionId !== data.sessionId));
      // Optionally fetch updated sessions
      fetchSessionStats();
    };

    const onRejected = (data) => {
      if (!data?.sessionId) return;
      setPendingSessions((prev) => prev.filter((p) => p.sessionId !== data.sessionId));
    };

    socket.on("incoming_request", onIncoming);
    socket.on("session:accepted", onAccepted);
    socket.on("session:rejected", onRejected);

    return () => {
      socket.off("incoming_request", onIncoming);
      socket.off("session:accepted", onAccepted);
      socket.off("session:rejected", onRejected);
    };
  }, [socket, astrologerData, fetchSessionStats]);

  // Toggle online/offline
  const toggleOnlineStatus = async () => {
    if (!user || !astrologerData) return;
    const endpoint = isOnline ? "offline" : "online";
    try {
      const res = await fetch(`${backendUrl}/api/v1/astrologers/${astrologerData._id}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": user.id }
      });
      const data = await res.json();
      if (data.success) {
        setIsOnline(!isOnline);
        setAstrologerData((prev) => ({ ...prev, online: !isOnline }));
        if (socket) socket.emit(isOnline ? "presence:off" : "presence:on");
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Toggle online error:", err);
      alert("Failed to update online status");
    }
  };

  // Update availability preferences
  const updateAvailability = async (field, value) => {
    if (!user || !astrologerData) return;
    const prev = availability;
    const next = { ...availability, [field]: value };
    setAvailability(next);
    try {
      const res = await fetch(`${backendUrl}/api/v1/astrologers/${astrologerData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-user-id": user.id },
        body: JSON.stringify({ availability: next })
      });
      const data = await res.json();
      if (!data.success) {
        setAvailability(prev);
        alert(data.message || "Failed to update availability");
      }
    } catch (err) {
      console.error("Availability update failed:", err);
      setAvailability(prev);
      alert("Failed to update availability");
    }
  };

  // Accept session: core flow
  const acceptSession = async (sessionData) => {
    if (!user || !sessionData) return;
    const sid = sessionData.sessionId;
    try {
      setSessionLoading(sid, true);

      // 1) Tell backend astrologer accepts (server will update session status)
      const acceptRes = await fetch(`${backendUrl}/api/v1/sessions/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": user.id },
        body: JSON.stringify({
          sessionId: sid,
          astrologerClerkId: user.id
        })
      });
      const acceptJson = await acceptRes.json();
      if (!acceptJson.success) {
        throw new Error(acceptJson.message || "Failed to accept session");
      }

      // 2) Emit socket accept so server and user clients are notified, and join session room
      if (socket) {
        socket.emit("session:accept", { sessionId: sid });
        socket.emit("session:join", { sessionId: sid });
      }

      // 3) If it's a call (audio/video) -> get Agora token and redirect to call page
      const mode = sessionData.mode || sessionData.sessionType;
      if (mode === "audio" || mode === "video") {
        // Request Agora token using sessionId & astrologer mongo id (astrologerData._id)
        const tokenRes = await fetch(`${backendUrl}/api/v1/agora/token`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-user-id": user.id },
          body: JSON.stringify({
            sessionId: sid,
            requesterId: astrologerData._id // pass mongo id so server can validate session membership
          })
        });
        const tokenJson = await tokenRes.json();
        if (!tokenJson.success) {
          // still allow chat fallback: join session and stay on dashboard
          alert(tokenJson.message || "Failed to get Agora token — remain in dashboard");
          fetchSessionStats();
          return;
        }

        const { token, channelName, appId, uid } = tokenJson;

        // Build redirect params
        const params = new URLSearchParams({
          sessionId: sid,
          channelName,
          token,
          appId: appId || tokenJson.appId || "",
          uid: String(uid || ""),
          role: "astrologer"
        });

        // Redirect to the corresponding call page (your existing components should read these params)
        if (mode === "audio") {
          router.replace(`/audio-call?${params.toString()}`);
        } else {
          router.replace(`/video-call?${params.toString()}`);
        }
      } else {
        // Chat mode: join session room and keep dashboard; optionally open chat panel
        if (socket) socket.emit("session:join", { sessionId: sid });
        // Move pending -> active locally
        setPendingSessions((prev) => prev.filter((p) => p.sessionId !== sid));
        setActiveSessions((prev) => [{ ...sessionData, sessionId: sid, status: "active" }, ...prev]);
        fetchSessionStats();
      }
    } catch (err) {
      console.error("Accept session failed:", err);
      alert(err.message || "Failed to accept session");
    } finally {
      setSessionLoading(sid, false);
    }
  };

  // Reject session
  const rejectSession = async (sessionId) => {
    if (!user || !sessionId) return;
    try {
      setSessionLoading(sessionId, true);
      const res = await fetch(`${backendUrl}/api/v1/sessions/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": user.id },
        body: JSON.stringify({ sessionId, astrologerClerkId: user.id })
      });
      const json = await res.json();
      if (json.success) {
        setPendingSessions((prev) => prev.filter((p) => p.sessionId !== sessionId));
        if (socket) socket.emit("session:reject", { sessionId });
      } else {
        throw new Error(json.message || "Reject failed");
      }
    } catch (err) {
      console.error("Reject failed:", err);
      alert(err.message || "Failed to reject");
    } finally {
      setSessionLoading(sessionId, false);
    }
  };

  // UI: loading states
  const renderIncomingList = () => {
    if (!pendingSessions.length) {
      return <p className="text-white/60">No pending session requests</p>;
    }

    return (
      <div className="space-y-3">
        {pendingSessions.map((session) => {
          const sid = session.sessionId;
          const loading = !!loadingIds[sid];
          return (
            <Card key={sid} className="bg-white/5 border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{session.userName || session.userId}</p>
                    <p className="text-white/60 text-sm">Type: {session.mode || session.sessionType}</p>
                    <p className="text-white/60 text-sm">Channel: {session.channelName}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => acceptSession(session)}
                      disabled={loading}
                      className="bg-green-500 hover:bg-green-600 text-white"
                      size="sm"
                    >
                      {loading ? "Accepting..." : "Accept"}
                    </Button>
                    <Button
                      onClick={() => rejectSession(sid)}
                      disabled={loading}
                      variant="destructive"
                      size="sm"
                    >
                      {loading ? "Rejecting..." : "Reject"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  // Loading initial states
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Header />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user || !astrologerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Header />
        <div className="flex justify-center items-center min-h-[60vh]">
          <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <p className="text-white text-lg">Astrologer profile not found. Please contact support.</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Summary */}
        <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl mb-6">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Profile Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-white/60 text-sm">Name</p>
                <p className="text-white text-lg font-semibold">{astrologerData.name}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Expertise</p>
                <p className="text-white text-lg font-semibold">{astrologerData.expertise}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Rating</p>
                <p className="text-white text-lg font-semibold">⭐ {astrologerData.rating} ({astrologerData.reviews} reviews)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <p className="text-white/60 text-sm mb-2">Today's Earnings</p>
              <p className="text-white text-3xl font-bold">₹{todayEarnings}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <p className="text-white/60 text-sm mb-2">Active Sessions</p>
              <p className="text-white text-3xl font-bold">{activeSessions.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <p className="text-white/60 text-sm mb-2">Price per Minute</p>
              <p className="text-white text-3xl font-bold">₹{astrologerData.pricePerMin}</p>
            </CardContent>
          </Card>
        </div>

        {/* Status & Availability */}
        <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl mb-6">
          <CardHeader>
            <CardTitle className="text-white text-xl">Status & Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 mb-2">Online Status</p>
                <Badge variant={isOnline ? "default" : "secondary"}>
                  {isOnline ? "Online" : "Offline"}
                </Badge>
              </div>
              <Button
                onClick={toggleOnlineStatus}
                disabled={!isConnected}
                className={`${isOnline ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} text-white`}
              >
                {isOnline ? "Go Offline" : "Go Online"}
              </Button>
            </div>

            <div>
              <p className="text-white/80 mb-3">Availability</p>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={availability.chat} onChange={(e) => updateAvailability("chat", e.target.checked)} className="w-4 h-4"/>
                  <span className="text-white">Chat</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={availability.call} onChange={(e) => updateAvailability("call", e.target.checked)} className="w-4 h-4"/>
                  <span className="text-white">Audio Call</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={availability.video} onChange={(e) => updateAvailability("video", e.target.checked)} className="w-4 h-4"/>
                  <span className="text-white">Video Call</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Incoming Requests */}
        <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white text-xl">Incoming Requests ({pendingSessions.length})</CardTitle>
          </CardHeader>
          <CardContent>{renderIncomingList()}</CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
