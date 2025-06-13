import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../../firebaseConfig"; 
import { onAuthStateChanged } from "firebase/auth";

const ProfileInformation = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    mobile: "",
    dateOfBirth: "",
  });
  const [age, setAge] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserEmail(user.email);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userEmail) {
      setLoading(true);
      axios
        .get(`http://localhost:3000/api/profile/${userEmail}`)
        .then((res) => {
          if (res.data) {
            setProfile({
              firstName: res.data.firstName || "",
              lastName: res.data.lastName || "",
              gender: res.data.gender || "",
              mobile: res.data.mobile || "",
              dateOfBirth: res.data.dateOfBirth
                ? new Date(res.data.dateOfBirth).toISOString().split("T")[0]
                : "",
            });
            if (res.data.dateOfBirth) {
              setAge(calculateAge(res.data.dateOfBirth));
            }
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching profile information:", err);
          setLoading(false);
        });
    }
  }, [userEmail]);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let computedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      computedAge--;
    }
    return computedAge;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    if (name === "dateOfBirth") {
      setAge(value ? calculateAge(value) : null);
    }
  };

  const triggerModal = (text) => {
    setModalText(text);
    setShowModal(true);
    setTimeout(() => setShowModal(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userEmail) return;
    setLoading(true);
    try {
      const endpoint = profile.firstName ? "update" : "create";
      const response =
        endpoint === "update"
          ? await axios.put("http://localhost:3000/api/profile/update", {
              email: userEmail,
              ...profile,
            })
          : await axios.post("http://localhost:3000/api/profile/create", {
              email: userEmail,
              ...profile,
            });
      console.log(response.data);
      triggerModal(`Profile ${endpoint === "update" ? "updated" : "created"} successfully!`);
      setEditMode(false);
    } catch (error) {
      console.error("Error saving profile information:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your profile information?")) {
      try {
        setLoading(true);
        const res = await axios.delete("http://localhost:3000/api/profile/delete", {
          data: { email: userEmail },
        });
        console.log(res.data);
        setProfile({
          firstName: "",
          lastName: "",
          gender: "",
          mobile: "",
          dateOfBirth: "",
        });
        setAge(null);
        triggerModal("Profile information deleted successfully!");
      } catch (error) {
        console.error("Error deleting profile information:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <main className="flex-1 p-6 relative pt-24">
      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg animate-fade-in">
            <h2 className="text-2xl font-bold text-green-600 mb-2 text-center">
              {modalText}
            </h2>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>
      
      {/* Profile Information Section */}
      <div className="bg-green-200 shadow-lg p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Profile Information</h3>
          <button onClick={() => setEditMode(!editMode)} className="text-blue-600 font-medium">
            {editMode ? "Cancel" : "Edit"}
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                readOnly={!editMode}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                readOnly={!editMode}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Your Gender</label>
            <div className="flex items-center space-x-6">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={profile.gender === "Male"}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="form-radio text-blue-500"
                />
                <span className="ml-2 text-gray-700">Male</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={profile.gender === "Female"}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="form-radio text-blue-500"
                />
                <span className="ml-2 text-gray-700">Female</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  checked={profile.gender === "Other"}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="form-radio text-blue-500"
                />
                <span className="ml-2 text-gray-700">Other</span>
              </label>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-700">Email Address</label>
              <input
                type="email"
                value={userEmail}
                readOnly
                className="w-full px-4 py-2 border rounded bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-700">Mobile Number</label>
              <input
                type="text"
                name="mobile"
                value={profile.mobile}
                onChange={handleChange}
                readOnly={!editMode}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={profile.dateOfBirth}
                onChange={handleChange}
                readOnly={!editMode}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            {age !== null && (
              <div>
                <label className="block text-gray-700">Age</label>
                <input
                  type="text"
                  value={age}
                  readOnly
                  className="w-full px-4 py-2 border rounded bg-gray-100"
                />
              </div>
            )}
          </div>

          {editMode && (
            <div className="flex space-x-6 mt-6">
              <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                Save
              </button>
              <button type="button" onClick={handleDelete} className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
                Delete
              </button>
            </div>
          )}
        </form>
      </div>
    </main>
  );
};

export default ProfileInformation;
