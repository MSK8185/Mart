import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setError("User is not logged in");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userEmail) return;

      try {
        const response = await axios.get(
          `http://20.40.59.234:3000/api/orders/${userEmail}`
        );
        setOrders(response.data);
      } catch (err) {
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userEmail]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold text-gray-700">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 text-center mt-4 font-medium">{error}</div>
    );

  return (
    <div className="container mx-auto p-8 max-w-6xl bg-gray-50 rounded-lg shadow-lg font-poppins">
      <h2 className="text-4xl font-extrabold mb-6 text-gray-900 text-center">
        Order History
      </h2>
      <div className="space-y-6">
        {orders.map((order, index) => (
          <div
            key={index}
            className="border p-6 rounded-lg shadow-md bg-white hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <p
                className={`text-${
                  order.status === "Paid" ? "green" : "orange"
                }-600 font-bold uppercase tracking-wide`}
              >
                {order.status}
              </p>
              <p className="text-gray-500 text-sm">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 border-b pb-4 last:border-none"
                >
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-24 h-24 object-cover rounded-lg shadow-md"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-lg text-gray-800">
                      {item.productName}
                    </p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-gray-600">Price: ₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-4">
              <p className="font-semibold text-xl text-gray-900">
                Total: ₹{order.totalAmount}
              </p>
              <p className="text-gray-500 text-sm">Order ID: {order.orderId}</p>
            </div>

            <div className="mt-4 text-gray-500 text-sm">
              <p>Payment ID: {order.paymentId}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600 text-lg font-medium">
          Showing 1-5 of {orders.length}{" "}
          <span className="text-blue-600 cursor-pointer hover:underline font-bold">
            Next
          </span>
        </p>
      </div>
    </div>
  );
};

export default OrderHistory;
