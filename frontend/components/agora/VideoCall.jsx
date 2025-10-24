"use client";
import React, { useEffect, useState, useRef } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useAgora } from "@/hooks/useAgora";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function VideoCall({ channelName, astrologerId, onEndCall }) {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallActive, setIsCallActive] = useState(false);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const durationInterval = useRef(null);

  const { 
    isConnected, 
    isPublishing, 
    remoteUsers, 
    publishTracks, 
    unpublishTracks, 
    cleanup 
  } = useAgora({ 
    channelName, 
    token,
    onError: (error) => {
      console.error("Agora error:", error);
      setError(error.message || "Connection error occurred");
    }
  });

  useEffect(() => {
    const fetchToken = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/agora/token?channel=${channelName}&uid=${Date.now()}`
        );
        
        if (!response.ok) {
          throw new Error("Failed to get token");
        }
        
        const data = await response.json();
        setToken(data.token);
      } catch (err) {
        console.error("Error fetching token:", err);
        setError("Failed to initialize call");
      } finally {
        setIsLoading(false);
      }
    };

    fetchToken();
  }, [channelName]);

  useEffect(() => {
    if (token && isConnected) {
      startCall();
    }
  }, [token, isConnected]);

  const startCall = async () => {
    try {
      const tracks = await AgoraRTC.createMicrophoneAndCameraTracks(
        { 
          encoderConfig: { 
            sampleRate: 48000, 
            stereo: true, 
            bitrate: 128 
          } 
        },
        { 
          encoderConfig: { 
            width: 640, 
            height: 480, 
            frameRate: 15, 
            bitrate: 1000 
          } 
        }
      );

      // Play local video
      if (localVideoRef.current) {
        tracks[1].play(localVideoRef.current);
      }

      await publishTracks(tracks);
      setIsCallActive(true);
      startDurationTimer();
    } catch (error) {
      console.error("Error starting call:", error);
      setError("Failed to start video call");
    }
  };

  const startDurationTimer = () => {
    durationInterval.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const stopDurationTimer = () => {
    if (durationInterval.current) {
      clearInterval(durationInterval.current);
      durationInterval.current = null;
    }
  };

  const toggleVideo = async () => {
    if (isPublishing) {
      try {
        // Find video track from published tracks
        const videoTrack = localTracks.current.find(track => track.trackMediaType === 'video');
        if (videoTrack) {
          if (isVideoEnabled) {
            await videoTrack.setEnabled(false);
          } else {
            await videoTrack.setEnabled(true);
          }
          setIsVideoEnabled(!isVideoEnabled);
        }
      } catch (error) {
        console.error("Error toggling video:", error);
      }
    }
  };

  const toggleAudio = async () => {
    if (isPublishing) {
      try {
        // Find audio track from published tracks
        const audioTrack = localTracks.current.find(track => track.trackMediaType === 'audio');
        if (audioTrack) {
          if (isAudioEnabled) {
            await audioTrack.setEnabled(false);
          } else {
            await audioTrack.setEnabled(true);
          }
          setIsAudioEnabled(!isAudioEnabled);
        }
      } catch (error) {
        console.error("Error toggling audio:", error);
      }
    }
  };

  const endCall = async () => {
    try {
      stopDurationTimer();
      await unpublishTracks();
      await cleanup();
      setIsCallActive(false);
      if (onEndCall) {
        onEndCall(callDuration);
      }
    } catch (error) {
      console.error("Error ending call:", error);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      stopDurationTimer();
      cleanup();
    };
  }, []);

  if (isLoading) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white">Initializing video call...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <h3 className="text-white text-lg font-semibold mb-2">Call Failed</h3>
          <p className="text-white/80 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-orange-500 hover:bg-orange-600">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-semibold">Video Call</h3>
          <div className="flex items-center space-x-2">
            <span className="text-orange-400 text-sm">Duration: {formatDuration(callDuration)}</span>
            <div className={`w-3 h-3 rounded-full ${isCallActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Local Video */}
          <div className="relative">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div 
                ref={localVideoRef}
                className="w-full h-48 bg-gray-700 flex items-center justify-center"
              >
                {!isVideoEnabled && (
                  <div className="text-white/60 text-center">
                    <div className="text-4xl mb-2">📹</div>
                    <p>Video Off</p>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              You
            </div>
          </div>

          {/* Remote Video */}
          <div className="relative">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div 
                ref={remoteVideoRef}
                id="remote-player"
                className="w-full h-48 bg-gray-700 flex items-center justify-center"
              >
                {remoteUsers.length === 0 ? (
                  <div className="text-white/60 text-center">
                    <div className="text-4xl mb-2">👤</div>
                    <p>Waiting for astrologer...</p>
                  </div>
                ) : (
                  <div className="text-green-400 text-center">
                    <div className="text-4xl mb-2">✅</div>
                    <p>Connected</p>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              Astrologer
            </div>
          </div>
        </div>

        {/* Call Controls */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={toggleAudio}
            variant={isAudioEnabled ? "default" : "destructive"}
            className={`${isAudioEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
          >
            {isAudioEnabled ? '🎤' : '🔇'}
          </Button>
          
          <Button
            onClick={toggleVideo}
            variant={isVideoEnabled ? "default" : "destructive"}
            className={`${isVideoEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
          >
            {isVideoEnabled ? '📹' : '📷'}
          </Button>
          
          <Button
            onClick={endCall}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            📞 End Call
          </Button>
        </div>

        {isCallActive && (
          <div className="mt-4 text-center">
            <p className="text-white/80 text-sm">
              Call is active • {remoteUsers.length > 0 ? 'Connected' : 'Waiting for connection'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
