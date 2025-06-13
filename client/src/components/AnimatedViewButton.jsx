import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const AnimatedViewButton = ({ handleViewDetails }) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    const btn = buttonRef.current;
    const span = btn.querySelector("span");
    const tl = gsap.timeline({ paused: true });

    tl.to(span, { duration: 0.2, yPercent: -150, ease: "power2.in" });
    tl.set(span, { yPercent: 150 });
    tl.to(span, { duration: 0.2, yPercent: 0 });

    btn.addEventListener("mouseenter", () => tl.play(0));

    return () => {
      btn.removeEventListener("mouseenter", () => tl.play(0));
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      onClick={(e) => {
        e.stopPropagation();
        handleViewDetails();
      }}
      className="relative overflow-hidden bg-white w-40 h-12 rounded-lg text-orangeCustom
       font-semibold"
    >
      <span className="inline-block relative z-10">View</span>
    </button>
  );
};

export default AnimatedViewButton;
