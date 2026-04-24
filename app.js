import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(compression());
app.use(cors());
app.use(express.json());

// Serve static files from the 'dist' directory with a 1-year cache lifetime
// This matches Lighthouse recommendations for efficient caching
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1y',
  immutable: true,
  etag: true,
  lastModified: true
}));

// Handle Single Page Application (SPA) routing
// This ensures that all routes are handled by index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Local architecture: ${process.arch}`);
  console.log(`Serving from: ${path.join(__dirname, 'dist')}`);
});
