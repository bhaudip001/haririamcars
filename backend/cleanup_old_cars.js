import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const carSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

const Car = mongoose.models.Car || mongoose.model('Car', carSchema);

async function cleanup() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all cars sorted by newest first
    const allCars = await Car.find().sort({ createdAt: -1 });
    console.log(`Total cars in database: ${allCars.length}`);

    if (allCars.length <= 3) {
      console.log('3 or fewer cars exist. No deletion needed.');
      process.exit(0);
    }

    // Keep the first 3
    const carsToKeep = allCars.slice(0, 3);
    const carsToDelete = allCars.slice(3);

    console.log(`Keeping ${carsToKeep.length} newest cars.`);
    console.log(`Deleting ${carsToDelete.length} older cars...`);

    const idsToDelete = carsToDelete.map(car => car._id);

    const result = await Car.deleteMany({ _id: { $in: idsToDelete } });
    console.log(`✅ Successfully deleted ${result.deletedCount} old cars from the database!`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

cleanup();
