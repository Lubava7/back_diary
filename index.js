import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { getRecords, addRecord, getPostgresVersion } from './server.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use(express.json({ limit: '500mb', extended: true }));
app.use(
  express.urlencoded({ limit: '500mb', extended: true, parameterLimit: 50000 })
);

const corsOptions = {
  origin: [
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'https://lubava7.github.io/diary/',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));

const port = process.env.PORT || 3000;

getPostgresVersion().catch(console.error);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

app.get('/', (req, res) => {
  res.send('Express + TS server ');
});
app.get('/records', (req, res) => {
  console.log('Reached /records endpoint');
  getRecords(req, res);
});
app.post('/records', (req, res) => {
  console.log('Reached /records endpoint');
  addRecord(req, res);
});

app.post('/', (req, res) => {
  res.send('сервер работает!! POST method');
});
