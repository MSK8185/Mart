import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Carousel({ slides }) {
  const [current, setCurrent] = useState(0);
  const textRefs = useRef([]);

  const previousSlide = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  };

  useEffect(() => {
    const autoSlide = setInterval(nextSlide, 7000);
    return () => clearInterval(autoSlide);
  }, [current]);

  useEffect(() => {
    if (textRefs.current[current]) {
      gsap.fromTo(
        textRefs.current[current],
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 3, ease: "power3.out" }
      );
    }
  }, [current]);

  return (
    <div className="relative overflow-hidden w-full h-[40vh]">
      {/* Slides Container */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="relative flex-shrink-0 w-full h-full">
            <img
              src={slide.url} // <-- using backend image field
              alt={`Slide ${i + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Optional animated text area */}
            <div
              ref={(el) => (textRefs.current[i] = el)}
              className="absolute bottom-8 left-8 text-white text-xl font-semibold"
            >
              {/* Add dynamic text if needed */}
            </div>
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      <button
        onClick={previousSlide}
        className="absolute top-0 left-0 h-full w-12 flex items-center justify-center text-white bg-black/30 hover:bg-black/50 z-10 transition"
      >
        <FaChevronLeft size={24} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute top-0 right-0 h-full w-12 flex items-center justify-center text-white bg-black/30 hover:bg-black/50 z-10 transition"
      >
        <FaChevronRight size={24} />
      </button>
    </div>
  );
}
