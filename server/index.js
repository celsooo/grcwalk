import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './database/connection.js';
import { setupDatabase } from './database/setup.js';
import { seedDatabase } from './database/seedData.js';
import risksRouter from './routes/risks.js';
import controlsRouter from './routes/controls.js';
import bowtieRouter from './routes/bowtie.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/risks', risksRouter);
app.use('/api/controls', controlsRouter);
app.use('/api/bowtie', bowtieRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'GRCWalk API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const startServer = async () => {
  try {
    console.log('🚀 Starting GRCWalk server...');
    
    // Test database connection
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ Cannot start server without database connection');
      console.log('📋 Please ensure MySQL is running and check your .env configuration:');
      console.log('   - DB_HOST=localhost');
      console.log('   - DB_PORT=3306');
      console.log('   - DB_USER=grcwalk_user');
      console.log('   - DB_PASSWORD=grcwalk_password');
      console.log('   - DB_NAME=grcwalk_db');
      process.exit(1);
    }

    // Setup database schema
    try {
      await setupDatabase();
    } catch (error) {
      console.warn('⚠️  Database setup failed:', error.message);
      console.log('📋 This might be normal if the database already exists');
    }

    // Seed database with initial data
    try {
      await seedDatabase();
    } catch (error) {
      console.warn('⚠️  Database seeding failed:', error.message);
      console.log('📋 This might be normal if the database already contains data');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 API available at http://localhost:${PORT}/api`);
      console.log(`🌐 Frontend should connect to http://localhost:5173`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();