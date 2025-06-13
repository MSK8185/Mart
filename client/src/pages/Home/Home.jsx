import React, { useState, useEffect } from "react";
import Carousel from "../../components/Carousel.component";
import ProductsHome from "../../section/ProductsHome";
import Footerbanner from "../../section/Footerbanner";
import CategoriesHome from "../../section/Category/CategoreisHome";
import axios from "axios";

const Home = () => {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get("http://20.40.59.234:3000/api/banners/get");
        setSlides(res.data.slice(0, 4)); // Limit to 4 banners
      } catch (err) {
        console.error("Failed to fetch banners", err);
      }
    };

    fetchBanners();
  }, []);

  return (
    <>
      {/* Carousel Section */}
      <div className="w-full mx-auto">
        <Carousel slides={slides} />
      </div>

      {/* Categories Section */}
      <section className="mt-0">
        <CategoriesHome />
      </section>

      {/* Products Section */}
      <section className="mt-4">
        {" "}
        {/* Reduced from mt-12 to mt-4 */}
        <ProductsHome />
      </section>

      {/* Footer Banner */}
      <Footerbanner />
    </>
  );
};

export default Home;
