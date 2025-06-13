import React from 'react'
import { CategoryBannerImage } from '../../assets/images';

const About = () => {
  return (
    <section className="relative h-64">
    <div className="relative w-full h-full">
      <img 
        src={CategoryBannerImage}
        alt="banner"
        className="w-full h-full object-cover"
      />
      <div className=" font-poppins font-500 text-custom-48 absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-10  text-black">
        <h1 className="text-4xl font-bold">About Us</h1>
        <p className="text-sm mt-2">
          Home <span className="mx-1">&gt;</span> About
        </p>
      </div>
    </div>
  </section>
  )
}

export default About