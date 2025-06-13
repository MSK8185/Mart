
import express from 'express';
import Order from '../models/orderModel.js'; 

const router = express.Router();

// Create a new order
router.post('/create', async (req, res) => {
  const { userId, orderItems, paymentInfo, totalAmount } = req.body;

  try {
    const order = new Order({
      user: userId,
      orderItems,
      paymentInfo,
      totalAmount,
    });

    await order.save();
    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
