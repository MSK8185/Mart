import React, { useEffect, useState } from "react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedUserEmail, setSelectedUserEmail] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://20.40.59.234:3000/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const fetchOrdersByEmail = async (email) => {
    setLoading(true);
    setError("");
    setOrders([]);
    try {
      const response = await axios.get(
        `http://20.40.59.234:3000/api/orders/${email}`
      );
      setOrders(response.data);
      setSelectedUserEmail(email);
      setIsModalOpen(true);
    } catch (err) {
      setError("Failed to fetch orders");
    }
    setLoading(false);
  };

  const cancelOrder = async (orderId) => {
    try {
      await axios.put(`http://20.40.59.234:3000/api/cancel-order/${orderId}`);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? { ...order, status: "Cancelled" } : order
        )
      );
    } catch (error) {
      console.error("Failed to cancel order:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl bg-white rounded-lg shadow-lg font-poppins">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        User Management
      </h2>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">User ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Wallet Coins</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userId} className="text-center">
              <td className="border p-2">{user.userId}</td>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.wallet?.coins || 0}</td>
              <td className="border p-2">
                <button
                  onClick={() => fetchOrdersByEmail(user.email)}
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                >
                  View Orders
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Order Details Modal */}
      <div className="">
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 pl-56">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4 text-center">
                Order History for {selectedUserEmail}
              </h3>

              {loading ? (
                <p className="text-center">Loading orders...</p>
              ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
              ) : orders.length === 0 ? (
                <p className="text-center">No orders found for this user.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.orderId}
                      className="border p-4 rounded-lg shadow-sm bg-gray-50"
                    >
                      <div className="flex justify-between mb-2">
                        <span
                          className={`text-${
                            order.status === "Paid" ? "green" : "orange"
                          }-600 font-bold uppercase`}
                        >
                          {order.status}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Enable scroll for items */}
                      <div className="overflow-y-auto max-h-[50vh] pr-2">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-4 border-b pb-2 last:border-none"
                          >
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                            <div>
                              <p className="font-semibold text-gray-800">
                                {item.productName}
                              </p>
                              <p className="text-gray-600">
                                Qty: {item.quantity} | ₹{item.price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 flex justify-between text-gray-700">
                        <span className="font-semibold">
                          Total: ₹{order.totalAmount}
                        </span>
                        <span className="text-sm">
                          Order ID: {order.orderId}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
