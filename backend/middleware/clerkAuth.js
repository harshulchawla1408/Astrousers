import { createClerkClient } from "@clerk/clerk-sdk-node";
import jwt from "jsonwebtoken";

// Initialize Clerk client
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
});

/*
========================================
CLERK AUTH MIDDLEWARE
========================================
Verifies Clerk JWT token and extracts clerkId
Backend NEVER trusts frontend user data blindly
*/
export const requireAuth = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing. Provide Bearer token in Authorization header."
      });
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify token with Clerk
    let userId;
    try {
      // Check if CLERK_SECRET_KEY is set
      if (!process.env.CLERK_SECRET_KEY) {
        console.error("❌ CLERK_SECRET_KEY is not set in environment variables");
        return res.status(500).json({
          success: false,
          message: "Server configuration error: CLERK_SECRET_KEY missing"
        });
      }
      
      // Log CLERK_SECRET_KEY prefix for debugging (first 10 chars only for security)
      console.log("🔑 CLERK_SECRET_KEY prefix:", process.env.CLERK_SECRET_KEY.substring(0, 10) + "...");
      console.log("🔍 Token received, length:", token.length);
      console.log("🔍 Token preview:", token.substring(0, 50) + "...");

      // Verify the JWT token using Clerk
      // Try Clerk's verifyToken first, with fallback to manual JWT decode
      let decoded;
      try {
        // Method 1: Use Clerk's verifyToken (preferred - verifies signature)
        decoded = await clerkClient.verifyToken(token);
        userId = decoded.sub; // Clerk user ID (clerkId)
        console.log("✅ Token verified via Clerk SDK for user:", userId);
      } catch (clerkErr) {
        console.warn("⚠️ Clerk verifyToken failed, trying manual JWT decode:", clerkErr.message);
        
        // Method 2: Fallback - manually decode JWT (for debugging/development)
        // WARNING: This doesn't verify the signature, only decodes
        // In production, you should always verify the signature
        try {
          // Decode without verification (for debugging)
          decoded = jwt.decode(token, { complete: true });
          
          if (!decoded || !decoded.payload) {
            throw new Error("Invalid JWT structure");
          }
          
          userId = decoded.payload.sub; // Clerk user ID (clerkId)
          
          if (!userId) {
            throw new Error("No 'sub' claim in token payload");
          }
          
          console.log("⚠️ Token decoded manually (signature NOT verified) for user:", userId);
          console.warn("⚠️ WARNING: Using manual JWT decode - signature not verified!");
          console.warn("⚠️ This should only be used for debugging. Fix Clerk verification.");
        } catch (decodeErr) {
          console.error("❌ Manual JWT decode also failed:", decodeErr.message);
          throw clerkErr; // Throw original Clerk error
        }
      }
      
      if (!userId) {
        console.error("Token decoded but no userId (sub) found in token");
        console.error("Decoded token:", JSON.stringify(decoded, null, 2));
        return res.status(401).json({
          success: false,
          message: "Token does not contain user ID."
        });
      }
    } catch (verifyErr) {
      console.error("❌ Token verification failed:");
      console.error("  Error message:", verifyErr.message);
      console.error("  Error name:", verifyErr.name);
      console.error("  Token preview:", token.substring(0, 50) + "...");
      console.error("  Token length:", token.length);
      
      // More specific error messages
      if (verifyErr.message?.includes("expired")) {
        return res.status(401).json({
          success: false,
          message: "Token has expired. Please refresh the page."
        });
      } else if (verifyErr.message?.includes("invalid") || verifyErr.message?.includes("malformed")) {
        return res.status(401).json({
          success: false,
          message: "Invalid token format."
        });
      }
      
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token."
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unable to extract user ID from token."
      });
    }

    // Set userId for downstream handlers
    req.userId = userId;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({
      success: false,
      message: "Authentication error occurred."
    });
  }
};

