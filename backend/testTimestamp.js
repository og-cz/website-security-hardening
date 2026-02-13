import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './models/orderModel.js';

// Sabihin sa dotenv kung nasaan ang .env file
dotenv.config({ path: '../.env' });

const testTimestamp = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const order = await Order.findOne(); // kumuha ng first order sa DB
    if (!order) {
      console.log('No orders found yet');
      await mongoose.disconnect();
      return;
    }

    console.log('paidAt:', order.paidAt || new Date().toISOString());
    console.log('deliveredAt:', order.deliveredAt || new Date().toISOString());

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
};

testTimestamp();
