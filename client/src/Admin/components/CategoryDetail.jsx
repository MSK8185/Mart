import React, { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";

const CategoryDetail = ({ category, closeModal }) => {
  const [subcategories, setSubcategories] = useState([]);
  const [productsBySubcategory, setProductsBySubcategory] = useState({});
  const [allCategoryProducts, setAllCategoryProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState({});
  const [productsPerPage] = useState(3);

  const getSubcategories = async (category) => {
    try {
      const response = await fetch(
        `http://20.40.59.234:3000/api/admin/subcategories/subcategories?categoryId=${category._id}`
      );
      const data = await response.json();
      setSubcategories(data.subcategories || []);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const getAllProductsByCategory = async (category) => {
    try {
      const response = await fetch(
        `http://20.40.59.234:3000/api/products/category/${category.name}`
      );
      const data = await response.json();
      setAllCategoryProducts(data.products || []);
      // Initialize the pagination for "all" tab
      setCurrentPage((prev) => ({ ...prev, all: 1 }));
    } catch (error) {
      console.error("Error fetching category products:", error);
    }
  };

  const getProductsBySubcategory = async (subcategoryId) => {
    try {
      const response = await fetch(
        `http://20.40.59.234:3000/api/products/subcategory/${subcategoryId}`
      );
      const data = await response.json();
      setProductsBySubcategory((prev) => ({
        ...prev,
        [subcategoryId]: data.products || [],
      }));
      // Initialize the pagination for this subcategory
      setCurrentPage((prev) => ({ ...prev, [subcategoryId]: 1 }));
    } catch (error) {
      console.error("Error fetching subcategory products:", error);
    }
  };

  useEffect(() => {
    if (category?._id) {
      getSubcategories(category);
      getAllProductsByCategory(category);
    }
  }, [category]);

  const allTabs = [{ _id: "all", name: "All" }, ...subcategories];

  // Pagination handler
  const paginate = (tabId, pageNumber) => {
    setCurrentPage((prev) => ({
      ...prev,
      [tabId]: pageNumber,
    }));
  };

  // Get current products for a specific tab
  const getCurrentProducts = (tabId) => {
    const products =
      tabId === "all"
        ? allCategoryProducts
        : productsBySubcategory[tabId] || [];
    const page = currentPage[tabId] || 1;

    const indexOfLastProduct = page * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

    return {
      currentProducts: products.slice(indexOfFirstProduct, indexOfLastProduct),
      totalProducts: products.length,
      totalPages: Math.ceil(products.length / productsPerPage),
    };
  };

  // Generate pagination controls
  const renderPagination = (tabId, totalPages) => {
    if (totalPages <= 1) return null;

    const currentPageNumber = currentPage[tabId] || 1;

    // Generate page numbers array for pagination with ellipses
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      // Add first page, last page, and pages around current page
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPageNumber - 1 && i <= currentPageNumber + 1)
      ) {
        pageNumbers.push(i);
      } else if (i === currentPageNumber - 2 || i === currentPageNumber + 2) {
        pageNumbers.push("...");
      }
    }

    // Remove duplicate ellipses
    const uniquePageNumbers = pageNumbers.filter((number, index, self) =>
      number === "..." ? self.indexOf(number) === index : true
    );

    return (
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => paginate(tabId, currentPageNumber - 1)}
            disabled={currentPageNumber === 1}
            className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
              currentPageNumber === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPageNumber} of {totalPages}
          </span>
          <button
            onClick={() => paginate(tabId, currentPageNumber + 1)}
            disabled={currentPageNumber === totalPages}
            className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
              currentPageNumber === totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {Math.min(
                  (currentPageNumber - 1) * productsPerPage + 1,
                  getCurrentProducts(tabId).totalProducts
                )}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(
                  currentPageNumber * productsPerPage,
                  getCurrentProducts(tabId).totalProducts
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium">
                {getCurrentProducts(tabId).totalProducts}
              </span>{" "}
              results
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={() => paginate(tabId, currentPageNumber - 1)}
                disabled={currentPageNumber === 1}
                className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                  currentPageNumber === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                } ring-1 ring-inset ring-gray-300 focus:outline-offset-0`}
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {uniquePageNumbers.map((number, index) => (
                <button
                  key={index}
                  onClick={() => number !== "..." && paginate(tabId, number)}
                  disabled={number === "..."}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    number === currentPageNumber
                      ? "bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      : number === "..."
                      ? "text-gray-700 ring-1 ring-inset ring-gray-300"
                      : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                  }`}
                >
                  {number}
                </button>
              ))}

              <button
                onClick={() => paginate(tabId, currentPageNumber + 1)}
                disabled={currentPageNumber === totalPages}
                className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                  currentPageNumber === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                } ring-1 ring-inset ring-gray-300 focus:outline-offset-0`}
              >
                <span className="sr-only">Next</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  const renderProductTable = (tabId) => {
    const { currentProducts, totalPages } = getCurrentProducts(tabId);

    return (
      <>
        {currentProducts?.length > 0 ? (
          <>
            <div className="overflow-auto">
              <table className="min-w-full table-auto border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2">Image</th>
                    <th className="border px-4 py-2">Name</th>
                    <th className="border px-4 py-2">Price</th>
                    <th className="border px-4 py-2">Stock</th>
                    <th className="border px-4 py-2">MOQ</th>
                    <th className="border px-4 py-2">Bulk Pricing</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((product) => (
                    <tr key={product._id}>
                      <td className="border px-4 py-2">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="border px-4 py-2">{product.name}</td>
                      <td className="border px-4 py-2">₹{product.price}</td>
                      <td className="border px-4 py-2">{product.stock}</td>
                      <td className="border px-4 py-2">{product.MOQ}</td>
                      <td className="border px-4 py-2">
                        {product.bulkPricing?.length > 0 ? (
                          <ul className="list-disc ml-4">
                            {product.bulkPricing.map((bp, index) => (
                              <li key={index}>
                                {bp.minQty}+ units: ₹{bp.pricePerUnit}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {renderPagination(tabId, totalPages)}
          </>
        ) : (
          <p className="text-gray-500">No products found.</p>
        )}
      </>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[90vw] max-w-6xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Category: {category?.name}</h2>

        <Tab.Group>
          <Tab.List className="flex space-x-2 border-b pb-2 mb-4 overflow-x-auto">
            {allTabs.map((tab) => (
              <Tab
                key={tab._id}
                className={({ selected }) =>
                  `px-4 py-1 rounded-md whitespace-nowrap ${
                    selected ? "bg-blue-600 text-white" : "bg-gray-200"
                  }`
                }
                onClick={() => {
                  if (tab._id !== "all" && !productsBySubcategory[tab._id]) {
                    getProductsBySubcategory(tab._id);
                  }
                }}
              >
                {tab.name}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels>
            {allTabs.map((tab) => (
              <Tab.Panel key={tab._id} className="mt-4">
                <h3 className="text-xl font-semibold mb-2">
                  {tab.name === "All"
                    ? "All Products"
                    : `Products in ${tab.name}`}
                </h3>
                {renderProductTable(tab._id)}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>

        <button
          onClick={closeModal}
          className="mt-6 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CategoryDetail;
