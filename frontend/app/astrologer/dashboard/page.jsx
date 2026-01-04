"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserContext } from "@/contexts/UserContext";
import { useUser, useAuth } from "@clerk/nextjs";
import { getSocket } from "@/lib/socketClient";
import ChatBox from "@/components/chat/ChatBox";
import dynamic from "next/dynamic";

const AudioCall = dynamic(() => import("@/components/agora/AudioCall"), {
  ssr: false,
});

const VideoCall = dynamic(() => import("@/components/agora/VideoCall"), {
  ssr: false,
});

const backend =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function AstrologerDashboard() {
  const { user: userProfile, role, loading } = useUserContext();
  const { user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();

  const [astrologer, setAstrologer] = useState(null);
  const [pending, setPending] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [availability, setAvailability] = useState({
    chat: true,
    call: true,
    video: false,
  });
  const [isOnline, setIsOnline] = useState(false);

  /* -------------------------------------------------- */
  /* ROLE-BASED REDIRECT */
  /* -------------------------------------------------- */
  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      router.replace("/");
      return;
    }
    
    if (role !== "ASTROLOGER") {
      if (role === "ADMIN") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
      return;
    }
  }, [user, role, loading, router]);

  /* -------------------------------------------------- */
  /* LOAD ASTROLOGER PROFILE */
  /* -------------------------------------------------- */
  useEffect(() => {
    if (!user || role !== "ASTROLOGER") return;

    const load = async () => {
      try {
        const res = await fetch(
          `${backend}/api/v1/astrologers/check/${user.id}`
        );

        if (!res.ok) {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await res.json();
            console.error("Failed to check astrologer:", errorData.message || "Unknown error");
          }
          return;
        }

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Backend returned non-JSON response");
          return;
        }

        const json = await res.json();
        if (!json.exists) return;

        const prof = await fetch(
          `${backend}/api/v1/astrologers/${json.astrologer._id}`
        );

        if (!prof.ok) {
          const contentType = prof.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await prof.json();
            console.error("Failed to fetch astrologer profile:", errorData.message || "Unknown error");
          }
          return;
        }

        const profContentType = prof.headers.get("content-type");
        if (!profContentType || !profContentType.includes("application/json")) {
          console.error("Backend returned non-JSON response");
          return;
        }

        const data = await prof.json();
        if (data.success && data.data) {
          setAstrologer(data.data);
          if (data.data.availability) {
            setAvailability(data.data.availability);
          }
        }
      } catch (err) {
        console.error("Error loading astrologer profile:", err);
      }
    };

    load();
  }, [user, role]);

  /* -------------------------------------------------- */
  /* SOCKET: CONNECTION & ONLINE STATUS */
  /* -------------------------------------------------- */
  useEffect(() => {
    if (!user || !astrologer || role !== "ASTROLOGER") return;

    const socket = getSocket(user.id);

    // Function to go online
    const goOnline = () => {
      if (socket.connected) {
        console.log("✅ Socket connected, going online...");
        socket.emit("astrologer:go-online");
        setIsOnline(true);
      } else {
        console.log("⏳ Socket not connected yet, waiting...");
      }
    };

    // Wait for socket to connect, then go online
    const handleConnect = () => {
      console.log("✅ Socket connected, going online...");
      // Small delay to ensure backend is ready
      setTimeout(() => {
        socket.emit("astrologer:go-online");
        setIsOnline(true);
      }, 500);
    };

    // If already connected, go online immediately
    if (socket.connected) {
      setTimeout(() => {
        socket.emit("astrologer:go-online");
        setIsOnline(true);
      }, 500);
    } else {
      socket.on("connect", handleConnect);
    }

    // Listen for incoming session requests
    const onIncoming = (payload) => {
      console.log("📥 Incoming session request:", payload);
      // Check if this session is for this astrologer (compare as strings)
      const payloadAstrologerId = payload.astrologerId;
      if (payloadAstrologerId && payloadAstrologerId.toString() !== astrologer._id.toString()) {
        console.log("❌ Session not for this astrologer:", payloadAstrologerId, "vs", astrologer._id);
        return; // Not for this astrologer
      }
      console.log("✅ Adding session to pending:", payload.sessionId, "mode:", payload.mode);
      setPending((p) => {
        // Check if already exists
        if (p.some((x) => x.sessionId === payload.sessionId)) {
          console.log("⚠️ Session already in pending list");
          return p;
        }
        return [{
          sessionId: payload.sessionId,
          userName: payload.userName || payload.user?.name || "User",
          mode: payload.mode,
          ...payload
        }, ...p];
      });
    };

    socket.on("session:incoming", onIncoming);

    // Cleanup: go offline when component unmounts
    return () => {
      socket.off("connect", handleConnect);
      socket.off("session:incoming", onIncoming);
      // Go offline on unmount
      if (socket.connected) {
        socket.emit("astrologer:go-offline");
        setIsOnline(false);
      }
    };
  }, [user, astrologer, role]);

  /* -------------------------------------------------- */
  /* STATS */
  /* -------------------------------------------------- */
  const loadStats = useCallback(async () => {
    if (!astrologer) return;
    
    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(
        `${backend}/api/v1/sessions/astrologer`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json();
          console.error("Failed to fetch sessions:", errorData.message || "Unknown error");
        }
        return;
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Backend returned non-JSON response");
        return;
      }

      const json = await res.json();
      const sessions = json.data || [];
      const active = sessions.filter((s) => s.status === "active");
      setActiveSessions(active);
      setActiveCount(active.length);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setTodayEarnings(
        sessions
          .filter((s) => s.status === "ended" && new Date(s.endTime || s.updatedAt) >= today)
          .reduce((sum, s) => sum + (s.coinsUsed || 0), 0)
      );
    } catch (err) {
      console.error("Error loading stats:", err);
    }
  }, [astrologer, getToken]);

  useEffect(() => {
    loadStats();
    const id = setInterval(loadStats, 30000);
    return () => clearInterval(id);
  }, [loadStats]);

  /* -------------------------------------------------- */
  /* ACCEPT / REJECT */
  /* -------------------------------------------------- */
  const acceptSession = async (s) => {
    try {
      const token = await getToken();
      
      if (!token) {
        console.error("No auth token available");
        return;
      }

      const res = await fetch(`${backend}/api/v1/sessions/accept`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ sessionId: s.sessionId }),
      });

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json();
          console.error("Failed to accept session:", errorData.message || "Unknown error");
        }
        return;
      }

      const socket = getSocket(user.id);
      socket?.emit("session:accept", { sessionId: s.sessionId });
      setPending((p) => p.filter((x) => x.sessionId !== s.sessionId));
      // Reload stats to get active sessions
      setTimeout(() => loadStats(), 500);
    } catch (err) {
      console.error("Error accepting session:", err);
    }
  };

  const rejectSession = async (id) => {
    try {
      const token = await getToken();
      
      if (!token) {
        console.error("No auth token available");
        return;
      }

      const res = await fetch(`${backend}/api/v1/sessions/reject`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ sessionId: id }),
      });

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json();
          console.error("Failed to reject session:", errorData.message || "Unknown error");
        }
        return;
      }

      setPending((p) => p.filter((x) => x.sessionId !== id));
    } catch (err) {
      console.error("Error rejecting session:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white" />
      </div>
    );
  }
  
  if (!user || role !== "ASTROLOGER") {
    return null; // Will redirect via useEffect
  }

  // Show loading state while astrologer data is being fetched
  if (!astrologer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Online Status Toggle */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></div>
            <span className="text-white font-medium">
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
          <Button
            onClick={() => {
              const socket = getSocket(user.id);
              if (isOnline) {
                socket.emit("astrologer:go-offline");
                setIsOnline(false);
              } else {
                socket.emit("astrologer:go-online");
                setIsOnline(true);
              }
            }}
            variant={isOnline ? "destructive" : "default"}
            className={isOnline ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
          >
            {isOnline ? "Go Offline" : "Go Online"}
          </Button>
        </div>

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
                ₹{astrologer.pricePerMinute?.chat || 0}
              </p>
              {astrologer.pricePerMinute && (
                <p className="text-white/40 text-xs mt-1">
                  Chat: ₹{astrologer.pricePerMinute.chat || 0} | 
                  Call: ₹{astrologer.pricePerMinute.call || 0} | 
                  Video: ₹{astrologer.pricePerMinute.video || 0}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Active Sessions */}
        {activeSessions.length > 0 && (
          <Card className="bg-white/10 border-0 mb-6">
            <CardHeader>
              <CardTitle className="text-white">
                Active Sessions ({activeSessions.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeSessions.map((session) => (
                <div key={session._id} className="bg-white/5 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="text-white font-medium">
                        {session.userId?.name || "User"}
                      </p>
                      <p className="text-white/60 text-sm capitalize">
                        {session.sessionType} Session
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async () => {
                        try {
                          const token = await getToken();
                          if (!token) return;
                          await fetch(`${backend}/api/v1/sessions/end`, {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ sessionId: session._id }),
                          });
                          loadStats();
                        } catch (err) {
                          console.error("Error ending session:", err);
                        }
                      }}
                    >
                      End Session
                    </Button>
                  </div>
                  {session.sessionType === "chat" && userProfile && (
                    <ChatBox
                      sessionId={session._id}
                      userId={userProfile.id}
                      astrologer={{ name: session.userId?.name || "User", image: session.userId?.avatar }}
                    />
                  )}
                  {session.sessionType === "call" && (
                    <AudioCall sessionId={session._id} />
                  )}
                  {session.sessionType === "video" && (
                    <VideoCall sessionId={session._id} />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

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
                  <p className="text-white/60 text-sm capitalize">
                    {s.mode === "call" ? "Audio Call" : s.mode === "video" ? "Video Call" : s.mode} consultation
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
