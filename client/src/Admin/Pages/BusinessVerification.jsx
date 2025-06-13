import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BusinessVerification = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const topRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const cardRefs = useRef([]);

  // New states for rejection popup
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionRemarks, setRejectionRemarks] = useState('');
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    if (businesses.length > 0) {
      gsap.from(cardRefs.current, {
        y: 100,
        scale: 0.95,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.business-grid',
          start: 'top 85%',
        },
      });
    }
  }, [businesses]);

  const fetchBusinesses = () => {
    axios
      .get('http://localhost:3000/api/business')
      .then((res) => {
        setBusinesses(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch data');
        setLoading(false);
      });
  };

  const openPdf = (fileName) => {
    const url = fileName.startsWith('http') ? fileName : `http://localhost:3000/uploads/${fileName}`;
    setPdfUrl(url);
    setShowModal(true);
  };

  const closeModal = () => {
    setPdfUrl('');
    setShowModal(false);
  };

  const updateStatus = async (id, status, remarks = '') => {
    if (status === 'Rejected' && !remarks.trim()) {
      alert('Please enter rejection remarks');
      return;
    }

    try {
      await axios.put(`http://localhost:3000/api/business/${id}/status`, {
        status,
        ...(status === 'Rejected' && { remarks }),
      });

      setBusinesses((prev) =>
        prev.map((biz) =>
          biz._id === id
            ? {
              ...biz,
              status,
              ...(status === 'Rejected' && { rejectionRemarks: remarks }),
            }
            : biz
        )
      );

      if (status === 'Rejected') {
        closeRejectModal();
      }
    } catch (err) {
      console.error('Failed to update status', err);
      alert(`${status} update failed`);
    }
  };


  // New function to handle rejection with remarks
  const handleRejectClick = (businessId) => {
    setSelectedBusinessId(businessId);
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setRejectionRemarks('');
    setSelectedBusinessId(null);
  };

  const submitRejection = async () => {
    if (!rejectionRemarks.trim()) {
      alert('Please enter rejection remarks');
      return;
    }

    try {
      await axios.put(`http://localhost:3000/api/business/${selectedBusinessId}/status`, {
        status: 'Rejected',
        remarks: rejectionRemarks
      });

      setBusinesses((prev) =>
        prev.map((biz) =>
          biz._id === selectedBusinessId ? { ...biz, status: 'Rejected', rejectionRemarks } : biz
        )
      );

      closeRejectModal();
    } catch (err) {
      console.error('Failed to reject business', err);
      alert('Rejection failed');
    }
  };

  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch =
      business.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.userEmail?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || business.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredBusinesses.length / itemsPerPage);
  const paginatedBusinesses = filteredBusinesses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setTimeout(() => {
        scrollToTop();
      }, 0);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setTimeout(() => {
        scrollToTop();
      }, 0);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    scrollToTop();
  };

  if (loading) return <p className="text-center text-lg mt-10">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="p-6 font-poppins bg-gray-50 min-h-screen overflow-x-hidden" ref={topRef}>
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Business Verification</h2>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by business name and Email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Verified">Verified</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 business-grid">
        {paginatedBusinesses.map((business, index) => {
          const statusColor =
            business.status === 'Verified'
              ? 'border-green-400'
              : business.status === 'Rejected'
                ? 'border-red-400'
                : 'border-yellow-400';

          return (
            <div
              key={business._id}
              ref={(el) => (cardRefs.current[index] = el)}
              className={`bg-white border-l-4 ${statusColor} rounded-xl shadow-lg p-6 transform transition-transform hover:scale-[1.02] hover:shadow-xl`}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{business.businessName}</h3>
              <p className="text-gray-600"><strong>Email Id:</strong> {business.userEmail}</p>
              <p className="text-gray-600"><strong>PAN:</strong> {business.panNumber}</p>
              <p className="text-gray-600"><strong>GSTIN:</strong> {business.gstin}</p>
              <p className="text-gray-600"><strong>Address:</strong> {business.businessAddress}</p>
              <p className="text-gray-600"><strong>Created At:</strong> {new Date(business.createdAt).toLocaleString()}</p>
              <p className="mt-2">
                <strong>Status:</strong>
                <span className={`ml-2 font-semibold ${business.status === 'Verified'
                  ? 'text-green-600'
                  : business.status === 'Rejected'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                  }`}>
                  {business.status || 'Pending'}
                </span>
              </p>

              {/* Show rejection remarks if available */}
              {business.status === 'Rejected' && business.rejectionRemarks && (
                <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-700"><strong>Rejection Reason:</strong></p>
                  <p className="text-sm text-red-600">{business.rejectionRemarks}</p>
                </div>
              )}

              <div className="flex gap-3 mt-4 flex-wrap">
                <button
                  onClick={() => openPdf(business.panFile)}
                  className="px-4 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  View PAN
                </button>
                <button
                  onClick={() => openPdf(business.aadharFile)}
                  className="px-4 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                >
                  View Aadhar
                </button>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => updateStatus(business._id, 'Verified')}
                  className="px-4 py-1.5 rounded-md bg-green-600 text-white hover:bg-green-700 transition-all"
                >
                  Verify
                </button>
                <button
                  onClick={() => handleRejectClick(business._id)}
                  className="px-4 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 transition-all"
                >
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* PDF Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl w-[90%] h-[90%] relative shadow-2xl">
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-red-500 font-bold text-2xl hover:scale-125 transition-transform"
            >
              &times;
            </button>
            <iframe
              src={pdfUrl}
              title="PDF Viewer"
              className="w-full h-full border rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Rejection Remarks Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Reject Business Application</h3>
            <p className="text-gray-600 mb-4">Please provide a reason for rejection:</p>

            <textarea
              value={rejectionRemarks}
              onChange={(e) => setRejectionRemarks(e.target.value)}
              placeholder="Enter rejection remarks..."
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />

            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={closeRejectModal}
                className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => updateStatus(selectedBusinessId, 'Rejected', rejectionRemarks)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Reject Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center space-x-2 mt-32">
        <button onClick={handlePrevPage} disabled={currentPage === 1} className={`px-3 py-1 border rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-gray-100'}`} >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button key={index + 1} onClick={() => handlePageClick(index + 1)} className={`px-4 py-2 mx-1 rounded ${currentPage === index + 1 ? 'bg-yellow-600 text-white' : 'bg-gray-200'}`} >
            {index + 1}
          </button>
        ))}
        <button onClick={handleNextPage} disabled={currentPage === totalPages} className={`px-3 py-1 border rounded ${currentPage === totalPages ? 'bg-gray-300' : 'bg-gray-100'}`} >
          Next
        </button>
      </div>
    </div>
  );
};

export default BusinessVerification;