import { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";

export function useAgora({ channelName, token, onRemoteJoin, onError }) {
  const client = useRef(null);
  const localTracks = useRef([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState([]);

  useEffect(() => {
    if (!channelName || !token) return;

    const initAgora = async () => {
      try {
        // Create Agora client
        client.current = AgoraRTC.createClient({ 
          mode: "rtc", 
          codec: "vp8" 
        });

        // Set up event listeners
        client.current.on("user-published", async (user, mediaType) => {
          console.log("User published:", user, mediaType);
          await client.current.subscribe(user, mediaType);
          
          if (mediaType === "video") {
            const remotePlayer = document.getElementById("remote-player");
            if (remotePlayer) {
              user.videoTrack.play(remotePlayer);
            }
          }
          
          if (mediaType === "audio") {
            user.audioTrack.play();
          }

          setRemoteUsers(prev => [...prev, user]);
          if (onRemoteJoin) onRemoteJoin(user);
        });

        client.current.on("user-unpublished", (user, mediaType) => {
          console.log("User unpublished:", user, mediaType);
          setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
        });

        client.current.on("user-left", (user) => {
          console.log("User left:", user);
          setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
        });

        client.current.on("exception", (event) => {
          console.error("Agora exception:", event);
          if (onError) onError(event);
        });

        // Join the channel
        await client.current.join(
          process.env.NEXT_PUBLIC_AGORA_APP_ID,
          channelName,
          token,
          null
        );

        setIsConnected(true);
        console.log("Successfully joined channel:", channelName);

      } catch (error) {
        console.error("Error initializing Agora:", error);
        if (onError) onError(error);
      }
    };

    initAgora();

    return () => {
      cleanup();
    };
  }, [channelName, token]);

  const publishTracks = async (tracks) => {
    if (!client.current || !isConnected) return;

    try {
      localTracks.current = tracks;
      await client.current.publish(tracks);
      setIsPublishing(true);
      console.log("Successfully published tracks");
    } catch (error) {
      console.error("Error publishing tracks:", error);
      if (onError) onError(error);
    }
  };

  const unpublishTracks = async () => {
    if (!client.current || !isPublishing) return;

    try {
      await client.current.unpublish(localTracks.current);
      setIsPublishing(false);
      console.log("Successfully unpublished tracks");
    } catch (error) {
      console.error("Error unpublishing tracks:", error);
      if (onError) onError(error);
    }
  };

  const cleanup = async () => {
    try {
      if (localTracks.current.length > 0) {
        localTracks.current.forEach(track => {
          track.close();
        });
        localTracks.current = [];
      }

      if (client.current) {
        await client.current.leave();
        client.current = null;
      }

      setIsConnected(false);
      setIsPublishing(false);
      setRemoteUsers([]);
      console.log("Agora cleanup completed");
    } catch (error) {
      console.error("Error during cleanup:", error);
    }
  };

  return {
    client: client.current,
    isConnected,
    isPublishing,
    remoteUsers,
    publishTracks,
    unpublishTracks,
    cleanup
  };
}
