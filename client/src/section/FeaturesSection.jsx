import React, { useEffect, useRef } from 'react';
import { features } from '../data';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FeaturesSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const q = gsap.utils.selector(sectionRef);

    // Animate each feature box
    gsap.fromTo(
      q('.feature-box'),
      {
        opacity: 0,
        y: 80,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'power4.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      }
    );

    // Animate each title separately
    gsap.fromTo(
      q('.feature-title'),
      {
        y: 30,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        },
      }
    );

    // Animate each text below the title
    gsap.fromTo(
      q('.feature-text'),
      {
        y: 20,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 0.2,
        ease: 'power2.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        },
      }
    );
  }, []);

  return (
    <div
      ref={sectionRef}
      className="bg-crystalAqua py-1 my-20 font-poppins w-full overflow-hidden"
    >
      <div className="max-w-6xl mx-auto my-16 flex flex-col md:flex-row justify-between items-center">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="feature-box text-white text-center w-full md:w-1/3 px-4 mb-6 md:mb-0"
          >
            <h1 className="feature-title font-semibold text-custom-24 mb-2">
              {feature.title}
            </h1>
            <p className="feature-text font-400 text-custom-16">
              {feature.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
