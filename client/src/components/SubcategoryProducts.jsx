import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ProductCard from "./ProductCard";

const SubcategoryProducts = () => {
  const { subcategoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Subcategory ID:", subcategoryId);
        const response = await axios.get(
          `http://20.40.59.234:3000/api/products/subcategory/${subcategoryId}`
        );
        console.log("API Response:", response.data);
        setProducts(response.data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (subcategoryId) {
      fetchProducts();
    } else {
      console.error("Subcategory ID is missing or invalid.");
    }
  }, [subcategoryId]);

  if (loading) {
    return <p>Loading products...</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      {products.length === 0 ? (
        <p>No products found for this subcategory.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              imgURL={product.image}
              name={product.name}
              quantity={product.quantity}
              price={product.price}
              originalprice={product.originalprice}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubcategoryProducts;
