import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://20.40.59.234:3000/api/admin/orders"
        );
        console.log("Orders fetched from backend:", response.data);
        setOrders(response.data.items || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders from backend:", error.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-poppins">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">All Orders</h1>
      {loading ? (
        <p className="text-center text-gray-600">Loading orders...</p>
      ) : orders.length > 0 ? (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
          <table className="w-full border-collapse border border-gray-200 text-left text-gray-700">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 border border-gray-300">Order ID</th>
                <th className="p-3 border border-gray-300">Amount</th>
                <th className="p-3 border border-gray-300">Currency</th>
                <th className="p-3 border border-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-100">
                  <td className="p-3 border border-gray-300">{order.id}</td>
                  <td className="p-3 border border-gray-300">
                    {(order.amount / 100).toFixed(2)}
                  </td>
                  <td className="p-3 border border-gray-300">
                    {order.currency}
                  </td>
                  <td className="p-3 border border-gray-300 text-green-600 font-medium">
                    {order.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">No orders available</p>
      )}
    </div>
  );
};

export default Orders;
