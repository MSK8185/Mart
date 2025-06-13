import React from "react";
import { FaBars } from "react-icons/fa";
import { FiLogOut, FiBell, FiMail } from "react-icons/fi";
import { Avatar } from "../../assets/images/admin";
import { useNavigate } from "react-router-dom";

const AdminHeader = ({ setOpen }) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      sessionStorage.removeItem("admintoken");
      navigate("/SignIn");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 text-black border-b cursor-pointer bg-gray-100 font-poppins">
      <button className="lg:hidden" onClick={() => setOpen((prev) => !prev)}>
        <FaBars size={20} />
        <span className="sr-only">Toggle Menu</span>
      </button>

      <div className="flex items-center gap-4 ml-auto">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 bg-gray-500 rounded-full" >
            <img
              className="rounded-full w-8 h-8"
              src={Avatar}
              alt="user-profile"
            />
          </div>{" "}
          <div>
            <p className="text-xs text-gray-400">Welcome</p>
            <p className="text-sm font-medium">Admin</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 rounded-md px-4 py-2 text-sm 
                font-medium bg-gray-200 hover:bg-gray-300"
        >
          <span>Log Out</span>
          <FiLogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
