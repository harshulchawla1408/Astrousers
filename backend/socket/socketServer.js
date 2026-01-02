import { Server } from "socket.io";
import User from "../models/user.js";
import Astrologer from "../models/astrologerModel.js";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*", credentials: true },
  });

  io.on("connection", async (socket) => {
    try {
      const clerkId = socket.handshake.auth?.clerkId;
      if (!clerkId) return socket.disconnect();

      const user = await User.findOne({ clerkId });
      if (!user) return socket.disconnect();

      socket.userId = user._id.toString();
      socket.role = user.role; // "user" | "astrologer"

      socket.join(`user:${socket.userId}`);

      console.log("⚡ Connected:", user.name, socket.role);

      /*
      ================================
      ASTROLOGER MANUAL ONLINE/OFFLINE
      ================================
      */
      socket.on("astrologer:go-online", async () => {
        if (socket.role !== "astrologer") return;

        await Astrologer.findOneAndUpdate(
          { userId: socket.userId },
          { isOnline: true, socketId: socket.id }
        );

        broadcastOnlineAstrologers();
      });

      socket.on("astrologer:go-offline", async () => {
        if (socket.role !== "astrologer") return;

        await Astrologer.findOneAndUpdate(
          { userId: socket.userId },
          { isOnline: false, socketId: null }
        );

        broadcastOnlineAstrologers();
      });

      /*
      ================================
      SESSION ROOMS
      ================================
      */
      socket.on("join-session", ({ sessionId }) => {
        socket.join(`session:${sessionId}`);
        console.log("📥 Joined session:", sessionId);
      });

      socket.on("leave-session", ({ sessionId }) => {
        socket.leave(`session:${sessionId}`);
        console.log("📤 Left session:", sessionId);
      });

      /*
      ================================
      SESSION REQUEST (USER → ASTROLOGER)
      ================================
      */
      socket.on("session:request", async ({ sessionId }) => {
        const astrologer = await Astrologer.findOne({
          isOnline: true,
          socketId: { $ne: null },
        });

        if (astrologer?.socketId) {
          io.to(astrologer.socketId).emit("session:incoming", {
            sessionId,
            userId: socket.userId,
          });
        }
      });

      /*
      ================================
      DISCONNECT
      ================================
      */
      socket.on("disconnect", async () => {
        console.log("❌ Disconnected:", user.name);

        if (socket.role === "astrologer") {
          await Astrologer.findOneAndUpdate(
            { socketId: socket.id },
            { isOnline: false, socketId: null }
          );

          broadcastOnlineAstrologers();
        }
      });
    } catch (err) {
      console.error("🔥 Socket Error:", err);
      socket.disconnect();
    }
  });

  return io;
};

async function broadcastOnlineAstrologers() {
  const online = await Astrologer.find({ isOnline: true })
    .populate("userId", "name avatar")
    .select("pricePerMinute rating userId");

  io.emit("astrologers:online", online);
}

export const getIO = () => io;
