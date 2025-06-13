import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import nodemailer from "nodemailer";
import Payment from "../models/pamentModels.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import router from "./authRoutes.js";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_GsUAh2atNEW2CJ",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "KD2TJZjIV1kJecLkcgRV6UiM",
});

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.STORE_EMAIL || "yourstoreemail@gmail.com",
    pass: process.env.APP_PASSWORD  || "yourapppassword"
  }
});

router.post("/api/verify-razorpay-payment", async (req, res) => {
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

    if (generatedSignature !== razorpaySignature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Razorpay signature" });
    }

    const newOrder = new Order({
      user: { name: userName, email: userEmail },
      items: orderDetails,
      totalAmount,
      paymentId: razorpayPaymentId,
      orderId: razorpayOrderId,
      status: "Paid",
    });
    await newOrder.save();

    const formattedItems = orderDetails
      .map(
        (item) => `- ${item.productName} x${item.quantity} — ₹${item.price.toFixed(2)}`
      )
      .join("\n");

    const mailOptions = {
      from: `"Your Store" <${process.env.STORE_EMAIL || "yourstoreemail@gmail.com"}>`,
      to: userEmail,
      subject: "🧾 Order Confirmation",
      text: `Hi ${userName},

Thank you for shopping with us! Your payment was successful and your order is confirmed. Here are your order details:

${formattedItems}

Total Paid: ₹${totalAmount.toFixed(2)}

We’ll notify you once your items are on the way.

Best regards,
Your Store Team`,
    };

    await transporter.sendMail(mailOptions);

    // 4) Respond
    res.json({
      success: true,
      message: "Payment verified, order saved, and confirmation email sent."
    });
  } catch (error) {
    console.error("Error verifying payment or sending email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


export const fetchAndSaveRazorpayPayments = async () => {
  try {
    const response = await razorpay.payments.all();
    if (!response.items || response.items.length === 0) {
      console.log("No new payments found.");
      return;
    }

    for (const payment of response.items) {
      try {
        const existingPayment = await Payment.findOne({ paymentId: payment.id });
        if (existingPayment) continue;

        const amountInRupees = payment.amount / 100;
        const paymentDetails = new Payment({
          paymentId: payment.id,
          amount: amountInRupees,
          currency: payment.currency,
          status: payment.status,
          orderId: payment.order_id || "N/A",
          method: payment.method || "unknown",
          email: payment.email || "N/A",
          contact: payment.contact || "N/A",
          createdAt: new Date(payment.created_at * 1000),
        });

        await paymentDetails.save();

        if (payment.email) {
          const rewardCoins = Math.floor(amountInRupees / 10);
          const updatedUser = await User.findOneAndUpdate(
            { email: payment.email },
            { $inc: { "wallet.coins": rewardCoins } },
            { new: true }
          );

          if (updatedUser) {
            console.log(`Added ${rewardCoins} coins to ${payment.email}.`);
          }
        }
      } catch (err) {
        console.error(`Error processing payment ${payment.id}:`, err);
      }
    }
  } catch (err) {
    console.error("Error fetching Razorpay payments:", err);
  }
};

export default router;
