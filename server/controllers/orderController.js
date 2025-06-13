import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  try {
    const { orderId, user, items, totalAmount, paymentDetails } = req.body;
    const order = new Order({
      orderId,
      user,
      items,
      totalAmount,
      paymentDetails,
    });
    const savedOrder = await order.save();
    res.status(201).json({ success: true, order: savedOrder });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ success: false, message: 'Failed to save order.' });
  }
};
