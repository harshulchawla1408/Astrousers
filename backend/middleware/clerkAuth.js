import jwt from 'jsonwebtoken';
import User from '../models/user.js';

// Clerk JWT verification middleware
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify JWT token with Clerk secret
    const decoded = jwt.verify(token, process.env.CLERK_SECRET_KEY);
    
    // Extract user ID from Clerk JWT payload
    const userId = decoded.sub || decoded.user_id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token format.' 
      });
    }

    // Find or create user in MongoDB
    let user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      // Auto-create user with default 100 coins if not exists
      user = await User.create({
        clerkId: userId,
        email: decoded.email || '',
        fullName: decoded.name || '',
        profileImage: decoded.picture || '',
        coins: 100, // Default wallet balance
        transactions: [{
          type: 'credit',
          amount: 100,
          description: 'Welcome bonus - Account created'
        }]
      });
    }

    // Attach user info to request
    req.userId = userId;
    req.user = user;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token.' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired.' 
      });
    }
    
    return res.status(500).json({ 
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
      return next(); // Continue without auth
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.CLERK_SECRET_KEY);
    const userId = decoded.sub || decoded.user_id;
    
    if (userId) {
      const user = await User.findOne({ clerkId: userId });
      req.userId = userId;
      req.user = user;
    }
    
    next();
  } catch (error) {
    // Continue without auth on error
    next();
  }
};
