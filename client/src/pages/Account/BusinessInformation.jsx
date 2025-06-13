import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { gsap } from 'gsap';
import * as jwtDecode from 'jwt-decode';
import BusinessVerificationStatus from './BusinessVerificationStatus';

export default function BusinessInfoForm() {
  const formRef = useRef(null);
  const [activeTab, setActiveTab] = useState('submit');

  const [formData, setFormData] = useState({
    businessName: '',
    panNumber: '',
    gstin: '',
    businessAddress: '',
    email: '',
  });

  const [userEmail, setUserEmail] = useState('');
  const [verificationData, setVerificationData] = useState(null);
  const [files, setFiles] = useState({
    panFile: null,
    aadharFile: null,
  });

  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { y: 50, scale: 0.95 },
        {
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'power3.out',
        }
      );
    }
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode.jwtDecode(token);
        const email = decoded.email;
        setUserEmail(email);
        setFormData(prev => ({ ...prev, email: email }));

        // Fetch verification data
        const fetchVerificationData = async () => {
          try {
            const response = await axios.get(`http://localhost:3000/api/business/getBusinessInfo/${email}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            setVerificationData(response.data);
          } catch (err) {
            console.error('Error fetching verification data:', err);
            // It's okay if this fails - it just means no submission exists yet
          }
        };

        fetchVerificationData();
      } catch (error) {
        console.error('Error decoding token:', error);
        setMessage('❌ Error retrieving user information. Please login again.');
      }
    } else {
      setMessage('❌ No authentication token found. Please login again.');
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Validate email exists
    if (!formData.email) {
      setMessage('❌ User email not found. Please refresh and try again.');
      return;
    }

    if (!files.panFile || !files.aadharFile) {
      setMessage('⚠️ Please upload both PAN and Aadhar files.');
      return;
    }

    // Validate file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(files.panFile.type) || !allowedTypes.includes(files.aadharFile.type)) {
      setMessage('❌ Please upload files in JPG, PNG, or PDF format only.');
      return;
    }

    // Validate file size (2MB max)
    const maxFileSize = 2 * 1024 * 1024; // 2MB
    if (files.panFile.size > maxFileSize || files.aadharFile.size > maxFileSize) {
      setMessage('❌ Each file must be under 2MB.');
      return;
    }

    setIsSubmitting(true);

    const data = new FormData();

    // Append all form data including email
    Object.entries(formData).forEach(([key, value]) => {
      if (value) { // Only append non-empty values
        data.append(key, value);
      }
    });

    data.append('panFile', files.panFile);
    data.append('aadharFile', files.aadharFile);

    try {
      const response = await axios.post('http://localhost:3000/api/business', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
      });

      setMessage('✅ Business information submitted successfully!');

      // Reset form (but keep email)
      setFormData({
        businessName: '',
        panNumber: '',
        gstin: '',
        businessAddress: '',
        email: userEmail, // Keep the email
      });
      setFiles({ panFile: null, aadharFile: null });

      // Reset file inputs
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach(input => input.value = '');

      // Switch to status tab after successful submission
      setTimeout(() => {
        setActiveTab('status');
      }, 2000);

    } catch (err) {
      console.error('Submission error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Something went wrong.';
      setMessage(`❌ ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTabContent = () => {
    if (activeTab === 'submit') {
      return (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 font-medium text-gray-700">Business Name *</label>
            <input
              type="text"
              name="businessName"
              placeholder="Enter your business name"
              value={formData.businessName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">PAN Number *</label>
            <input
              type="text"
              name="panNumber"
              placeholder="ABCDE1234F"
              value={formData.panNumber}
              onChange={handleChange}
              required
              maxLength={10}
              pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
            />
            <p className="text-xs text-gray-500 mt-1">Format: ABCDE1234F</p>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">GSTIN (Optional)</label>
            <input
              type="text"
              name="gstin"
              placeholder="22AAAAA0000A1Z5"
              value={formData.gstin}
              onChange={handleChange}
              maxLength={15}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
            />
            <p className="text-xs text-gray-500 mt-1">15-digit GST identification number</p>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Business Address *</label>
            <textarea
              name="businessAddress"
              placeholder="Enter your complete business address"
              value={formData.businessAddress}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Upload PAN Document *</label>
            <input
              type="file"
              name="panFile"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
              required
              className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition file:cursor-pointer"
            />
            {files.panFile && (
              <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  ✓ Selected: <span className="font-medium">{files.panFile.name}</span>
                </p>
                <p className="text-xs text-blue-600">
                  Size: {(files.panFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">Accepted formats: JPG, PNG, PDF (Max 2MB)</p>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Upload Aadhar Document *</label>
            <input
              type="file"
              name="aadharFile"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
              required
              className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-green-600 file:text-white hover:file:bg-green-700 transition file:cursor-pointer"
            />
            {files.aadharFile && (
              <div className="mt-2 p-2 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  ✓ Selected: <span className="font-medium">{files.aadharFile.name}</span>
                </p>
                <p className="text-xs text-green-600">
                  Size: {(files.aadharFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">Accepted formats: JPG, PNG, PDF (Max 2MB)</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !userEmail}
            className={`w-full py-3 px-4 rounded-xl transition duration-300 font-medium ${isSubmitting || !userEmail
                ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl hover:scale-105 transform'
              }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Business Information'
            )}
          </button>

          {message && (
            <div className={`text-center text-sm mt-4 p-3 rounded-lg font-medium ${message.includes('✅')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : message.includes('⚠️')
                  ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
              {message}
            </div>
          )}
        </form>
      );
    } else {
      return <BusinessVerificationStatus />;
    }
  };

  return (
    <div
      ref={formRef}
      className="max-w-2xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-3xl border border-gray-100 font-poppins"
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-blue-800 mb-2">Business Information</h2>
      </div>

      {/* Tab Navigation */}
      <div className="flex mb-8 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setActiveTab('submit')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
            activeTab === 'submit'
              ? 'bg-white text-blue-600 shadow-md'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Submit Application
          </div>
        </button>
        <button
          onClick={() => setActiveTab('status')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
            activeTab === 'status'
              ? 'bg-white text-blue-600 shadow-md'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Verification Status
          </div>
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>
    </div>
  );
}