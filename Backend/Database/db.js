import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tictactoe');
    console.log('MongoDB Connected suceesfully');
  } catch (error) {
    console.error("error during connection time",error);
    process.exit(1);
  }
};

export default connectDB;