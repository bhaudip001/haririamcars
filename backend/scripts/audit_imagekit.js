import ImageKit from 'imagekit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

async function auditImageKitSizes() {
  console.log('\n=============================================');
  console.log('🚀 IMAGEKIT AUDIT: Verifying Average WebP Size');
  console.log('=============================================\n');

  try {
    const ik = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });

    console.log('Fetching files from ImageKit /inventory...');

    // Fetch first 500 files to get a good average
    const result = await new Promise((resolve, reject) => {
      ik.listFiles({
        path: '/inventory',
        limit: 500
      }, function(error, result) {
        if (error) reject(error);
        else resolve(result);
      });
    });

    if (!result || result.length === 0) {
      console.log('No files found in ImageKit /inventory folder.');
      process.exit(0);
    }

    let totalBytes = 0;
    let webpCount = 0;
    let otherFormatCount = 0;

    result.forEach(file => {
      totalBytes += file.size;
      
      // ImageKit usually sets mime type in mimetype or format
      const format = file.format || file.mimeType || file.filePath.split('.').pop();
      if (format.toLowerCase().includes('webp')) {
        webpCount++;
      } else {
        otherFormatCount++;
      }
    });

    const averageSizeKB = (totalBytes / result.length) / 1024;
    const totalSizeMB = totalBytes / (1024 * 1024);

    console.log('\n--- 📈 AUDIT RESULTS ---');
    console.log(`📸 Total Files Sampled: ${result.length}`);
    console.log(`📦 Total Size Evaluated: ${totalSizeMB.toFixed(2)} MB`);
    console.log(`🎯 AVERAGE FILE SIZE: ${averageSizeKB.toFixed(2)} KB`);
    console.log(`✅ WebP Format count: ${webpCount}`);
    console.log(`❌ Other Format count: ${otherFormatCount}`);

    if (averageSizeKB < 150) {
      console.log('\n🎉 SUCCESS! Images are perfectly compressed and optimized.');
    } else {
      console.log('\n⚠️ WARNING! Average size is above 150 KB. Compression might be failing.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ ImageKit Audit failed:', error);
    process.exit(1);
  }
}

auditImageKitSizes();
