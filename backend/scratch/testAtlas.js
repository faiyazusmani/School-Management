require('dotenv').config();
const dns = require('dns');
// Set public DNS servers to resolve MongoDB Atlas SRV records on Windows networks
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');

async function testAtlas() {
  console.log('Connecting to MongoDB Atlas with Google DNS SRV resolver...');
  const uri = process.env.MONGODB_URI;
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ SUCCESS! Connected to MongoDB Atlas Cluster: ${conn.connection.host} / Database: ${conn.connection.name}`);
    await mongoose.connection.close();
  } catch (err) {
    console.error(`❌ Atlas Connection Error: ${err.message}`);
  }
}

testAtlas();
