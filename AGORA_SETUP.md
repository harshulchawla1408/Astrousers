# Agora Setup Guide for Astrousers Platform

## Environment Variables Configuration

### Backend (.env)
Create a `.env` file in the `backend` directory with the following variables:

```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/astrousers

# Agora Configuration
AGORA_APP_ID=your_agora_app_id_here
AGORA_APP_CERTIFICATE=your_agora_app_certificate_here

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration (if using authentication)
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
Create a `.env.local` file in the `frontend` directory with the following variables:

```env
# Agora Configuration
NEXT_PUBLIC_AGORA_APP_ID=your_agora_app_id_here

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000

# Environment
NODE_ENV=development
```

## Agora Setup Steps

1. **Create Agora Account**
   - Go to [Agora Console](https://console.agora.io/)
   - Sign up for a free account
   - Create a new project

2. **Get App Credentials**
   - In your Agora project, go to "Project Management"
   - Copy your App ID
   - Generate an App Certificate (if not already generated)

3. **Configure Environment Variables**
   - Add your Agora App ID and Certificate to both backend and frontend environment files
   - Make sure the App ID is the same in both files

4. **Install Dependencies**
   ```bash
   # Backend
   cd backend
   npm install agora-access-token

   # Frontend (already installed)
   cd frontend
   npm install agora-rtc-sdk-ng
   ```

## Features Implemented

### 1. Chat System
- Real-time messaging between users and astrologers
- Message history storage in MongoDB
- WebSocket-like polling for real-time updates

### 2. Audio Call System
- High-quality audio calls using Agora RTC
- Audio controls (mute/unmute)
- Call duration tracking
- Automatic cleanup on call end

### 3. Video Call System
- HD video calls with audio
- Video and audio controls
- Local and remote video display
- Call duration tracking

### 4. Session Management
- Session start/end tracking
- Coin deduction based on call duration
- Session history
- Active session monitoring

### 5. Wallet System
- Coin balance display
- Insufficient coins modal
- Automatic coin deduction after calls
- Add coins functionality

## API Endpoints

### Agora Token Generation
- `GET /api/agora/token?channel={channelName}&uid={uid}&role={role}`
- `GET /api/agora/rtm-token?userId={userId}`

### Chat System
- `GET /api/chat/messages?astrologerId={id}&userId={id}`
- `POST /api/chat/send`
- `PUT /api/chat/read`

### Session Management
- `POST /api/sessions/start`
- `POST /api/sessions/end`
- `GET /api/sessions/active/{userId}`
- `GET /api/sessions/history/{userId}`

## Usage Flow

1. **User visits astrologer profile page**
2. **Clicks on Chat/Audio/Video button**
3. **System checks user's coin balance**
4. **If sufficient coins: starts session**
5. **If insufficient coins: shows "Add Coins" modal**
6. **During session: tracks duration and usage**
7. **After session: deducts coins based on duration**

## Security Considerations

- Agora tokens are generated server-side for security
- Session management prevents multiple active sessions
- Coin validation prevents unauthorized access
- Input sanitization for chat messages

## Testing

1. Start the backend server: `cd backend && npm run dev`
2. Start the frontend server: `cd frontend && npm run dev`
3. Navigate to an astrologer profile page
4. Test chat, audio, and video call functionality
5. Verify coin deduction and session tracking

## Troubleshooting

- Ensure Agora credentials are correctly set
- Check MongoDB connection
- Verify CORS settings for frontend-backend communication
- Check browser console for any Agora SDK errors
