import React, { useState, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddProduct = ({
  onAddProduct,
  loading,
  error,
  imagePreview,
  product,
  handleInputChange,
  handleImageChange,
  categories,
  subcategories,
  handleCategoryChange,
}) => {
  const [bulkPricing, setBulkPricing] = useState(product.bulkPricing || []);
  const [subImages, setSubImages] = useState([]);
  const [subImagePreviews, setSubImagePreviews] = useState([]);
  const imageInputRef = useRef(null);

  const handleBulkPricingChange = (index, field, value) => {
    const updated = [...bulkPricing];
    updated[index] = { ...updated[index], [field]: value };
    setBulkPricing(updated);
  };

  const addBulkPricingField = () => {
    setBulkPricing([...bulkPricing, { minQty: "", pricePerUnit: "" }]);
  };

  const removeBulkPricingField = (index) => {
    setBulkPricing(bulkPricing.filter((_, i) => i !== index));
  };

  const blockInvalidChar = (e) => {
    if (['e', 'E', '+', '-'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleSubImagesChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + subImages.length > 4) {
      toast.error("You can only upload up to 4 subimages.");
      return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setSubImages(prev => [...prev, ...files]);
    setSubImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const handleRemoveSubImage = (index) => {
    setSubImages(subImages.filter((_, i) => i !== index));
    setSubImagePreviews(subImagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!product.productDetails?.trim()) {
      alert("Product Details are required.");
      return;
    }

    if (bulkPricing.length === 0) {
      toast.error("Please add at least one Bulk Pricing entry.");
      return;
    }

    const numberFields = ['price', 'originalprice', 'stock', 'MOQ'];
    for (const field of numberFields) {
      const value = product[field];
      if (value === '' || isNaN(Number(value))) {
        alert(`Please enter a valid number for "${field}".`);
        return;
      }
    }

    for (let i = 0; i < bulkPricing.length; i++) {
      const { minQty, pricePerUnit } = bulkPricing[i];
      if (minQty === '' || isNaN(Number(minQty))) {
        alert(`Please enter a valid number for Min Qty in row ${i + 1}`);
        return;
      }
      if (pricePerUnit === '' || isNaN(Number(pricePerUnit))) {
        alert(`Please enter a valid number for Price per Unit in row ${i + 1}`);
        return;
      }
    }

    const updatedProduct = {
      ...product,
      bulkPricing,
      MOQ: product.MOQ || 1,
      subImages, // Attach subimages to send to backend
    };

    onAddProduct(updatedProduct);
    setBulkPricing([]);
    setSubImages([]);
    setSubImagePreviews([]);
    if (imageInputRef.current) {
      imageInputRef.current.value = null;
    }
  };

  return (
 
    <form onSubmit={handleSubmit} className="form-card">
  <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

  <div className="grid grid-cols-2 gap-4">
    <input type="text" name="name" value={product.name} onChange={handleInputChange} placeholder="Product Name" className="common-input" required />

    <select name="category" value={product.category} onChange={handleCategoryChange} className="common-input" required>
      <option value="">Select a Category</option>
      {categories?.map((cat) => (
        <option key={cat._id} value={cat._id}>{cat.name}</option>
      ))}
    </select>

    <select name="subCategory" value={product.subCategory || ""} onChange={handleInputChange} className="common-input" required>
      <option value="">Select a Subcategory</option>
      {subcategories?.length > 0 ? (
        subcategories.map((sub) => (
          <option key={sub._id} value={sub._id}>{sub.name}</option>
        ))
      ) : (
        <option value="" disabled>No subcategories available</option>
      )}
    </select>

    <input type="number" name="price" value={product.price} onChange={handleInputChange} onKeyDown={blockInvalidChar} placeholder="Price" className="common-input" required />
    <input type="number" name="originalprice" value={product.originalprice} onChange={handleInputChange} onKeyDown={blockInvalidChar} placeholder="Original Price" className="common-input" />
    <input type="number" name="stock" value={product.stock} onChange={handleInputChange} onKeyDown={blockInvalidChar} placeholder="Stock" className="common-input" />
    <input type="text" name="quantity" value={product.quantity || ""} onChange={handleInputChange} placeholder="Quantity" className="common-input" required />
    <input type="number" name="MOQ" value={product.MOQ || ""} onChange={handleInputChange} onKeyDown={blockInvalidChar} placeholder="Minimum Order Quantity (MOQ)" className="common-input" required />
    <textarea name="productDetails" value={product.productDetails} onChange={handleInputChange} placeholder="Product Details" className="common-input col-span-2" required />

    <div className="col-span-2">
      <h3 className="section-heading">Main Image</h3>
      <input type="file" name="image" onChange={handleImageChange} accept="image/png, image/jpeg, image/jpg" ref={imageInputRef} className="common-input" />
      <p className="text-xs text-gray-500">Only PNG, JPG, JPEG formats allowed.</p>
      {imagePreview && <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover mt-2" />}
    </div>
  </div>

  <div className="col-span-2 mt-4">
    <h3 className="section-heading">Sub Images (Max 4)</h3>
    <input type="file" accept="image/png, image/jpeg, image/jpg" multiple onChange={handleSubImagesChange} disabled={subImages.length >= 4} className="common-input" />
    <p className="text-xs text-gray-500">You can upload up to 4 images.</p>

    <div className="flex gap-4 flex-wrap mt-2">
      {subImagePreviews.map((preview, index) => (
        <div key={index} className="relative w-24 h-24">
          <img src={preview} alt={`SubImage-${index}`} className="w-full h-full object-cover rounded" />
          <button type="button" onClick={() => handleRemoveSubImage(index)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
        </div>
      ))}
    </div>
  </div>

  <div className="mt-4">
    <h3 className="section-heading">Bulk Pricing</h3>
    {bulkPricing.map((bp, index) => (
      <div key={index} className="flex space-x-2 mb-2">
        <input type="number" value={bp.minQty} onChange={(e) => handleBulkPricingChange(index, "minQty", e.target.value)} placeholder="Min Quantity" className="common-input" required />
        <input type="number" value={bp.pricePerUnit} onChange={(e) => handleBulkPricingChange(index, "pricePerUnit", e.target.value)} placeholder="Price Per Unit" className="common-input" required />
        <button type="button" onClick={() => removeBulkPricingField(index)} className="bg-red-500 text-white px-2 rounded">Remove</button>
      </div>
    ))}
    <button type="button" onClick={addBulkPricingField} className="bg-green-500 text-white px-2 py-1 rounded">Add Bulk Pricing</button>
  </div>

  <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 my-4 flex justify-center items-center space-x-2 rounded-lg transition ${
          loading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600"
        } text-white shadow-md hover:shadow-lg transform focus:outline-none`}
      >
        {loading ? (
          <>
            <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3.25A4.75 4.75 0 007.25 12H4z" />
            </svg>
            <span>Adding...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Add Product</span>
          </>
        )}
      </button>

  {error && <p className="text-red-500 text-center">{error}</p>}
  <ToastContainer position="top-center" autoClose={3000} theme="colored" />
</form>

  );
};

export default AddProduct;