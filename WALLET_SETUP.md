# 🪙 Astrousers Wallet System Setup Guide

This guide will help you set up the coin wallet and Razorpay payment system for the Astrousers platform.

## 🔧 Environment Variables Setup

### Backend (.env)
Create a `.env` file in the `backend` directory with the following variables:

```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/Astrousers?retryWrites=true&w=majority

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
Create a `.env.local` file in the `frontend` directory with the following variables:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id_here

# Clerk Configuration (if not using default)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
```

## 🚀 Getting Started

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install razorpay
```

**Frontend:**
```bash
cd frontend
npm install razorpay
```

### 2. Razorpay Setup

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Get your API keys from the dashboard
3. Add the keys to your environment variables

### 3. Clerk Setup

1. Set up Clerk authentication
2. Get your secret key from Clerk dashboard
3. Add the key to your backend environment variables

### 4. MongoDB Setup

1. Create a MongoDB Atlas cluster
2. Get your connection string
3. Add it to your backend environment variables

## 🏗️ System Architecture

### Backend Components

- **User Model**: Updated with `coins` and `transactions` fields
- **Authentication Middleware**: `clerkAuth.js` for secure access control
- **Payment Routes**: Razorpay integration for wallet recharge
- **Session Routes**: Coin deduction logic for chat/video sessions

### Frontend Components

- **WalletCard**: Display current balance and status
- **RechargeButton**: Razorpay payment integration
- **InsufficientBalanceModal**: Low balance warnings
- **TransactionHistory**: View transaction records
- **useWallet Hook**: Wallet operations and state management

## 🔒 Security Features

✅ **Clerk JWT Authentication**: All wallet operations require valid authentication
✅ **Server-side Verification**: Razorpay signature verification on backend
✅ **Balance Validation**: Prevents sessions without sufficient coins
✅ **Transaction Logging**: Complete audit trail of all transactions
✅ **Input Sanitization**: XSS and NoSQL injection protection

## 📊 Database Schema

### User Document Example
```json
{
  "clerkId": "user_1234",
  "email": "user@example.com",
  "fullName": "John Doe",
  "coins": 540,
  "transactions": [
    {
      "type": "credit",
      "amount": 500,
      "description": "Wallet Recharge via Razorpay",
      "date": "2025-10-22T18:30:00.000Z"
    },
    {
      "type": "debit",
      "amount": 60,
      "description": "Video call with astrologer_789",
      "date": "2025-10-23T10:00:00.000Z"
    }
  ]
}
```

## 🎯 API Endpoints

### Payment Routes (`/api/payment`)
- `POST /create-order` - Create Razorpay order
- `POST /verify` - Verify payment and credit coins
- `GET /balance` - Get user wallet balance
- `GET /history` - Get transaction history

### Session Routes (`/api/sessions`)
- `POST /start` - Start session with balance validation
- `POST /end` - End session and deduct coins
- `GET /active` - Get active sessions
- `GET /history` - Get session history

## 💡 Usage Examples

### Starting a Session
```javascript
const { startSession, checkBalance } = useWallet();

// Check balance before starting
const balanceCheck = await checkBalance(requiredCoins);
if (!balanceCheck.hasEnough) {
  // Show insufficient balance modal
  return;
}

// Start session
const session = await startSession({
  astrologerId: "astrologer_123",
  sessionType: "video",
  channelName: "channel_123",
  ratePerMinute: 10
});
```

### Recharging Wallet
```javascript
const handleRecharge = async (amount) => {
  // Razorpay payment flow
  const order = await createOrder(amount);
  const razorpay = new window.Razorpay(options);
  razorpay.open();
};
```

## 🚨 Error Handling

The system includes comprehensive error handling for:
- Insufficient balance scenarios
- Payment failures
- Network errors
- Authentication failures
- Invalid session attempts

## 🔄 Transaction Flow

1. **User Registration**: Auto-created with 100 coins
2. **Session Start**: Balance validation before allowing connection
3. **Session End**: Automatic coin deduction based on duration
4. **Wallet Recharge**: Razorpay payment with instant coin credit
5. **Transaction Logging**: Complete audit trail maintained

## 📱 Frontend Integration

### Wallet Page
Access the wallet at `/wallet` with tabs for:
- Overview: Current balance and quick actions
- Recharge: Payment options
- History: Transaction records

### Session Integration
- Balance checks before session start
- Real-time balance updates
- Low balance warnings
- Automatic session termination on insufficient funds

## 🎨 UI Components

All components are built with:
- TailwindCSS for styling
- Responsive design
- Loading states
- Error handling
- Success notifications

## 🧪 Testing

Test the system with:
1. User registration (auto-100 coins)
2. Wallet recharge via Razorpay
3. Session start/end with coin deduction
4. Transaction history viewing
5. Low balance scenarios

## 📞 Support

For issues or questions:
1. Check environment variables
2. Verify Razorpay configuration
3. Ensure Clerk authentication is working
4. Check MongoDB connection
5. Review console logs for errors

---

**🎉 Your Astrousers wallet system is now ready!** Users can recharge their wallets, start sessions with astrologers, and track their transaction history securely.
