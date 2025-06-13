import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaHome, FaSpinner, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import * as jwtDecode from 'jwt-decode';

const AddressManagement = () => {
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    isDefault: false,
    email: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  const API_BASE_URL = 'http://localhost:3000/api/address';

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode.jwtDecode(token);
        setUserEmail(decoded.email);
        setFormData(prev => ({ ...prev, email: decoded.email }));
      } catch (error) {
        console.error('Error decoding token:', error);
        toast.error('Failed to authenticate user');
      }
    }
  }, []);

  const fetchAddresses = async () => {
    if (!userEmail) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/fetchAddress/?email=${userEmail}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      setAddresses(response.data.address || []);
    } catch (error) {
      toast.error('Failed to fetch addresses');
      console.error('Error fetching addresses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.phone.match(/^[\+]?[1-9][\d]{9,14}$/)) errors.phone = 'Enter a valid phone number';
    if (!formData.street.trim()) errors.street = 'Street address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    if (!formData.postalCode.match(/^[0-9]{5,10}$/)) errors.postalCode = 'Enter a valid postal code';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveAddress = async (addressData) => {
    if (!validateForm()) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      };
      if (isEditing) {
        await axios.put(`${API_BASE_URL}/updateAddress/${addressData._id}`, addressData, config);
        toast.success('Address updated successfully');
      } else {
        await axios.post(`${API_BASE_URL}/addAddress`, { ...addressData, email: userEmail }, config);
        toast.success('Address added successfully');
      }
      fetchAddresses();
      resetForm();
    } catch (error) {
      toast.error(`Failed to ${isEditing ? 'update' : 'save'} address`);
      console.error('Error saving address:', error);
    }
  };

  const deleteAddress = async (_id) => {
    try {
      await axios.delete(`${API_BASE_URL}/deleteAddress/${_id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      toast.success('Address deleted successfully');
      fetchAddresses();
      setShowDeleteConfirm(false);
    } catch (error) {
      toast.error('Failed to delete address');
      console.error('Error deleting address:', error);
    }
  };

  const setDefaultAddress = async (_id) => {
    try {
      await axios.post(`${API_BASE_URL}/set-default`, { _id }, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      toast.success('Default address updated');
      fetchAddresses();
    } catch (error) {
      toast.error('Failed to set default address');
      console.error('Error setting default address:', error);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchAddresses();
    }
  }, [userEmail]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setFormErrors({ ...formErrors, [name]: '' }); // clear error on input change
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveAddress(formData);
  };

  const resetForm = () => {
    setFormData({
      _id: '',
      name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      isDefault: false,
      email: userEmail
    });
    setFormErrors({});
    setIsEditing(false);
  };

  const handleEdit = (address) => {
    setFormData(address);
    setFormErrors({});
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (_id) => {
    setAddressToDelete(_id);
    setShowDeleteConfirm(true);
  };

  return (
    <div className="container mx-auto p-4 pt-2 max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Addresses</h2>

      <form onSubmit={handleSubmit} className="p-6 border rounded-lg shadow-md mb-8 bg-white">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          {isEditing ? 'Edit Address' : 'Add New Address'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
            {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="1234567890"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
            {formErrors.phone && <p className="text-red-500 text-sm">{formErrors.phone}</p>}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
          <input
            type="text"
            name="street"
            placeholder="123 Main St"
            value={formData.street}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
          {formErrors.street && <p className="text-red-500 text-sm">{formErrors.street}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              name="city"
              placeholder="HYDERABAD"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
            {formErrors.city && <p className="text-red-500 text-sm">{formErrors.city}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input
              type="text"
              name="state"
              placeholder="TELANGANA"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
            {formErrors.state && <p className="text-red-500 text-sm">{formErrors.state}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
            <input
              type="text"
              name="postalCode"
              placeholder="10001"
              value={formData.postalCode}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
            {formErrors.postalCode && <p className="text-red-500 text-sm">{formErrors.postalCode}</p>}
          </div>
        </div>

        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            name="isDefault"
            id="isDefault"
            checked={formData.isDefault}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600"
          />
          <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
            Set as default address
          </label>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center"
          >
            {isEditing ? <FaEdit className="mr-2" /> : <FaPlus className="mr-2" />}
            {isEditing ? 'Update Address' : 'Save Address'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Address List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Addresses</h3>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <FaSpinner className="animate-spin text-2xl text-blue-600" />
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
            <p className="text-gray-600">You haven&apos;t saved any addresses yet.</p>
          </div>
        ) : (
          addresses.map((address) => (
            <div key={address._id} className={`bg-white p-5 rounded-lg shadow-sm border ${address.isDefault ? 'border-blue-500' : 'border-gray-200'}`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  {address.isDefault ? (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <FaCheck className="mr-1" /> Default
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <FaHome className="mr-1" /> Home
                    </span>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(address)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(address._id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-lg text-gray-800 mb-1">
                {address.name} • {address.phone}
              </h3>

              <p className="text-gray-600 mb-3">
                {address.street}, {address.city}, {address.state} -{' '}
                <span className="font-medium">{address.postalCode}</span>
              </p>

              {!address.isDefault && (
                <button
                  onClick={() => setDefaultAddress(address._id)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Set as default
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this address? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteAddress(addressToDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressManagement;