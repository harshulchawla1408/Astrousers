"use client";
import { io } from "socket.io-client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";

let socketInstance = null;

export const getSocket = (token) => {
  if (socketInstance && socketInstance.connected) {
    return socketInstance;
  }

  const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '');
  
  socketInstance = io(backendUrl, {
    auth: {
      token: token
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5
  });

  socketInstance.on('connect', () => {
    console.log('✅ Socket connected:', socketInstance.id);
  });

  socketInstance.on('disconnect', () => {
    console.log('❌ Socket disconnected');
  });

  socketInstance.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

// React hook for socket connection
export const useSocket = () => {
  const { user, isLoaded } = useUser();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const tokenRef = useRef(null);

  useEffect(() => {
    if (!isLoaded || !user) {
      return;
    }

    const connectSocket = async () => {
      try {
        const token = await user.getToken();
        tokenRef.current = token;
        const socketInstance = getSocket(token);
        setSocket(socketInstance);

        socketInstance.on('connect', () => {
          setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
          setIsConnected(false);
        });
      } catch (error) {
        console.error('Error getting token for socket:', error);
      }
    };

    connectSocket();

    return () => {
      if (socketInstance) {
        socketInstance.off('connect');
        socketInstance.off('disconnect');
      }
    };
  }, [isLoaded, user]);

  return { socket, isConnected };
};

