import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI is not set. Please add your MongoDB Atlas connection string in server/.env');
    }

    const conn = await mongoose.connect(mongoUri, {
      dbName: 'leads_db',
    });

    console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
