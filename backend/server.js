import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import hpp from "hpp";
import xss from "xss";
import { createServer } from "http";

import userRoutes from "./routes/userRoutes.js";
import astrologerRoutes from "./routes/astrologerRoutes.js";
import astrologyRoutes from "./routes/astrologyRoutes.js";
import calendarRoutes from "./routes/calendarRoutes.js";
import agoraRoutes from "./routes/agoraRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminAstrologerRoutes from "./routes/admin/astrologerRoutes.js";
import adminDashboardRoutes from "./routes/admin/dashboardRoutes.js";
import { initializeSocket } from "./socket/socketServer.js";

const app = express();
const httpServer = createServer(app);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(helmet());
app.use(hpp());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const sanitizeValue = (value) => {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (typeof value === "object") return sanitizeObject(value);
  if (typeof value === "string") return xss(value);
  return value;
};

const sanitizeObject = (obj) => {
  const sanitized = {};
  for (const key in obj) {
    if (key.startsWith("$") || key.includes(".")) continue;
    sanitized[key] = sanitizeValue(obj[key]);
  }
  return sanitized;
};

app.use((req, res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeObject(req.body);
  }
  if (req.params && typeof req.params === "object") {
    req.params = sanitizeObject(req.params);
  }
  next();
});

/* -------------------- Routes -------------------- */

app.get("/", (req, res) => {
  res.send("🔮 Astrousers API is running");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    db:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
    uptime: process.uptime(),
  });
});

app.use("/api/users", userRoutes);
app.use("/api/v1/user", userRoutes);

app.use("/api/v1/astrologers", astrologerRoutes);
app.use("/api/agora", agoraRoutes);
app.use("/api/v1/agora", agoraRoutes);

app.use("/api/chat", chatRoutes);
app.use("/api/v1/chat", chatRoutes);

app.use("/api/sessions", sessionRoutes);
app.use("/api/v1/sessions", sessionRoutes);

app.use("/api/payment", paymentRoutes);
app.use("/api/v1/payment", paymentRoutes);

app.use("/api/astrology", astrologyRoutes);

app.use("/api/calendar", calendarRoutes);

app.use("/api/v1/admin/astrologers", adminAstrologerRoutes);
app.use("/api/v1/admin/dashboard", adminDashboardRoutes);

/* -------------------- 404 Handler -------------------- */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
  });
});

/* -------------------- Global Error Handler -------------------- */

app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* -------------------- MongoDB -------------------- */

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not defined");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

connectDB();

/* -------------------- Socket.io -------------------- */

initializeSocket(httpServer);

/* -------------------- Start Server -------------------- */

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
