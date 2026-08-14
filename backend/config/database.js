const mongoose = require('mongoose');
const dns = require('dns');

// Configure public DNS servers to resolve MongoDB Atlas SRV records reliably on Windows environments
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if DNS override is locked by local OS policy
}

/**
 * Connect to MongoDB Database using Mongoose with production best practices
 * Handlers: Success connection, Connection errors, Disconnection, Graceful Shutdown
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn('⚠️ MONGODB_URI missing in .env file. Running in offline fallback mode.');
    return null;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host} / ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`⚠️ MongoDB Service Connection Warning: ${error.message}. Express API running in fallback mode.`);
    return null;
  }
};

// Monitor Mongoose connection events
mongoose.connection.on('connected', () => {
  console.log('ℹ️ Mongoose connection established');
});

mongoose.connection.on('error', (err) => {
  console.error(`⚠️ Mongoose connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ Mongoose connection disconnected!');
});

// Handle Graceful Process Termination (SIGINT / SIGTERM)
const closeDBConnection = async (signal) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log(`🛑 Mongoose connection closed gracefully due to app termination (${signal})`);
    }
    process.exit(0);
  } catch (err) {
    console.error(`Error closing Mongoose connection: ${err.message}`);
    process.exit(1);
  }
};

process.on('SIGINT', () => closeDBConnection('SIGINT'));
process.on('SIGTERM', () => closeDBConnection('SIGTERM'));

module.exports = connectDB;
