import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import criminalRoutes from './routes/criminals.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 30600;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the Frontend directory
app.use(express.static(path.join(__dirname, 'Frontend')));

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/criminals', criminalRoutes);

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Database connection details:`);
  console.log(`- Host: ${process.env.DB_HOST}`);
  console.log(`- Database: ${process.env.DB_NAME}`);
  console.log(`- User: ${process.env.DB_USER}`);
});
