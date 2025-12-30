import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import tiktokRoute from './routes/tiktok.route.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/tiktok', tiktokRoute);

const PORT = process.env['PORT'] || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
