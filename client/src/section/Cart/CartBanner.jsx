import React from 'react'
import {  CartBannerImg } from '../../assets/images';

const CartBanner = () => {
  return (
    <section className="relative h-64 ">
    <div className="relative w-full h-full">
      <img 
        src={CartBannerImg}
        alt="banner"
        className="w-full h-full object-cover opacity-55"
      />
      <div className=" font-poppins font-500 text-custom-48 absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-10  text-black">
        <h1 className="text-4xl font-bold">Cart</h1>
        <p className="text-sm mt-2">
          Home <span className="mx-1">&gt;</span> Cart
        </p>
      </div>
    </div>
  </section>
  )
}

export default CartBanner