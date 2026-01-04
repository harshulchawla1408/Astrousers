import { useEffect, useRef, useState } from "react";

export function useAgora({ channelName, token, uid, appId, onError }) {
  const clientRef = useRef(null);
  const localTracks = useRef([]);
  const [isConnected, setIsConnected] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState([]);

  useEffect(() => {
    if (!channelName || !token || !appId || typeof window === "undefined") return;

    const init = async () => {
      try {
        // Dynamically import Agora SDK only on client side
        const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
        clientRef.current = AgoraRTC.createClient({
          mode: "rtc",
          codec: "vp8",
        });

        const client = clientRef.current;

        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);

          if (mediaType === "video" && user.videoTrack) {
            user.videoTrack.play(`remote-video-${user.uid}`);
          }

          if (mediaType === "audio" && user.audioTrack) {
            user.audioTrack.play();
          }

          setRemoteUsers((prev) =>
            prev.some((u) => u.uid === user.uid) ? prev : [...prev, user]
          );
        });

        client.on("user-left", (user) => {
          setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
        });

        await client.join(appId, channelName, token, uid || null);
        setIsConnected(true);
      } catch (err) {
        console.error("Agora init error:", err);
        onError?.(err);
      }
    };

    init();

    return () => cleanup();
  }, [channelName, token, uid, appId]);

  const publishTracks = async (tracks) => {
    if (!clientRef.current) return;
    localTracks.current = tracks;
    await clientRef.current.publish(tracks);
  };

  const unpublishTracks = async () => {
    if (!clientRef.current) return;
    await clientRef.current.unpublish(localTracks.current);
  };

  const cleanup = async () => {
    try {
      localTracks.current.forEach((t) => t.close());
      localTracks.current = [];

      if (clientRef.current) {
        await clientRef.current.leave();
        clientRef.current.removeAllListeners();
        clientRef.current = null;
      }

      setIsConnected(false);
      setRemoteUsers([]);
    } catch (err) {
      console.error("Agora cleanup error:", err);
    }
  };

  return {
    isConnected,
    remoteUsers,
    localTracks,
    publishTracks,
    unpublishTracks,
    cleanup,
  };
}
