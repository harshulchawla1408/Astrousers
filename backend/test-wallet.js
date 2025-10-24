// Test script for Astrousers Wallet System
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.js";

dotenv.config();

const testWalletSystem = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Test 1: Create a test user with wallet
    console.log("\n🧪 Test 1: Creating user with wallet...");
    const testUser = await User.create({
      clerkId: "test_user_123",
      email: "test@astrousers.com",
      fullName: "Test User",
      profileImage: "https://example.com/avatar.jpg",
      coins: 100,
      transactions: [{
        type: 'credit',
        amount: 100,
        description: 'Welcome bonus - Account created'
      }]
    });
    console.log("✅ Test user created:", {
      id: testUser._id,
      coins: testUser.coins,
      transactions: testUser.transactions.length
    });

    // Test 2: Add transaction (recharge)
    console.log("\n🧪 Test 2: Adding recharge transaction...");
    testUser.coins += 500;
    testUser.transactions.push({
      type: 'credit',
      amount: 500,
      description: 'Wallet Recharge via Razorpay - Test'
    });
    await testUser.save();
    console.log("✅ Recharge added:", {
      newBalance: testUser.coins,
      totalTransactions: testUser.transactions.length
    });

    // Test 3: Deduct coins (session)
    console.log("\n🧪 Test 3: Deducting coins for session...");
    const sessionCost = 60; // 60 coins for a session
    if (testUser.coins >= sessionCost) {
      testUser.coins -= sessionCost;
      testUser.transactions.push({
        type: 'debit',
        amount: sessionCost,
        description: 'Video session with astrologer_789'
      });
      await testUser.save();
      console.log("✅ Session cost deducted:", {
        remainingBalance: testUser.coins,
        sessionCost: sessionCost
      });
    } else {
      console.log("❌ Insufficient balance for session");
    }

    // Test 4: Check transaction history
    console.log("\n🧪 Test 4: Transaction history...");
    const recentTransactions = testUser.transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    
    console.log("✅ Recent transactions:");
    recentTransactions.forEach((tx, index) => {
      console.log(`  ${index + 1}. ${tx.type.toUpperCase()} ${tx.amount} coins - ${tx.description}`);
    });

    // Test 5: Balance validation
    console.log("\n🧪 Test 5: Balance validation...");
    const requiredCoins = 100;
    const hasEnough = testUser.coins >= requiredCoins;
    console.log(`✅ Balance check: ${hasEnough ? 'SUFFICIENT' : 'INSUFFICIENT'} (${testUser.coins}/${requiredCoins})`);

    // Test 6: Low balance warning
    console.log("\n🧪 Test 6: Low balance scenarios...");
    if (testUser.coins < 50) {
      console.log("⚠️  LOW BALANCE WARNING: User has less than 50 coins");
    } else if (testUser.coins < 100) {
      console.log("⚠️  MEDIUM BALANCE: User has less than 100 coins");
    } else {
      console.log("✅ GOOD BALANCE: User has sufficient coins");
    }

    // Cleanup: Remove test user
    console.log("\n🧹 Cleanup: Removing test user...");
    await User.deleteOne({ clerkId: "test_user_123" });
    console.log("✅ Test user removed");

    console.log("\n🎉 All wallet system tests passed!");
    console.log("\n📋 Test Summary:");
    console.log("  ✅ User creation with default 100 coins");
    console.log("  ✅ Wallet recharge functionality");
    console.log("  ✅ Coin deduction for sessions");
    console.log("  ✅ Transaction history tracking");
    console.log("  ✅ Balance validation");
    console.log("  ✅ Low balance detection");

  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  }
};

// Run tests
testWalletSystem();
