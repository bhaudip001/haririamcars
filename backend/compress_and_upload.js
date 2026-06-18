import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';

ffmpeg.setFfmpegPath(ffmpegPath.path);

cloudinary.config({
  cloud_name: 'dvo48lu7g',
  api_key: '934655314158967',
  api_secret: 'fK2xl3LqNDcsYhLLKVbyXvxl3XQ'
});

const videos = [
  { name: 'showroom_video', path: '../frontend/public/IMG_5512.MOV' },
  { name: 'IMG_5506', path: '../frontend/public/car delivery/IMG_5506.MOV' },
  { name: 'IMG_5509', path: '../frontend/public/car delivery/IMG_5509.MOV' },
  { name: 'IMG_5510', path: '../frontend/public/car delivery/IMG_5510.MOV' },
  { name: 'IMG_5514', path: '../frontend/public/car delivery/IMG_5514.MOV' }
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compressVideo = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    console.log(`\n⚙️  Compressing ${path.basename(inputPath)}... (This might take a while, please wait)`);
    ffmpeg(inputPath)
      .outputOptions([
        '-c:v libx264',
        '-crf 28',         // higher number = more compression
        '-preset fast',    // fast compression
        '-s 720x1280',     // resize to 720p vertical
        '-c:a aac',
        '-b:a 128k'
      ])
      .on('end', () => {
        console.log(`✅ Compression finished: ${outputPath}`);
        resolve();
      })
      .on('error', (err) => {
        console.error(`❌ Compression error:`, err);
        reject(err);
      })
      .save(outputPath);
  });
};

const uploadVideo = (filePath, publicId) => {
  return new Promise((resolve, reject) => {
    console.log(`☁️  Uploading ${publicId} to Cloudinary...`);
    cloudinary.uploader.upload_large(filePath, {
      resource_type: "video",
      folder: "hariram-motors-videos",
      public_id: publicId,
      chunk_size: 6000000 
    }, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};

async function processVideos() {
  const results = {};
  
  for (const video of videos) {
    const fullInputPath = path.resolve(__dirname, video.path);
    const compressedPath = path.resolve(__dirname, `compressed_${video.name}.mp4`);
    
    if (fs.existsSync(fullInputPath)) {
      try {
        // Step 1: Compress
        await compressVideo(fullInputPath, compressedPath);
        
        // Step 2: Upload
        const res = await uploadVideo(compressedPath, video.name);
        console.log(`🎉 Upload Success: ${res.secure_url}`);
        results[video.name] = res.secure_url;
        
        // Step 3: Cleanup compressed file
        fs.unlinkSync(compressedPath);
        
      } catch (err) {
        console.error(`❌ Failed to process ${video.name}:`, err.message || err);
      }
    } else {
      console.log(`⚠️ File not found: ${fullInputPath}`);
    }
  }
  
  console.log('\n--- FINAL UPLOAD RESULTS ---');
  console.log(JSON.stringify(results, null, 2));
  process.exit(0);
}

processVideos();
