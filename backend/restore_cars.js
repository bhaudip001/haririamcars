import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const carSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

const Car = mongoose.models.Car || mongoose.model('Car', carSchema);

async function restore() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Read the old cars (30 cars)
    const oldDataPath = path.join(__dirname, '../cars_data.json');
    const oldFileContent = fs.readFileSync(oldDataPath, 'utf-8');
    const oldJsonData = JSON.parse(oldFileContent);
    const oldCars = oldJsonData.cars || oldJsonData;

    // Read the 3 newest cars that we saved
    const newDataPath = path.join(__dirname, '../backup_vercel.json');
    const newFileContent = fs.readFileSync(newDataPath, 'utf-8');
    const newJsonData = JSON.parse(newFileContent);
    const newCars = newJsonData.cars || newJsonData.data || newJsonData;

    console.log(`Found ${oldCars.length} old cars in cars_data.json`);
    console.log(`Found ${newCars.length} new cars in backup_vercel.json`);

    // Wipe the current database to ensure a clean slate
    await Car.deleteMany({});
    console.log('Cleared existing database to prepare for restore.');

    // Process old cars (strip images)
    const processedOldCars = oldCars.map(car => {
      car.images = [];
      return car;
    });

    // Combine them
    const allCarsToInsert = [...processedOldCars, ...newCars];

    // Insert into database
    await Car.insertMany(allCarsToInsert);
    console.log(`✅ Successfully restored all ${allCarsToInsert.length} cars!`);
    console.log(`- ${processedOldCars.length} old cars have had their broken images safely removed.`);
    console.log(`- ${newCars.length} newest cars are perfectly preserved with their images intact.`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error during restore:', err);
    process.exit(1);
  }
}

restore();
