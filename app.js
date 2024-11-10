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

const connectToMongoDB = async () => {
  try {
      const mongoURI = process.env.MONGODB_URI;
      if (!mongoURI) {
          throw new Error('MONGODB_URI is not defined');
      }
      await mongoose.connect(mongoURI, {
          serverSelectionTimeoutMS: 5000
      });
      console.log('Connected to MongoDB');
  } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1);  // Exit jika tidak bisa connect ke MongoDB
  }
};

// Memulai server
const startServer = async () => {
  await connectToMongoDB();

  const port = process.env.PORT; 
  app.listen(port, "0.0.0.0", () => {
    // Bind ke 0.0.0.0
    console.log(`Server is running on port ${port}`);
  });
};

startServer();
