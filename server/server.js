import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import cron from "node-cron";
import { fetchAndSaveRazorpayPayments } from "./routes/paymentRoutes.js";
import Order from "./models/Order.js";
import ContactMessage from "./models/contactMessage.js"; // <-- NEW: Contact model

// Route Imports
import userRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/admin/products.js";
import categoryRoutes from "./routes/admin/categoryRoutes.js";
import subCategoryRoutes from "./routes/admin/subCategoryRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import wishlistRoutes from './routes/wishlistRoutes.js';
import Product from "./models/admin/product.js";
import cartRoutes from "./routes/CartRoutes.js";
import profileRoutes from "./routes/ProfileRoutes.js";
import revenueRoutes from "./routes/admin/revenueRoutes.js";
import totalOrderRoutes from "./routes/admin/toatalOrderRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import businessRoutes from "./routes/businessRoutes.js";
import voucherRoutes from './routes/admin/voucherRoutes.js';
import bannerRoutes from "./routes/admin/bannerRoutes.js";
import addressRoutes from './routes/AddressRoutes.js';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
const mongouri = process.env.MONGO_URI;
mongoose
  .connect(mongouri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Razorpay Configuration
const razorpay = new Razorpay({
  key_id: "rzp_test_GsUAh2atNEW2CJ",
  key_secret: "KD2TJZjIV1kJecLkcgRV6UiM",
});

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api", paymentRoutes);
app.use("/api/search", searchRoutes);
app.use("/api", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin/categories", categoryRoutes);
app.use("/api/admin/subcategories", subCategoryRoutes);
app.use("/api/admin/vouchers", voucherRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/revenue", revenueRoutes);
app.use("/api/orders", totalOrderRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/address", addressRoutes)


// Cron for Razorpay Payment Sync
cron.schedule("*/1 * * * *", async () => {
  await fetchAndSaveRazorpayPayments();
});

// Razorpay Order Creation
app.post("/api/create-razorpay-order", async (req, res) => {
  const { amount, currency = "INR" } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount provided" });
  }

  try {
    const options = {
      amount: Math.round(amount * 100),
      currency,
    };
    const order = await razorpay.orders.create(options);
    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
});

// Razorpay Payment Verification
app.post("/api/verify-razorpay-payment", async (req, res) => {
  const {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    orderDetails,
    totalAmount,
    userEmail,
    userName,
  } = req.body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const generatedSignature = crypto
      .createHmac("sha256", razorpay.key_secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature === razorpaySignature) {
      const newOrder = new Order({
        user: { name: userName, email: userEmail },
        items: orderDetails,
        totalAmount,
        paymentId: razorpayPaymentId,
        orderId: razorpayOrderId,
        status: "Paid",
      });

      await newOrder.save();
      res.json({ success: true, message: "Payment verified and order saved" });
    } else {
      res.status(400).json({ success: false, message: "Invalid Razorpay signature" });
    }
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    res.status(500).json({ error: "Failed to verify and save order" });
  }
});

// Fetch all orders (Admin)
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Fetch orders by user email
app.get("/api/orders/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const orders = await Order.find({ "user.email": email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Fetch all Razorpay payments
app.get("/api/fetch-razorpay-payments", async (req, res) => {
  try {
    const payments = await razorpay.payments.all();
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching Razorpay payments:", error.message);
    res.status(500).json({ error: "Failed to fetch payments", details: error.message });
  }
});

// Product Detail Page
app.get("/api/products/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findOne({ productId });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error retrieving product details:", error); 
    res.status(500).json({
      message: "Error retrieving product details",
      error: error.message || error,
    });
  }
});

// Fetch all user orders (Admin or Management)
app.get("/api/all-orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching all user orders:", error);
    res.status(500).json({ error: "Failed to fetch all user orders" });
  }
});

// Root Route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
