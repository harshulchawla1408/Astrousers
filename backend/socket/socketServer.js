// backend/socket/socketServer.js
import { Server } from "socket.io";
import User from "../models/user.js";
import Astrologer from "../models/astrologerModel.js";
import Session from "../models/sessionModel.js";
import Message from "../models/messageModel.js";

let io;

// Format helper
const getUserRoom = (id) => `user:${id}`;
const getAstroRoom = (id) => `astrologer:${id}`;
const getSessionRoom = (id) => `session:${id}`;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*", credentials: true }
  });

  io.on("connection", async (socket) => {
    try {
      const clerkId = socket.handshake.auth?.clerkId;
      if (!clerkId) {
        socket.disconnect();
        return;
      }

      // ℹ Fetch user or astrologer
      let user = await User.findOne({ clerkId });
      let astrologer = await Astrologer.findOne({ clerkId });

      if (!user) {
        // create minimum user profile if not exist
        user = await User.create({
          clerkId,
          wallet: 0,
          name: "New User"
        });
      }

      // Attach to socket object
      socket.clerkId = clerkId;
      socket.mongoUserId = user._id.toString();
      socket.role = astrologer ? "astrologer" : "user";

      // Bind socket to user document
      await User.findOneAndUpdate(
        { clerkId },
        { socketId: socket.id, isOnline: true, lastSeen: new Date() }
      );

      // Update astrologer online
      if (socket.role === "astrologer") {
        await Astrologer.findOneAndUpdate(
          { clerkId },
          { online: true }
        );
      }

      // Join personal rooms
      socket.join(getUserRoom(user._id.toString()));
      if (astrologer) {
        socket.join(getAstroRoom(astrologer._id.toString()));
        socket.join("astrologers"); // for dashboards
      }

      console.log("⚡ Connected:", clerkId, "Role:", socket.role);

      // BROADCAST updated astrologer presence
      const onlineAstros = await Astrologer.find({ online: true }).select(
        "_id name pricePerMin rating image availability"
      );
      io.emit("presence:online-list", onlineAstros);

      /*
      ---------------------------------------------------------
        📌 1) JOIN SESSION ROOM
      ---------------------------------------------------------
      */
      socket.on("session:join", ({ sessionId }) => {
        socket.join(getSessionRoom(sessionId));
      });

      socket.on("session:leave", ({ sessionId }) => {
        socket.leave(getSessionRoom(sessionId));
      });

      /*
      ---------------------------------------------------------
        📌 2) CHAT: SEND MESSAGE
      ---------------------------------------------------------
      */
      socket.on("message:send", async ({ sessionId, text }) => {
        if (!text || !sessionId) return;

        const session = await Session.findById(sessionId);
        if (!session || session.status !== "active") return;

        const fromUserId = socket.mongoUserId;
        const isUser = session.userId === fromUserId;
        const isAstro = session.astrologerId === fromUserId;

        if (!isUser && !isAstro) return;

        const toUserId = isUser ? session.astrologerId : session.userId;

        const msg = await Message.create({
          sessionId,
          fromUserId,
          toUserId,
          text,
          timestamp: new Date()
        });

        io.to(getSessionRoom(sessionId)).emit("message:receive", msg);
      });

      /*
      ---------------------------------------------------------
        📌 3) REAL-TIME INCOMING REQUEST (controller triggers)
      ---------------------------------------------------------
      */
      socket.on("session:incoming", (data) => {
        // No internal logic needed. Controller emits this.
      });

      /*
      ---------------------------------------------------------
        📌 4) CALL SIGNALING (WebRTC / Agora)
      ---------------------------------------------------------
      */
      socket.on("call:signal", async ({ sessionId, signal }) => {
        const session = await Session.findById(sessionId);
        if (!session) return;

        const fromId = socket.mongoUserId;
        const toId = fromId === session.userId ? session.astrologerId : session.userId;

        io.to(getUserRoom(toId)).emit("call:signal", {
          sessionId,
          signal,
          from: fromId
        });
      });

      /*
      ---------------------------------------------------------
        📌 5) SESSION ACCEPT
      ---------------------------------------------------------
      */
      socket.on("session:accept", async ({ sessionId }) => {
        const session = await Session.findById(sessionId);
        if (!session) return;

        io.to(getUserRoom(session.userId)).emit("session:accepted", {
          sessionId,
          channelName: session.channelName,
          sessionType: session.sessionType
        });
      });

      /*
      ---------------------------------------------------------
        📌 6) SESSION REJECT
      ---------------------------------------------------------
      */
      socket.on("session:reject", async ({ sessionId }) => {
        const session = await Session.findById(sessionId);
        if (!session) return;

        io.to(getUserRoom(session.userId)).emit("session:rejected", {
          sessionId,
          message: "Astrologer rejected your request"
        });
      });

      /*
      ---------------------------------------------------------
        📌 7) BILLING PING (EVERY 60 SEC)
      ---------------------------------------------------------
      */
      socket.on("billing:tick", async ({ sessionId }) => {
        const s = await Session.findById(sessionId);
        if (!s || s.status !== "active") return;

        io.to(getSessionRoom(sessionId)).emit("billing:update", {});
      });

      /*
      ---------------------------------------------------------
        ❌ DISCONNECT LOGIC
      ---------------------------------------------------------
      */
      socket.on("disconnect", async () => {
        console.log("❌ Disconnected:", clerkId);

        await User.findOneAndUpdate(
          { clerkId },
          { isOnline: false, socketId: null, lastSeen: new Date() }
        );

        if (socket.role === "astrologer") {
          await Astrologer.findOneAndUpdate(
            { clerkId },
            { online: false }
          );

          const onlineAstros = await Astrologer.find({ online: true }).select(
            "_id name image pricePerMin rating availability"
          );
          io.emit("presence:online-list", onlineAstros);
        }
      });
    } catch (err) {
      console.log("🔥 Socket error:", err);
      socket.disconnect();
    }
  });

  return io;
};

export const getIO = () => io;
