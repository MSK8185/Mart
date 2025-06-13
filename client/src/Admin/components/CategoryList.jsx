import React, { useState, useEffect } from 'react';
import { FcViewDetails } from "react-icons/fc";
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const CategoryList = ({ categories, onDelete, onDetails, onEdit }) => {
  // Ensure categories is always an array
  const safeCategories = Array.isArray(categories) ? categories : [];

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [filteredCategories, setFilteredCategories] = useState([]);

  // Filter and sort categories whenever dependencies change
  useEffect(() => {
    let result = [...safeCategories];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        category =>
          (category.name && category.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        // Handle undefined values
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredCategories(result);
    // Only reset page if we have results and we're not on the first page
    if (result.length > 0 && currentPage > 1 && result.length <= (currentPage - 1) * categoriesPerPage) {
      setCurrentPage(1);
    }
  }, [safeCategories, searchTerm, sortConfig, currentPage, categoriesPerPage]);

  // Get current categories for pagination
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Sort function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Get sort direction indicator
  const getSortDirectionIndicator = (name) => {
    if (sortConfig.key !== name) return null;
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage) || 1;

  // Generate page numbers array for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pageNumbers.push(i);
    } else if (
      i === currentPage - 2 ||
      i === currentPage + 2
    ) {
      pageNumbers.push('...');
    }
  }

  // Remove duplicate ellipses
  const uniquePageNumbers = pageNumbers.filter((number, index, self) =>
    number === '...' ? self.indexOf(number) === index : true
  );

  // Export to CSV function
  const exportToCSV = () => {
    // Create CSV content
    const headers = ['Name', 'Image URL'];

    // Convert each category to a CSV row
    const rows = filteredCategories.map(category => [
      category.name || 'Unnamed Category',
      category.image || 'No Image'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });

    // Use FileSaver to save the file
    saveAs(blob, 'categories.csv');
  };

  // Export to PDF function
  const exportToPDF = () => {
    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text('Categories Report', 14, 15);

    // Add generation info
    doc.setFontSize(10);
    const date = new Date().toLocaleString();
    doc.text(`Generated on: ${date}`, 14, 22);

    // Prepare table data
    const tableColumn = ['Name', 'Image URL'];
    const tableRows = filteredCategories.map(category => [
      category.name || 'Unnamed Category',
      category.image ? '(Image URL available)' : 'No Image'
    ]);

    // Create the table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: 'striped',
      headStyles: { fillColor: [128, 0, 128] }
    });

    // Save the PDF
    doc.save('categories.pdf');
  };

  return (
    <div className="overflow-hidden bg-white shadow-md rounded-lg">
      {/* Search and filter section */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-purple-500 focus:border-purple-500"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={exportToCSV}
              className="inline-flex items-center justify-center bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow hover:from-purple-600 hover:to-purple-700 transition duration-200 ease-in-out"
              disabled={filteredCategories.length === 0}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
              Export CSV
            </button>

            <button
              onClick={exportToPDF}
              className="inline-flex items-center justify-center bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow hover:from-indigo-600 hover:to-indigo-700 transition duration-200 ease-in-out"
              disabled={filteredCategories.length === 0}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
              Export PDF
            </button>
          </div>

          <div className="text-sm text-gray-500">
            Showing {filteredCategories.length} of {safeCategories.length} categories
          </div>
        </div>
      </div>

      {/* Table section */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-s font-bold text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('name')}
              >
                Category {getSortDirectionIndicator('name')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-s font-bold text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th scope="col" className="px-6 py-3 text-right text-s font-bold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentCategories && currentCategories.length > 0 ? (
              currentCategories.map((category, index) => (
                <tr key={category._id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{category.name || 'Unnamed Category'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name || 'Category image'}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded-md">
                        <span className="text-xs text-gray-400">No Image</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onEdit && onEdit(category)}
                        className="inline-flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow hover:from-green-600 hover:to-green-700 transition duration-200 ease-in-out"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-4 h-4 mr-1"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.232 5.232l3.536 3.536m-2.036-4.036a2.5 2.5 0 113.536 3.536L7 21H3v-4L16.732 3.732z"
                          />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => onDetails && onDetails(category)}
                        className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow hover:from-blue-600 hover:to-blue-700 transition duration-200 ease-in-out"
                      >
                        <FcViewDetails className="w-4 h-4 mr-1" />
                        Details
                      </button>
                      <button
                        onClick={() => onDelete && onDelete(category._id, category.name)}
                        className="inline-flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow hover:from-red-600 hover:to-red-700 transition duration-200 ease-in-out"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-4 h-4 mr-1"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 13h6m2 9H7a2 2 0 01-2-2V7a2 2 0 012-2h3l1-1h4l1 1h3a2 2 0 012 2v13a2 2 0 01-2 2z"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                  {searchTerm ? 'No categories match your search' : 'No categories found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - Only show if we have categories */}
      {filteredCategories && filteredCategories.length > 0 && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{filteredCategories.length > 0 ? indexOfFirstCategory + 1 : 0}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastCategory, filteredCategories.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredCategories.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {uniquePageNumbers.map((number, index) => (
                    <button
                      key={index}
                      onClick={() => number !== '...' && paginate(number)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${number === currentPage
                          ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                          : number === '...'
                            ? 'bg-white border-gray-300 text-gray-500 cursor-default'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                      {number}
                    </button>
                  ))}

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${currentPage === totalPages || totalPages === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;