const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

cloudinary.api.usage().then(result => {
  console.log("=== CLOUDINARY USAGE ===");
  if (result.storage) {
     const usedMb = (result.storage.usage / (1024 * 1024)).toFixed(2);
     const limitMb = (result.storage.limit / (1024 * 1024)).toFixed(2);
     const percent = ((result.storage.usage / result.storage.limit) * 100).toFixed(2);
     console.log(`Storage: ${usedMb} MB / ${limitMb} MB (${percent}%)`);
  }
  if (result.bandwidth) {
     const usedMb = (result.bandwidth.usage / (1024 * 1024)).toFixed(2);
     const limitMb = (result.bandwidth.limit / (1024 * 1024)).toFixed(2);
     const percent = ((result.bandwidth.usage / result.bandwidth.limit) * 100).toFixed(2);
     console.log(`Bandwidth: ${usedMb} MB / ${limitMb} MB (${percent}%)`);
  }
  console.log("Full Response:", JSON.stringify(result, null, 2));
}).catch(error => {
  console.error("Error fetching usage:", error);
});
