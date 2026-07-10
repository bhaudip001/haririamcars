const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const inputPath = 'e:\\hariram motor\\website\\haririamcars\\frontend\\public\\IMG_5512.MOV';
const outputPath = 'e:\\hariram motor\\website\\haririamcars\\frontend\\public\\IMG_5512.mp4';

console.log(`Starting compression of ${inputPath}...`);

ffmpeg(inputPath)
  .videoCodec('libx264')
  .videoBitrate('1500k')
  .on('end', async () => {
    console.log(`✅ Finished compressing: ${outputPath}`);
    
    // Check new size
    const stats = fs.statSync(outputPath);
    const sizeMB = stats.size / (1024 * 1024);
    console.log(`New size: ${sizeMB.toFixed(2)} MB`);

    console.log(`Uploading to Cloudinary...`);
    try {
      const result = await cloudinary.uploader.upload(outputPath, {
        resource_type: "video",
        folder: "hariram-motors/videos"
      });
      console.log(`🎉 Upload successful! URL: ${result.secure_url}`);
    } catch (err) {
      console.error("❌ Cloudinary Upload Error:", err);
    }
  })
  .on('error', (err) => {
    console.error(`❌ Error compressing:`, err);
  })
  .save(outputPath);
