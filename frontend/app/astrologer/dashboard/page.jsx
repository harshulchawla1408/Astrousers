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
  const [loading, setLoading] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  // Fetch astrologer data
  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchAstrologerData = async () => {
      try {
        // Check if user is astrologer
        const checkRes = await fetch(`${backendUrl}/api/v1/astrologers/check/${user.id}`);
        const checkData = await checkRes.json();
        
        if (checkData.exists && checkData.astrologer) {
          // Fetch full astrologer data
          const res = await fetch(`${backendUrl}/api/v1/astrologers/${checkData.astrologer._id}`);
          const data = await res.json();
          
          if (data.success) {
            setAstrologerData(data.data);
            setIsOnline(data.data.online || false);
            setAvailability(data.data.availability || { chat: true, call: true, video: false });
          }
        }
      } catch (error) {
        console.error('Error fetching astrologer data:', error);
      }
    };

    fetchAstrologerData();
  }, [isLoaded, user, backendUrl]);

  // Fetch today's earnings and active sessions
  useEffect(() => {
    if (!astrologerData) return;

    const fetchSessionData = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/v1/sessions/astrologer/${astrologerData._id}`);
        const data = await res.json();
        
        if (data.success) {
          const sessions = data.sessions || [];
          const active = sessions.filter(s => s.status === 'active');
          setActiveSessions(active);

          // Calculate today's earnings
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const todaySessions = sessions.filter(s => {
            const sessionDate = new Date(s.endTime || s.startTime);
            return sessionDate >= today && s.status === 'ended';
          });
          
          const earnings = todaySessions.reduce((sum, s) => sum + (s.coinsUsed || 0), 0);
          setTodayEarnings(earnings);
        }
      } catch (error) {
        console.error('Error fetching session data:', error);
      }
    };

    fetchSessionData();
    const interval = setInterval(fetchSessionData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [astrologerData, backendUrl]);

  // Listen for incoming session requests
  useEffect(() => {
    if (!socket) return;

    socket.on('incoming_request', (data) => {
      console.log('New session request:', data);
      setPendingSessions((prev) => {
        // Avoid duplicates
        if (prev.find(s => s.sessionId === data.sessionId)) return prev;
        return [...prev, data];
      });
    });

    socket.on('session:accepted', (data) => {
      setPendingSessions((prev) => prev.filter(s => s.sessionId !== data.sessionId));
    });

    return () => {
      socket.off('incoming_request');
      socket.off('session:accepted');
    };
  }, [socket]);

  const toggleOnlineStatus = async () => {
    if (!user || !astrologerData) return;

    try {
      setLoading(true);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const endpoint = isOnline ? 'offline' : 'online';
      
      const response = await fetch(`${backendUrl}/api/v1/astrologers/${astrologerData._id}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        }
      });

      const data = await response.json();
      if (data.success) {
        setIsOnline(!isOnline);
        // Update astrologer data
        setAstrologerData(prev => ({ ...prev, online: !isOnline }));
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

  const updateAvailability = async (field, value) => {
    if (!user || !astrologerData) return;

    const newAvailability = { ...availability, [field]: value };
    setAvailability(newAvailability);

    try {
      const response = await fetch(`${backendUrl}/api/v1/astrologers/${astrologerData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({ availability: newAvailability })
      });

      const data = await response.json();
      if (!data.success) {
        // Revert on error
        setAvailability(availability);
        alert(data.message || 'Failed to update availability');
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      setAvailability(availability);
      alert('Failed to update availability');
    }
  };

  const acceptSession = async (sessionData) => {
    if (!user || !socket) return;

    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/v1/sessions/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({ 
          sessionId: sessionData.sessionId,
          astrologerClerkId: user.id
        })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to accept session');
      }

      // Emit socket event
      socket.emit('session:accept', { sessionId: sessionData.sessionId });
      socket.emit('join-session', { sessionId: sessionData.sessionId });

      // Remove from pending, add to active
      setPendingSessions((prev) => prev.filter(s => s.sessionId !== sessionData.sessionId));
      setActiveSessions((prev) => [...prev, { ...sessionData, status: 'active' }]);

      // If call mode, get Agora token
      if (sessionData.mode === 'audio' || sessionData.mode === 'video') {
        const tokenRes = await fetch(`${backendUrl}/api/v1/agora/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': user.id
          },
          body: JSON.stringify({
            channelName: sessionData.channelName,
            uid: user.id,
            role: 'publisher'
          })
        });

        const tokenData = await tokenRes.json();
        if (tokenData.success) {
          // Emit token to user via socket
          socket.emit('agora:token', {
            sessionId: sessionData.sessionId,
            token: tokenData.token,
            appId: tokenData.appId,
            channelName: tokenData.channelName
          });
        }
      }

      alert(`Session accepted!`);
    } catch (error) {
      console.error('Error accepting session:', error);
      alert(error.message || 'Failed to accept session');
    } finally {
      setLoading(false);
    }
  };

  const rejectSession = async (sessionId) => {
    if (!user) return;

    try {
      const response = await fetch(`${backendUrl}/api/v1/sessions/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({ 
          sessionId,
          astrologerClerkId: user.id
        })
      });

      const data = await response.json();
      if (data.success) {
        setPendingSessions((prev) => prev.filter(s => s.sessionId !== sessionId));
        if (socket) {
          socket.emit('session:reject', { sessionId });
        }
      }
    } catch (error) {
      console.error('Error rejecting session:', error);
    }
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

        {/* Online Status & Availability */}
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
                disabled={loading || !isConnected}
                className={`${
                  isOnline
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                } text-white`}
              >
                {loading ? "Updating..." : isOnline ? "Go Offline" : "Go Online"}
              </Button>
            </div>

            <div>
              <p className="text-white/80 mb-3">Availability</p>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={availability.chat}
                    onChange={(e) => updateAvailability('chat', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-white">Chat</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={availability.call}
                    onChange={(e) => updateAvailability('call', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-white">Audio Call</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={availability.video}
                    onChange={(e) => updateAvailability('video', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-white">Video Call</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Incoming Requests */}
        <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white text-xl">
              Incoming Requests ({pendingSessions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                            Type: {session.mode || session.sessionType}
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
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

