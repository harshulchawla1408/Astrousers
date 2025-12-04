"use client";
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSocket } from "@/lib/socketClient";

export default function ChatBox({ sessionId, userId, astrologer }) {
  const { socket, isConnected } = useSocket();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Scroll to bottom
  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [messages]);

  // Load old messages from DB
  useEffect(() => {
    if (!sessionId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${backendUrl}/api/v1/messages/${sessionId}`
        );
        const data = await res.json();
        if (data.success) {
          setMessages(data.messages);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [sessionId, backendUrl]);

  // Join session room and listen for incoming messages
  useEffect(() => {
    if (!socket || !sessionId) return;

    socket.emit("join-session", { sessionId });

    socket.on("message:receive", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit("leave-session", { sessionId });
      socket.off("message:receive");
    };
  }, [socket, sessionId]);

  const sendMessage = () => {
    if (!socket || !newMessage.trim()) return;

    const msgData = {
      sessionId,
      text: newMessage,
    };

    // Emit to backend
    socket.emit("message:send", msgData);

    // UI instant push (optimistic update)
    setMessages((prev) => [
      ...prev,
      {
        text: newMessage,
        fromUserId: userId,
        sessionId,
        timestamp: new Date(),
      },
    ]);

    setNewMessage("");
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  if (loading) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white">Loading chat...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
      <CardContent className="p-0 flex flex-col h-[500px]">

        {/* Chat Header */}
        <div className="p-4 border-b border-white/20 flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={astrologer?.image} />
            <AvatarFallback className="bg-orange-500 text-white">
              {astrologer?.name?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-white font-semibold">{astrologer?.name}</h3>
            <p className="text-sm text-green-400">
              {isConnected ? "Online" : "Connecting..."}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-white/60 pt-12">
              <p>No messages yet. Start chatting!</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isSelf = msg.fromUserId === userId;
              return (
                <div key={idx} className={`flex ${isSelf ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                      isSelf ? "bg-orange-500 text-white" : "bg-white/20 text-white"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Box */}
        <div className="p-4 border-t border-white/20 flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleEnter}
            placeholder="Type a message..."
            className="bg-white/10 border-white/30 text-white placeholder-white/60"
          />
          <Button
            onClick={sendMessage}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
