import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Car from './models/Car.js';
import PromoBanner from './models/PromoBanner.js';
import HappyCustomer from './models/HappyCustomer.js';
import SellRequest from './models/SellRequest.js';

dotenv.config();

async function deleteImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully.');

    // 1. Clear images array in Cars
    const carsResult = await Car.updateMany({}, { $set: { images: [] } });
    console.log(`Cleared images for ${carsResult.modifiedCount} Cars.`);

    // 2. Clear image URLs and publicIds in PromoBanners
    const bannersResult = await PromoBanner.updateMany({}, { 
      $set: { 
        desktopImageUrl: '', 
        desktopPublicId: '', 
        mobileImageUrl: '', 
        mobilePublicId: '' 
      } 
    });
    console.log(`Cleared images for ${bannersResult.modifiedCount} Promo Banners.`);

    // 3. Remove photo object in HappyCustomers
    const customersResult = await HappyCustomer.updateMany({}, { 
      $unset: { photo: "" } 
    });
    console.log(`Cleared images for ${customersResult.modifiedCount} Happy Customers.`);

    // 4. Clear photos array in SellRequests
    const sellRequestsResult = await SellRequest.updateMany({}, { 
      $set: { photos: [] } 
    });
    console.log(`Cleared images for ${sellRequestsResult.modifiedCount} Sell Requests.`);

    console.log('✅ All old image links have been successfully deleted from the database.');
    process.exit(0);
  } catch (error) {
    console.error('Error deleting images from database:', error);
    process.exit(1);
  }
}

deleteImages();
