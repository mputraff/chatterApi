import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk parsing JSON
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};


// Memulai server
const startServer = async () => {
  await connectDB();

  const port = process.env.PORT; 
  app.listen(port, "0.0.0.0", () => {
    // Bind ke 0.0.0.0
    console.log(`Server is running on port ${port}`);
  });
};

startServer();
