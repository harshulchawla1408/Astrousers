import { Server } from 'socket.io';
import { verifyToken } from '@clerk/clerk-sdk-node';
import User from '../models/user.js';
import Astrologer from '../models/astrologerModel.js';
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

    // If user is astrologer, join astrologer room and update astrologers collection
    const currentUser = await User.findOne({ clerkId: socket.userId });
    if (currentUser && currentUser.role === 'astrologer') {
      socket.join('astrologers');
      // Update astrologers collection if clerkId matches
      await Astrologer.findOneAndUpdate(
        { clerkId: socket.userId },
        { online: true },
        { upsert: false }
      );
      // Broadcast updated online list
      const onlineAstrologers = await Astrologer.find({ online: true })
        .select('_id name image rating pricePerMin availability');
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
        // Update astrologers collection
        await Astrologer.findOneAndUpdate(
          { clerkId: socket.userId },
          { online: true },
          { upsert: false }
        );
        const onlineAstrologers = await Astrologer.find({ online: true })
          .select('_id name image rating pricePerMin availability');
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
        // Update astrologers collection
        await Astrologer.findOneAndUpdate(
          { clerkId: socket.userId },
          { online: false },
          { upsert: false }
        );
        const onlineAstrologers = await Astrologer.find({ online: true })
          .select('_id name image rating pricePerMin availability');
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

    // Handle message:send (chat messages)
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

        // Verify session is active
        if (session.status !== 'active') {
          socket.emit('message:error', { message: 'Session is not active' });
          return;
        }

        // Verify user is part of this session
        const isUser = session.userId === socket.userId;
        const astrologer = await Astrologer.findById(session.astrologerId);
        const isAstrologer = astrologer && astrologer.clerkId === socket.userId;

        if (!isUser && !isAstrologer) {
          socket.emit('message:error', { message: 'Unauthorized' });
          return;
        }

        // Determine recipient
        const toUserId = isUser ? session.astrologerId : session.userId;

        // Save message to DB (using chatmessages collection)
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
          _id: message._id,
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

    // Handle session:accept (astrologer accepts)
    socket.on('session:accept', async (data) => {
      try {
        const { sessionId } = data;
        const session = await Session.findById(sessionId);
        
        if (!session) {
          socket.emit('session:error', { message: 'Session not found' });
          return;
        }

        // Notify user
        io.to(`user:${session.userId}`).emit('session:accepted', {
          sessionId: session._id.toString(),
          channelName: session.channelName,
          sessionType: session.sessionType
        });
      } catch (error) {
        console.error('Error handling session accept:', error);
        socket.emit('session:error', { message: 'Failed to accept session' });
      }
    });

    // Handle session:reject (astrologer rejects)
    socket.on('session:reject', async (data) => {
      try {
        const { sessionId } = data;
        const session = await Session.findById(sessionId);
        
        if (!session) {
          socket.emit('session:error', { message: 'Session not found' });
          return;
        }

        // Notify user
        io.to(`user:${session.userId}`).emit('session:rejected', {
          sessionId: session._id.toString(),
          message: 'Astrologer declined your consultation request'
        });
      } catch (error) {
        console.error('Error handling session reject:', error);
        socket.emit('session:error', { message: 'Failed to reject session' });
      }
    });

    // Handle call signaling (for audio/video calls)
    socket.on('call:signal', async (data) => {
      try {
        const { sessionId, signal, type } = data;
        const session = await Session.findById(sessionId);
        
        if (!session) {
          socket.emit('call:error', { message: 'Session not found' });
          return;
        }

        // Forward signal to other party in session
        const targetUserId = socket.userId === session.userId 
          ? session.astrologerId 
          : session.userId;
        
        io.to(`user:${targetUserId}`).emit('call:signal', {
          sessionId,
          signal,
          type,
          from: socket.userId
        });
      } catch (error) {
        console.error('Error handling call signal:', error);
        socket.emit('call:error', { message: 'Failed to send signal' });
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
        // Update astrologers collection
        await Astrologer.findOneAndUpdate(
          { clerkId: socket.userId },
          { online: false },
          { upsert: false }
        );
        const onlineAstrologers = await Astrologer.find({ online: true })
          .select('_id name image rating pricePerMin availability');
        io.emit('presence:online-list', { astrologers: onlineAstrologers });
      }
    });
  });

  return io;
};

export const getIO = () => io;

