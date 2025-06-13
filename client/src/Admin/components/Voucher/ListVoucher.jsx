import React, { useState, useMemo } from 'react';
import { FiEdit, FiTrash2, FiToggleLeft, FiToggleRight, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import EditVoucherModal from './EditVoucherModal';

const ListVouchers = ({ vouchers, loading, deleteVoucher, toggleVoucherStatus, editVoucher }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter and search vouchers
  const filteredVouchers = useMemo(() => {
    return vouchers.filter(voucher => {
      // Status filter
      let statusMatch = true;
      if (filterStatus === 'active') statusMatch = voucher.isActive;
      else if (filterStatus === 'inactive') statusMatch = !voucher.isActive;
      else if (filterStatus === 'expired') statusMatch = new Date(voucher.expiryDate) < new Date();
      else if (filterStatus === 'valid') {
        statusMatch = voucher.isActive &&
          new Date(voucher.expiryDate) > new Date() &&
          (voucher.maxUsage === null || voucher.usageCount < voucher.maxUsage);
      }

      // Search filter
      const searchMatch = searchTerm === '' ||
        voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voucher.discount.toString().includes(searchTerm) ||
        voucher.minPurchase.toString().includes(searchTerm);

      return statusMatch && searchMatch;
    });
  }, [vouchers, filterStatus, searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredVouchers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVouchers = filteredVouchers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchTerm]);

  const handleEditSave = (id, formData) => {
    editVoucher(id, formData);
    setEditingVoucher(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiChevronLeft size={16} />
      </button>
    );

    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => 2(i)}
          className={`px-3 py-2 text-sm font-medium border-t border-b border-r border-gray-300 hover:bg-gray-50 ${currentPage === i
              ? 'bg-blue-50 text-blue-600 border-blue-500'
              : 'bg-white text-gray-700'
            }`}
        >
          {i}
        </button>
      );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiChevronRight size={16} />
      </button>
    );

    return buttons;
  };

  return (
    <section className="bg-white rounded-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-gray-700">Voucher List</h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search vouchers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
          </div>

          {/* Filter Dropdown */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Vouchers</option>
            <option value="valid">Valid Vouchers</option>
            <option value="active">Active Vouchers</option>
            <option value="inactive">Inactive Vouchers</option>
            <option value="expired">Expired Vouchers</option>
          </select>
        </div>
      </div>

      {/* Results summary and items per page */}
      {!loading && filteredVouchers.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredVouchers.length)} of {filteredVouchers.length} vouchers
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-600">per page</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center p-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      ) : filteredVouchers.length === 0 ? (
        <div className="text-center p-8 text-gray-500">
          {searchTerm ? `No vouchers found matching "${searchTerm}"` : 'No vouchers found.'}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Purchase</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage Limit Per User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedVouchers.map((voucher) => {
                  const isExpired = new Date(voucher.expiryDate) < new Date();
                  const isValid = voucher.isActive && !isExpired &&
                    (voucher.maxUsage === null || voucher.usageCount < voucher.maxUsage);

                  return (
                    <tr key={voucher._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 w-32">
                        <div
                          className="font-medium text-gray-900 whitespace-nowrap overflow-x-auto w-20"
                          title={voucher.code}
                        >
                          {voucher.code}
                        </div>

                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium">
                          {voucher.discount}{voucher.type === 'percentage' ? '%' : '₹'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {voucher.minPurchase > 0 ? `₹${voucher.minPurchase}` : 'None'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`${voucher.maxUsage && voucher.usageCount >= voucher.maxUsage
                            ? 'text-red-600 font-medium'
                            : 'text-gray-900'
                          }`}>
                          {voucher.usageCount || 0}/{voucher.maxUsage || '∞'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {voucher.usageLimitPerUser || 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={isExpired ? 'text-red-600 font-medium' : 'text-gray-900'}>
                          {new Date(voucher.expiryDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isValid
                            ? 'bg-green-100 text-green-800'
                            : isExpired
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                          {isValid ? 'Valid' : isExpired ? 'Expired' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 ">
                        <div className="flex  gap-1">
                          <button
                            onClick={() => setEditingVoucher(voucher)}
                            className="inline-flex items-center px-2 py-1 text-xs rounded text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
                            title="Edit voucher"
                          >
                            <FiEdit size={12} className="mr-1" />
                            Edit
                          </button>

                          <button
                            onClick={() => toggleVoucherStatus(voucher._id, voucher.isActive)}
                            className={`inline-flex items-center px-2 py-1 text-xs rounded transition-colors ${voucher.isActive
                                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            title={voucher.isActive ? 'Deactivate voucher' : 'Activate voucher'}
                          >
                            {voucher.isActive ? (
                              <>
                                <FiToggleRight size={12} className="mr-1" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <FiToggleLeft size={12} className="mr-1" />
                                Activate
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => deleteVoucher(voucher._id)}
                            className="inline-flex items-center px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                            title="Delete voucher"
                          >
                            <FiTrash2 size={12} className="mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center">
                {renderPaginationButtons()}
              </div>
            </div>
          )}
        </>
      )}

      {/* Edit Modal */}
      <EditVoucherModal
        voucher={editingVoucher}
        isOpen={!!editingVoucher}
        onClose={() => setEditingVoucher(null)}
        onSave={handleEditSave}
      />

    </section>
  );
};

export default ListVouchers;