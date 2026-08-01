import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import Car from '../models/Car.js';

async function auditDB() {
  console.log('\n=============================================');
  console.log('🚀 DB AUDIT: Verifying Image URLs');
  console.log('=============================================\n');

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is missing from .env');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const cars = await Car.find({});
    console.log(`📊 Found ${cars.length} total cars in DB`);

    let totalImages = 0;
    let validImageKitCount = 0;
    let legacyImgbbCount = 0;
    let brokenOrOtherCount = 0;
    
    let corruptedCars = [];

    cars.forEach(car => {
      let carHasErrors = false;
      
      if (!car.images || car.images.length === 0) {
        console.warn(`⚠️ Car [${car.make} ${car.model}] (ID: ${car._id}) has NO images!`);
        return;
      }

      car.images.forEach((img, idx) => {
        totalImages++;
        
        if (!img.url) {
          brokenOrOtherCount++;
          carHasErrors = true;
          return;
        }

        if (img.url.includes('ik.imagekit.io')) {
          validImageKitCount++;
        } else if (img.url.includes('ibb.co')) {
          legacyImgbbCount++;
          carHasErrors = true;
        } else {
          brokenOrOtherCount++;
          carHasErrors = true;
        }
      });

      if (carHasErrors) {
        corruptedCars.push(car);
      }
    });

    console.log('\n--- 📈 AUDIT RESULTS ---');
    console.log(`📸 Total Images Scanned: ${totalImages}`);
    console.log(`✅ Valid ImageKit URLs: ${validImageKitCount} (${totalImages > 0 ? ((validImageKitCount/totalImages)*100).toFixed(1) : 0}%)`);
    console.log(`❌ Legacy ImgBB URLs: ${legacyImgbbCount} (${totalImages > 0 ? ((legacyImgbbCount/totalImages)*100).toFixed(1) : 0}%)`);
    console.log(`❓ Broken/Other URLs: ${brokenOrOtherCount} (${totalImages > 0 ? ((brokenOrOtherCount/totalImages)*100).toFixed(1) : 0}%)`);

    if (corruptedCars.length > 0) {
      console.log('\n⚠️ FOUND STRAGGLERS! The following cars require manual fixing:');
      corruptedCars.forEach(c => {
        console.log(`   - ${c.make} ${c.model} (${c._id})`);
      });
    } else {
      console.log('\n🎉 SUCCESS! 100% of images are safely hosted on ImageKit.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Database Audit failed:', error);
    process.exit(1);
  }
}

auditDB();
