// Enhanced database connection with retry logic and monitoring
const mongoose = require('mongoose');
const logger = require('./logger');

let retryCount = 0;
const MAX_RETRIES = 5;

const connectDB = async () => {
  try {
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    logger.info(`MongoDB Connected`, { 
      host: conn.connection.host,
      database: conn.connection.name
    });
    
    retryCount = 0;

    mongoose.connection.on('error', (err) => {
      logger.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected');
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        setTimeout(connectDB, 5000);
      }
    });

    process.on('SIGTERM', async () => {
      await mongoose.connection.close();
      process.exit(0);
    });

  } catch (error) {
    logger.error('Database connection failed:', error);
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      logger.warn(`Retrying database connection`, { retry: retryCount, maxRetries: MAX_RETRIES });
      setTimeout(connectDB, 5000);
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
