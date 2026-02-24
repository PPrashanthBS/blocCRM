import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import leadRoutes from './routes/leadRoutes';
import salesCallerRoutes from './routes/salesCallerRoutes';
import assignmentRoutes from './routes/assignmentRoutes';
import { errorHandler, notFound } from './middlewares/errorHandler';

dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/leads', leadRoutes);
app.use('/api/sales-callers', salesCallerRoutes);
app.use('/api/assignments', assignmentRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
