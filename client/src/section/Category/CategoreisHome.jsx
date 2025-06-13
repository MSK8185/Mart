import React, { useRef, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { offerImage } from "../../assets/images";
import { TbCategoryFilled } from "react-icons/tb";

const CategorySection = () => {
  const scrollContainerRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const scroll = (direction) => {
    const scrollAmount = 300;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://20.40.59.234:3000/api/admin/categories/"
        );
        setCategories(response.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="mx-auto px-4 py-6 bg-gray-100 shadow-md p-4">
      <h2 className="flex items-center gap-2 text-2xl font-bold italic mb-6 text-gray-200 font-poppins shadow-lg p-3 bg-blue-900">
        <TbCategoryFilled /> Choose your Category
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading categories...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="flex items-center relative">
          {/* Scrollable Area */}
          <div className="relative w-full overflow-hidden mr-4 group">
            {/* Left Arrow (visible on hover) */}
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border rounded-md p-2 shadow transition-transform duration-200 ease-in-out hidden group-hover:flex"
            >
              <FaChevronLeft />
            </button>

            {/* Categories */}
            <div
              ref={scrollContainerRef}
              className="flex gap-1 bg-white overflow-x-auto scrollbar-hide scroll-smooth px-8 pb-6"
            >
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/categories/${category.name}`}
                  className="flex-none w-40 h-50 flex flex-col items-center justify-center shadow rounded-lg hover:shadow-md hover:scale-105 transition-transform"
                >
                  <div className="w-36 h-36 mb-2">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-sm font-bold text-gray-700 text-center line-clamp-2 pb-2">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>

            {/* Right Arrow (visible on hover) */}
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border rounded-md p-2 shadow transition-transform duration-200 ease-in-out hidden group-hover:flex"
            >
              <FaChevronRight />
            </button>
          </div>

          {/* Banner on the right */}
          <div className="w-52 flex-shrink-0 hidden lg:block">
            <img
              src={offerImage}
              alt="Offer Banner"
              className="w-full h-full object-cover rounded-lg shadow"
            />
          </div>
        </div>
      )}

      {/* Hide scrollbars */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default CategorySection;
