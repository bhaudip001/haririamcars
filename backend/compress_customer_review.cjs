const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
const path = require('path');
const fs = require('fs');

const directory = 'e:\\hariram motor\\website\\haririamcars\\frontend\\public\\customer review';

function compressVideo(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    console.log(`\nStarting compression: ${path.basename(inputPath)}`);
    console.log(`Target: HD 720p, under 100MB. This will take a few minutes...`);
    
    ffmpeg(inputPath)
      .videoCodec('libx264')
      .videoBitrate('1500k') // High quality but guarantees small file size
      .on('end', () => {
        console.log(`✅ Finished compressing: ${path.basename(outputPath)}`);
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error(`❌ Error compressing ${path.basename(inputPath)}:`, err);
        reject(err);
      })
      .save(outputPath);
  });
}

async function main() {
  console.log('--- Batch Converting & Compressing Videos in Customer Review ---');
  
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    if (file.toLowerCase().endsWith('.mov')) {
      const inputPath = path.join(directory, file);
      
      const stats = fs.statSync(inputPath);
      const sizeMB = stats.size / (1024 * 1024);
      
      console.log(`\nFound: ${file} (${sizeMB.toFixed(2)} MB)`);
      
      const outputPath = path.join(directory, file.replace(/\.mov$/i, '.mp4'));
      
      try {
        await compressVideo(inputPath, outputPath);
        fs.unlinkSync(inputPath);
        console.log(`🗑️ Deleted original ${file}`);
      } catch (e) {
        console.log(`Failed on ${file}. Moving to next.`);
      }
    }
  }
  
  console.log('\n🎉 All .MOV videos in Customer Review have been converted to .MP4 and shrunk under 100 MB!');
}

main();
