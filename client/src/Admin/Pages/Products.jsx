import React, { useReducer, useEffect, useState, useRef } from "react";
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";
import Popup from "reactjs-popup";
import AddProduct from "../components/AddProduct";
import EditProductModal from "../components/EditProductModal";
import { getCategories } from "../api/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const initialState = {
  newProduct: {
    name: "",
    category: "",
    subCategory: "",
    price: "",
    stock: "",
    image: null,
    subImages: [],
    originalprice: "",
    productId: "",
    quantity: "",
    productDetails: "",
    bulkPricing: [],
    MOQ: "", // Minimum Order Quantity
  },
  imagePreview: null,
  subImagePreview: [],
  loading: false,
  error: null,
  products: [],
  searchQuery: "",
  productToEdit: null,
};

const productReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_NEW_PRODUCT":
      return {
        ...state,
        newProduct: { ...state.newProduct, [action.name]: action.value },
      };

    case "SET_IMAGE_PREVIEW":
      return { ...state, imagePreview: action.payload };

    case "SET_SUB_IMAGE_PREVIEW":
      return { ...state, subImagePreview: action.payload };

    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "RESET_NEW_PRODUCT":
      return {
        ...state,
        newProduct: initialState.newProduct,
        imagePreview: null,
        subImagePreview: null,
        error: null,
        productToEdit: null,
      };

    case "SET_PRODUCTS":
      return { ...state, products: action.payload };

    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };

    case "SET_PRODUCT_TO_EDIT":
      return { ...state, productToEdit: action.payload };

    case "UPDATE_BULK_PRICING":
      return {
        ...state,
        newProduct: {
          ...state.newProduct,
          bulkPricing: action.payload,
        },
      };

    case "SET_SUB_IMAGES":
      return {
        ...state,
        newProduct: {
          ...state.newProduct,
          subImages: action.payload,
        },
      };

    default:
      return state;
  }
};

