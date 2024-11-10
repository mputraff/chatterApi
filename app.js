import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import fs from 'fs';
const swaggerDocument = JSON.parse(fs.readFileSync('./swagger/swagger.json', 'utf-8'));
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(express.json());

app.use('/api', authRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
