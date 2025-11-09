import express, { type Application, type Request, type Response } from 'express'; // <-- FIX: 'import type'
import cors from 'cors';
import apiV1Router from './api/index.js'; // <-- FIX: Added '/index.js'

const app: Application = express();

// --- Core Middleware ---
// 1. Allow cross-origin requests
app.use(cors());
// 2. Parse JSON request bodies
app.use(express.json());
// 3. Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
// Mount our v1 API router
app.use('/api/v1', apiV1Router);

// --- Health Check Route ---
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'QuickCart API is up and running!',
    status: 'success',
  });
});

// --- TODO: Add Global Error Handler ---

export default app;