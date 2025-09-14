import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { errorHandler } from "./middleware/error.middleware.js";
import { requestLogger } from "./middleware/logger.middleware.js";
import { Logger } from "./utils/logger.js";
import applicationRoutes from "./routes/application.routes.js";
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import companyRoutes from "./routes/company.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import skillsRoutes from "./routes/skills.routes.js";
import vacancyRoutes from "./routes/vacancy.routes.js";

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
app.use("/api/applications", applicationRoutes);

// Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => Logger.success("🚀 Connected to MongoDB", { uri: process.env.MONGODB_URI }))
    .catch((error) => Logger.error("❌ MongoDB connection error", error));

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
        Logger.success(`🎉 Server is running on port ${PORT}`, { 
            port: PORT, 
            environment: process.env.NODE_ENV || 'development',
            timestamp: new Date().toISOString()
        });
    });
}
