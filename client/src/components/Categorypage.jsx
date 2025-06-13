import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductListc from "../components/ProductListc";
import SubcategorySidebar from "./SubcategorySidebar";
import { CategoryBannerImage } from "../assets/images";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [categoryId, setCategoryId] = useState(null);
  const [subcategoryId, setSubcategoryId] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categoryDisplayName, setCategoryDisplayName] = useState(categoryName); 

  useEffect(() => {
    const fetchCategoryId = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/admin/categories`
        );
        const category = response.data.find(
          (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
        );
        if (category) {
          setCategoryId(category._id);
          setCategoryDisplayName(category.name);
        } else {
          console.error("Category not found");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryId();
  }, [categoryName]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `http://localhost:3000/api/products/category/${categoryName}`;
        if (subcategoryId) {
          url = `http://localhost:3000/api/products/subcategory/${subcategoryId}`;
        }
        const response = await axios.get(url);
        setProducts(response.data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (categoryId) {
      fetchProducts();
    }
  }, [categoryId, subcategoryId]);

  if (loading) {
    return <p>Loading category data...</p>;
  }

  if (!categoryId) {
    return <p>Category not found!</p>;
  }



  return (
    <div>
      {/* Banner Section */}
      <section className="relative h-64 mb-10">
        <div className="relative w-full h-full">
          <img
            src={CategoryBannerImage}
            alt="banner"
            className="w-full h-full object-cover"
          />
          <div
            className="font-poppins font-500 text-custom-48 absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-10 text-black"
          >
            <h1 className="text-4xl font-bold">{categoryName}</h1>
            <p className="text-sm mt-2">
              Home <span className="mx-1">&gt;</span> {categoryName}
            </p>
          </div>
        </div>
      </section>
      <div className="flex">
        <SubcategorySidebar
          selectedCategoryId={categoryId}
          onSubcategorySelect={setSubcategoryId}
        />
        <div className="flex-1 p-4">
          {products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <ProductListc
              products={products}
              categoryName={categoryDisplayName} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
