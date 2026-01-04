"use client";
import { io } from "socket.io-client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

let socketInstance = null;
let subscriberCount = 0;

const getBackendUrl = () =>
  (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");

const createSocket = () => {
  const socket = io(getBackendUrl(), {
    auth: {},
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    autoConnect: false,
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Socket disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.error("🔥 Socket connection error:", err.message);
  });

  return socket;
};

const ensureSocket = () => {
  if (!socketInstance) {
    socketInstance = createSocket();
  }
  return socketInstance;
};

export const connectSocket = (clerkId) => {
  if (!clerkId) {
    throw new Error("clerkId is required to connect socket");
  }

  const socket = ensureSocket();

  if (socket.auth?.clerkId !== clerkId) {
    socket.auth = { clerkId };
  }

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.removeAllListeners();
    socketInstance.disconnect();
    socketInstance = null;
  }
};

export const useSocket = (shouldConnect = true) => {
  const { user, isLoaded } = useUser();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user || !shouldConnect) return;

    const activeSocket = connectSocket(user.id);
    subscriberCount += 1;
    setSocket(activeSocket);
    setIsConnected(activeSocket.connected);

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    activeSocket.on("connect", handleConnect);
    activeSocket.on("disconnect", handleDisconnect);

    return () => {
      activeSocket.off("connect", handleConnect);
      activeSocket.off("disconnect", handleDisconnect);
      subscriberCount = Math.max(0, subscriberCount - 1);
      if (subscriberCount === 0) {
        disconnectSocket();
      }
      setSocket(null);
      setIsConnected(false);
    };
  }, [isLoaded, user, shouldConnect]);

  return { socket, isConnected };
};
