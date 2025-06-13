import React, { useEffect, useRef } from 'react';
import { footerBanner } from '../assets/images';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const   Footerbanner = () => {
  const bannerRef = useRef(null);

  useEffect(() => {
    const el = bannerRef.current;

    // Initial hidden state
    gsap.set(el, {
      opacity: 0,
      y: 100,
    });

    // Reveal on scroll
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });
  }, []);

  return (
    <div
      ref={bannerRef}
      className="w-full h-auto overflow-hidden"
    >
      <img
        src={footerBanner}
        alt="Footer Banner"
        className="w-full h-auto object-cover"
      />
    </div>
  );
};

export default Footerbanner;
