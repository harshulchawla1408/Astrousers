"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useSocket } from "@/lib/socketClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AstrologerDashboard() {
  const { user, isLoaded } = useUser();
  const { socket, isConnected } = useSocket();
  const [isOnline, setIsOnline] = useState(false);
  const [pendingSessions, setPendingSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user || !socket) return;

    // Listen for session requests
    socket.on('session:request', (data) => {
      console.log('New session request:', data);
      setPendingSessions((prev) => [...prev, data]);
    });

    // Cleanup
    return () => {
      socket.off('session:request');
    };
  }, [isLoaded, user, socket]);

  const toggleOnlineStatus = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const token = await user.getToken();
      const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '');
      const endpoint = isOnline ? 'offline' : 'online';
      
      // Use clerkId for the endpoint
      const response = await fetch(`${backendUrl}/api/v1/astrologers/${user.id}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setIsOnline(!isOnline);
        // Emit socket event
        if (socket) {
          socket.emit(isOnline ? 'presence:off' : 'presence:on');
        }
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error toggling online status:', error);
      alert('Failed to update online status');
    } finally {
      setLoading(false);
    }
  };

  const acceptSession = async (sessionData) => {
    if (!user || !socket) return;

    try {
      setLoading(true);
      const token = await user.getToken();
      const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '');

      // Accept session
      const acceptResponse = await fetch(`${backendUrl}/api/sessions/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionId: sessionData.sessionId })
      });

      const acceptData = await acceptResponse.json();
      if (!acceptData.success) {
        throw new Error(acceptData.message || 'Failed to accept session');
      }

      // Get Agora token
      const tokenResponse = await fetch(`${backendUrl}/api/agora/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          channelName: sessionData.channelName,
          uid: user.id
        })
      });

      const tokenData = await tokenResponse.json();
      if (!tokenData.success) {
        throw new Error('Failed to get Agora token');
      }

      // Join session room
      socket.emit('join-session', { sessionId: sessionData.sessionId });

      // Remove from pending
      setPendingSessions((prev) => prev.filter(s => s.sessionId !== sessionData.sessionId));

      alert(`Session accepted! Channel: ${sessionData.channelName}`);
      // Here you would open the chat/Agora interface
    } catch (error) {
      console.error('Error accepting session:', error);
      alert(error.message || 'Failed to accept session');
    } finally {
      setLoading(false);
    }
  };

  const rejectSession = (sessionId) => {
    setPendingSessions((prev) => prev.filter(s => s.sessionId !== sessionId));
  };

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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Header />
        <div className="flex justify-center items-center min-h-[60vh]">
          <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <p className="text-white text-lg">Please sign in to access the dashboard</p>
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
        <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Astrologer Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Connection Status */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80">Socket Status:</p>
                <Badge variant={isConnected ? "default" : "destructive"}>
                  {isConnected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
              <div>
                <p className="text-white/80">Online Status:</p>
                <Badge variant={isOnline ? "default" : "secondary"}>
                  {isOnline ? "Online" : "Offline"}
                </Badge>
              </div>
            </div>

            {/* Toggle Online Button */}
            <Button
              onClick={toggleOnlineStatus}
              disabled={loading || !isConnected}
              className={`w-full ${
                isOnline
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              } text-white`}
            >
              {loading ? "Updating..." : isOnline ? "Go Offline" : "Go Online"}
            </Button>

            {/* Pending Sessions */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">
                Pending Session Requests ({pendingSessions.length})
              </h3>
              {pendingSessions.length === 0 ? (
                <p className="text-white/60">No pending session requests</p>
              ) : (
                <div className="space-y-3">
                  {pendingSessions.map((session) => (
                    <Card key={session.sessionId} className="bg-white/5 border-white/20">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">
                              {session.userName || session.userId}
                            </p>
                            <p className="text-white/60 text-sm">
                              Type: {session.sessionType}
                            </p>
                            <p className="text-white/60 text-xs">
                              Channel: {session.channelName}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => acceptSession(session)}
                              disabled={loading}
                              className="bg-green-500 hover:bg-green-600 text-white"
                              size="sm"
                            >
                              Accept
                            </Button>
                            <Button
                              onClick={() => rejectSession(session.sessionId)}
                              disabled={loading}
                              variant="destructive"
                              size="sm"
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

