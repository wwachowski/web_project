import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API działa!');
});

app.listen(3000, () => {
  console.log('Serwer działa na http://localhost:3000');
});
