"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useSocket } from "@/lib/socketClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ChatBox from "@/components/chat/ChatBox";
import VideoCall from "@/components/agora/VideoCall";
import AudioCall from "@/components/agora/AudioCall";

export default function SessionManager({ astrologerId, astrologerName, sessionType, pricePerMin }) {
  const { user } = useUser();
  const { socket, isConnected } = useSocket();
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, pending, active, ended
  const [agoraToken, setAgoraToken] = useState(null);
  const [channelName, setChannelName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!socket) return;

    // Listen for session acceptance
    socket.on('session:accepted', (data) => {
      console.log('Session accepted:', data);
      setStatus('active');
      setChannelName(data.channelName);
      fetchAgoraToken(data.channelName);
      setSession({ ...session, status: 'active' });
    });

    // Listen for messages
    socket.on('message:receive', (data) => {
      console.log('Message received:', data);
      // Handle message in chat component
    });

    return () => {
      socket.off('session:accepted');
      socket.off('message:receive');
    };
  }, [socket]);

  const startSession = async () => {
    if (!user) {
      alert('Please sign in to start a session');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = await user.getToken();
      const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '');

      const response = await fetch(`${backendUrl}/api/sessions/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          astrologerId,
          sessionType,
          ratePerMinute: pricePerMin
        })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to start session');
      }

      setSession(data.session);
      setStatus('pending');
      setChannelName(data.session.channelName);

      // Emit session request via socket
      if (socket) {
        socket.emit('session:request', { sessionId: data.session._id });
      }
    } catch (err) {
      console.error('Error starting session:', err);
      setError(err.message || 'Failed to start session');
    } finally {
      setLoading(false);
    }
  };

  const fetchAgoraToken = async (channel) => {
    if (!user) return;

    try {
      const token = await user.getToken();
      const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '');

      const response = await fetch(`${backendUrl}/api/agora/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          channelName: channel,
          uid: user.id
        })
      });

      const data = await response.json();
      if (data.success) {
        setAgoraToken(data.token);
        // Join session room
        if (socket) {
          socket.emit('join-session', { sessionId: session?._id });
        }
      }
    } catch (err) {
      console.error('Error fetching Agora token:', err);
    }
  };

  const endSession = async () => {
    if (!session) return;

    try {
      setLoading(true);
      const token = await user.getToken();
      const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '');

      const response = await fetch(`${backendUrl}/api/sessions/end`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: session._id,
          ratePerMinute: pricePerMin
        })
      });

      const data = await response.json();
      if (data.success) {
        setStatus('ended');
        if (socket) {
          socket.emit('leave-session', { sessionId: session._id });
        }
        alert(`Session ended. Coins used: ${data.coinsUsed}`);
      }
    } catch (err) {
      console.error('Error ending session:', err);
      alert('Failed to end session');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'idle') {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-white text-xl font-semibold">Start {sessionType} Session</h3>
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

  if (status === 'pending') {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <h3 className="text-white text-xl font-semibold">Waiting for Astrologer</h3>
            <p className="text-white/80">Your session request has been sent. Please wait for {astrologerName} to accept.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === 'active') {
    return (
      <div className="space-y-4">
        {sessionType === 'chat' && (
          <ChatBox astrologerId={astrologerId} astrologerName={astrologerName} />
        )}
        {sessionType === 'video' && agoraToken && channelName && (
          <VideoCall
            channelName={channelName}
            astrologerId={astrologerId}
            onEndCall={endSession}
          />
        )}
        {sessionType === 'audio' && agoraToken && channelName && (
          <AudioCall
            channelName={channelName}
            astrologerId={astrologerId}
            onEndCall={endSession}
          />
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

