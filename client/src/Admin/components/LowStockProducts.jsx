import React, { useEffect, useState } from "react";
import axios from "axios";

const LowStockProducts = () => {
  const [lowStockCount, setLowStockCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLowStockProducts = async () => {
      try {
        const response = await axios.get(
          "http://20.40.59.234:3000/api/products/low-stock?threshold=5"
        );
        setLowStockCount(response.data.lowStockProducts.length);
      } catch (err) {
        setError("Failed to fetch low-stock products");
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockProducts();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Low Stock Products</h3>
          {loading ? (
            <p className="text-xl">Loading...</p>
          ) : error ? (
            <p className="text-xl text-yellow-300">{error}</p>
          ) : (
            <p className="text-3xl font-bold">{lowStockCount}</p>
          )}
        </div>
        <div className="text-4xl opacity-50">
          <i className="fas fa-box-open"></i>
        </div>
      </div>
    </div>
  );
};

export default LowStockProducts;
