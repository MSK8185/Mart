import React from 'react';
import { RiAdminFill } from "react-icons/ri";
import { MdOutlineDashboardCustomize, MdClose, MdOutlinePhoneCallback } from "react-icons/md";
import { FaBagShopping } from "react-icons/fa6";
import { PiShoppingBagFill } from "react-icons/pi";
import { useNavigate, useLocation } from 'react-router-dom';
import { MdCategory } from "react-icons/md";
import { FaUserShield } from "react-icons/fa6";
import { FaPercentage } from "react-icons/fa";
import { FaShoppingBasket } from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import { FaBusinessTime } from "react-icons/fa";
import { PiFlagBannerFill } from "react-icons/pi";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const adminSidebarMenuItems = [
    { id: "dashboard", label: "Dashboard", path: "/admin/dashboard", icon: <MdOutlineDashboardCustomize /> },
    { id: "products", label: "Products", path: "/admin/products", icon: <FaBagShopping /> },
    { id: "categories", label: "Categories", path: "/admin/categories", icon: <MdCategory /> },
    { id: "subcategories", label: "SubCategories", path: "/admin/subcategories", icon: <FaShoppingBasket /> },
    { id: "orders", label: "Orders", path: "/admin/orders", icon: <PiShoppingBagFill /> },
    { id: "usermanagement", label: "Users", path: "/admin/users", icon: <FaUserShield /> },
    { id: "voucher", label: "Voucher", path: "/admin/voucher", icon: <FaPercentage /> },
    { id: "paymentdetails", label: "PaymentDetails", path: "/admin/payment-details", icon: <MdOutlinePayment /> },
    { id: "business-verification", label: "BusinessVerfication", path: "/admin/business-verfication", icon: <FaBusinessTime /> },
    { id: "contactdetails", label: "Contact Enquiries", path: "/admin/contact-details", icon: <MdOutlinePhoneCallback /> },
    { id: "banner", label: "Banner", path: "/admin/banner", icon: <PiFlagBannerFill /> },
];

const MenuItems = ({ setOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="mt-8 flex flex-col gap-2 font-poppins">
            {adminSidebarMenuItems.map((menuItem) => (
                <div
                    key={menuItem.id}
                    onClick={() => {
                        navigate(menuItem.path);
                        setOpen && setOpen(false);
                    }}
                    className={`flex cursor-pointer text-xl items-center gap-2
                        rounded-md px-3 py-2 
                        ${location.pathname === menuItem.path 
                            ? 'bg-gray-200 text-cyan-700' 
                            : 'text-gray-500 hover:bg-gray-100 hover:text-cyan-700'
                        }`}
                >
                    {menuItem.icon}
                    <span className='max-md:text-base'>{menuItem.label}</span>
                </div>
            ))}
        </nav>
    );
};

const AdminSideBar = ({ open, setOpen }) => {
    return (
        <aside
            className={`fixed inset-y-0 z-20 bg-cyan-50 text-cyan-900 border-r transition-transform 
                lg:relative lg:transform-none lg:w-64 w-64 max-h-screen overflow-y-auto scrollbar-w-4 scrollbar-thumb-cyan-600 scrollbar-track-transparent 
                ${open ? 'translate-x-0' : '-translate-x-full'}`}
        >
            <div className="flex items-center gap-5 p-[14px] border-b">
                <button
                    className="lg:hidden text-gray-600 hover:text-gray-900"
                    onClick={() => setOpen(false)}
                >
                    <MdClose size={24} />
                </button>
                <div className="flex items-center gap-2">
                    <RiAdminFill size={24} />
                    <h1 className="text-2xl font-extrabold max-lg:text-lg">Admin Panel</h1>
                </div>
            </div>
            <MenuItems setOpen={setOpen} />
        </aside>
    );
};

export default AdminSideBar;