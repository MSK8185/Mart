import Order from "../../models/Order.js";

// Fetch Total Orders
export const getTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments(); 
    res.json({ totalOrders });
  } catch (error) {
    console.error("Error fetching total orders:", error);
    res.status(500).json({ error: "Failed to fetch total orders" });
  }
};
