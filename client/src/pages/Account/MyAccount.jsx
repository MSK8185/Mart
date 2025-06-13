import React, { useState } from "react";
import {
  MdSwitchAccount,
  MdOutlinePayment,
  MdClose,
  MdMenu
} from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import AddressManagement from "../../pages/Account/AddressMangement";
import ProfileInformation from "../../pages/Account/ProfileInformation";
import GiftCard from "../../pages/Account/GiftCardPage";
import OrderHistory from "../../components/OrderHistory";
import BusinessInformation from "./BusinessInformation";
import { useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  {
    section: "Account Settings",
    icon: <MdSwitchAccount className="mr-3 text-xl" />,
    options: [
      { label: "Profile Information", component: <ProfileInformation /> },
      { label: "Manage Addresses", component: <AddressManagement /> },
      { label: "My Orders", component: <OrderHistory /> },
      { label: "Business Information", component: <BusinessInformation /> },
    ],
  },
  {
    section: "Payments",
    icon: <MdOutlinePayment className="mr-3 text-xl" />,
    options: [
      { label: "Gift Cards", component: <GiftCard /> },
    ],
  },
];

const GreetingPage = () => {

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-2xl shadow-lg border border-green-100">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-white text-3xl font-bold">W</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome Back!</h2>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
            We&apos;re delighted to have you here. Use the navigation menu to explore your account settings,
            manage your orders, and personalize your experience with us.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MdSwitchAccount className="text-green-600 text-2xl" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Account Settings</h3>
              <p className="text-gray-600 text-sm">Manage your profile and preferences</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MdOutlinePayment className="text-blue-600 text-2xl" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Payment Methods</h3>
              <p className="text-gray-600 text-sm">Handle your payment options</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-2xl">📦</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Order History</h3>
              <p className="text-gray-600 text-sm">Track and review your orders</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-green-100 rounded-xl border border-green-200">
            <p className="text-green-700 font-medium">
              💡 Tip: Keep your profile updated for a personalized experience!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyAccount = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem("token");
      navigate("/SignIn");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavClick = (component) => {
    setActiveComponent(component);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-20 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
        aria-label="Toggle menu"
      >
        {sidebarOpen ? (
          <MdClose className="text-xl text-gray-700" />
        ) : (
          <MdMenu className="text-xl text-gray-700" />
        )}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative lg:translate-x-0 z-40
          w-80 lg:w-72 h-full lg:h-auto
          bg-white shadow-xl lg:shadow-md
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          overflow-y-auto
        `}
      >
        {/* User Info */}
        <div className="p-6 border-b border-gray-100">
          <div className="text-center">
            <div className="relative inline-block">
              <img
                src="https://via.placeholder.com/80"
                alt="User profile"
                className="w-20 h-20 rounded-full mx-auto border-4 border-white shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <h3 className="mt-4 font-bold text-xl text-gray-800">
              Hello, User
            </h3>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {NAV_ITEMS.map(({ section, icon, options }, index) => (
            <div key={index} className="mb-6">
              <div className="flex items-center text-gray-800 font-bold text-sm mb-3 px-3 py-2 bg-gray-50 rounded-lg">
                {icon}
                <span className="tracking-wide">{section}</span>
              </div>
              <div className="space-y-1">
                {options.map(({ label, component }, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleNavClick(component)}
                    className={`
                      w-full text-left px-4 py-3 rounded-lg
                      transition-all duration-200
                      hover:bg-green-50 hover:text-green-700 hover:shadow-sm
                      focus:outline-none focus:ring-2 focus:ring-green-200
                      ${activeComponent === component
                        ? 'bg-green-100 text-green-700 shadow-sm font-medium'
                        : 'text-gray-600'
                      }
                    `}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Logout */}
          <div className="pt-4 border-t border-gray-100">
            <button className="w-full text-left px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-700 rounded-lg flex items-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-200"
              onClick={handleLogout}
            >
              <span>Logout</span>
              <IoLogOut className="ml-auto text-xl" />
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 min-h-screen">
        <div className="p-4 lg:p-8 pt-20 lg:pt-8">
          <div className="max-w-6xl mx-auto">
            {activeComponent ? (
              <div className="animate-fadeIn">
                {activeComponent}
              </div>
            ) : (
              <GreetingPage />
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MyAccount;