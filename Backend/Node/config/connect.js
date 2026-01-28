import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
       
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    console.error('Server will continue running. Please fix the database connection.');
    // Don't exit - let server run so you can fix the connection
  }
};

export default connectDB;