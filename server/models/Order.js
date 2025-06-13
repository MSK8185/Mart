import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  user: {
    name: String,
    email: String,
  },
  items: [
    {
      productName: String,
      productImage: String,
      quantity: Number,
      price: Number,
    },
  ],
  totalAmount: Number,
  paymentId: String,
  orderId: String,
  status: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", OrderSchema);
export default Order;