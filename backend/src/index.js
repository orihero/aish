import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { requestLogger } from "./middleware/logger.middleware.js";
import mongoose from "mongoose";
import { errorHandler } from "./middleware/error.middleware.js";
import "./config/telegram.js";
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import vacancyRoutes from "./routes/vacancy.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import companyRoutes from "./routes/company.routes.js";
import skillsRoutes from "./routes/skills.route.js";
import * as models from "./models/index.js";

dotenv.config();

export const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/vacancies", vacancyRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/companies", companyRoutes);

// Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("MongoDB connection error:", error));

// Basic route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Vuexy API" });
});

// Error handling middleware
app.use(errorHandler);

// Only start server if not in test environment
if (process.env.NODE_ENV !== "test") {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
