import React, { useState } from "react";
import { auth } from "../../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  sendEmailVerification,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import SignUpbg from "../../assets/images/signUpbg.png";

const SignUp = () => {
  // User information
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [isPhone, setIsPhone] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");

  // Business information
  const [businessName, setBusinessName] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [gstin, setGstin] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [panFile, setPanFile] = useState(null);
  const [aadharFile, setAadharFile] = useState(null);

  // UI states
  const [successMessage, setSuccessMessage] = useState(false);
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [businessFormSubmitted, setBusinessFormSubmitted] = useState(false);

  const navigate = useNavigate();
  const frontendApi = import.meta.env.VITE_FRONTEND_API;

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await sendEmailVerification(userCredential.user, {
        url: `${frontendApi}/home`,
        handleCodeInApp: true,
      });

      await fetch("http://20.40.59.234:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      setSuccessMessage(true);
      setShowBusinessForm(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePhoneSignUp = async (e) => {
    e.preventDefault();
    try {
      const appVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {},
        auth
      );
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );
      setVerificationId(confirmationResult.verificationId);
      alert("OTP has been sent to your phone.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      const userCredential = await signInWithCredential(auth, credential);

      await fetch("http://20.40.59.234:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phoneNumber, password }),
      });

      setSuccessMessage(true);
      setShowBusinessForm(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBusinessFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!validatePAN(panNumber)) {
        setError("Invalid PAN format (e.g., AAAAA9999A)");
        return;
      }

      if (gstin && !validateGSTIN(gstin)) {
        setError("Invalid GSTIN format");
        return;
      }

      if (!panFile || !aadharFile) {
        setError("Please upload both PAN and Aadhar documents");
        return;
      }

      // Create FormData for file uploads
      const formData = new FormData();
      formData.append("businessName", businessName);
      formData.append("panNumber", panNumber);
      formData.append("gstin", gstin);
      formData.append("businessAddress", businessAddress);
      formData.append("panFile", panFile);
      formData.append("aadharFile", aadharFile);

      await fetch("http://20.40.59.234:3000/api/business", {
        method: "POST",
        body: formData,
      });

      setBusinessFormSubmitted(true);
      setSuccessMessage(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen pt-24 pb-10">
      <div className="hidden lg:flex flex-[0.51]">
        <img
          src={SignUpbg}
          alt="Sign Up"
          className="object-cover w-full h-full"
        />
      </div>

      <div className="flex flex-col items-center flex-1 max-w-xl mx-auto p-6 shadow-lg bg-white overflow-y-auto">
        <img src={logo} alt="Logo" className="w-26 h-20 mb-6" />

        {!showBusinessForm ? (
          <div className="w-full">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
              Sign Up
            </h2>

            {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

            <div className="flex justify-center mb-6">
              <button
                onClick={() => setIsPhone(false)}
                className={`px-4 py-2 mx-2 rounded-lg ${
                  !isPhone
                    ? "bg-blue-700 text-white"
                    : "bg-gray-100 text-gray-700"
                } transition`}
              >
                Email
              </button>
              <button
                onClick={() => setIsPhone(true)}
                className={`px-4 py-2 mx-2 rounded-lg ${
                  isPhone
                    ? "bg-blue-700 text-white"
                    : "bg-gray-100 text-gray-700"
                } transition`}
              >
                Phone
              </button>
            </div>

            {isPhone ? (
              <form onSubmit={handlePhoneSignUp} className="w-full">
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-1">
                    Name*
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-1">
                    Phone Number*
                  </label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter your phone number"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-1">
                    Password*
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create password"
                    required
                    minLength="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 6 characters
                  </p>
                </div>
                <div id="recaptcha-container" className="mb-4"></div>
                <button
                  type="submit"
                  className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors mb-4"
                >
                  Send OTP
                </button>

                {verificationId && (
                  <>
                    <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-1">
                        OTP*
                      </label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP received"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <button
                      onClick={handleVerifyOtp}
                      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Verify OTP & Register
                    </button>
                  </>
                )}
              </form>
            ) : (
              <form onSubmit={handleEmailSignUp} className="w-full">
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-1">
                    Name*
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-1">
                    Email*
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-1">
                    Password*
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create password"
                    required
                    minLength="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 6 characters
                  </p>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Complete Registration
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="w-full">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
              Business Information
            </h2>
            {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

            <form onSubmit={handleBusinessFormSubmit} className="w-full">
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Business Name*
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Your business name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  PAN Number*
                </label>
                <input
                  type="text"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  placeholder="AAAAA9999A"
                  maxLength="10"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 uppercase"
                />
                <p className="text-xs text-gray-500 mt-1">Format: AAAAA9999A</p>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  GSTIN (Optional)
                </label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  placeholder="22AAAAA0000A1Z5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 uppercase"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: 22AAAAA0000A1Z5
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Business Address*
                </label>
                <textarea
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  placeholder="Registered business address"
                  rows="3"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Upload PAN Card*
                </label>
                <input
                  type="file"
                  onChange={(e) => setPanFile(e.target.files[0])}
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Accepted formats: PDF, JPG, PNG
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-1">
                  Upload Aadhar Card*
                </label>
                <input
                  type="file"
                  onChange={(e) => setAadharFile(e.target.files[0])}
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Accepted formats: PDF, JPG, PNG
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors"
              >
                Submit Business Details
              </button>
            </form>
          </div>
        )}

        {/* Success Modal */}
        {successMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md">
              <h3 className="text-2xl font-bold text-green-700">
                Successfully Signed Up!
              </h3>
              <p className="mt-4 text-gray-700">
                Welcome, <strong>{name}!</strong> Your account has been created.
              </p>
              <p className="mt-2 text-gray-700">
                A verification email has been sent to <strong>{email}</strong>.
                Please check your inbox and verify your email before logging in.
              </p>
              <button
                onClick={() => {
                  setSuccessMessage(false);
                  navigate("/signin");
                }}
                className="mt-6 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
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

export default SignUp;
