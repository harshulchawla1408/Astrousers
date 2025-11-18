// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import hpp from "hpp";
import xss from "xss"; // modern XSS sanitizer
import { createServer } from "http";

import userRoutes from "./routes/userRoutes.js";
import kundliRoutes from "./routes/kundliRoutes.js";
import astrologerRoutes from "./routes/astrologerRoutes.js";
import agoraRoutes from "./routes/agoraRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { initializeSocket } from "./socket/socketServer.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

// -------------------- Middlewares --------------------
app.use(cors());
app.use(express.json({ limit: "10mb" })); // JSON payload limit
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Security Middlewares
app.use(helmet()); // sets secure HTTP headers
app.use(hpp()); // prevent HTTP param pollution

// Basic NoSQL injection guard compatible with Express 5
function sanitizeValue(value) {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (typeof value === "object") return sanitizeObject(value);
  if (typeof value === "string") return xss(value); // sanitize strings
  return value;
}

function sanitizeObject(obj) {
  const sanitized = {};
  for (const key of Object.keys(obj)) {
    // Drop keys that start with '$' or contain '.'
    if (key.startsWith("$") || key.includes(".")) continue;
    sanitized[key] = sanitizeValue(obj[key]);
  }
  return sanitized;
}

app.use((req, res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeObject(req.body);
  }
  if (req.params && typeof req.params === "object") {
    req.params = sanitizeObject(req.params);
  }
  // Do NOT reassign req.query (read-only)
  next();
});

// Logging (only in development)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// -------------------- Routes --------------------
app.get("/", (req, res) => {
  res.send("🔮 Astrousers API is running...");
});

app.use("/api/users", userRoutes);
app.use("/api/v1/kundli", kundliRoutes);
app.use("/api/v1/astrologers", astrologerRoutes);
app.use("/api/agora", agoraRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/payment", paymentRoutes);

// -------------------- MongoDB Connection --------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit process on DB failure
  });

// -------------------- Global Error Handling --------------------
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// -------------------- Initialize Socket.io --------------------
initializeSocket(httpServer);

// -------------------- Start Server --------------------
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`🔌 Socket.io server initialized`);
});
