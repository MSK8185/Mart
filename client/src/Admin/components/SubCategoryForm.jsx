import React, { useState } from "react";

const SubCategoryForm = ({ categories, onSuccess }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("image", image);

    try {
      const response = await fetch(
        "http://20.40.59.234:3000/api/admin/subcategories",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        onSuccess(data.subcategory);
        setName("");
        setCategory("");
        setImage(null);
      } else {
        console.error("Error:", data.message);
        onSuccess("Failed to add subcategory.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      onSuccess("Error adding subcategory.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border  rounded-lg font-poppins"
    >
      <div className="mb-4">
        <label htmlFor="name" className="block mb-1">
          Subcategory Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="category" className="block mb-1">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="image" className="block mb-1">
          Image
        </label>
        <input
          type="file"
          id="image"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full border px-3 py-2 rounded"
          accept="image/*"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded  "
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Subcategory"}
      </button>
    </form>
  );
};

export default SubCategoryForm;
