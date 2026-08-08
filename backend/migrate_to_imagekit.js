import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import sharp from 'sharp';
import ImageKit from 'imagekit';
import Car from './models/Car.js';

// Load environment variables
dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function migrateImages() {
  console.log('Connecting to MongoDB...');
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully.');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }

  try {
    const cars = await Car.find({});
    console.log(`Found ${cars.length} cars to process.\n`);

    for (let i = 0; i < cars.length; i++) {
      let car = cars[i];
      let updated = false;
      let newImagesArray = [];

      console.log(`[Car ${i + 1}/${cars.length}] Processing: ${car.make} ${car.model} (${car.year})`);

      for (let j = 0; j < car.images.length; j++) {
        let imgObj = car.images[j];
        let originalUrl = imgObj.url || imgObj; // Fallback in case of string

        // Skip if already on ImageKit
        if (originalUrl.includes('ik.imagekit.io')) {
          console.log(`  - Photo ${j + 1}/${car.images.length}: Already on ImageKit, skipping.`);
          newImagesArray.push(imgObj);
          continue;
        }

        // Only process ImgBB or external URLs
        if (originalUrl.includes('ibb.co')) {
          console.log(`  - Photo ${j + 1}/${car.images.length}: Downloading from ImgBB...`);
          try {
            // 1. Download original image
            const response = await axios.get(originalUrl, { responseType: 'arraybuffer', timeout: 15000 });
            const imageBuffer = Buffer.from(response.data, 'binary');

            // 2. Compress with Sharp
            console.log(`    Compressing...`);
            const webpBuffer = await sharp(imageBuffer)
              .resize({ width: 1280, withoutEnlargement: true })
              .webp({ quality: 75 })
              .toBuffer();

            // 3. Upload to ImageKit
            console.log(`    Uploading to ImageKit...`);
            const ikResponse = await imagekit.upload({
              file: webpBuffer,
              fileName: `car-${car._id}-photo-${j}.webp`,
              folder: '/inventory'
            });

            // Replace image object with ImageKit data
            newImagesArray.push({
              url: ikResponse.url,
              publicId: ikResponse.fileId // Map ImageKit's fileId to our publicId
            });
            updated = true;
            console.log(`    Success: ${ikResponse.url}`);

          } catch (err) {
            console.error(`    ERROR migrating photo ${j + 1}:`, err.message);
            // Keep original to prevent breaking the car record
            newImagesArray.push(imgObj);
          }
        } else {
          // Keep non-ImgBB URLs intact
          newImagesArray.push(imgObj);
        }
      }

      if (updated) {
        car.images = newImagesArray;
        await car.save();
        console.log(`[Car ${i + 1}] Successfully updated in MongoDB.\n`);
      } else {
        console.log(`[Car ${i + 1}] No images needed migration.\n`);
      }
    }

    console.log('Migration completely finished!');
    process.exit(0);
  } catch (error) {
    console.error('Fatal Error during migration:', error);
    process.exit(1);
  }
}

migrateImages();
