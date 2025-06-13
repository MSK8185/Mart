import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [
      {
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    paymentInfo: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      stripePaymentId: String,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      default: 'Ordered',
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
