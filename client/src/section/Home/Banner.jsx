import React from 'react'
import {  banner1 } from '../../assets/images'

const Banner = () => {
  return (
    <section className='flex items-center justify-center max-lg:hidden'>
      <div className=" absolute mr-[38rem]">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
          Stay home & get <br></br> your daily need's
        </h1>
      </div>
        <div>
        <img 
        src={banner1}
        alt='banner'/>
        </div>       
    </section>
  )
}

export default Banner