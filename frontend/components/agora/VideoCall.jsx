"use client";
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useAgora } from "@/hooks/useAgora";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function VideoCall() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get("sessionId");
  const token = searchParams.get("token");
  const channelName = searchParams.get("channelName");
  const uid = searchParams.get("uid");
  const appId = searchParams.get("appId");

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

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
      const [micTrack, camTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();

      camTrack.play(localVideoRef.current);

      await publishTracks([micTrack, camTrack]);
      startTimer();
    } catch (err) {
      console.error("Video call start error:", err);
    }
  };

  const startTimer = () => {
    durationInterval.current = setInterval(
      () => setCallDuration((p) => p + 1),
      1000
    );
  };

  const stopTimer = () => {
    if (durationInterval.current) {
      clearInterval(durationInterval.current);
      durationInterval.current = null;
    }
  };

  const toggleAudio = async () => {
    const mic = localTracks.current.find((t) => t.trackMediaType === "audio");
    if (!mic) return;
    await mic.setEnabled(!isAudioEnabled);
    setIsAudioEnabled((p) => !p);
  };

  const toggleVideo = async () => {
    const cam = localTracks.current.find((t) => t.trackMediaType === "video");
    if (!cam) return;
    await cam.setEnabled(!isVideoEnabled);
    setIsVideoEnabled((p) => !p);
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

  const format = (sec) =>
    `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2,"0")}`;

  useEffect(() => () => cleanup(), []);

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

        <div className="flex justify-center space-x-4">
          <Button
            onClick={toggleAudio}
            className={`${isAudioEnabled ? "bg-green-600" : "bg-red-600"} text-white`}
          >
            {isAudioEnabled ? "Mute" : "Unmute"}
          </Button>

          <Button
            onClick={toggleVideo}
            className={`${isVideoEnabled ? "bg-green-600" : "bg-red-600"} text-white`}
          >
            {isVideoEnabled ? "Camera Off" : "Camera On"}
          </Button>

          <Button onClick={endCall} className="bg-red-500 text-white">
            End Call
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
