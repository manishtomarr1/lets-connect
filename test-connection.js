const mongoose = require('mongoose');
require('dotenv').config({ path: './.env.local' });

const testMongoConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,  // Deprecated, but shouldn't cause connection failure
      useUnifiedTopology: true, // Deprecated, but shouldn't cause connection failure
      serverSelectionTimeoutMS: 5000, // Adjust this timeout as needed
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  } finally {
    mongoose.connection.close();
  }
};

testMongoConnection();
