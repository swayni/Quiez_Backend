import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db';
import './models/User';
import './models/Quiz';
import './models/Question';
import './models/Answer';
import authRoutes from './routes/authRoutes';
import quizRoutes from './routes/quizRoutes';
import swaggerUi from "swagger-ui-express";
import swaggerSpec from './swagger';

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api-docs/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
 
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
console.log(process.env.MONGO_URI);
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT}/api/ adresinde çalışıyor.`);
});
