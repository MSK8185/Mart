import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default function BusinessVerificationStatus() {
  const [verificationData, setVerificationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusinessVerification = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }

        const decoded = jwtDecode(token);
        const email = decoded.email;

        const response = await axios.get(`http://localhost:3000/api/business/getBusinessInfo/${email}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data && response.data.length > 0) {
          setVerificationData(response.data);
          console.log('verificationData', response.data);
        } else {
          setError('No business verification data found');
        }
      } catch (err) {
        console.error('Error fetching business verification:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch verification data');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessVerification();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 inline-block"></div>
        <p className="mt-2 text-gray-600">Loading verification status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!verificationData || verificationData.length === 0) {
    return (
      <div className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Business Verification Status</h3>
        <p className="text-gray-600">No verification data found.</p>
      </div>
    );
  }

  return (
    <div className="mb-8 space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">Business Verification Status</h3>
      
      {verificationData.map((verification, index) => (
        <div key={verification._id} className={`p-6 rounded-xl border-2 ${
          verification.status === 'Verified' 
            ? 'bg-green-50 border-green-200' 
            : verification.status === 'Rejected' 
            ? 'bg-red-50 border-red-200' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex justify-between items-start mb-4">
            <h4 className={`text-lg font-medium ${
              verification.status === 'Verified' 
                ? 'text-green-800' 
                : verification.status === 'Rejected' 
                ? 'text-red-800' 
                : 'text-yellow-800'
            }`}>
              Application #{index + 1}
            </h4>
            <span className="text-sm text-gray-500">
              {new Date(verification.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Business Name:</span>
              <span className="font-medium">{verification.businessName}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">PAN Number:</span>
              <span className="font-medium">{verification.panNumber}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">GSTIN:</span>
              <span className="font-medium">{verification.gstin}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Business Address:</span>
              <span className="font-medium">{verification.businessAddress}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status:</span>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  verification.status === 'Verified' ? 'bg-green-500' :
                  verification.status === 'Rejected' ? 'bg-red-500' :
                  'bg-yellow-500'
                }`}></div>
                <span className={`font-medium ${
                  verification.status === 'Verified' ? 'text-green-600' :
                  verification.status === 'Rejected' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {verification.status}
                  {verification.status === 'Pending' && ' (Under Review)'}
                </span>
              </div>
            </div>
            
            {verification.status === 'Rejected' && verification.rejectionRemarks && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-100">
                <h4 className="font-medium text-red-700 mb-2">Rejection Reason:</h4>
                <p className="text-red-600">{verification.rejectionRemarks}</p>
              </div>
            )}
            
            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-700 mb-2">Submitted Documents:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">PAN Document:</p>
                  <a 
                    href={verification.panFile} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View PAN Document
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Aadhar Document:</p>
                  <a 
                    href={verification.aadharFile} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View Aadhar Document
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}