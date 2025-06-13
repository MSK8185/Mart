import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCheckCircle, FiPlusCircle, FiList } from 'react-icons/fi';
import AddVoucher from '../components/Voucher/AddVoucher';
import ListVoucher from '../components/Voucher/ListVoucher';
import ConfirmModal from '../../components/ConfirmModal';

const Voucher = () => {
  const [activeTab, setActiveTab] = useState('add');
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'Confirm',
    cancelText: 'Cancel'
  });

  // Fetch all vouchers on component mount
  useEffect(() => {
    fetchVouchers();
  }, []);

    useEffect(() => {
    if (activeTab === 'list') {
      fetchVouchers();
    }
  }, [activeTab]);

  // Clear message after timeout
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/admin/vouchers/getAllVouchers');
      setVouchers(response.data.vouchers);
    } catch (error) {
      console.log('Failed to fetch vouchers', error);
      setMessage({ type: 'error', text: 'Failed to fetch vouchers' });
    } finally {
      setLoading(false);
    }
  };

  const editVoucher = async (id, formData) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/admin/vouchers/editVoucher/${id}`, formData);
      if (response.data.success) {
        setVouchers(prevVouchers =>
          prevVouchers.map(voucher =>
            voucher._id === id ? response.data.updatedVoucher : voucher
          )
        );
        setMessage({ type: 'success', text: 'Voucher updated successfully' });
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to update voucher' });
      }
    } catch (error) {
      console.error('Error updating voucher:', error);
      setMessage({ type: 'error', text: 'An error occurred while updating voucher' });
    }
  };

  // Show delete confirmation modal
  const showDeleteConfirmation = (voucherId, voucherCode) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Voucher',
      message: `Are you sure you want to delete the voucher "${voucherCode}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => performDeleteVoucher(voucherId)
    });
  };

  // Actual delete function
  const performDeleteVoucher = async (id) => {
    try {
      setLoading(true);
      const response = await axios.delete(`http://localhost:3000/api/admin/vouchers/deleteVoucher/${id}`);

      if (response.data.success) {
        setVouchers(vouchers.filter(voucher => voucher._id !== id));
        setMessage({ type: 'success', text: 'Voucher deleted successfully' });
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to delete voucher' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
      console.log(error);
      
    } finally {
      fetchVouchers();
      setLoading(false);
    }
  };

  // Delete voucher with confirmation
  const deleteVoucher = (id) => {
    const voucher = vouchers.find(v => v._id === id);
    showDeleteConfirmation(id, voucher?.code || 'Unknown');
  };

  // Show status toggle confirmation modal
  const showStatusToggleConfirmation = (voucherId, currentStatus, voucherCode) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    setConfirmModal({
      isOpen: true,
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Voucher`,
      message: `Are you sure you want to ${action} the voucher "${voucherCode}"?`,
      confirmText: action.charAt(0).toUpperCase() + action.slice(1),
      cancelText: 'Cancel',
      onConfirm: () => performToggleVoucherStatus(voucherId, currentStatus)
    });
  };

  // Actual toggle function
  const performToggleVoucherStatus = async (id, currentStatus) => {
    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:3000/api/admin/vouchers/toggleVoucher/${id}`, {
        isActive: !currentStatus
      });

      if (response.data.success) {
        setVouchers(vouchers.map(voucher =>
          voucher._id === id ? response.data.data : voucher
        ));
        setMessage({
          type: 'success',
          text: `Voucher ${!currentStatus ? 'activated' : 'deactivated'} successfully`
        });
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to update voucher' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Toggle voucher status with confirmation
  const toggleVoucherStatus = (id, currentStatus) => {
    const voucher = vouchers.find(v => v._id === id);
    showStatusToggleConfirmation(id, currentStatus, voucher?.code || 'Unknown');
  };

  // Close confirm modal
  const closeConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      title: '',
      message: '',
      onConfirm: null,
      confirmText: 'Confirm',
      cancelText: 'Cancel'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 ">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 flex items-center">
          <FiCheckCircle className="mr-2 text-green-500" size={30} />
          Voucher & Discount Management
        </h1>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`mr-4 py-2 px-4 font-medium flex items-center ${activeTab === 'add'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('add')}
          >
            <FiPlusCircle className="mr-2" />
            Add Voucher
          </button>
          <button
            className={`py-2 px-4 font-medium flex items-center ${activeTab === 'list'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('list')}
          >
            <FiList className="mr-2" />
            Voucher List
          </button>
        </div>

        {message.text && (
          <div className={`p-4 mb-4 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message.text}
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'add' ? (
          <AddVoucher
            onVoucherAdded={(newVoucher) => {
              setVouchers([newVoucher, ...vouchers]);
              setMessage({ type: 'success', text: 'Voucher created successfully' });
            }}
            setMessage={setMessage}
          />
        ) : (
          <ListVoucher
            vouchers={vouchers}
            loading={loading}
            deleteVoucher={deleteVoucher}
            editVoucher={editVoucher}
            toggleVoucherStatus={toggleVoucherStatus}
          />
        )}

        {/* Confirm Modal */}
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={closeConfirmModal}
          onConfirm={confirmModal.onConfirm}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmText={confirmModal.confirmText}
          cancelText={confirmModal.cancelText}
        />
      </div>
    </div>
  );
};

export default Voucher;