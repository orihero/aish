import express from 'express';
import cors from 'cors';
import skillsRouter from './routes/skills.route.js';
import authRouter from './routes/auth.routes.js';
import resumeRouter from './routes/resume.routes.js';
import chatRouter from './routes/chat.routes.js';
import applicationRouter from './routes/application.routes.js';

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/skills', skillsRouter);
app.use('/api/auth', authRouter);
app.use('/api/resumes', resumeRouter);
app.use('/api/applications', applicationRouter);
app.use('/api/chats', chatRouter);

export default app; 