// import React, { useEffect, useRef } from 'react';
// import gsap from 'gsap';

// const LoadingScreen = () => {
//   const loaderRef = useRef(null);

//   useEffect(() => {
//     if (loaderRef.current) {
//       gsap.fromTo(
//         loaderRef.current,
//         { opacity: 0 },
//         { opacity: 1, duration: 0.5, ease: 'power2.out' }
//       );
//     }
//   }, []);

//   return (
//     <div
//       ref={loaderRef}
//       className="fixed inset-0 z-50 flex items-center justify-center bg-white"
//     >
//       <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
//     </div>
//   );
// };

// export default LoadingScreen;




import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Logo1 } from '../../assets/images/admin';

const LoadingScreen = () => {
  const loaderRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    if (loaderRef.current) {
      gsap.fromTo(
        loaderRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, []);


  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 0.5,
        defaults: { duration: 0.6, ease: 'power2.inOut' }
      });


      tl.set('#target1', { rotation: 45, svgOrigin: '50 50' });
      tl.set('#target2', { rotation: 135, svgOrigin: '50 50' });
      tl.to('line', { attr: { x2: 100 } });
      tl.to('#target1', { rotation: 0 }, 'turn');
      tl.to('#target2', { rotation: 180 }, 'turn');
      tl.to('#target1', { y: -10 }, 'move');
      tl.to('#target2', { y: 10 }, 'move');
      tl.to('#theSquare', { attr: { height: 22, y: 38 } }, 'move');
      tl.to('line', { attr: { x1: 50, x2: 50 } });
      tl.to('text', { duration: 1, opacity: 0, ease: 'none' });
    }, svgRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
    >
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="w-[28rem] h-[28rem]"
      >
        <defs>
          <clipPath id="theClipPath">
            <rect
              id="theSquare"
              x="0"
              y="50"
              width="100"
              height="0"
              fill="red"
            />
          </clipPath>
        </defs>

        <line
          id="target1"
          x1="0"
          y1="50"
          x2="0"
          y2="50"
          strokeWidth="1"
          stroke="#333"
        />
        <line
          id="target2"
          x1="0"
          y1="50"
          x2="0"
          y2="50"
          strokeWidth="1"
          stroke="#333"
        />
        <g clipPath="url(#theClipPath)">
          <text
            transform="translate(50 55)"
            textAnchor="middle"
            fontSize="10"
            fill="#333"
          >
            LyrosMart....
            
            <image
             href={Logo1}
             x="35"   
             y="40"
             width="30"
             height="30"
             preserveAspectRatio="xMidYMid meet"
            />
          </text>
        </g>
      </svg>
    </div>
  );
};

export default LoadingScreen;
