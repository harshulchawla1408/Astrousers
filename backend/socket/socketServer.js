import { Server } from "socket.io";
import User from "../models/user.js";
import Astrologer from "../models/astrologerModel.js";
import Session from "../models/sessionModel.js";
import Message from "../models/messageModel.js";

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
      socket.role = user.role; // "USER" | "ASTROLOGER" | "ADMIN"

      socket.join(`user:${socket.userId}`);

      console.log("⚡ Connected:", user.name, "role:", socket.role, "userId:", socket.userId);

      /*
      ================================
      ASTROLOGER MANUAL ONLINE/OFFLINE
      ================================
      */
      socket.on("astrologer:go-online", async () => {
        console.log("📡 Received astrologer:go-online from socket:", socket.id, "role:", socket.role);
        if (socket.role !== "ASTROLOGER") {
          console.log("❌ Rejected: Not an ASTROLOGER, role is:", socket.role);
          return;
        }

        const result = await Astrologer.findOneAndUpdate(
          { userId: socket.userId },
          { isOnline: true, socketId: socket.id },
          { new: true }
        );

        if (result) {
          console.log("✅ Astrologer set online:", result.userId, "socketId:", socket.id);
        } else {
          console.log("⚠️ Astrologer not found for userId:", socket.userId);
        }

        broadcastOnlineAstrologers();
      });

      socket.on("astrologer:go-offline", async () => {
        console.log("📡 Received astrologer:go-offline from socket:", socket.id);
        if (socket.role !== "ASTROLOGER") return;

        await Astrologer.findOneAndUpdate(
          { userId: socket.userId },
          { isOnline: false, socketId: null }
        );

        console.log("✅ Astrologer set offline:", socket.userId);
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

      socket.on("session:join", ({ sessionId }) => {
        socket.join(`session:${sessionId}`);
        console.log("📥 Joined session (alias):", sessionId);
      });

      socket.on("leave-session", ({ sessionId }) => {
        socket.leave(`session:${sessionId}`);
        console.log("📤 Left session:", sessionId);
      });

      socket.on("session:leave", ({ sessionId }) => {
        socket.leave(`session:${sessionId}`);
        console.log("📤 Left session (alias):", sessionId);
      });

      /*
      ================================
      CHAT MESSAGES
      ================================
      */
      socket.on("message:send", async ({ sessionId, text }) => {
        try {
          const session = await Session.findById(sessionId);
          if (!session) {
            console.error("❌ Session not found:", sessionId);
            return;
          }

          // Verify user is part of this session
          const isUser = session.userId.toString() === socket.userId;
          const astrologer = await Astrologer.findById(session.astrologerId);
          const isAstrologer = astrologer && astrologer.userId.toString() === socket.userId;

          if (!isUser && !isAstrologer) {
            console.error("❌ Unauthorized message send attempt");
            return;
          }

          const senderRole = socket.role === "ASTROLOGER" ? "ASTROLOGER" : "USER";

          // Save message to database
          const message = await Message.create({
            sessionId,
            senderId: socket.userId,
            senderRole,
            text
          });

          // Populate sender info for response
          const messageWithSender = await Message.findById(message._id)
            .populate("senderId", "name avatar");

          // Broadcast to all participants in the session
          const messagePayload = {
            _id: message._id,
            sessionId: message.sessionId,
            senderId: socket.userId,
            senderRole,
            text: message.text,
            createdAt: message.createdAt,
            fromUserId: socket.userId // For ChatBox compatibility
          };

          io.to(`session:${sessionId}`).emit("message:receive", messagePayload);

          console.log("✅ Message sent:", sessionId, "by", senderRole);
        } catch (err) {
          console.error("🔥 Message send error:", err);
        }
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

        if (socket.role === "ASTROLOGER") {
          await Astrologer.findOneAndUpdate(
            { userId: socket.userId },
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
