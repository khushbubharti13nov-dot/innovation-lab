import app from './app.js'; // <-- FIX: Added '.js' extension

// We need this to manually load .env for our `yarn dev` script
import * as dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Backend server is running on http://localhost:${PORT}`);
});