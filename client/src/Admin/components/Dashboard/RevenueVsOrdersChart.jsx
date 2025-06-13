import React, { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

const RevenueVsOrdersChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersResponse = await fetch("http://localhost:3000/api/orders/total-orders");
        const revenueResponse = await fetch("http://localhost:3000/api/revenue/average-revenue");

        if (!ordersResponse.ok || !revenueResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const ordersData = await ordersResponse.json();
        const revenueData = await revenueResponse.json();

        // Sample data structure for chart
        const newData = [
          { name: "Today", Revenue: revenueData.averageRevenue, Order: ordersData.totalOrders },
          { name: "Yesterday", Revenue: revenueData.averageRevenue * 0.9, Order: ordersData.totalOrders - 5 },
          { name: "Last Week", Revenue: revenueData.averageRevenue * 0.8, Order: ordersData.totalOrders - 10 },
        ];

        setChartData(newData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading revenue and order data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Revenue vs Order</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorOrder" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Line type="monotone" dataKey="Revenue" stroke="url(#colorRevenue)" strokeWidth={3} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="Order" stroke="url(#colorOrder)" strokeWidth={3} dot={{ r: 4 }} />
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip contentStyle={{ backgroundColor: "#f9fafb", borderColor: "#d1d5db" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueVsOrdersChart;
