
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const CategoriesHome = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const categoryRefs = useRef([]);
  const scrollContainerRef = useRef(null);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/admin/categories/"
        );
        setCategories(response.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // GSAP animation on initial load
  useEffect(() => {
    if (categories.length > 0) {
      gsap.fromTo(
        categoryRefs.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "#category-grid",
            start: "top 80%",
          },
        }
      );
    }
  }, [categories]);

  // Continuous auto-scrolling effect
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || categories.length === 0) return;

    let scrollSpeed = 0.5; // Adjust speed here
    let animationFrameId;

    const scroll = () => {
      container.scrollLeft += scrollSpeed;

      // Reset when we've scrolled past the original content
      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      }

      animationFrameId = requestAnimationFrame(scroll);
    };

    scroll();

    return () => cancelAnimationFrame(animationFrameId);
  }, [categories]);

  // GSAP logo animation
  useGSAP(() => {
    gsap.to("#logo", {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#logo",
        start: "top 15%",
        toggleActions: "play none none none",
      },
    });
  }, []);

  return (
    <section className="container mx-auto px-6 py-8 font-poppins">
      {/* Hide scrollbars with CSS */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <h2
        id="logo"
        className="text-4xl font-bold  mb-10 text-center text-gray-800"
      >
        Categories
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading categories...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : categories.length === 0 ? (
        <p className="text-center text-gray-500">No categories available.</p>
      ) : (
        <div
          id="category-grid"
          ref={scrollContainerRef}
          className="flex gap-8 overflow-x-auto px-4 py-6 hide-scrollbar"
          style={{
            scrollSnapType: "x mandatory",
            scrollBehavior: "smooth",
            whiteSpace: "nowrap",
          }}
        >
          {/* Duplicate categories to make seamless loop */}
          {[...categories, ...categories].map((category, index) => (
            <Link
              key={`${category._id}-${index}`}
              ref={(el) => (categoryRefs.current[index] = el)}
              to={`/categories/${category.name}`}
              className="flex-shrink-0 w-60 sm:w-72 lg:w-80 flex flex-col items-center bg-white shadow-xl hover:shadow-2xl p-6 transition-transform hover:scale-105 rounded-xl scroll-snap-align-start"
            >
              <img
                src={category.image || "placeholder.png"}
                alt={category.name}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-700 text-center">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default CategoriesHome;
