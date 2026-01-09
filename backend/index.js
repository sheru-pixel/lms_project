import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieS from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import authRouther from './route/authroute.js';
import userRouter from './route/userRoute.js';
import courseRouter from './route/courseRoute.js';
import paymentRouter from './route/paymentRoute.js';
import chatRouter from './route/chatRoute.js';
import availabilityRouter from './route/availabilityRoute.js';
import sessionRouter from './route/sessionRoute.js';
import quizRouter from './route/quizRoute.js';
import connectdb from './config/connectDb.js';  

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieS()); 
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use('/api/auth', authRouther);
app.use('/api/user', userRouter);
app.use('/api/course', courseRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/chat', chatRouter);
app.use('/api/availability', availabilityRouter);
app.use('/api/session', sessionRouter);
app.use('/api/quiz', quizRouter);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    connectdb();
});






