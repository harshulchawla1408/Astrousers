import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import hpp from "hpp";
import xss from "xss"; // modern XSS sanitizer
import { createServer } from "http";

import userRoutes from "./routes/userRoutes.js";
import astrologerRoutes from "./routes/astrologerRoutes.js";
import astrologyRoutes from "./routes/astrologyRoutes.js";
import agoraRoutes from "./routes/agoraRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { initializeSocket } from "./socket/socketServer.js";

const app = express();
const httpServer = createServer(app);

// -------------------- Middlewares --------------------
// CORS configuration - allow all origins in development
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Allow all origins in dev, restrict in production
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));

// Body parsing middleware - MUST be before routes
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

// Request logging middleware (for debugging)
app.use((req, res, next) => {
  if (req.path === '/api/users/sync' || req.path === '/api/v1/user') {
    console.log(`📥 Incoming request to ${req.path}`);
    console.log('📥 Method:', req.method);
    console.log('📥 Headers:', {
      'content-type': req.headers['content-type'],
      'authorization': req.headers['authorization'] ? 'Present' : 'Missing'
    });
    console.log('📥 Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Sanitization middleware - SKIP for user endpoints to preserve all fields
app.use((req, res, next) => {
  // Skip sanitization for user endpoints to preserve all fields
  if (req.path === '/api/users/sync' || 
      req.path === '/api/v1/user' || 
      req.path.startsWith('/api/v1/user/')) {
    console.log(`⏭️ Skipping sanitization for ${req.path}`);
    return next();
  }
  
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

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    uptime: process.uptime()
  });
});

app.use("/api/users", userRoutes);
app.use("/api/v1/user", userRoutes); // Primary route for user creation/update
app.use("/api/v1/astrologers", astrologerRoutes);
app.use("/api/agora", agoraRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/v1/sessions", sessionRoutes); // Primary route for sessions
app.use("/api/payment", paymentRoutes);
app.use("/api/astrology", astrologyRoutes);


// -------------------- MongoDB Connection --------------------
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI is not defined in environment variables");
      console.error("❌ Please set MONGO_URI in your .env file");
      process.exit(1);
    }

    console.log("🔄 Attempting to connect to MongoDB...");
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Modern connection options
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log(`✅ MongoDB connected successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Ready State: ${conn.connection.readyState} (1 = connected)`);
    
    // Log connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
      console.error('❌ Error details:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected - attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully');
    });

    mongoose.connection.on('connecting', () => {
      console.log('🔄 MongoDB connecting...');
    });

  } catch (err) {
    console.error("❌ MongoDB connection failed!");
    console.error("❌ Error message:", err.message);
    
    // Provide helpful error messages
    if (err.message.includes('authentication failed')) {
      console.error("❌ Authentication failed - check your MongoDB username and password");
    } else if (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo')) {
      console.error("❌ Network error - check your MongoDB cluster URL");
    } else if (err.message.includes('timeout')) {
      console.error("❌ Connection timeout - check your network and MongoDB Atlas IP whitelist");
    } else {
      console.error("❌ Full error:", err);
    }
    
    console.error("\n💡 Troubleshooting tips:");
    console.error("   1. Verify MONGO_URI in your .env file");
    console.error("   2. Check MongoDB Atlas IP whitelist (should include 0.0.0.0/0 for development)");
    console.error("   3. Verify database user credentials");
    console.error("   4. Check your internet connection");
    
    process.exit(1);
  }
};

connectDB();

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
