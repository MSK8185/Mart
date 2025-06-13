import axios from "axios";

const RAZORPAY_KEY_ID = "rzp_test_GsUAh2atNEW2CJ";
const RAZORPAY_KEY_SECRET = "KD2TJZjIV1kJecLkcgRV6UiM";

export const fetchAllOrders = async (req, res) => {
  try {
    // Encode the Razorpay credentials for Basic Auth
    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");
    // Fetch orders from Razorpay
    const response = await axios.get("https://api.razorpay.com/v1/orders", {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    console.log("Orders fetched from Razorpay:", response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching orders from Razorpay:", error.message);
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};
