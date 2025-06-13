import Order from "../../models/Order.js";

// Get Average Revenue
export const getAverageRevenue = async (req, res) => {
  try {
    const orders = await Order.find();

    if (orders.length === 0) {
      return res.json({ averageRevenue: 0 });
    }

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const averageRevenue = totalRevenue / orders.length;

    res.json({ averageRevenue });
  } catch (error) {
    console.error("Error fetching average revenue:", error);
    res.status(500).json({ error: "Failed to calculate average revenue" });
  }
};
