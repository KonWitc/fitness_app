import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import exerciseRoutes from './routes/exercises';
import workoutRoutes from './routes/workouts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/exercises', exerciseRoutes);
app.use('/api/workouts', workoutRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
