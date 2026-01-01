import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'dotenv/config';
import tiktokRoute from './routes/tiktok.route.js';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
  })
);

app.use(express.json());

app.use('/api/tiktok', tiktokRoute);

const PORT = Number(process.env.PORT) || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
