import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedStrokeButton from "../components/AnimatedStrokeButton";
import { RiAlignItemLeftFill } from "react-icons/ri";

gsap.registerPlugin(ScrollTrigger);

const ProductsHome = () => {
  const [randomProducts, setRandomProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products/products/random');
        setRandomProducts(response.data.products);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRandomProducts();
  }, []);

  useEffect(() => {
    if (cardRefs.current.length > 0) {
      gsap.set(cardRefs.current, {
        opacity: 0,
        y: 50,
        scale: 0.95,
      });

      cardRefs.current.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'top 85%',
          onEnter: () => {
            gsap.to(card, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: 'power3.out',
              delay: i * 0.03,
            });
          },
        });
      });
    }
  }, [randomProducts]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <div className="text-center mt-10">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
  }

  return (
    <section className="mx-auto px-4 py-6 bg-gray-100 shadow-md p-4">
      <h2 className="flex items-center gap-2 text-2xl font-bold italic mb-6 text-gray-200 font-poppins shadow-lg p-3 bg-blue-900">
       <RiAlignItemLeftFill /> Products
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 pt-6">
        {randomProducts.map((product, index) => (
          <div
            key={product.name}
            ref={(el) => (cardRefs.current[index] = el)}
          >
            <ProductCard
              productId={product.productId}
              imgURL={product.image}
              name={product.name}
              quantity={product.quantity}
              price={product.price}
              originalprice={product.originalprice}
            />
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link to="/shop">
          <AnimatedStrokeButton label="Show More" onClick={scrollToTop} />
        </Link>
      </div>
    </section>
  );
};

export default ProductsHome;
