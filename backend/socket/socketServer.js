import { Server } from 'socket.io';
import { verifyToken } from '@clerk/clerk-sdk-node';
import User from '../models/user.js';
import Session from '../models/sessionModel.js';
import Message from '../models/messageModel.js';

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const verified = await verifyToken(token, {
        audience: process.env.CLERK_JWT_AUD || undefined,
        issuer: process.env.CLERK_JWT_ISSUER || undefined
      });

      const userId = verified.sub;
      if (!userId) {
        return next(new Error('Authentication error: Invalid token'));
      }

      // Find or create user
      let user = await User.findOne({ clerkId: userId });
      if (!user) {
        user = await User.create({
          clerkId: userId,
          email: verified.email || '',
          name: verified.name || '',
          profileImage: verified.picture || '',
          wallet: 100
        });
      }

      socket.userId = userId;
      socket.user = user;
      next();
    } catch (error) {
      console.error('Socket auth error:', error);
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`✅ User connected: ${socket.userId}`);

    // Update user socketId and set online
    await User.findOneAndUpdate(
      { clerkId: socket.userId },
      { 
        socketId: socket.id,
        isOnline: true,
        lastSeen: new Date()
      }
    );

    // Join user's personal room
    socket.join(`user:${socket.userId}`);

    // If user is astrologer, join astrologer room
    const currentUser = await User.findOne({ clerkId: socket.userId });
    if (currentUser && currentUser.role === 'astrologer') {
      socket.join('astrologers');
      // Broadcast updated online list
      const onlineAstrologers = await User.find({ 
        role: 'astrologer', 
        isOnline: true 
      }).select('clerkId name profileImage');
      io.emit('presence:online-list', { astrologers: onlineAstrologers });
    }

    // Handle presence:on
    socket.on('presence:on', async () => {
      const currentUser = await User.findOne({ clerkId: socket.userId });
      await User.findOneAndUpdate(
        { clerkId: socket.userId },
        { isOnline: true, lastSeen: new Date() }
      );
      
      if (currentUser && currentUser.role === 'astrologer') {
        const onlineAstrologers = await User.find({ 
          role: 'astrologer', 
          isOnline: true 
        }).select('clerkId name profileImage');
        io.emit('presence:online-list', { astrologers: onlineAstrologers });
      }
    });

    // Handle presence:off
    socket.on('presence:off', async () => {
      const currentUser = await User.findOne({ clerkId: socket.userId });
      await User.findOneAndUpdate(
        { clerkId: socket.userId },
        { isOnline: false, lastSeen: new Date() }
      );
      
      if (currentUser && currentUser.role === 'astrologer') {
        const onlineAstrologers = await User.find({ 
          role: 'astrologer', 
          isOnline: true 
        }).select('clerkId name profileImage');
        io.emit('presence:online-list', { astrologers: onlineAstrologers });
      }
    });

    // Handle join-session
    socket.on('join-session', async (data) => {
      const { sessionId } = data;
      if (sessionId) {
        socket.join(`session:${sessionId}`);
        console.log(`User ${socket.userId} joined session ${sessionId}`);
      }
    });

    // Handle leave-session
    socket.on('leave-session', async (data) => {
      const { sessionId } = data;
      if (sessionId) {
        socket.leave(`session:${sessionId}`);
        console.log(`User ${socket.userId} left session ${sessionId}`);
      }
    });

    // Handle message:send
    socket.on('message:send', async (data) => {
      try {
        const { sessionId, text } = data;
        
        if (!sessionId || !text) {
          socket.emit('message:error', { message: 'Session ID and text are required' });
          return;
        }

        const session = await Session.findById(sessionId);
        if (!session) {
          socket.emit('message:error', { message: 'Session not found' });
          return;
        }

        // Determine recipient
        const toUserId = socket.userId === session.userId 
          ? session.astrologerId 
          : session.userId;

        // Save message to DB
        const message = new Message({
          sessionId,
          fromUserId: socket.userId,
          toUserId,
          text,
          timestamp: new Date()
        });
        await message.save();

        // Emit to session room
        io.to(`session:${sessionId}`).emit('message:receive', {
          sessionId,
          fromUserId: socket.userId,
          toUserId,
          text,
          timestamp: message.timestamp
        });
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('message:error', { message: 'Failed to send message' });
      }
    });

    // Handle session request (user starts session)
    socket.on('session:request', async (data) => {
      try {
        const { sessionId } = data;
        const session = await Session.findById(sessionId);
        
        if (!session) {
          socket.emit('session:error', { message: 'Session not found' });
          return;
        }

        // Notify astrologer
        const astrologer = await User.findOne({ clerkId: session.astrologerId });
        if (astrologer && astrologer.socketId) {
          io.to(astrologer.socketId).emit('session:request', {
            sessionId: session._id.toString(),
            userId: session.userId,
            sessionType: session.sessionType,
            channelName: session.channelName
          });
        }
      } catch (error) {
        console.error('Error handling session request:', error);
        socket.emit('session:error', { message: 'Failed to send session request' });
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
      
      const currentUser = await User.findOne({ clerkId: socket.userId });
      await User.findOneAndUpdate(
        { clerkId: socket.userId },
        { 
          isOnline: false,
          socketId: null,
          lastSeen: new Date()
        }
      );

      if (currentUser && currentUser.role === 'astrologer') {
        const onlineAstrologers = await User.find({ 
          role: 'astrologer', 
          isOnline: true 
        }).select('clerkId name profileImage');
        io.emit('presence:online-list', { astrologers: onlineAstrologers });
      }
    });
  });

  return io;
};

export const getIO = () => io;

