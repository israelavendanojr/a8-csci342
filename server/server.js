// server/server.js
// Assignment 6 â€" Express backend for PlateScout.
// This server stores users in memory for now.
// MongoDB, password hashing, JWTs, and protected routes come later.

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware â€" mounted BEFORE any route.
//   cors()           â€" lets the browser call this server during dev
//   express.json()   â€" populates req.body on POST requests
app.use(cors({
  origin: [
    "http://localhost:5173",                       // dev
    "https://your-platescout.vercel.app",          // <-- your Vercel URL (after Step D)
    /\.vercel\.app$/,                              // optional: preview branches
  ],
  credentials: true,
}));
app.use(express.json());

// Connect to MongoDB Atlas before any routes.
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User schema and model.
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

function validateInputs({ username, email, password }) {
  if (!username || username.trim().length < 3) {
    return "Username must be at least 3 characters.";
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Invalid email address.";
  }

  if (!password || password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  return "";
}

app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  const validationError = validateInputs({ username, email, password });
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(409).json({ error: "Username already taken." });
  }

  const hash = await bcrypt.hash(password, 10);
  const newUser = await User.create({ username, email, password: hash });

  return res.status(201).json({
    message: "User registered successfully.",
    user: {
      username: newUser.username,
      email: newUser.email,
    },
  });
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  const passwordMatch = user && (await bcrypt.compare(password, user.password));

  if (!user || !passwordMatch) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return res.status(200).json({
    message: "Login successful.",
    user: {
      username: user.username,
      email: user.email,
    },
    token,
  });
});

app.post("/api/logout", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token." });
  }

  const token = authHeader.slice(7);

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    // Accept expired or invalid tokens for logout
  }

  return res.status(200).json({ message: "Logged out." });
});

// GET /api/users - for quiz 6
app.get("/api/users", (req, res) => {
  const safeUsers = users.map(({ username, email }) => ({ username, email }));
  return res.status(200).json({ users: safeUsers });
});

// DELETE /api/users/:username — for quiz 6
app.delete("/api/users/:username", (req, res) => {
  const { username } = req.params;
  const index = users.findIndex((u) => u.username === username);

  if (index === -1) {
    return res.status(404).json({ error: "User not found." });
  }

  users.splice(index, 1);
  return res.status(200).json({ message: `User "${username}" deleted.` });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
    mongo: mongoose.connection.readyState === 1,
  });
});

// 404 fallback â€" must come AFTER all routes so they match first.
app.use((req, res) => {
  return res.status(404).json({
    error: "Route not found.",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});