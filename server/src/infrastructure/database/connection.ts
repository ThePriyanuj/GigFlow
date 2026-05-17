import mongoose from 'mongoose';

let mongoServer: any = null;

export const connectDatabase = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gigflow';
  const useMemory = process.env.USE_MEMORY_DB === 'true';
  const isServerless = !!process.env.VERCEL;

  try {
    if (useMemory && !isServerless) {
      // Use in-memory MongoDB for development without local MongoDB
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      await mongoose.connect(memoryUri);
      console.log('✅ MongoDB Memory Server connected (in-memory mode)');
      console.log('   ⚠️  Data will not persist between restarts');
    } else {
      try {
        const options: any = { serverSelectionTimeoutMS: 5000 };
        await mongoose.connect(mongoUri, options);
        console.log('✅ MongoDB connected successfully');
      } catch (err) {
        if (isServerless) {
          // On Vercel, we can't use memory server — require a real MongoDB
          console.error('❌ MongoDB connection failed. Set MONGODB_URI to a MongoDB Atlas URI in your Vercel environment variables.');
          throw err;
        }
        // Fallback to memory server for local development
        console.log('⚠️  MongoDB not available, falling back to in-memory mode...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        mongoServer = await MongoMemoryServer.create();
        const memoryUri = mongoServer.getUri();
        await mongoose.connect(memoryUri);
        console.log('✅ MongoDB Memory Server connected (fallback mode)');
        console.log('   ⚠️  Data will not persist between restarts');
      }
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }

  mongoose.connection.on('error', (err: any) => {
    console.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
};

