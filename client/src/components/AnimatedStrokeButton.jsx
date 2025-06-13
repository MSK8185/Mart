import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

const AnimatedStrokeButton = ({ label = "Click", className = "" }) => {
  const buttonRef = useRef(null);
  const flairRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    const flair = flairRef.current;

    const xSet = gsap.quickSetter(flair, "xPercent");
    const ySet = gsap.quickSetter(flair, "yPercent");

    const getXY = (e) => {
      const rect = button.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      return { x, y };
    };

    const onEnter = (e) => {
      const { x, y } = getXY(e);
      xSet(x);
      ySet(y);
      gsap.to(flair, {
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    const onLeave = (e) => {
      const { x, y } = getXY(e);
      gsap.killTweensOf(flair);
      gsap.to(flair, {
        xPercent: x > 90 ? x + 20 : x < 10 ? x - 20 : x,
        yPercent: y > 90 ? y + 20 : y < 10 ? y - 20 : y,
        scale: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const onMove = (e) => {
      const { x, y } = getXY(e);
      gsap.to(flair, {
        xPercent: x,
        yPercent: y,
        duration: 0.4,
        ease: "power2",
      });
    };

    button.addEventListener("mouseenter", onEnter);
    button.addEventListener("mouseleave", onLeave);
    button.addEventListener("mousemove", onMove);

    return () => {
      button.removeEventListener("mouseenter", onEnter);
      button.removeEventListener("mouseleave", onLeave);
      button.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      className={`relative overflow-hidden border-2 border-orange-500 text-orangeCustom font-semibold text-sm px-6 py-2 rounded-md hover:bg-orange-600 hover:text-white transition-colors duration-150 ${className}`}
    >
      <span
        ref={flairRef}
        className="absolute inset-0 pointer-events-none transform scale-0 origin-top-left"
      >
        <span className="absolute left-0 top-0 w-[170%] aspect-square bg-orange-500 rounded-full -translate-x-1/2 -translate-y-1/2"></span>
      </span>
      <span className="relative z-10">{label}</span>
    </button>
  );
};

export default AnimatedStrokeButton;