const Products = () => {
  const [state, dispatch] = useReducer(productReducer, initialState);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [productToPreview, setProductToPreview] = useState(null);
  const [notification, setNotification] = useState();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 11; // Adjust as needed
  const [filterBy, setFilterBy] = useState("category");
  const [filterValue, setFilterValue] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const topRef = useRef(null);

  const filteredProducts = state.products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      product.productId.toLowerCase().includes(state.searchQuery.toLowerCase());

    let matchesFilter = true;
    if (filterBy === "category") {
      matchesFilter = !filterValue || product.category?._id === filterValue;
    } else if (filterBy === "lowStock") {
      matchesFilter =
        !filterValue || (filterValue === "low" && product.stock <= 10);
    }
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setTimeout(() => {
        scrollToTop();
      }, 0);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setTimeout(() => {
        scrollToTop();
      }, 0);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    scrollToTop();
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://20.40.59.234:3000/api/products/get");
      if (response.ok) {
        const data = await response.json();
        dispatch({ type: "SET_PRODUCTS", payload: data });
      } else {
        console.error("Error fetching products:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "UPDATE_NEW_PRODUCT", name, value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch({ type: "UPDATE_NEW_PRODUCT", name: "image", value: file });
      dispatch({
        type: "SET_IMAGE_PREVIEW",
        payload: URL.createObjectURL(file),
      });
    }
  };

  const handleAddProduct = async (productData) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    // Generate new productId
    const existingIds = state.products
      .map((product) => product.productId)
      .filter((id) => id.startsWith("PROD-"))
      .map((id) => parseInt(id.split("-")[1], 10));
    const newIdNumber =
      existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    const newProductId = `PROD-${String(newIdNumber).padStart(2, "0")}`;
    // Update product data with generated productId
    dispatch({
      type: "UPDATE_NEW_PRODUCT",
      name: "productId",
      value: newProductId,
    });
    try {
      const formData = new FormData();
      formData.append("productId", newProductId);
      formData.append("name", productData.name);
      formData.append("category", productData.category);
      formData.append("subCategory", productData.subCategory);
      formData.append("price", productData.price);
      formData.append("stock", productData.stock);
      formData.append("originalprice", productData.originalprice);
      formData.append("quantity", productData.quantity);
      formData.append("productDetails", productData.productDetails);
      formData.append("bulkPricing", JSON.stringify(productData.bulkPricing));
      formData.append("MOQ", productData.MOQ || 1);

      if (productData.image) {
        formData.append("image", productData.image);
      } else {
        dispatch({ type: "SET_ERROR", payload: "Image file is missing" });
        return;
      }

      if (productData.subImages && productData.subImages.length > 0) {
        productData.subImages.forEach((file, index) => {
          formData.append("subImages", file);
        });
      }
      const response = await fetch(
        "http://20.40.59.234:3000/api/products/add",
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        const data = await response.json();
        setNotification(`Product "${productData.name}" added successfully!`);
        dispatch({ type: "RESET_NEW_PRODUCT" });
        fetchProducts();
        setTimeout(() => setNotification(""), 3000);
      } else {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          dispatch({
            type: "SET_ERROR",
            payload: errorJson.message || "Error adding product",
          });
        } catch (e) {
          dispatch({
            type: "SET_ERROR",
            payload: errorText || "Error adding product",
          });
        }
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.message || "Error adding product",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowConfirm(true);
  };
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(
        `http://20.40.59.234:3000/api/products/delete/${productToDelete._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setNotification(
          `Product "${productToDelete.name || "Unnamed"}" deleted successfully!`
        );
        dispatch({
          type: "SET_PRODUCTS",
          payload: state.products.filter((p) => p._id !== productToDelete._id),
        });
        fetchProducts();
      } else {
        const errorText = await response.text();
        setNotification("Error deleting product");
      }
    } catch (error) {
      setNotification("Error deleting product");
    } finally {
      setTimeout(() => setNotification(""), 3000);
      setShowConfirm(false);
      setProductToDelete(null);
    }
  };

  const handleEditProduct = async (product) => {
    dispatch({ type: "SET_PRODUCT_TO_EDIT", payload: product });
    Object.keys(product).forEach((key) => {
      dispatch({ type: "UPDATE_NEW_PRODUCT", name: key, value: product[key] });
    });

    dispatch({
      type: "SET_IMAGE_PREVIEW",
      payload: product.image.includes("http")
        ? product.image
        : `https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/${product.image}`,
    });

    const selectedCategoryId = product.category?._id || product.category;
    if (selectedCategoryId) {
      try {
        const response = await fetch(
          `http://20.40.59.234:3000/api/admin/subcategories/subcategories?categoryId=${selectedCategoryId}`
        );
        const data = await response.json();
        setSubcategories(data.subcategories || []);
      } catch (error) {
        setSubcategories([]);
      }
    } else {
      setSubcategories([]);
    }

    setShowEditModal(true);
  };

  const handleDeleteSubImage = async (imageUrlOrId) => {
    if (!state.productToEdit) return;

    const confirm = window.confirm(
      "Are you sure you want to delete this image?"
    );
    if (!confirm) return;

    try {
      const res = await fetch(
        `http://20.40.59.234:3000/api/products/subimage/${state.productToEdit._id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrlOrId }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete image.");

      // Update Redux state (remove deleted subImage)
      const updatedSubImages = state.newProduct.subImages.filter(
        (img) => img !== imageUrlOrId
      );
      dispatch({
        type: "UPDATE_NEW_PRODUCT",
        name: "subImages",
        value: updatedSubImages,
      });

      setNotification("Sub image deleted successfully");
      setTimeout(() => setNotification(""), 3000);
    } catch (error) {
      console.error("Delete error:", error.message);
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const handleModalClose = () => {
    setShowEditModal(false);
    dispatch({ type: "RESET_NEW_PRODUCT" });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!state.productToEdit) return;

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const formData = new FormData();

      Object.entries(state.newProduct).forEach(([key, value]) => {
        if (key === "image" && value instanceof File) {
          formData.append("image", value); // New image file
        } else if (key === "subImages") {
          (value || []).forEach((img) => {
            if (img instanceof File) {
              formData.append("subImages", img);
            } else {
              formData.append("existingSubImages[]", img);
            }
          });
        } else if (key === "bulkPricing") {
          formData.append("bulkPricing", JSON.stringify(value));
        } else if (key === "category" || key === "subCategory") {
          formData.append(
            key,
            typeof value === "object" && value !== null && value._id
              ? value._id
              : value || ""
          );
        } else {
          formData.append(key, value);
        }
      });

      const response = await fetch(
        `http://20.40.59.234:3000/api/products/update/${state.productToEdit._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
        await fetchProducts();
        setShowEditModal(false);
        dispatch({ type: "RESET_NEW_PRODUCT" });
        dispatch({ type: "SET_SUB_IMAGES", payload: [] });
        setNotification(
          `Product "${state.newProduct.name}" updated successfully!`
        );
        setTimeout(() => setNotification(""), 3000);
      } else {
        const errorText = await response.text();
        dispatch({ type: "SET_ERROR", payload: errorText });
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handlePreviewProduct = (product) => {
    console.log("Previewing product:", product);
    setProductToPreview(product);
    setShowPreviewModal(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSearchChange = (e) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: e.target.value });
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = async (e) => {
    const selectedCategoryId = e.target.value;
    dispatch({
      type: "UPDATE_NEW_PRODUCT",
      name: "category",
      value: selectedCategoryId,
    });
    if (state.newProduct.subCategory) {
      dispatch({ type: "UPDATE_NEW_PRODUCT", name: "subCategory", value: "" });
    }
    if (selectedCategoryId) {
      try {
        const response = await fetch(
          `http://20.40.59.234:3000/api/admin/subcategories/subcategories?categoryId=${selectedCategoryId}`
        );
        const data = await response.json();
        setSubcategories(data.subcategories || []);
      } catch (error) {
        setSubcategories([]);
      }
    } else {
      setSubcategories([]);
    }
  };

  const handleBulkPricingChange = (index, field, value) => {
    const updatedBulkPricing = [...state.newProduct.bulkPricing];
    updatedBulkPricing[index] = {
      ...updatedBulkPricing[index],
      [field]: value,
    };
    dispatch({ type: "UPDATE_BULK_PRICING", payload: updatedBulkPricing });
  };

  const addBulkPricing = () => {
    const newEntry = { minQty: "", pricePerUnit: "" };
    const updated = [...state.newProduct.bulkPricing, newEntry];
    dispatch({ type: "UPDATE_BULK_PRICING", payload: updated });
  };

  const removeBulkPricing = (index) => {
    const updated = [...state.newProduct.bulkPricing];
    updated.splice(index, 1);
    dispatch({ type: "UPDATE_BULK_PRICING", payload: updated });
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("Product Report", 14, 15);
    doc.setFontSize(12);
    doc.setTextColor(100);

    const tableColumn = [
      "Product ID",
      "Name",
      "Category",
      "Subcategory",
      "Price",
      "Stock",
      "MOQ",
    ];

    const tableRows = [];

    filteredProducts.forEach((product) => {
      const productData = [
        product.productId || "",
        product.name || "",
        product.category?.name || "",
        product.subCategory?.name || "",
        product.price || "",
        product.stock || "",
        product.MOQ || "",
      ];
      tableRows.push(productData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] },
      margin: { top: 25 },
    });

    doc.save("products-report.pdf");
  };

  const exportCSV = () => {
    const headers = [
      "Product ID",
      "Name",
      "Category",
      "Subcategory",
      "Price",
      "Stock",
      "MOQ",
    ];

    const rows = filteredProducts.map((product) => [
      product.productId || "",
      product.name || "",
      product.category?.name || "",
      product.subCategory?.name || "",
      product.price || "",
      product.stock || "",
      product.MOQ || "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map(String).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "products-report.csv");
    link.click();
  };

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubImagesChange = (e) => {
    const files = Array.from(e.target.files);

    // Append to existing subImages in state
    const updatedSubImages = [...state.newProduct.subImages, ...files];
    dispatch({ type: "SET_SUB_IMAGES", payload: updatedSubImages });

    // Generate preview URLs
    const previews = files.map((file) => URL.createObjectURL(file));

    // Append to existing preview URLs
    const updatedPreviews = [...state.subImagePreview, ...previews];
    dispatch({ type: "SET_SUB_IMAGE_PREVIEW", payload: updatedPreviews });
  };

  return (
    <div className=" container mx-auto p-4 font-poppins overflow-x-hidden  ">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        {notification && (
          <div className="fixed top-4 right-96 bg-green-600 text-white py-3 px-6 rounded-xl shadow-lg">
            {notification}
          </div>
        )}
        <h2 className="text-3xl font-bold text-gray-800 max-sm:py-4">
          Product List
        </h2>
        <button
          onClick={() => setShowAddProductForm(!showAddProductForm)}
          className="inline-flex items-center justify-center bg-gradient-to-r from-cyan-600 to-cyan-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow hover:from-cyan-500 hover:to-cyan-600 transition duration-200 ease-in-out
          mb-4 bg-cyan-600  hover:bg-cyan-700 "
        >
          {showAddProductForm ? "Close Form" : " + Add Product"}
        </button>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Filter Type Dropdown */}
          <div className="relative w-48">
            <label
              htmlFor="filterBy"
              className="block mb-1 font-medium text-gray-700"
            >
              Filter by:
            </label>
            <select
              id="filterBy"
              value={filterBy}
              onChange={(e) => {
                setFilterBy(e.target.value);
                setFilterValue("");
              }}
              className="block w-full appearance-none border border-cyan-500 text-gray-800 px-3 py-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="">Select</option>
              <option value="category">Category</option>
              <option value="lowStock">Low Stock</option>
            </select>
          </div>

          {/* Category Filter Dropdown */}
          {filterBy === "category" && (
            <div className="relative w-48">
              <label
                htmlFor="filterValue"
                className="block mb-1 font-medium text-gray-700"
              >
                Category:
              </label>
              <select
                id="filterValue"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="block w-full appearance-none border border-cyan-500 text-gray-800 px-3 py-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              >
                <option value="">All</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Low Stock Filter Dropdown */}
          {filterBy === "lowStock" && (
            <div className="relative w-48">
              <label
                htmlFor="stockFilter"
                className="block mb-1 font-medium text-gray-700"
              >
                Stock:
              </label>
              <select
                id="stockFilter"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="block w-full appearance-none border border-cyan-500 text-gray-800 px-3 py-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              >
                <option value="">All</option>
                <option value="low">Low Stock (≤ 10)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-cyan-500">
                ▼
              </div>
            </div>
          )}
        </div>
      </div>

      {showAddProductForm && (
        <AddProduct
          onAddProduct={handleAddProduct}
          loading={state.loading}
          error={state.error}
          imagePreview={state.imagePreview}
          setImagePreview={(url) =>
            dispatch({ type: "SET_IMAGE_PREVIEW", payload: url })
          }
          product={state.newProduct}
          handleInputChange={handleInputChange}
          handleImageChange={handleImageChange}
          handleSubImagesChange={handleSubImagesChange}
          categories={categories}
          subcategories={subcategories}
          handleCategoryChange={handleCategoryChange}
        />
      )}
      <input
        type="text"
        placeholder="Search by product name or ID"
        value={state.searchQuery}
        onChange={handleSearchChange}
        className="mb-4 p-2  w-full focus:ring-2 focus:ring-cyan-400
       border border-cyan-500 rounded-md text-sm sm:text-base focus:outline-none  focus:border-cyan-500 placeholder-gray-400 shadow-sm"
      />
      <div className="overflow-x-auto" ref={topRef}>
        <table className="sm:text-base min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Image</th>
              <th className="border px-4 py-2">Product Name</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Stock</th>
              <th className="border px-4 py-2">MOQ</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{product.productId}</td>
                <td className="border px-4 py-2">
                  <img
                    src={product.image || "default-image-path"}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                </td>
                <td className="border px-4 py-2">{product.name}</td>
                <td className="border px-4 py-2">{product.category?.name}</td>
                <td className="border px-4 py-2">
                  <span className="font-semibold">RS.</span>
                  {product.price}
                </td>
                <td
                  className={`border px-4 py-2 ${
                    product.stock < 5 ? "text-red-500 font-bold" : ""
                  }`}
                >
                  {product.stock}
                </td>
                <td className="border px-4 py-2">{product.MOQ || "N/A"}</td>
                <td className="p-4 border-b">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="text-blue-600"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500  hover:underline"
                      onClick={() => handleDeleteClick(product)}
                    >
                      <FaTrashAlt />
                    </button>
                    <button
                      className="text-green-500"
                      onClick={() => handlePreviewProduct(product)}
                    >
                      <FaEye />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          {showConfirm && productToDelete && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  🗑 Confirm Deletion
                </h3>
                <p className="mb-2 text-gray-700">
                  Are you sure you want to delete{" "}
                  <strong>{productToDelete.name}</strong>?
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setShowConfirm(false);
                      setProductToDelete(null);
                    }}
                    className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </table>
        <Popup open={showEditModal} onClose={() => setShowEditModal(false)}>
          <EditProductModal
            showModal={showEditModal}
            onClose={handleModalClose}
            product={state.newProduct}
            imagePreview={state.imagePreview}
            onInputChange={handleInputChange}
            onImageChange={handleImageChange}
            onUpdate={handleUpdateProduct}
            loading={state.loading}
            categories={categories}
            handleInputChange={handleInputChange}
            subcategories={subcategories}
            handleCategoryChange={handleCategoryChange}
            handleBulkPricingChange={handleBulkPricingChange}
            addBulkPricing={addBulkPricing}
            removeBulkPricing={removeBulkPricing}
            onSubImagesChange={handleSubImagesChange}
            removeSubImage={handleDeleteSubImage}
          />
        </Popup>
        {productToPreview && (
          <Popup
            open={showPreviewModal}
            onClose={() => setShowPreviewModal(false)}
          >
            <div className="p-4 sm:p-6 md:p-8 bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl max-h-[90vh] w-full max-w-[95%] sm:max-w-2xl overflow-y-auto relative font-poppins border border-gray-300">
              {/* Header */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 sm:mb-6 border-b pb-2 sm:pb-3 drop-shadow-md">
                Product Details
              </h2>
              {/* Product Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-gray-800 text-base sm:text-lg">
                <p>
                  <span className="font-semibold text-gray-600">ID:</span>{" "}
                  {productToPreview.productId || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-gray-600">Name:</span>{" "}
                  {productToPreview.name || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-gray-600">Category:</span>{" "}
                  {productToPreview.category?.name || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-gray-600">
                    Subcategory:
                  </span>{" "}
                  {productToPreview.subCategory?.name || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-gray-600">Price:</span>{" "}
                  <span className="text-green-600 font-bold">
                    RS.{productToPreview.price || "N/A"}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-600">
                    Original Price:
                  </span>{" "}
                  <span className="text-red-500 font-bold line-through">
                    RS.{productToPreview.originalprice || "N/A"}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-600">Stock:</span>{" "}
                  {productToPreview.stock || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-gray-600">Quantity:</span>{" "}
                  {productToPreview.quantity || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-gray-600">MOQ:</span>{" "}
                  {productToPreview.MOQ || "N/A"}
                </p>
              </div>
              {/* Bulk Pricing Details */}
              <div className="mt-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-700">
                  Bulk Pricing
                </h3>
                {productToPreview.bulkPricing &&
                productToPreview.bulkPricing.length > 0 ? (
                  <ul className="list-disc pl-5 text-gray-700">
                    {productToPreview.bulkPricing.map((bp, idx) => (
                      <li key={idx}>
                        Min Qty: {bp.minQty}, Price Per Unit: RS.
                        {bp.pricePerUnit}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">
                    No bulk pricing details available
                  </p>
                )}
              </div>
              {/* Product Details */}
              <p className="mt-6 text-gray-700 text-base sm:text-lg leading-relaxed">
                <span className="font-semibold text-gray-600">Details:</span>{" "}
                {productToPreview.productDetails || "N/A"}
              </p>
              {/* Image with Hover Zoom Effect */}
              <div className="mt-6 flex justify-center">
                <div className="relative group">
                  <img
                    src={
                      productToPreview.image ||
                      "https://via.placeholder.com/300"
                    }
                    alt={productToPreview.name || "Product Image"}
                    className="w-32 sm:w-40 md:w-48 h-32 sm:h-40 md:h-48 object-cover rounded-xl shadow-lg border border-gray-200 transition-transform duration-300 transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
              {/* Close Button */}
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="inline-flex items-center justify-center bg-gradient-to-r from-cyan-600 to-cyan-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow hover:from-cyan-500 hover:to-cyan-600 transition duration-200 ease-in-out
                  w-full  sm:py-3   sm:text-lg  hover:shadow-blue-500/50 hover:scale-105 "
                >
                  Close
                </button>
              </div>
            </div>
          </Popup>
        )}
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center space-x-2 mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-3 py-1 border rounded ${
            currentPage === 1 ? "bg-gray-300" : "bg-gray-100"
          }`}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageClick(index + 1)}
            className={`px-4 py-2 mx-1 rounded ${
              currentPage === index + 1
                ? "bg-yellow-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 border rounded ${
            currentPage === totalPages ? "bg-gray-300" : "bg-gray-100"
          }`}
        >
          Next
        </button>
      </div>
      <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
        <button
          onClick={exportPDF}
          className="
          inline-flex items-center justify-center bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow hover:from-indigo-600 hover:to-indigo-700 transition duration-200 ease-in-out self-end sm:self-auto"
        >
          Export PDF
        </button>

        <button
          onClick={exportCSV}
          className="inline-flex items-center justify-center bg-gradient-to-r from-cyan-600 to-cyan-700 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow hover:from-cyan-500 hover:to-cyan-600 transition duration-200 ease-in-out self-end sm:self-auto"
        >
          Export CSV
        </button>
      </div>
    </div>
  );
};

export default Products;
