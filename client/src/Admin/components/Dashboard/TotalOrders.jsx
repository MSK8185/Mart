import React, { useEffect, useState } from "react";

const TotalOrders = () => {
  const [totalOrders, setTotalOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTotalOrders = async () => {
      try {
        const response = await fetch(
          "http://20.40.59.234:3000/api/orders/total-orders"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch total orders");
        }
        const data = await response.json();
        setTotalOrders(data.totalOrders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalOrders();
  }, []);

  if (loading) return <p>Loading total orders...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Total Orders</h3>
          <p className="text-3xl font-bold">{totalOrders}</p>
        </div>
        <div className="text-4xl opacity-50">
          <i className="fas fa-shopping-cart"></i>
        </div>
      </div>
    </div>
  );
};

export default TotalOrders;
