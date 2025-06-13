import React from "react";
import ProductCard from "./ProductCard";

const ProductListc = ({ categoryName, products }) => {
  return (
    <div className="product-list-container">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products && products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product._id}
              imgURL={product.image}
              name={product.name}
              quantity={product.quantity}
              price={product.price}
              originalprice={product.originalprice}
              productId={product.productId} 
            />
          ))
        ) : (
          <p>No products found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default ProductListc;




