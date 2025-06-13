import React, { useState, useEffect, useRef } from 'react';

const CategoryForm = ({ onSubmit, editingCategory, setEditingCategory }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name || '');
      setImagePreview(editingCategory.image || null);
      setImage(null);
    } else {
      // Reset form when not editing
      setName('');
      setImage(null);
      setImagePreview(null);
    }
  }, [editingCategory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    if (image) formData.append('image', image);

    if (editingCategory) {
      onSubmit(formData);
    } else {
      onSubmit(formData);
      // Reset form after submission
      resetForm();
    }
  };

  const resetForm = () => {
    setName('');
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    if (setEditingCategory) {
      setEditingCategory(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 mx-auto"
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        {editingCategory ? 'Edit Category' : 'Add New Category'}
      </h2>

      <div className="mb-4">
        <label className="block mb-2 text-gray-600 font-medium">Category Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
          required
          className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-gray-600 font-medium">Upload Image</label>
        <input
          type="file"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="block w-full text-gray-600 bg-white border border-gray-300 rounded px-4 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
          accept="image/*"
        />

      </div>

      {/* Image Preview */}
      {(imagePreview || editingCategory?.image) && (
        <div className="mb-4">
          <label className="block mb-2 text-gray-600 font-medium">Current Image</label>
          <img
            src={imagePreview || editingCategory?.image}
            alt="Category preview"
            className="h-32 w-auto object-cover rounded border border-gray-300"
          />
        </div>
      )}

      <div className="flex justify-between gap-4">
        <button
          type="submit"
          className="bg-green-500 text-white font-medium px-4 py-2 rounded flex-1 hover:bg-green-600 transition duration-300"
        >
          {editingCategory ? 'Update Category' : 'Add Category'}
        </button>


      </div>
    </form>
  );
};

export default CategoryForm;