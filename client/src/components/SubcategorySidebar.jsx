import React, { useState, useEffect } from "react";
import axios from "axios";

const SubcategorySidebar = ({ selectedCategoryId, onSubcategorySelect }) => {
  const [subcategories, setSubCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);

  useEffect(() => {
    if (!selectedCategoryId) return;

    setSubCategories([]);
    setSelectedSubcategoryId(null);
    setError(null);
    setLoading(true);

    const fetchSubcategories = async () => {
      try {
        const res = await axios.get(
          `http://20.40.59.234:3000/api/admin/subcategories/subcategories?categoryId=${selectedCategoryId}`
        );
        const data = res.data?.subcategories || [];
        setSubCategories(data);
      } catch (err) {
        console.error("Error fetching subcategories:", err);
        setError("Failed to load subcategories.");
        setSubCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, [selectedCategoryId]);

  const handleClick = (subcategoryId) => {
    setSelectedSubcategoryId(subcategoryId);
    onSubcategorySelect(subcategoryId);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-100 h-full overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 z-10">
        <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
          Categories
        </h2>
      </div>

      {/* Content */}
      <div className="px-3 py-3">
        {loading ? (
          <p className="text-gray-500 text-sm text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-sm text-center">{error}</p>
        ) : subcategories.length === 0 ? (
          <p className="text-gray-400 text-sm text-center">No items found</p>
        ) : (
          <div className="space-y-1">
            {/* All Products */}
            <button
              onClick={() => handleClick(null)}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center transition-all duration-200 ${
                selectedSubcategoryId === null
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p
                  className="text-sm font-medium truncate"
                  title="All Products"
                >
                  All Products
                </p>
                <p className="text-xs text-gray-500">View everything</p>
              </div>
              {selectedSubcategoryId === null && (
                <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
              )}
            </button>

            {/* Subcategories */}
            {subcategories.map((subcategory) => (
              <button
                key={subcategory._id}
                onClick={() => handleClick(subcategory._id)}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center transition-all duration-200 ${
                  selectedSubcategoryId === subcategory._id
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <div className="w-10 h-10 rounded-lg mr-3 flex-shrink-0 overflow-hidden">
                  {subcategory.image ? (
                    <img
                      src={subcategory.image}
                      alt={subcategory.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentNode.querySelector(
                          ".fallback"
                        ).style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`fallback w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${
                      subcategory.image ? "hidden" : ""
                    }`}
                  >
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  {/* OPTION 1: Wrap text */}
                  <p className="text-sm font-medium break-words whitespace-normal">
                    {subcategory.name}
                  </p>

                  {/* OPTION 2: Truncate with tooltip */}
                  {/* <p className="text-sm font-medium truncate" title={subcategory.name}>
                    {subcategory.name}
                  </p> */}

                  <p className="text-xs text-gray-500">Browse items</p>
                </div>
                {selectedSubcategoryId === subcategory._id && (
                  <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubcategorySidebar;
