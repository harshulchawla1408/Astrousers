"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useAgora } from "@/hooks/useAgora";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";

export default function VideoCall({ sessionId }) {
  const router = useRouter();
  const { getToken } = useAuth();

  const [token, setToken] = useState(null);
  const [channelName, setChannelName] = useState(null);
  const [uid, setUid] = useState(null);
  const [appId, setAppId] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallActive, setIsCallActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEnding, setIsEnding] = useState(false);

  const durationInterval = useRef(null);
  const billingInterval = useRef(null);

  const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");

  // Fetch Agora token when component mounts
  useEffect(() => {
    const fetchToken = async () => {
      if (!sessionId) return;

      try {
        const authToken = await getToken();
        if (!authToken) {
          console.error("No auth token available");
          setLoading(false);
          return;
        }

        const res = await fetch(`${backendUrl}/api/v1/agora/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`
          },
          body: JSON.stringify({ sessionId })
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          let errorMessage = errorData.message || `Failed to fetch Agora token (${res.status})`;
          
          // Provide user-friendly error messages
          if (errorMessage.includes("configuration missing") || errorMessage.includes("Agora configuration")) {
            errorMessage = "Server configuration error. Please contact support.";
            console.error("Agora configuration missing on server. Check backend .env file for AGORA_APP_ID and AGORA_APP_CERTIFICATE");
          } else if (errorMessage.includes("Session not active")) {
            errorMessage = "Waiting for astrologer to accept the session...";
          }
          
          console.error("Agora token fetch failed:", errorMessage);
          throw new Error(errorMessage);
        }

        const data = await res.json();
        if (data.success) {
          setToken(data.token);
          setChannelName(data.channelName);
          setUid(data.uid);
          setAppId(data.appId);
        } else {
          throw new Error(data.message || "Failed to get Agora token");
        }
      } catch (err) {
        console.error("Error fetching Agora token:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, [sessionId, getToken]);

  const {
    isConnected,
    remoteUsers,
    localTracks,
    publishTracks,
    unpublishTracks,
    cleanup
  } = useAgora({
    channelName,
    token,
    uid,
    appId,
    onError: (err) => console.error("Agora error:", err)
  });

  useEffect(() => {
    if (token && channelName && uid && appId && isConnected && !isCallActive && !loading) {
      startCall();
    }
  }, [token, channelName, uid, appId, isConnected, loading, isCallActive]);

  useEffect(() => {
    remoteUsers.forEach(user => {
      user.videoTrack?.play(remoteVideoRef.current);
    });
  }, [remoteUsers]);

  const startCall = async () => {
    if (typeof window === "undefined") {
      console.error("Window is undefined - cannot start call");
      return;
    }
    try {
      // Dynamically import Agora SDK only on client side
      const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
      const [micTrack, camTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      camTrack.play(localVideoRef.current);
      await publishTracks([micTrack, camTrack]);
      setIsCallActive(true);
      setIsAudioEnabled(true);
      setIsVideoEnabled(true);

      durationInterval.current = setInterval(() => {
        setCallDuration(p => p + 1);
      }, 1000);

      billingInterval.current = setInterval(() => {
        // Optional billing endpoint - don't block if it fails
        fetch(`${backendUrl}/api/v1/sessions/billing`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId })
        }).catch(err => console.warn("Billing endpoint not available:", err));
      }, 60000);
    } catch (err) {
      console.error("Video call start error:", err);
    }
  };

  const toggleAudio = async () => {
    if (!isCallActive || !localTracks.current?.length) return;
    const mic = localTracks.current.find(t => t.trackMediaType === "audio");
    if (!mic) return;
    const nextState = !isAudioEnabled;
    await mic.setEnabled(nextState);
    setIsAudioEnabled(nextState);
  };

  const toggleVideo = async () => {
    if (!isCallActive || !localTracks.current?.length) return;
    const cam = localTracks.current.find(t => t.trackMediaType === "video");
    if (!cam) return;
    const nextState = !isVideoEnabled;
    await cam.setEnabled(nextState);
    setIsVideoEnabled(nextState);
  };

  const endCall = async () => {
    if (isEnding) return;
    try {
      setIsEnding(true);
      clearInterval(durationInterval.current);
      clearInterval(billingInterval.current);

      const authToken = await getToken();
      const headers = { "Content-Type": "application/json" };
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }

      await fetch(`${backendUrl}/api/v1/sessions/end`, {
        method: "POST",
        headers,
        body: JSON.stringify({ sessionId })
      });

      await unpublishTracks();
      await cleanup();
      setIsCallActive(false);

      const query = new URLSearchParams({
        sessionId: sessionId || "",
        duration: String(callDuration || 0)
      }).toString();

      if (typeof window !== "undefined") {
        const target = `/call-ended?${query}`;
        if (router) {
          router.replace(target);
        } else {
          window.location.href = target;
        }
      }
    } catch (err) {
      console.error("End call error:", err);
    } finally {
      setIsEnding(false);
    }
  };

  const format = (sec) =>
    `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

  useEffect(() => {
    return () => {
      clearInterval(durationInterval.current);
      clearInterval(billingInterval.current);
      cleanup();
    };
  }, []);

  if (loading) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-6">
          <div className="text-center text-white">Loading video call...</div>
        </CardContent>
      </Card>
    );
  }

  if (!token || !channelName) {
    if (!loading) {
      return (
        <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <div className="text-red-400 font-medium">Failed to initialize call</div>
              <div className="text-white/60 text-sm">
                Waiting for session to be accepted by astrologer...
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-6">
          <div className="text-center text-white">Loading video call...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
      <CardContent className="p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-white text-xl font-bold">Video Call</h2>
          <div className="text-orange-400">⏱ {format(callDuration)}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div ref={localVideoRef} className="bg-black rounded-lg h-48" />
          <div ref={remoteVideoRef} className="bg-gray-800 rounded-lg h-48">
            {!remoteUsers.length && (
              <p className="text-white/60 text-center pt-16">Waiting...</p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            onClick={toggleAudio}
            disabled={!isCallActive || isEnding}
            className={`flex items-center gap-2 px-6 ${
              isAudioEnabled ? "bg-green-600 hover:bg-green-500" : "bg-red-600 hover:bg-red-500"
            } text-white disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            <span>{isAudioEnabled ? "Mute Mic" : "Unmute Mic"}</span>
          </Button>
          <Button
            onClick={toggleVideo}
            disabled={!isCallActive || isEnding}
            className={`flex items-center gap-2 px-6 ${
              isVideoEnabled ? "bg-green-600 hover:bg-green-500" : "bg-red-600 hover:bg-red-500"
            } text-white disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            <span>{isVideoEnabled ? "Camera Off" : "Camera On"}</span>
          </Button>
          <Button
            onClick={endCall}
            disabled={isEnding}
            className="flex items-center gap-2 px-6 bg-red-500 hover:bg-red-600 text-white disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <PhoneOff className="h-4 w-4" />
            <span>{isEnding ? "Ending..." : "End Call"}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}