import { verifyToken } from '@clerk/clerk-sdk-node';
import User from '../models/user-temp.js';

// Clerk JWT verification middleware using Clerk SDK
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.substring(7);

    const verified = await verifyToken(token, {
      audience: process.env.CLERK_JWT_AUD || undefined,
      issuer: process.env.CLERK_JWT_ISSUER || undefined
    });

    const userId = verified.sub;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format.'
      });
    }

    // Find or create user in MongoDB
    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      user = await User.create({
        clerkId: userId,
        email: verified.email || '',
        name: verified.name || '',
        profileImage: verified.picture || '',
        wallet: 100,
        transactions: [{
          type: 'credit',
          amount: 100,
          description: 'Welcome bonus - Account created'
        }]
      });
    } else {
      // Sync mutable profile fields from Clerk token
      const mutableUpdates = {
        email: verified.email || user.email,
        name: verified.name || user.name,
        profileImage: verified.picture || user.profileImage
      };
      user.set(mutableUpdates);
      await user.save();
    }

    req.userId = userId;
    req.user = user;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed.'
    });
  }
};

// Optional auth middleware (doesn't fail if no token)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);
    const verified = await verifyToken(token, {
      audience: process.env.CLERK_JWT_AUD || undefined,
      issuer: process.env.CLERK_JWT_ISSUER || undefined
    });

    const user = await User.findOne({ clerkId: verified.sub });
    req.userId = verified.sub;
    req.user = user;

    next();
  } catch (error) {
    next();
  }
};
