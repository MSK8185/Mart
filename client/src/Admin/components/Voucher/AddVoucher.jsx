import React, { useState } from "react";

const AddVoucher = ({ onVoucherAdded, setMessage }) => {
  const [loading, setLoading] = useState(false);
  const [newVoucher, setNewVoucher] = useState({
    code: "",
    discount: "",
    type: "percentage",
    minPurchase: 0,
    maxUsage: "",
    usageLimitPerUser: "",
    isActive: true,
    expiryDate: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewVoucher({
      ...newVoucher,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Add a new voucher
  const addVoucher = async () => {
    // Form validation
    if (!newVoucher.code || !newVoucher.discount || !newVoucher.expiryDate) {
      setMessage({ type: "error", text: "Please fill all required fields" });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "http://20.40.59.234:3000/api/admin/vouchers/addVoucher",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...newVoucher,
            // Convert empty string to null for optional numerical fields
            maxUsage:
              newVoucher.maxUsage === "" ? null : Number(newVoucher.maxUsage),
            usageLimitPerUser:
              newVoucher.maxUsage === ""
                ? 1
                : Number(newVoucher.usageLimitPerUser),
            minPurchase: Number(newVoucher.minPurchase),
            discount: Number(newVoucher.discount),
            expiryDate: new Date(newVoucher.expiryDate),
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        onVoucherAdded(data.data);
        setNewVoucher({
          code: "",
          discount: "",
          type: "percentage",
          minPurchase: 0,
          maxUsage: "",
          usageLimitPerUser: "",
          isActive: true,
          expiryDate: "",
        });
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to create voucher",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">
        Create New Voucher
      </h2>
      <p className="text-gray-500 mb-4">
        Define discount codes with validity periods.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-600 mb-1" htmlFor="code">
            Voucher Code *
          </label>
          <input
            type="text"
            name="code"
            id="code"
            placeholder="e.g., SAVE20"
            value={newVoucher.code}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1" htmlFor="discount">
            Discount Amount *
          </label>
          <input
            type="number"
            name="discount"
            id="discount"
            placeholder="20"
            min={1}
            value={newVoucher.discount}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1" htmlFor="type">
            Discount Type
          </label>
          <select
            name="type"
            id="type"
            value={newVoucher.type}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount (₹)</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-600 mb-1" htmlFor="minPurchase">
            Minimum Purchase (₹)
          </label>
          <input
            type="number"
            name="minPurchase"
            id="minPurchase"
            placeholder="0"
            min={1}
            value={newVoucher.minPurchase}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1" htmlFor="maxUsage">
            Max Usage (blank for unlimited)
          </label>
          <input
            type="number"
            name="maxUsage"
            id="maxUsage"
            placeholder="Unlimited"
            min={1}
            value={newVoucher.maxUsage}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            className="block text-gray-600 mb-1"
            htmlFor="usageLimitPerUser"
          >
            Usage Limit Per User
          </label>
          <input
            type="number"
            name="usageLimitPerUser"
            id="usageLimitPerUser"
            placeholder="1"
            min={1}
            value={newVoucher.usageLimitPerUser}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1" htmlFor="expiryDate">
            Expiry Date *
          </label>
          <input
            type="date"
            name="expiryDate"
            id="expiryDate"
            value={newVoucher.expiryDate}
            onChange={handleInputChange}
            min={new Date().toISOString().split("T")[0]}
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="flex items-center text-gray-600">
          <input
            type="checkbox"
            name="isActive"
            checked={newVoucher.isActive}
            onChange={handleInputChange}
            className="mr-2 h-5 w-5"
          />
          Active
        </label>
      </div>

      <button
        onClick={addVoucher}
        disabled={
          loading ||
          !newVoucher.code ||
          !newVoucher.discount ||
          !newVoucher.expiryDate
        }
        className={`mt-6 w-full flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-md shadow hover:bg-blue-700 transition duration-300 ${
          loading ||
          !newVoucher.code ||
          !newVoucher.discount ||
          !newVoucher.expiryDate
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        {loading ? "Adding..." : "Add Voucher"}
      </button>
    </section>
  );
};

export default AddVoucher;
