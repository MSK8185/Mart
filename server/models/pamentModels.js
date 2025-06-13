import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  paymentId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, required: true },
  orderId: { type: String, required: false },
  method: { type: String, required: false },
  card: {
    network: { type: String },
    type: { type: String },
    last4: { type: String },
  },
  email: { type: String, required: false },
  contact: { type: String, required: false },
  fee: { type: Number, required: false },
  tax: { type: Number, required: false },
  createdAt: { type: Date, required: true },
});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;