require('dotenv').config();
const mongoose = require('mongoose');

async function checkStorage() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const stats = await db.stats();
    
    console.log("=== MONGODB USAGE ===");
    const dataSizeMB = (stats.dataSize / (1024 * 1024)).toFixed(2);
    const storageSizeMB = (stats.storageSize / (1024 * 1024)).toFixed(2);
    
    console.log(`Data Size: ${dataSizeMB} MB`);
    console.log(`Allocated Storage Size: ${storageSizeMB} MB`);
    console.log(`Free Tier Limit (Atlas M0): 512 MB`);
    
    const percentUsed = ((storageSizeMB / 512) * 100).toFixed(2);
    console.log(`Percentage Used (Storage): ${percentUsed}%`);
    console.log(`Free Space Remaining: ${(512 - storageSizeMB).toFixed(2)} MB`);
    
    process.exit(0);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
}

checkStorage();
