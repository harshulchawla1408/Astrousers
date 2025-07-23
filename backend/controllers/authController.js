import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

// For Google/NextAuth login
export const handleAuth = async (req, res) => {
  const { email, name, image, authProvider } = req.body;

  if (!email || !authProvider) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        name,
        image,
        authProvider,
      });
    }

    const token = generateToken(user);
    return res.status(200).json({ token, user });
  } catch (error) {
    console.error("handleAuth error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// For manual registration
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      authProvider: "manual",
    });

    const token = generateToken(newUser);
    return res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error("registerUser error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};
