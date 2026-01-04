/**
 * Script to find user by email or list all users
 * 
 * Usage:
 *   node backend/scripts/findUser.js <email>
 *   node backend/scripts/findUser.js --list
 */

import mongoose from "mongoose";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

const findUser = async (email) => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/astrouser";
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB\n");

    if (email === "--list") {
      // List all users
      const users = await User.find({})
        .select("clerkId name email walletBalance role")
        .sort({ createdAt: -1 })
        .lean();

      console.log(`📋 Found ${users.length} users:\n`);
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name || "No name"} (${user.email || "No email"})`);
        console.log(`   Clerk ID: ${user.clerkId}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Wallet: ₹${user.walletBalance}`);
        console.log("");
      });
    } else {
      // Find user by email
      const user = await User.findOne({ email });
      
      if (!user) {
        console.error(`❌ User not found with email: ${email}`);
        console.log("\n💡 Try listing all users:");
        console.log("   node backend/scripts/findUser.js --list");
        process.exit(1);
      }

      console.log(`✅ User found:\n`);
      console.log(`   Name: ${user.name || "No name"}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Clerk ID: ${user.clerkId}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Wallet Balance: ₹${user.walletBalance}`);
      console.log(`\n💡 To update wallet balance, run:`);
      console.log(`   node backend/scripts/updateWalletBalance.js ${user.clerkId} <amount>`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Usage:");
  console.log("  node findUser.js <email>          - Find user by email");
  console.log("  node findUser.js --list           - List all users");
  console.log("\nExample:");
  console.log("  node findUser.js user@example.com");
  process.exit(1);
}

findUser(args[0]);

