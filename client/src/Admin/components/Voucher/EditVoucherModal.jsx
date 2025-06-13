import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const EditVoucherModal = ({ voucher, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    type: 'percentage',
    minPurchase: 0,
    maxUsage: '',
    usageLimitPerUser: 1,
    expiryDate: '',
    isActive: false,
  });

  useEffect(() => {
    if (voucher) {
      setFormData({
        code: voucher.code || '',
        discount: voucher.discount || '',
        type: voucher.type || 'percentage',
        minPurchase: voucher.minPurchase || 0,
        maxUsage: voucher.maxUsage || '',
        usageLimitPerUser: voucher.usageLimitPerUser || 1,
        expiryDate: voucher.expiryDate
          ? new Date(voucher.expiryDate).toISOString().split('T')[0]
          : '',
        isActive: voucher.isActive || false,
      });
    }
  }, [voucher]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(voucher._id, formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Edit Voucher</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Voucher Code
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Value
            </label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              min="0"
              step={formData.type === 'percentage' ? '1' : '0.01'}
              max={formData.type === 'percentage' ? '100' : undefined}
              required
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Purchase Amount
            </label>
            <input
              type="number"
              name="minPurchase"
              value={formData.minPurchase}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Usage (leave empty for unlimited)
            </label>
            <input
              type="number"
              name="maxUsage"
              value={formData.maxUsage}
              onChange={handleChange}
              min="1"
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usage Limit Per User
            </label>
            <input
              type="number"
              name="usageLimitPerUser"
              value={formData.usageLimitPerUser}
              onChange={handleChange}
              min="1"
              required
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-sm font-medium text-gray-700">Active</label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditVoucherModal.propTypes = {
  voucher: PropTypes.shape({
    _id: PropTypes.string,
    code: PropTypes.string,
    discount: PropTypes.number,
    type: PropTypes.string,
    minPurchase: PropTypes.number,
    maxUsage: PropTypes.number,
    usageLimitPerUser: PropTypes.number,
    expiryDate: PropTypes.string,
    isActive: PropTypes.bool,
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditVoucherModal;
