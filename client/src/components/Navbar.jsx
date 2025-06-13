import React, { useState, useRef, useEffect } from "react";
import {
  FaSearch,
  FaUserCircle,
  FaHeart,
  FaShoppingCart,
  FaBars,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
// import logo from "../assets/images/logo.png";
// import logo from "../assets/images/logo.png";
import logo from "../assets/images/logo.png";
// import logo from "../assets/images/BGlog.png";
import Search from "../components/Search";

const Navbar = () => {
  const cartItems = useSelector((state) => state.cart);
  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const dropdownTimeout = useRef(null);
  const [walletCoins, setWalletCoins] = useState(0); // State to store wallet

  // useEffect(() => {
  //   const currentUser = auth.currentUser;
  //   if (currentUser) {
  //     setUserName(currentUser.displayName || currentUser.email.split("@")[0]);
  //   } else {
  //     setUserName("");
  //   }
  // }, [auth.currentUser]);

  useEffect(() => {
    // Fetch the current user information from Firebase (if logged in)
    const currentUser = auth.currentUser;
    if (currentUser && currentUser.emailVerified) {
      setUserName(currentUser.displayName || currentUser.email.split("@")[0]);
      fetchWalletCoins(currentUser.email);
    } else {
      setUserName("");
      setWalletCoins(0);
    }
  }, [auth.currentUser]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUserName("");
        navigate("/SignIn");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  const handleMouseEnter = () => {
    clearTimeout(dropdownTimeout.current);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 300);
  };

  const fetchWalletCoins = async (email) => {
    try {
      console.log("Fetching wallet coins for email:", email); // Log the email for debugging
      const response = await fetch(
        `http://20.40.59.234:5000/api/auth/coins/${email}`
      );
      const data = await response.json();
      if (response.ok) {
        setWalletCoins(data.coins); // Update the state with the wallet coins
      } else {
        console.error("Error fetching coins:", data.message);
      }
    } catch (error) {
      console.error("Error fetching wallet coins:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 shadow-md p-2 font-poppins h-20 lg:h-16 bg-gray-100">
      <div className="container mx-auto flex flex-col lg:flex-row lg:justify-between items-center bg">
        <div className="flex justify-between w-full lg:w-auto items-center mb-4 lg:mb-0 bg-gray-100 rounded-lg hover:scale-110 transition-transform duration-200">
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="w-40 h-30 animate-cart-slide-in "
            />
          </Link>
          <div className="flex items-center gap-3 lg:hidden">
            <Link to="/wishlist">
              <FaHeart
                size={20}
                className="cursor-pointer hover:text-gray-600 hover:scale-110 transition-transform duration-200"
              />
            </Link>
            <Link to="/cart">
              <div className="relative">
                <FaShoppingCart
                  size={20}
                  className="cursor-pointer hover:text-gray-600"
                />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-gray-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </div>
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-blue-900 lg:hidden"
            >
              <FaBars size={20} />
            </button>
          </div>
        </div>

        <ul
          className={`${
            isMenuOpen ? "block" : "hidden"
          } lg:flex flex-col lg:flex-row gap-6 w-full lg:w-auto bg-white lg:bg-transparent p-4 lg:p-0  text-slate-800  lg:static absolute top-20 left-0 z-50 font-extrabold font-poppins italic `}
        >
          <li className="hover:text-blue-600 hover:scale-110 transition-transform duration-200">
            <Link to="/">HOME</Link>
          </li>
          <li className="hover:text-blue-600 hover:scale-110 transition-transform duration-200">
            <Link to="/shop">PRODUCT</Link>
          </li>
        </ul>

        <div className="w-full lg:w-auto lg:mt-0 flex pt-6 lg:pt-0">
          <Search />
        </div>

        <div className="hidden lg:flex items-center gap-6 text-slate-800  relative">
          <Link to="/wishlist">
            <FaHeart
              size={24}
              className="cursor-pointer hover:text-blue-600 hover:scale-110 transition-transform duration-200"
            />
          </Link>
          <Link to="/cart">
            <div className="relative">
              <FaShoppingCart
                size={24}
                className="cursor-pointer hover:text-blue-600 hover:scale-110 transition-transform duration-200"
              />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-green-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </div>
          </Link>
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="flex items-center gap-2 hover:text-blue-600 hover:scale-110 transition-transform duration-200 font-bold">
              <FaUserCircle size={24} />
              {userName && (
                <span className="text-sm font-semibold">{userName}</span>
              )}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 z-50 animate__animated animate__fadeIn animate__faster">
                <p className="px-4 py-2 font-bold">Coins: {walletCoins} 🪙</p>{" "}
                {/* Display wallet coins */}
                {userName ? (
                  <>
                    <Link
                      to="/account"
                      className="block px-4 py-2 hover:bg-gray-100 hover:scale-105 transition-transform duration-200 font-bold"
                    >
                      My Account
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-4 py-2 hover:bg-gray-100 hover:scale-105 transition-transform duration-200 font-bold"
                    >
                      Wishlist
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 hover:bg-gray-100 hover:scale-105 transition-transform duration-200 font-bold"
                    >
                      Orders
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 font-bold hover:scale-105 transition-transform duration-200"
                      onClick={handleLogout}
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:scale-105 transition-transform duration-200 font-bold"
                    onClick={() => navigate("/SignIn")}
                  >
                    Log In
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
