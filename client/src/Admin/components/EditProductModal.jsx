import React from "react";

const EditProductModal = ({
  showModal,
  onClose,
  product,
  imagePreview,
  onInputChange,
  onImageChange,
  onSubImagesChange,
  removeSubImage,
  onUpdate,
  loading,
  categories,
  subcategories,
  handleCategoryChange,
  handleBulkPricingChange,
  addBulkPricing,
  removeBulkPricing,

}) => {
  if (!showModal) return null;

  return (
    <div className="p-4 bg-white shadow-md rounded-lg max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      <form onSubmit={onUpdate}>
        <div className="grid grid-cols-2 gap-4">
          {/* Product ID */}
          <label className="text-gray-600 font-semibold">
            Product ID
            <input
              type="text"
              name="productId"
              value={product.productId}
              onChange={onInputChange}
              className="p-2 border rounded-md w-full mt-1 text-black"
              readOnly
            />
          </label>


          <label className="text-gray-600 font-semibold">
            Product Name
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={onInputChange}
              className="p-2 border rounded-md w-full mt-1 text-black"
              required
            />
          </label>


          <label className="text-gray-600 font-semibold">
            Category
            <select
              name="category"
              value={product.category?._id || product.category || ""}
              onChange={handleCategoryChange}
              className="w-full border p-2 rounded text-black"
              required
            >
              <option value="">Select a Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </label>

          <label className="text-gray-600 font-semibold">
            Subcategory
            <select
              name="subCategory"
              value={product.subCategory?._id || product.subCategory || ""}
              onChange={onInputChange}
              className="w-full border p-2 rounded text-black"
              required
            >
              <option value="">Select a Subcategory</option>
              {subcategories.map((sub) => (
                <option key={sub._id} value={sub._id}>{sub.name}</option>
              ))}
            </select>
          </label>


          {["price", "originalprice", "stock", "MOQ"].map((field) => (
            <label key={field} className="text-gray-600 font-semibold">
              {field === "MOQ" ? "Minimum Order Quantity (MOQ)" : field.charAt(0).toUpperCase() + field.slice(1)}
              <input
                type="number"
                name={field}
                value={product[field]}
                onChange={onInputChange}
                className="p-2 border rounded-md w-full mt-1 text-black"
                required
              />
            </label>
          ))}


          <label className="text-gray-600 font-semibold">
            Quantity
            <input
              type="text"
              name="quantity"
              value={product.quantity}
              onChange={onInputChange}
              className="p-2 border rounded-md w-full mt-1 text-black"
              required
            />
          </label>


          <label className="text-gray-600 font-semibold col-span-2">
            Product Details
            <textarea
              name="productDetails"
              value={product.productDetails}
              onChange={onInputChange}
              className="p-2 border rounded-md w-full mt-1 text-black"
              required
            ></textarea>
          </label>


          <div className="col-span-2">
            <label className="text-gray-600 font-semibold">Bulk Pricing</label>
            {product.bulkPricing?.map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="number"
                  name="minQty"
                  value={item.minQty}
                  onChange={(e) => handleBulkPricingChange(index, "minQty", e.target.value)}
                  placeholder="Min Qty"
                  className="p-2 border rounded-md text-black w-1/2"
                  required
                />
                <input
                  type="number"
                  name="pricePerUnit"
                  value={item.pricePerUnit}
                  onChange={(e) => handleBulkPricingChange(index, "pricePerUnit", e.target.value)}
                  placeholder="Price Per Unit"
                  className="p-2 border rounded-md text-black w-1/2"
                  required
                />
                <button type="button" onClick={() => removeBulkPricing(index)} className="text-red-500 font-bold">X</button>
              </div>
            ))}
            <button type="button" onClick={addBulkPricing} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md">+ Add Bulk Pricing</button>
          </div>


          <label className="text-gray-600 font-semibold">
            Image
            <input type="file" name="image" onChange={onImageChange} className="p-2 border rounded-md w-full mt-1 text-black" />
            {imagePreview && <img src={imagePreview} alt="Preview" className="w-32 h-32 mt-2 object-cover" />}
          </label>
        </div>

        <div className="col-span-2">
          <label className="text-gray-600 font-semibold">Sub Images (Max 4)</label>
          <input
            type="file"
            name="subImages"
            multiple
            onChange={onSubImagesChange}
            disabled={product.subImages?.length >= 4}
            className={`p-2 border rounded-md w-full mt-1 text-black ${product.subImages?.length >= 4 ? 'bg-gray-200 cursor-not-allowed' : ''
              }`}
          />
          {product.subImages?.length >= 4 && (
            <p className="text-red-500 text-sm mt-1 ">Maximum 4 images allowed.</p>
          )}
          <div className="flex  gap-5 mt-2 ">
            {product.subImages?.map((img, index) => {
              const isFile = img instanceof File;
              const imgSrc = isFile ? URL.createObjectURL(img) : img;
              return (
                <div key={index} className="relative group">
                  <img
                    src={imgSrc}
                    alt={`Sub ${index}`}
                    className="w-32 h-32 object-cover rounded-md "
                  />
                  <button
                    type="button"
                    onClick={() => removeSubImage(img)}
                    title="Remove"
                    className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-700
             text-white rounded-full w-7 h-7 flex items-center justify-center
             text-sm font-bold shadow-md opacity-0 group-hover:opacity-100
             transition-all duration-200 ease-in-out"
                  >
                    &times;
                  </button>

                </div>
              );
            })}
          </div>
        </div>




        {/* Form Buttons */}
        <div className="flex justify-between mt-6">
          <button type="submit"
            className="mb-4 inline-flex items-center justify-center bg-gradient-to-r from-cyan-600 to-cyan-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow hover:from-cyan-500 hover:to-cyan-600 transition duration-200 ease-in-out" disabled={loading}>{loading ? "Updating..." : "Update Product"}</button>
          <button type="button" onClick={onClose} className="px-6 py-3 bg-gray-500 text-white rounded-lg">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditProductModal;