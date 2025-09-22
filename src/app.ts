import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db';
import authRoutes from './routes/authRoutes';
import quizRoutes from './routes/quizRoutes';

dotenv.config();

const app = express();

app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});