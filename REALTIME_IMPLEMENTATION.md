# Real-time Chat & Session Implementation Guide

## Overview
This document describes the implementation of real-time presence, chat, and audio/video sessions using Socket.io and Agora.

## Files Modified/Created

### Backend Files

#### Models
1. **backend/models/user.js** - Added presence fields:
   - `isOnline: Boolean`
   - `socketId: String`
   - `currentSessionId: ObjectId`
   - `lastSeen: Date`
   - `role: enum ['user', 'astrologer', 'admin']`

2. **backend/models/sessionModel.js** (NEW) - Session model with:
   - `status: enum ['pending', 'active', 'ended']`
   - `acceptedAt: Date`
   - `acceptedBy: String`

3. **backend/models/messageModel.js** (NEW) - Message model for chat persistence

#### Socket Server
4. **backend/socket/socketServer.js** (NEW) - Socket.io server with:
   - Authentication middleware
   - Presence events (on/off)
   - Session management (join/leave)
   - Real-time messaging
   - Session request/accept flow

#### Routes & Controllers
5. **backend/routes/astrologerRoutes.js** - Added:
   - `POST /:id/online` - Set astrologer online
   - `POST /:id/offline` - Set astrologer offline
   - `GET /online` - Get online astrologers list

6. **backend/routes/sessionRoutes.js** - Updated:
   - `POST /start` - Creates pending session, notifies astrologer
   - `POST /accept` - Astrologer accepts session (atomic reservation)
   - `POST /end` - End session and deduct coins

7. **backend/routes/agoraRoutes.js** - Updated:
   - `POST /token` - Generate Agora token (requires auth)
   - `GET /token` - Backward compatibility

8. **backend/server.js** - Integrated Socket.io with HTTP server

9. **backend/package.json** - Added `socket.io` dependency

### Frontend Files

10. **frontend/lib/socketClient.js** (NEW) - Socket.io client helper:
    - `getSocket()` - Get socket instance
    - `useSocket()` - React hook for socket connection

11. **frontend/app/astrologer/dashboard/page.js** (NEW) - Astrologer dashboard:
    - Toggle online/offline
    - View pending session requests
    - Accept/reject sessions
    - Get Agora tokens

12. **frontend/components/session/SessionManager.jsx** (NEW) - Session management:
    - Start session flow
    - Wait for acceptance
    - Handle active sessions
    - End session

13. **frontend/app/astrologers/[id]/page.js** - Updated to use SessionManager

14. **frontend/package.json** - Added `socket.io-client` dependency

## Environment Variables Required

### Backend (.env)
```
MONGO_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
AGORA_APP_ID=your_agora_app_id
AGORA_APP_CERTIFICATE=your_agora_app_certificate
FRONTEND_URL=http://localhost:3000 (or your Vercel domain)
PORT=5000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_BACKEND_URL=https://astrousers.onrender.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
NEXT_PUBLIC_AGORA_APP_ID=your_agora_app_id (if needed client-side)
```

## Installation Steps

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Testing Flow

### 1. Setup Astrologer Account
- Sign up/login as a user
- Update user role to 'astrologer' in MongoDB:
  ```javascript
  db.users.updateOne(
    { clerkId: "your_clerk_id" },
    { $set: { role: "astrologer" } }
  )
  ```

### 2. Start Backend
```bash
cd backend
npm run dev
```

### 3. Start Frontend
```bash
cd frontend
npm run dev
```

### 4. Test Astrologer Dashboard
1. Open `http://localhost:3000/astrologer/dashboard`
2. Sign in as astrologer
3. Click "Go Online" - should see status change
4. Socket should connect (check console)

### 5. Test User Session Flow
1. Open `http://localhost:3000/astrologers/[astrologer_id]` in another window
2. Sign in as regular user
3. Click "Start Chat" (or Audio/Video)
4. Should see "Waiting for Astrologer" message
5. In astrologer dashboard, should see pending session request
6. Click "Accept" in dashboard
7. User should see session accepted, chat/Agora should initialize

### 6. Test Real-time Chat
1. Once session is active, send messages
2. Messages should appear in real-time via Socket.io
3. Messages are persisted to MongoDB

## API Endpoints

### Presence
- `POST /api/v1/astrologers/:id/online` - Set online (auth required, astrologer only)
- `POST /api/v1/astrologers/:id/offline` - Set offline (auth required, astrologer only)
- `GET /api/v1/astrologers/online` - Get list of online astrologers

### Sessions
- `POST /api/sessions/start` - Start session (creates pending)
  - Body: `{ astrologerId, sessionType, ratePerMinute }`
- `POST /api/sessions/accept` - Accept session (astrologer only)
  - Body: `{ sessionId }`
- `POST /api/sessions/end` - End session
  - Body: `{ sessionId, duration?, ratePerMinute }`

### Agora
- `POST /api/agora/token` - Get Agora token (auth required)
  - Body: `{ channelName, uid? }`

## Socket Events

### Client → Server
- `presence:on` - Set user online
- `presence:off` - Set user offline
- `join-session` - Join session room
- `leave-session` - Leave session room
- `message:send` - Send chat message
- `session:request` - Notify astrologer of session request

### Server → Client
- `presence:online-list` - Broadcast online astrologers list
- `session:request` - New session request (astrologer)
- `session:accepted` - Session accepted (user)
- `message:receive` - Receive chat message
- `message:error` - Message send error

## Security Notes

1. **Authentication**: All endpoints require Clerk JWT token
2. **Role Checks**: Presence endpoints verify user is astrologer
3. **Atomic Operations**: Session acceptance uses `findOneAndUpdate` with null check
4. **CORS**: Configured for frontend domain
5. **Socket Auth**: Socket connections authenticated via Clerk token

## Production Considerations

1. Set `FRONTEND_URL` to your Vercel domain
2. Configure CORS in backend for production domain
3. Use environment variables for all secrets
4. Enable Socket.io transports: ['websocket', 'polling']
5. Monitor Socket.io connection limits
6. Consider Redis adapter for Socket.io scaling

## Troubleshooting

### Socket not connecting
- Check backend URL in `.env.local`
- Verify Clerk token is valid
- Check browser console for errors
- Verify Socket.io server is running

### Session not accepting
- Verify astrologer role in database
- Check astrologer is not already in a session
- Verify sessionId is correct

### Messages not appearing
- Check Socket.io connection status
- Verify session room join
- Check MongoDB for persisted messages

## Sample Test Requests

### Set Astrologer Online
```bash
curl -X POST http://localhost:5000/api/v1/astrologers/{clerkId}/online \
  -H "Authorization: Bearer {clerk_jwt_token}"
```

### Start Session
```bash
curl -X POST http://localhost:5000/api/sessions/start \
  -H "Authorization: Bearer {clerk_jwt_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "astrologerId": "astrologer_clerk_id",
    "sessionType": "chat",
    "ratePerMinute": 10
  }'
```

### Accept Session
```bash
curl -X POST http://localhost:5000/api/sessions/accept \
  -H "Authorization: Bearer {astrologer_jwt_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_id_here"
  }'
```

### Get Agora Token
```bash
curl -X POST http://localhost:5000/api/agora/token \
  -H "Authorization: Bearer {jwt_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "channelName": "session_user_astrologer_123456",
    "uid": "user_id"
  }'
```

