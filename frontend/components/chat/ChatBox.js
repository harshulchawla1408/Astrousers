"use client";
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSocket } from "@/lib/socketClient";

export default function ChatBox({ sessionId, userId, astrologer }) {
  const { socket, isConnected } = useSocket(true);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const backend = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (!sessionId) return;

    fetch(`${backend}/api/v1/chat/${sessionId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMessages(data.messages || []);
        }
      })
      .catch(err => console.error("Failed to load chat history:", err));
  }, [sessionId]);

  useEffect(() => {
    if (!socket || !sessionId) return;

    socket.emit("session:join", { sessionId });

    socket.on("message:receive", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.emit("session:leave", { sessionId });
      socket.off("message:receive");
    };
  }, [socket, sessionId]);

  const sendMessage = () => {
    if (!socket || !newMessage.trim()) return;

    socket.emit("message:send", {
      sessionId,
      text: newMessage
    });

    setNewMessage("");
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
      <CardContent className="p-0 flex flex-col h-[500px]">
        <div className="p-4 border-b border-white/20 flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={astrologer?.image} />
            <AvatarFallback>{astrologer?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-white font-semibold">{astrologer?.name}</h3>
            <p className="text-sm text-green-400">
              {isConnected ? "Online" : "Connecting..."}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => {
            // Support both message formats: fromUserId (legacy) and senderId (new)
            const isSelf = (msg.fromUserId === userId || msg.senderId === userId || (typeof msg.senderId === 'object' && msg.senderId?._id === userId));
            return (
              <div key={idx} className={`flex ${isSelf ? "justify-end" : "justify-start"}`}>
                <div className={`px-4 py-2 rounded-lg ${
                  isSelf ? "bg-orange-500 text-white" : "bg-white/20 text-white"
                }`}>
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-white/20 flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="bg-white/10 border-white/30 text-white"
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </CardContent>
    </Card>
  );
}