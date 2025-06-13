import React from 'react';
import { Link } from 'react-router-dom';
import { CategoryBannerImage } from '../../assets/images';

const ShopBanner = () => {
  return (
    <section className="relative h-64">
      <div className="relative w-full h-full">
        <img 
          src={CategoryBannerImage}
          alt="banner"
          className="w-full h-full object-cover"
        />
        <div className="font-poppins font-medium text-5xl absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-10 text-black">
          <h1 className="text-4xl font-bold">Our Products</h1>
          <p className="text-sm mt-2">
            <Link to="/" className="hover:underline">HOME</Link> <span className="mx-1">&gt;</span> Shop
          </p>
        </div>
      </div>
    </section>
  );
};

export default ShopBanner;
