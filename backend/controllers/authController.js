import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // This imports your MongoDB schema

// --- REGISTER ---
export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // 1. Basic Validation
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. CHECK MONGODB (instead of the array)
    const existingUser = await User.findOne({ email: normalizedEmail });
    
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. SAVE TO MONGODB
    const newUser = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword
    });

    await newUser.save(); // This is the line that creates data in Compass!
    
    console.log("✅ Registered in MongoDB:", normalizedEmail);
    return res.status(201).json({ message: "Registration successful!" });

  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Server error during registration" });
  }
};

// --- LOGIN ---
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    
    // 1. FIND USER IN MONGODB
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      console.log("❌ Login failed: User not found ->", normalizedEmail);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2. Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("❌ Login failed: Password mismatch ->", normalizedEmail);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Create Token
    const token = jwt.sign(
      { id: user._id, email: user.email }, // MongoDB uses _id
      process.env.JWT_SECRET || "YOUR_SECRET_KEY", 
      { expiresIn: "1d" }
    );

    console.log("🚀 Login Successful:", normalizedEmail);

    return res.status(200).json({
      token,
      user: { name: user.name, email: user.email }
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
};