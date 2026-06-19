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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.resolve(__dirname, '../frontend/public/IMG_5512.MOV');
const outputPath = path.resolve(__dirname, 'compressed_showroom.mp4');

const compressVideo = () => {
  return new Promise((resolve, reject) => {
    console.log(`⚙️  Compressing IMG_5512.MOV (Showroom Video)...`);
    ffmpeg(inputPath)
      .outputOptions([
        '-c:v libx264',
        '-crf 22',
        '-preset fast',
        '-c:a aac',
        '-b:a 192k'
      ])
      .on('end', () => {
        console.log(`✅ Compression finished!`);
        resolve();
      })
      .on('error', (err) => {
        console.error(`❌ Compression error:`, err);
        reject(err);
      })
      .save(outputPath);
  });
};

const uploadVideo = () => {
  return new Promise((resolve, reject) => {
    console.log(`☁️  Uploading showroom_video to Cloudinary...`);
    cloudinary.uploader.upload_large(outputPath, {
      resource_type: "video",
      folder: "hariram-motors-videos",
      public_id: "showroom_video",
      chunk_size: 6000000 
    }, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};

async function run() {
  if (fs.existsSync(inputPath)) {
    try {
      await compressVideo();
      const res = await uploadVideo();
      console.log(`🎉 Upload Success: ${res.secure_url}`);
      fs.unlinkSync(outputPath);
    } catch (err) {
      console.error(`❌ Failed:`, err);
    }
  } else {
    console.log(`⚠️ File not found: ${inputPath}`);
  }
}

run();
