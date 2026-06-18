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
  { name: 'IMG_5503', path: '../frontend/public/customer review/IMG_5503.MOV' },
  { name: 'IMG_5504', path: '../frontend/public/customer review/IMG_5504.MOV' },
  { name: 'IMG_5505', path: '../frontend/public/customer review/IMG_5505.MOV' },
  { name: 'IMG_5507', path: '../frontend/public/customer review/IMG_5507.MOV' },
  { name: 'IMG_5511', path: '../frontend/public/customer review/IMG_5511.MOV' },
  { name: 'IMG_5513', path: '../frontend/public/customer review/IMG_5513.MOV' }
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compressVideo = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    console.log(`\n⚙️  Compressing ${path.basename(inputPath)}... (This might take a while, please wait)`);
    ffmpeg(inputPath)
      .outputOptions([
        '-c:v libx264',
        '-crf 22',         // Visually lossless quality
        '-preset fast',
        '-s 1080x1920',    // Keep high resolution (1080p)
        '-c:a aac',
        '-b:a 192k'        // Better audio quality
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
      folder: "hariram-motors-reviews",
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
    const compressedPath = path.resolve(__dirname, `compressed_review_${video.name}.mp4`);
    
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
