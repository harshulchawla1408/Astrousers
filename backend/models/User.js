import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String }, 
  image: String,
  authProvider: { type: String, enum: ['google', 'otp', 'apple', 'facebook', 'manual'], required: true },
});


export default mongoose.model("User", userSchema);
