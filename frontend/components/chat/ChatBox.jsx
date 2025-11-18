"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ChatBox({ astrologerId, astrologerName = "Astrologer" }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize WebSocket connection for real-time chat
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        
        // For now, we'll use a simple polling mechanism
        // In production, you'd use WebSocket or Firebase Realtime Database
        await loadMessages();
        
        setIsConnected(true);
      } catch (err) {
        console.error("Error initializing chat:", err);
        setError("Failed to initialize chat");
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();

    // Set up polling for new messages (every 2 seconds)
    const messagePolling = setInterval(loadMessages, 2000);

    return () => {
      if (messagePolling) {
        clearInterval(messagePolling);
      }
    };
  }, [astrologerId]);

  const loadMessages = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/messages?astrologerId=${astrologerId}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    const messageData = {
      astrologerId,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      sender: "user"
    };

    try {
      setIsLoading(true);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        setNewMessage("");
        // Reload messages to get the latest
        await loadMessages();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading && messages.length === 0) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white">Initializing chat...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <h3 className="text-white text-lg font-semibold mb-2">Chat Error</h3>
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
      <CardContent className="p-0">
        {/* Chat Header */}
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/api/placeholder/40/40" />
              <AvatarFallback className="bg-orange-500 text-white">
                {astrologerName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-white font-semibold">{astrologerName}</h3>
              <p className={`text-sm ${isConnected ? 'text-green-400' : 'text-gray-400'}`}>
                {isConnected ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-white/60 py-8">
              <div className="text-4xl mb-2">💬</div>
              <p>Start a conversation with {astrologerName}</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-orange-500 text-white'
                      : 'bg-white/20 text-white'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-orange-100' : 'text-white/60'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-white/20">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="bg-white/10 border-white/30 text-white placeholder-white/60 focus:border-orange-500"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim() || isLoading}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isLoading ? "..." : "Send"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
