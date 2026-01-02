"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useSocket } from "@/lib/socketClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ChatBox from "@/components/chat/ChatBox";
import VideoCall from "@/components/agora/VideoCall";
import AudioCall from "@/components/agora/AudioCall";

export default function SessionManager({
  astrologerId,
  astrologerName,
  sessionType,
  pricePerMin
}) {
  const { user, isLoaded } = useUser();
  const { socket, isConnected } = useSocket();

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
    if (!isLoaded || !user) {
      alert("Please sign in to start a session");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${backendUrl}/api/v1/sessions/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,          // clerkId allowed
          astrologerId,
          mode: sessionType
        })
      });

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
    if (!session || !user) return;

    try {
      setLoading(true);

      await fetch(`${backendUrl}/api/v1/sessions/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session._id,
          requesterId: user.id
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
              disabled={loading || !isConnected}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {loading ? "Starting..." : `Start ${sessionType} Session`}
            </Button>
            {error && <p className="text-red-400 text-sm">{error}</p>}
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
            userId={user.id}
            astrologer={{ name: astrologerName }}
          />
        )}

        {sessionType === "audio" && (
          <AudioCall />
        )}

        {sessionType === "video" && (
          <VideoCall />
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