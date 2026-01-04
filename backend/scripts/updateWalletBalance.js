/**
 * Script to update user wallet balance in MongoDB
 * 
 * Usage:
 *   node backend/scripts/updateWalletBalance.js <clerkId> <amount>
 * 
 * Example:
 *   node backend/scripts/updateWalletBalance.js user_2abc123 1000
 */

import mongoose from "mongoose";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

const updateWallet = async (clerkId, amount) => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/astrouser";
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    // Find user by clerkId (or email if clerkId not found)
    let user = await User.findOne({ clerkId });
    
    if (!user) {
      // Try finding by email (in case user provided email instead of clerkId)
      user = await User.findOne({ email: clerkId });
      if (user) {
        console.log(`⚠️  Found user by email instead. Using Clerk ID: ${user.clerkId}`);
      }
    }
    
    if (!user) {
      console.error(`❌ User not found with clerkId/email: ${clerkId}`);
      console.log("\n💡 Tip: Use findUser.js to find your Clerk ID:");
      console.log("   node backend/scripts/findUser.js <your-email>");
      console.log("   node backend/scripts/findUser.js --list");
      process.exit(1);
    }

    console.log(`\n📊 User found: ${user.name} (${user.email})`);
    console.log(`📊 Current wallet balance: ₹${user.walletBalance}`);
    
    // If amount is 0, just show balance and exit
    if (parseFloat(amount) === 0) {
      console.log(`\n✅ Current balance: ₹${user.walletBalance}`);
      await mongoose.disconnect();
      process.exit(0);
    }

    console.log(`💰 Setting wallet balance to: ₹${amount}`);

    // Update wallet balance
    const oldBalance = user.walletBalance;
    const newBalance = parseFloat(amount);
    user.walletBalance = newBalance;
    
    // Add transaction record only if balance changed
    if (oldBalance !== newBalance) {
      user.walletTransactions.push({
        type: newBalance > oldBalance ? "CREDIT" : "DEBIT",
        amount: Math.abs(newBalance - oldBalance),
        reason: "Manual balance update via script",
        balanceAfter: newBalance,
        createdAt: new Date()
      });
    }

    await user.save();

    console.log(`\n✅ Wallet balance updated successfully!`);
    console.log(`   Old balance: ₹${oldBalance}`);
    console.log(`   New balance: ₹${user.walletBalance}`);
    console.log(`   User: ${user.name} (${user.email})`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating wallet:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log("Usage: node updateWalletBalance.js <clerkId> <amount>");
  console.log("Example: node updateWalletBalance.js user_2abc123 1000");
  process.exit(1);
}

const [clerkId, amount] = args;

if (isNaN(amount)) {
  console.error("❌ Amount must be a number");
  process.exit(1);
}

updateWallet(clerkId, amount);

