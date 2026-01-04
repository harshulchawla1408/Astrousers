# How to Update Wallet Balance in MongoDB

## Quick Method (Using the Script)

1. **Find your Clerk ID:**
   - Log in to your app
   - Open browser console (F12)
   - Type: `localStorage.getItem('clerk-session')` or check the network tab for API calls
   - Or check your Clerk dashboard: https://dashboard.clerk.com
   - Your Clerk ID looks like: `user_2abc123xyz...`

2. **Run the script:**
   ```bash
   cd backend
   node scripts/updateWalletBalance.js <YOUR_CLERK_ID> <AMOUNT>
   ```

   Example:
   ```bash
   node scripts/updateWalletBalance.js user_2abc123xyz 1000
   ```

   This will set your wallet balance to ₹1000.

## Manual Method (Using MongoDB Compass or MongoDB Shell)

1. **Connect to your MongoDB database**
   - Connection string: Check your `.env` file for `MONGODB_URI`

2. **Find your user:**
   ```javascript
   db.users.findOne({ email: "your-email@example.com" })
   ```
   Or by Clerk ID:
   ```javascript
   db.users.findOne({ clerkId: "user_2abc123xyz" })
   ```

3. **Update wallet balance:**
   ```javascript
   db.users.updateOne(
     { clerkId: "user_2abc123xyz" },
     { 
       $set: { walletBalance: 1000 },
       $push: {
         walletTransactions: {
           type: "CREDIT",
           amount: 1000,
           reason: "Manual balance update",
           balanceAfter: 1000,
           createdAt: new Date()
         }
       }
     }
   )
   ```

## Check Current Balance

After updating, you can verify:
```bash
node scripts/updateWalletBalance.js <YOUR_CLERK_ID> 0
```
(Setting to 0 will show current balance without changing it)

Or in MongoDB:
```javascript
db.users.findOne({ clerkId: "user_2abc123xyz" }, { walletBalance: 1, name: 1, email: 1 })
```

