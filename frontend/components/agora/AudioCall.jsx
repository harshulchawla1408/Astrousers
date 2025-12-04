"use client";
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useAgora } from "@/hooks/useAgora";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AudioCall() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get("sessionId");
  const token = searchParams.get("token");
  const channelName = searchParams.get("channelName");
  const uid = searchParams.get("uid");
  const appId = searchParams.get("appId");
  const role = searchParams.get("role") || "user";

  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallActive, setIsCallActive] = useState(false);

  const durationInterval = useRef(null);

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
    if (token && isConnected) startCall();
  }, [token, isConnected]);

  const startCall = async () => {
    try {
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      await publishTracks([audioTrack]);

      setIsCallActive(true);
      startTimer();
    } catch (err) {
      console.error("Audio call start error:", err);
    }
  };

  const startTimer = () => {
    durationInterval.current = setInterval(() => {
      setCallDuration((p) => p + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (durationInterval.current) {
      clearInterval(durationInterval.current);
      durationInterval.current = null;
    }
  };

  const toggleAudio = async () => {
    const micTrack = localTracks.current.find((t) => t.trackMediaType === "audio");
    if (!micTrack) return;

    await micTrack.setEnabled(!isAudioEnabled);
    setIsAudioEnabled((p) => !p);
  };

  const endCall = async () => {
    try {
      stopTimer();
      await unpublishTracks();
      await cleanup();

      router.replace(`/session-ended?sessionId=${sessionId}&duration=${callDuration}`);
    } catch (err) {
      console.error("End call error:", err);
    }
  };

  const format = (sec) => `${String(Math.floor(sec / 60)).padStart(2,"0")}:${String(sec%60).padStart(2,"0")}`;

  useEffect(() => () => cleanup(), []);

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-xl font-bold">Audio Call</h2>
          <div className="text-orange-400">⏱ {format(callDuration)}</div>
        </div>

        <div className="text-center mb-8">
          <div className="mx-auto w-28 h-28 rounded-full bg-orange-500/20 flex items-center justify-center">
            <span className="text-4xl">🎧</span>
          </div>
          <p className="text-white/80 mt-3">
            {remoteUsers.length ? "Connected" : "Waiting for other user..."}
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            onClick={toggleAudio}
            className={`${isAudioEnabled ? "bg-green-600" : "bg-red-600"} text-white`}
          >
            {isAudioEnabled ? "Mute" : "Unmute"}
          </Button>
          <Button onClick={endCall} className="bg-red-500 text-white">
            End Call
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
