"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useUser, useAuth } from "@clerk/nextjs";
import { useSocket } from "@/lib/socketClient";
import { useUserContext } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ChatBox from "@/components/chat/ChatBox";

// Dynamically import Agora components with SSR disabled (they use window object)
const VideoCall = dynamic(() => import("@/components/agora/VideoCall"), {
  ssr: false,
  loading: () => (
    <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
      <CardContent className="p-6">
        <div className="text-center text-white">Loading video call...</div>
      </CardContent>
    </Card>
  )
});

const AudioCall = dynamic(() => import("@/components/agora/AudioCall"), {
  ssr: false,
  loading: () => (
    <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
      <CardContent className="p-6">
        <div className="text-center text-white">Loading audio call...</div>
      </CardContent>
    </Card>
  )
});

export default function SessionManager({
  astrologerId,
  astrologerName,
  sessionType,
  pricePerMin
}) {
  const { user: clerkUser, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { socket, isConnected } = useSocket();
  const { user } = useUserContext(); // MongoDB user from context

  const [session, setSession] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | pending | active | ended
  const [channelName, setChannelName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const backendUrl =
    (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");

  /* ---------------------------------------------------
     SOCKET LISTENERS
  --------------------------------------------------- */
  useEffect(() => {
    if (!socket) return;

    // Astrologer accepted session
    const onAccepted = (data) => {
      if (!data?.sessionId) return;

      setStatus("active");
      setChannelName(data.channelName);
      setSession((prev) => ({
        ...prev,
        status: "active"
      }));

      socket.emit("session:join", { sessionId: data.sessionId });
    };

    socket.on("session:accepted", onAccepted);

    return () => {
      socket.off("session:accepted", onAccepted);
    };
  }, [socket]);

  /* ---------------------------------------------------
     START SESSION (USER → ASTROLOGER)
  --------------------------------------------------- */
  const startSession = async () => {
    if (!isLoaded || !clerkUser || !user) {
      alert("Please sign in to start a session");
      return;
    }

    // Don't block on socket connection - it will connect asynchronously
    // The session creation will work even if socket isn't connected yet
    // Socket connection is mainly for real-time updates

    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      if (!token) {
        throw new Error("Authentication token not available. Please sign in again.");
      }

      const res = await fetch(`${backendUrl}/api/v1/sessions/start`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          astrologerId,
          mode: sessionType === "audio" ? "call" : sessionType // Map "audio" to "call" for backend
        })
      });

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const json = await res.json();
          throw new Error(json.message || "Failed to start session");
        } else {
          const text = await res.text();
          throw new Error(text || "Failed to start session");
        }
      }

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || "Failed to start session");
      }

      setSession(json.session);
      setStatus("pending");
      setChannelName(json.session.channelName);
    } catch (err) {
      console.error("Start session error:", err);
      setError(err.message || "Failed to start session");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------------
     END SESSION
  --------------------------------------------------- */
  const endSession = async () => {
    if (!session || !clerkUser) return;

    try {
      setLoading(true);

      const token = await getToken();
      if (!token) {
        alert("Authentication token not available. Please sign in again.");
        return;
      }

      await fetch(`${backendUrl}/api/v1/sessions/end`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          sessionId: session._id
        })
      });

      if (socket) {
        socket.emit("session:leave", { sessionId: session._id });
      }

      setStatus("ended");
    } catch (err) {
      console.error("End session error:", err);
      alert("Failed to end session");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------------
     UI STATES (UNCHANGED)
  --------------------------------------------------- */
  if (status === "idle") {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-white text-xl font-semibold">
              Start {sessionType} Session
            </h3>
            <p className="text-white/80">Connect with {astrologerName}</p>
            <Button
              onClick={startSession}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Starting..." : `Start ${sessionType} Session`}
            </Button>
            {!isConnected && (
              <p className="text-yellow-400 text-sm">
                ⚠️ Connecting to server... Session will still work
              </p>
            )}
            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-3">
                <p className="text-red-400 text-sm font-medium">Error:</p>
                <p className="text-red-300 text-sm">{error}</p>
                {(error.includes("balance") || error.includes("Insufficient")) && (
                  <a 
                    href="/wallet" 
                    className="text-yellow-300 text-sm underline mt-2 inline-block"
                  >
                    → Recharge Wallet
                  </a>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === "pending") {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <h3 className="text-white text-xl font-semibold">
              Waiting for Astrologer
            </h3>
            <p className="text-white/80">
              Your request has been sent. Please wait for {astrologerName}.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === "active" && session) {
    return (
      <div className="space-y-4">
        {sessionType === "chat" && (
          <ChatBox
            sessionId={session._id}
            userId={user?.id}
            astrologer={{ name: astrologerName }}
          />
        )}

        {sessionType === "audio" && (
          <AudioCall sessionId={session._id} />
        )}

        {sessionType === "video" && (
          <VideoCall sessionId={session._id} />
        )}

        <Button
          onClick={endSession}
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 text-white"
        >
          End Session
        </Button>
      </div>
    );
  }

  return null;
}