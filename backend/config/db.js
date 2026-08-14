const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/edumanage_pro', {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB Connection Warning: ${error.message}. Backend will run with fallback mock database responses.`);
  }
};

module.exports = connectDB;
