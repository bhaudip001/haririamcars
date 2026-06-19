import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }).then(async (mongoose) => {
      console.log('✅ MongoDB connected');
      // Auto-seed admin user
      try {
        const User = (await import('../models/User.js')).default;
        const existingAdmin = await User.findOne({ email: 'admin@hariramcars.com' });
        if (!existingAdmin) {
          await User.create({
            name: 'Admin',
            email: 'admin@hariramcars.com',
            password: 'admin123456',
            role: 'admin',
          });
          console.log('✅ Auto-seeded admin user!');
        }

        const secondAdmin = await User.findOne({ email: 'bhaudip001@gmail.com' });
        if (!secondAdmin) {
          await User.create({
            name: 'Bhaudip Admin',
            email: 'bhaudip001@gmail.com',
            password: 'bhaudip12345',
            role: 'admin',
          });
          console.log('✅ Auto-seeded Bhaudip Admin user!');
        }
      } catch (err) {
        console.error('Auto-seed error:', err);
      }
      return mongoose;
    }).catch(err => {
      console.error('❌ MongoDB connection error:', err.message);
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

export default connectDB;
