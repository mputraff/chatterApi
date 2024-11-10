import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import fs from "fs/promises";
import path from "path";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk parsing JSON
app.use(express.json());

// Menggunakan path relatif dari root proyek untuk Swagger JSON
async function loadSwaggerDoc() {
  try {
    const swaggerPath = path.join(process.cwd(), "swagger", "swagger.json");
    console.log(`Loading Swagger document from: ${swaggerPath}`);
    const swaggerDocument = JSON.parse(await fs.readFile(swaggerPath, "utf-8"));
    console.log("Swagger document loaded successfully.");

    const options = {
      swaggerOptions: {
        url: `https://chatter-api.vercel.app/swagger/swagger.json`,
      },
      customCssUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.3/swagger-ui.css",
    };

    app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument, options)
    );
  } catch (error) {
    console.error("Error loading Swagger document:", error);
  }
}

// Mengatur route API utama
app.use("/api", authRoutes);

// Memanggil fungsi untuk memuat dokumen Swagger
loadSwaggerDoc();

// Koneksi ke MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Memulai server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
