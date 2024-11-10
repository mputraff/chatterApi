import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import fs from 'fs/promises';
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(express.json());

async function loadSwaggerDoc() {
    try {
      const swaggerPath = path.join(__dirname, 'swagger', 'swagger.json');
      const swaggerDocument = JSON.parse(await fs.readFile(swaggerPath, 'utf-8'));
      
      app.use('/api', authRoutes);
      app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    } catch (error) {
      console.error('Error loading swagger document:', error);
    }
  }

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB:", error);
    });

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
