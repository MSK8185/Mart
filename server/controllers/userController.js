import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();

// Helper to generate unique userId
const generateUniqueUserId = (name) => {
  const timestamp = Date.now().toString(36);
  const randomString = Math.random().toString(36).substring(2, 6);
  const normalizedName = name.replace(/\s+/g, "").toLowerCase();
  return `${normalizedName}-${randomString}-${timestamp}`;
};

// Register a new user
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists. Please log in." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = generateUniqueUserId(name);

    const newUser = new User({
      userId,
      name,
      email,
      password: hashedPassword,
      wallet: { coins: 100 },
    });

    await newUser.save();
    res.status(201).json({
      message: "User registered successfully",
      userId,
      coins: 100,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found. Please register." });
    }

    res.status(200).json({ userId: user.userId, coins: user.wallet.coins });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const loginAdmin = async (req,res) => {
  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { email, type: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.status(200).json({ token, route: "/admin" });
  }

  return res.status(403).json({ message: "Unauthorized: Admin only" });
}

// In your backend controller
export const getUserCoinsByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ coins: user.wallet.coins });
  } catch (error) {
    console.error("Error fetching coins:", error); 
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

//get user
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "userId name email wallet"); 
    console.log("Fetched Users:", users); 
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


// Get total number of users
export const getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments(); // Count total users
    res.status(200).json({ totalUsers });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
