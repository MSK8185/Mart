import { IoSearch } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { FaArrowLeft } from "react-icons/fa";
import useMobile from '../hooks/useMobile';
import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion"; // <-- Import motion

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchPage, setIsSearchPage] = useState(false);
  const [isMobile] = useMobile();
  const params = new URLSearchParams(location.search);
  const searchText = params.get('q') || '';

  useEffect(() => {
    setIsSearchPage(location.pathname === "/search");
  }, [location]);

  const handleOnChange = (e) => {
    const value = e.target.value;
    navigate(`/search?q=${value}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='w-full min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-full 
        border-2 border-gray-300 flex items-center text-neutral-600 bg-white 
        group focus-within:border-blue-500 hover:shadow-lg transition-all duration-300 ease-in-out'
    >
      <div>
        {isMobile && isSearchPage ? (
          <Link
            to="/"
            className='flex justify-center items-center h-full p-2 m-1
              text-gray-600 hover:text-blue-500 transition-colors duration-300'
          >
            <FaArrowLeft size={20} />
          </Link>
        ) : (
          <button
            className='flex justify-center items-center h-full p-3
              text-gray-500 group-focus-within:text-blue-500 hover:text-blue-500 transition-colors duration-300'
          >
            <IoSearch size={22} />
          </button>
        )}
      </div>

      <div className='w-full h-full'>
        {!isSearchPage ? (
          <div
            onClick={() => navigate("/search")}
            className='w-full h-full flex items-center cursor-text text-gray-400 hover:text-blue-700 transition-colors duration-600'
          >
            <TypeAnimation
              sequence={[
                'Search "Books"', 1500,
                'Search "BedSheet"', 1500,
                'Search "Cookware"', 1500,
                'Search "Bottles"', 1500
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </div>
        ) : (
          <input
            type='text'
            placeholder='Search for products...'
            autoFocus
            defaultValue={searchText}
            className='bg-transparent w-full h-full outline-none text-gray-700
              placeholder-gray-400 focus:placeholder-transparent transition duration-300'
            onChange={handleOnChange}
          />
        )}
      </div>
    </motion.div>
  );
};

export default Search;
