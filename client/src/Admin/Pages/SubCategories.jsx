import React, { useEffect, useState } from "react";
import SubCategoryForm from "../components/SubCategoryForm";
import SubCategoryList from "../components/SubCategoryList";

const SubCategories = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]); 
  const [showAddSubCategoryForm, setShowAddSubCategoryForm] = useState(false);
  const [notification, setNotification] = useState("");

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/admin/categories/");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/admin/subcategories");
        const data = await response.json();
        setSubCategories(data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchSubCategories();
  }, []);

  // Add subcategory callback
  const handleAddSubCategory = (newSubCategory) => {
    setSubCategories((prev) => [...prev, newSubCategory]);
    setNotification("Subcategory added successfully!");
    setTimeout(() => setNotification(""), 3000);
  };

  return (
    <div className="container mx-auto p-4">
      {notification && (
        <div className="fixed top-4 right-96 bg-green-600 text-white py-3 px-6 rounded-xl shadow-lg">
          {notification}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subcategory Management</h1>
        <button
          onClick={() => setShowAddSubCategoryForm(!showAddSubCategoryForm)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-500"
        >
          {showAddSubCategoryForm ? "Close Form" : "+ Add SubCategory"}
        </button>
      </div>

      {showAddSubCategoryForm && (
        <SubCategoryForm
          categories={categories}
          onSuccess={handleAddSubCategory} 
        />
      )}

      <SubCategoryList subcategories={subcategories} setSubCategories={setSubCategories} />
    </div>
  );
};

export default SubCategories;

