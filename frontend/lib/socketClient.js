"use client";
import { io } from "socket.io-client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";

let socketInstance = null;

export const getSocket = (clerkId) => {
  if (socketInstance && socketInstance.connected) {
    return socketInstance;
  }

  const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");

  socketInstance = io(backendUrl, {
    auth: {
      clerkId, // ✅ FIXED (was token earlier)
    },
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socketInstance.on("connect", () => {
    console.log("✅ Socket connected:", socketInstance.id);
  });

  socketInstance.on("disconnect", () => {
    console.log("❌ Socket disconnected");
  });

  socketInstance.on("connect_error", (err) => {
    console.error("🔥 Socket connection error:", err.message);
  });

  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

// React hook
export const useSocket = () => {
  const { user, isLoaded } = useUser();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (!isLoaded || !user || initialized.current) return;

    const socket = getSocket(user.id);
    initialized.current = true;
    setSocket(socket);

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [isLoaded, user]);

  return { socket, isConnected };
};
