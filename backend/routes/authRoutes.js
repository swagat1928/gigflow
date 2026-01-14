import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import validator from "validator";

const router = express.Router();

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ msg: "Invalid email address" });
  }

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ msg: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hashed });

  const token = createToken(user._id);
  res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax" });

  res.json({ id: user._id, name: user.name, email: user.email });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ msg: "Invalid email format" });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "Invalid credentials" });

  const token = createToken(user._id);
  res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax" });

  res.json({ id: user._id, name: user.name, email: user.email });
});

// Get current user
router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ msg: "Logged out" });
});

export default router;
