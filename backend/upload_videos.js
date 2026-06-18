import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

cloudinary.config({
  cloud_name: 'dvo48lu7g',
  api_key: '934655314158967',
  api_secret: 'fK2xl3LqNDcsYhLLKVbyXvxl3XQ'
});

const videos = [
  { name: 'showroom', path: '../frontend/public/IMG_5512.MOV' },
  { name: 'IMG_5502', path: '../frontend/public/car delivery/IMG_5502.MP4' },
  { name: 'IMG_5506', path: '../frontend/public/car delivery/IMG_5506.MOV' },
  { name: 'IMG_5509', path: '../frontend/public/car delivery/IMG_5509.MOV' },
  { name: 'IMG_5510', path: '../frontend/public/car delivery/IMG_5510.MOV' },
  { name: 'IMG_5514', path: '../frontend/public/car delivery/IMG_5514.MOV' }
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadVideo = (filePath, options) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(filePath, options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};

async function uploadVideos() {
  const results = {};
  
  for (const video of videos) {
    const fullPath = path.resolve(__dirname, video.path);
    if (fs.existsSync(fullPath)) {
      console.log(`Uploading ${video.name}... (this may take a few minutes)`);
      try {
        const res = await uploadVideo(fullPath, {
          resource_type: "video",
          folder: "hariram-motors-videos",
          public_id: video.name,
          chunk_size: 6000000 // 6MB chunks
        });
        console.log(`✅ Success: ${video.name}`);
        console.log(`URL: ${res.secure_url}`);
        results[video.name] = res.secure_url;
      } catch (err) {
        console.error(`❌ Failed to upload ${video.name}:`, err.message || err);
      }
    } else {
      console.log(`⚠️ File not found: ${fullPath}`);
    }
  }
  
  console.log('\n--- UPLOAD SUMMARY ---');
  console.log(JSON.stringify(results, null, 2));
  process.exit(0);
}

uploadVideos();
