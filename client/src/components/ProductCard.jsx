// // import React, { useState, useEffect, useRef } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { FaEllipsisV, FaHeart, FaShare } from "react-icons/fa";
// // import { useNavigate } from "react-router-dom";
// // import { add } from "../store/cartSlice";
// // import {
// //   addToWishlist,
// //   removeFromWishlist,
// //   fetchWishlist,
// // } from "../store/wishlistSlice";
// // import { BsFillCartCheckFill } from "react-icons/bs";
// // import { auth } from "../firebaseConfig";
// // import axios from "axios";
// // import AnimatedViewButton from "./AnimatedViewButton";
// // import { useGSAP } from "@gsap/react";
// // import gsap from "gsap";

// // const ProductCard = ({
// //   productId,
// //   imgURL,
// //   name,
// //   quantity,
// //   price,
// //   originalprice,
// // }) => {
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();
// //   const wishlist = useSelector((state) => state.wishlist.items);
// //   const isWishlisted = wishlist.some((item) => item.productId === productId);
// //   const [notification, setNotification] = useState({
// //     visible: false,
// //     productName: "",
// //   });
// //   const user = auth.currentUser;
// //   const buttonRef = useRef(null);
// //   const shareRef = useRef(null);
// //   const compareRef = useRef(null);
// //   const wishlistRef = useRef(null);

// //   // Calculate percentage discount
// //   const discountPercentage =
// //     originalprice && originalprice > price
// //       ? Math.round(((originalprice - price) / originalprice) * 100)
// //       : 0;

// //   useEffect(() => {
// //     dispatch(fetchWishlist());
// //   }, [dispatch]);

// //   const handleWishlist = async () => {
// //     if (!user) {
// //       navigate("/signin");
// //       return;
// //     }
// //     const product = {
// //       productId,
// //       name,
// //       imgURL,
// //       price,
// //       quantity,
// //       originalprice,
// //       email: user.email,
// //     };
// //     if (isWishlisted) {
// //       dispatch(removeFromWishlist(productId));
// //       await axios.post("http://localhost:3000/api/wishlist/remove", {
// //         email: user.email,
// //         productId,
// //       });
// //     } else {
// //       dispatch(addToWishlist(product));
// //       await axios.post("http://localhost:3000/api/wishlist/add", product);
// //     }
// //   };

// //   const addToCart = async () => {
// //     if (!user) {
// //       navigate("/signin");
// //       return;
// //     }
// //     const product = {
// //       productId,
// //       imgURL,
// //       name,
// //       price,
// //       originalprice,
// //       email: user.email,
// //       quantity: 1,
// //     };
// //     try {
// //       await axios.post("http://localhost:3000/api/cart/add", product);
// //       dispatch(add(product));
// //       showNotification(name);
// //     } catch (error) {
// //       console.error("Error adding to cart:", error);
// //       alert("Failed to add product to cart. Please try again.");
// //     }
// //   };

// //   const showNotification = (productName) => {
// //     setNotification({ visible: true, productName });
// //     setTimeout(() => {
// //       setNotification({ visible: false, productName: "" });
// //     }, 3000);
// //   };

// //   const handleViewDetails = () => {
// //     navigate(`/product-details/${productId}`);
// //   };

// //   const scrollToTop = () => {
// //     window.scrollTo({ top: 0, behavior: "smooth" });
// //   };

// //   // Implementing share using the native Web Share API
// //   const handleShare = async (e) => {
// //     e.stopPropagation();
// //     const shareData = {
// //       title: name,
// //       text: `Check out this product: ${name}`,
// //       url: window.location.origin + `/product-details/${productId}`,
// //     };

// //     if (navigator.share) {
// //       try {
// //         await navigator.share(shareData);
// //       } catch (err) {
// //         console.error("Error sharing:", err);
// //       }
// //     } else {
// //       alert("Sharing is not supported in this browser.");
// //     }
// //   };

// //   const similarProduct = ()=>{
// //     console.log("Similar Product",productId)
// //   }

// //   useEffect(() => {
// //     const setupAnimation = (ref) => {
// //       const span = ref.current;
// //       const innerSpan = span.querySelector("span");

// //       const tl = gsap.timeline({ paused: true });
// //       tl.to(innerSpan, { duration: 0.2, yPercent: -150, ease: "power2.in" });
// //       tl.set(innerSpan, { yPercent: 150 });
// //       tl.to(innerSpan, { duration: 0.2, yPercent: 0 });

// //       const playAnim = () => tl.play(0);
// //       span.addEventListener("mouseenter", playAnim);
// //       return () => {
// //         span.removeEventListener("mouseenter", playAnim);
// //       };
// //     };

// //     const cleanups = [
// //       setupAnimation(shareRef),
// //       setupAnimation(compareRef),
// //       setupAnimation(wishlistRef),
// //     ];

// //     return () => cleanups.forEach((cleanup) => cleanup && cleanup());
// //   }, []);

// //   return (
// //     <>
// //       {notification.visible && (
// //         <div className="fixed top-4 right-96 bg-green-600 text-white py-3 px-6 rounded-xl left-1/3 transform -translate-x-1/2 text-lg font-bold shadow-lg z-50 animate-slide-down font-poppins">
// //           <p className="flex items-center gap-2">
// //             <span className="animate-pulse">
// //               <BsFillCartCheckFill />
// //             </span>
// //             {notification.productName} added to cart!
// //           </p>
// //         </div>
// //       )}

// //       <div
// //         onClick={() => {
// //           handleViewDetails();
// //           scrollToTop();
// //         }}
// //         className="relative flex flex-col items-center ml-10 max-sm:ml-1 rounded-lg p-4 w-56 hover:shadow-xl transition-shadow group cursor-pointer"
// //       >
// //         {/* Discount Badge */}
// //         {discountPercentage > 0 && (
// //           <div className="absolute top-2 left-2">
// //             <div className="relative bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md border border-white">
// //               <span className="uppercase tracking-wide">
// //                 {discountPercentage}% OFF
// //               </span>
// //             </div>
// //           </div>
// //         )}

// //         {/* Product Image */}
// //         <div className="mb-3 overflow-hidden">
// //           <img
// //             src={imgURL}
// //             alt={name}
// //             className="w-40 h-40 max-sm:w-24 max-sm:h-32 object-cover transition-transform duration-300"
// //           />
// //         </div>

// //         {/* Product Info */}
// //         <div className="text-left font-poppins w-full h-28 bg-[#F4F5F7] p-2">
// //           <p className="text-base max-sm:text-sm font-semibold text-dimGray">
// //             {name}
// //           </p>
// //           <p className="text-custom-14 max-sm:text-[10px] font-500 text-stoneGray mb-2">
// //             {quantity}
// //           </p>
// //           <div className="flex items-center space-x-2 mt-2">
// //             <p className="text-custom-16 font-bold text-black">Rs.{price}</p>
// //             {originalprice && (
// //               <p className="text-sm text-gray-400 line-through">
// //                 Rs.{originalprice}
// //               </p>
// //             )}
// //           </div>
// //         </div>

// //         {/* Always-visible Buttons on Small & Medium Devices */}
// //         <div className="flex w-full items-center justify-around mt-2 lg:hidden">
// //           <button
// //             onClick={(e) => {
// //               e.stopPropagation();
// //               addToCart();
// //             }}
// //             className="text-white bg-green-500 px-4 py-2 rounded-lg font-semibold"
// //           >
// //             ADD
// //           </button>
// //           <button
// //             onClick={(e) => {
// //               e.stopPropagation();
// //               handleWishlist();
// //             }}
// //             className="px-4 py-2 rounded-lg border border-gray-300 flex items-center justify-center"
// //           >
// //             <FaHeart
// //               className={isWishlisted ? "text-red-500" : "text-gray-500"}
// //             />
// //           </button>
// //         </div>

// //         {/* Hover Overlay on Large Screens */}
// //         <div className="hidden lg:flex absolute inset-0 flex-col items-center justify-center bg-dimGray bg-opacity-80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
// //           <div className="w-full flex justify-center mb-4">
// //             <AnimatedViewButton handleViewDetails={handleViewDetails} />
// //           </div>
// //           <div
// //             className="flex justify-around w-full cursor-pointer
// //              text-white font-semibold text-custom-13 "
// //           >
// //             <span
// //               ref={shareRef}
// //               className="flex items-center space-x-1 cursor-pointer hover:text-orangeCustom"
// //               onClick={(e) => {
// //                 e.stopPropagation();
// //                 handleShare(e);
// //               }}
// //             >
// //               <FaShare />
// //               <span>Share</span>
// //             </span>

// //             <span
// //               onClick={similarProduct}
// //               ref={compareRef}
// //               className="flex items-center space-x-1 hover:text-orangeCustom"
// //             >
// //               <FaEllipsisV />
// //               <span>Similar</span>
// //             </span>

// //             <span
// //               ref={wishlistRef}
// //               className="flex items-center space-x-1 cursor-pointer hover:text-orangeCustom"
// //               onClick={(e) => {
// //                 e.stopPropagation();
// //                 handleWishlist();
// //               }}
// //             >
// //               <FaHeart className={isWishlisted ? "text-red-500" : ""} />
// //               <span>{isWishlisted ? "Wishlisted" : "Wishlist"}</span>
// //             </span>
// //           </div>
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default ProductCard;




// import React, { useState, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { FaEllipsisV, FaHeart, FaShare, FaPlus, FaMinus } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { add } from "../store/cartSlice";
// import {
//   addToWishlist,
//   removeFromWishlist,
//   fetchWishlist,
// } from "../store/wishlistSlice";
// import { BsFillCartCheckFill } from "react-icons/bs";
// import { auth } from "../firebaseConfig";
// import axios from "axios";

// const ProductCard = ({
//   productId,
//   imgURL,
//   name,
//   quantity,
//   price,
//   originalprice,
// }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const wishlist = useSelector((state) => state.wishlist.items);
//   const isWishlisted = wishlist.some((item) => item.productId === productId);
//   const [notification, setNotification] = useState({
//     visible: false,
//     productName: "",
//   });
//   const [cartQuantity, setCartQuantity] = useState(0);
//   const [isAdding, setIsAdding] = useState(false);
//   const [showQuantityInput, setShowQuantityInput] = useState(false);
//   const [customQuantity, setCustomQuantity] = useState(1);
//   const user = auth.currentUser;

//   // Calculate percentage discount
//   const discountPercentage =
//     originalprice && originalprice > price
//       ? Math.round(((originalprice - price) / originalprice) * 100)
//       : 0;

//   useEffect(() => {
//     dispatch(fetchWishlist());
//   }, [dispatch]);

//   const handleWishlist = async (e) => {
//     e.stopPropagation();
//     if (!user) {
//       navigate("/signin");
//       return;
//     }
//     const product = {
//       productId,
//       name,
//       imgURL,
//       price,
//       quantity,
//       originalprice,
//       email: user.email,
//     };
//     if (isWishlisted) {
//       dispatch(removeFromWishlist(productId));
//       await axios.post("http://localhost:3000/api/wishlist/remove", {
//         email: user.email,
//         productId,
//       });
//     } else {
//       dispatch(addToWishlist(product));
//       await axios.post("http://localhost:3000/api/wishlist/add", product);
//     }
//   };

//   const addToCart = async () => {
//     if (!user) {
//       navigate("/signin");
//       return;
//     }
    
//     // Show quantity input instead of directly adding
//     setShowQuantityInput(true);
//   };

//   const confirmAddToCart = async () => {
//     setIsAdding(true);
//     const product = {
//       productId,
//       imgURL,
//       name,
//       price,
//       originalprice,
//       email: user.email,
//       quantity: customQuantity,
//     };
    
//     try {
//       await axios.post("http://localhost:3000/api/cart/add", product);
//       dispatch(add(product));
//       setCartQuantity(customQuantity);
//       setShowQuantityInput(false);
//       showNotification(name);
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//       alert("Failed to add product to cart. Please try again.");
//     } finally {
//       setIsAdding(false);
//     }
//   };

//   const updateCartQuantity = async (newQuantity) => {
//     if (newQuantity < 0) return;
    
//     if (newQuantity === 0) {
//       setCartQuantity(0);
//       // Remove from cart API call here
//       return;
//     }
    
//     setCartQuantity(newQuantity);
//     // Update cart API call here
//   };

//   const showNotification = (productName) => {
//     setNotification({ visible: true, productName });
//     setTimeout(() => {
//       setNotification({ visible: false, productName: "" });
//     }, 3000);
//   };

//   const handleViewDetails = () => {
//     navigate(`/product-details/${productId}`);
//   };

//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleShare = async (e) => {
//     e.stopPropagation();
//     const shareData = {
//       title: name,
//       text: `Check out this product: ${name}`,
//       url: window.location.origin + `/product-details/${productId}`,
//     };

//     if (navigator.share) {
//       try {
//         await navigator.share(shareData);
//       } catch (err) {
//         console.error("Error sharing:", err);
//       }
//     } else {
//       alert("Sharing is not supported in this browser.");
//     }
//   };

//   return (
//     <>
//       {notification.visible && (
//         <div className="fixed top-4 right-4 bg-green-500 text-white py-3 px-6 rounded-lg shadow-lg z-50 animate-bounce">
//           <p className="flex items-center gap-2">
//             <BsFillCartCheckFill />
//             {notification.productName} added to cart!
//           </p>
//         </div>
//       )}

//       <div className="relative bg-white rounded-lg border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden w-64 h-96">
//         {/* Wishlist Heart - Top Right */}
//         <button
//           onClick={handleWishlist}
//           className="absolute top-3 right-3 z-10 p-1"
//         >
//           <FaHeart
//             className={`w-5 h-5 transition-colors ${
//               isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-400"
//             }`}
//           />
//         </button>

//         {/* Discount Badge */}
//         {discountPercentage > 0 && (
//           <div className="absolute top-1.5 left-1.5 z-10">
//             <div className="relative group">
//               <div className="bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 p-[1px] rounded-xl shadow-md">
//                 <div className="bg-white rounded-xl px-2 py-1 backdrop-blur-sm">
//                   <span className="text-[10px] font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
//                     {discountPercentage}% OFF
//                   </span>
//                 </div>
//               </div>
//               <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 rounded-xl opacity-15 blur-sm group-hover:opacity-25 transition-opacity"></div>
//             </div>
//           </div>
//         )}

//         {/* Product Image */}
//         <div
//           className="relative h-48 flex items-center justify-center p-4"
//           onClick={() => {
//             handleViewDetails();
//             scrollToTop();
//           }}
//         >
//           <img
//             src={imgURL}
//             alt={name}
//             className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
//           />
//         </div>

//         {/* Product Details */}
//         <div className="px-4 pb-4 flex-1 flex flex-col">
//           {/* Product Name & Quantity */}
//           <div
//             className="mb-3 cursor-pointer flex-1"
//             onClick={() => {
//               handleViewDetails();
//               scrollToTop();
//             }}
//           >
//             <h3 className="font-medium text-gray-900 text-sm leading-tight mb-1 line-clamp-2">
//               {name}
//             </h3>
//             <p className="text-xs text-gray-500">{quantity}</p>
//           </div>

//           {/* Price Section */}
//           <div className="flex items-center justify-between mb-3">
//             <div className="flex items-center gap-2">
//               <span className="font-bold text-gray-900">₹{price}</span>
//               {originalprice && (
//                 <span className="text-xs text-gray-400 line-through">
//                   ₹{originalprice}
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Add to Cart Button */}
//           <div className="flex items-center justify-center">
//             {showQuantityInput ? (
//               <div className="w-full bg-white border-2 border-blue-500 rounded-lg p-3">
//                 <div className="text-center mb-3">
//                   <p className="text-sm font-medium text-gray-700 mb-2">Select Quantity</p>
//                   <div className="flex items-center justify-center gap-3">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setCustomQuantity(Math.max(1, customQuantity - 1));
//                       }}
//                       className="w-8 h-8 border-2 border-blue-500 text-blue-500 rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors"
//                     >
//                       <FaMinus className="w-3 h-3" />
//                     </button>
//                     <input
//                       type="number"
//                       value={customQuantity}
//                       onChange={(e) => {
//                         e.stopPropagation();
//                         const value = Math.max(1, parseInt(e.target.value) || 1);
//                         setCustomQuantity(value);
//                       }}
//                       className="w-16 h-8 text-center border-2 border-blue-500 rounded-md font-semibold focus:outline-none focus:border-blue-600 text-blue-600"
//                       min="1"
//                       onClick={(e) => e.stopPropagation()}
//                     />
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setCustomQuantity(customQuantity + 1);
//                       }}
//                       className="w-8 h-8 border-2 border-blue-500 text-blue-500 rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors"
//                     >
//                       <FaPlus className="w-3 h-3" />
//                     </button>
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setShowQuantityInput(false);
//                       setCustomQuantity(1);
//                     }}
//                     className="flex-1 bg-white border-2 border-gray-300 text-gray-600 font-semibold py-2 px-3 rounded-md hover:bg-gray-50 transition-colors text-sm"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       confirmAddToCart();
//                     }}
//                     disabled={isAdding}
//                     className="flex-1 bg-white border-2 border-blue-500 text-blue-500 font-semibold py-2 px-3 rounded-md hover:bg-blue-50 transition-colors text-sm disabled:opacity-50"
//                   >
//                     {isAdding ? "Adding..." : "Confirm"}
//                   </button>
//                 </div>
//               </div>
//             ) : cartQuantity === 0 ? (
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   addToCart();
//                 }}
//                 disabled={isAdding}
//                 className="w-full bg-white border-2 border-blue-500 text-blue-500 font-semibold py-3 px-4 rounded-lg hover:bg-blue-50 transition-all duration-200 text-sm disabled:opacity-50"
//               >
//                 ADD TO CART
//               </button>
//             ) : (
//               <div className="flex items-center justify-between w-full bg-white border-2 border-blue-500 text-blue-500 rounded-lg overflow-hidden">
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     updateCartQuantity(cartQuantity - 1);
//                   }}
//                   className="flex items-center justify-center w-12 h-12 hover:bg-blue-50 transition-colors"
//                 >
//                   <FaMinus className="w-4 h-4" />
//                 </button>
//                 <span className="font-bold text-lg px-4">{cartQuantity}</span>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     updateCartQuantity(cartQuantity + 1);
//                   }}
//                   className="flex items-center justify-center w-12 h-12 hover:bg-blue-50 transition-colors"
//                 >
//                   <FaPlus className="w-4 h-4" />
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Remove hover overlay with share and similar buttons */}
//       </div>
//     </>
//   );
// };

// export default ProductCard;


// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { FaHeart, FaShare, FaPlus, FaMinus } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { add } from "../store/cartSlice";
// import {
//   addToWishlist,
//   removeFromWishlist,
//   fetchWishlist,
// } from "../store/wishlistSlice";
// import { auth } from "../firebaseConfig";
// import axios from "axios";

// const ProductCard = ({
//   productId,
//   imgURL,
//   name,
//   quantity,
//   price,
//   originalprice,
//   onNotify,
// }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const wishlist = useSelector((state) => state.wishlist.items);
//   const isWishlisted = wishlist.some((item) => item.productId === productId);
//   const [isAdding, setIsAdding] = useState(false);
//   const [showQuantityInput, setShowQuantityInput] = useState(false);
//   const [customQuantity, setCustomQuantity] = useState(1);
//   const user = auth.currentUser;

//   const discountPercentage =
//     originalprice && originalprice > price
//       ? Math.round(((originalprice - price) / originalprice) * 100)
//       : 0;

//   useEffect(() => {
//     dispatch(fetchWishlist());
//   }, [dispatch]);

//   const handleWishlist = async (e) => {
//     e.stopPropagation();
//     if (!user) {
//       navigate("/signin");
//       return;
//     }
//     const product = {
//       productId,
//       name,
//       imgURL,
//       price,
//       quantity,
//       originalprice,
//       email: user.email,
//     };
//     if (isWishlisted) {
//       dispatch(removeFromWishlist(productId));
//       await axios.post("http://localhost:3000/api/wishlist/remove", {
//         email: user.email,
//         productId,
//       });
//     } else {
//       dispatch(addToWishlist(product));
//       await axios.post("http://localhost:3000/api/wishlist/add", product);
//     }
//   };

//   const addToCart = async () => {
//     if (!user) {
//       navigate("/signin");
//       return;
//     }
//     setShowQuantityInput(true);
//   };

//   const confirmAddToCart = async () => {
//     setIsAdding(true);
//     const product = {
//       productId,
//       imgURL,
//       name,
//       price,
//       originalprice,
//       email: user.email,
//       quantity: customQuantity,
//     };

//     try {
//       await axios.post("http://localhost:3000/api/cart/add", product);
//       dispatch(add(product));
//       setShowQuantityInput(false);
//       setCustomQuantity(1);
//       if (onNotify) onNotify(`${name} added to cart!`, "cart"); // <-- FIXED
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//       alert("Failed to add product to cart. Please try again.");
//     } finally {
//       setIsAdding(false);
//     }
//   };

//   const handleViewDetails = () => {
//     navigate(`/product-details/${productId}`); // <-- FIXED: template literal in backticks
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleShare = async (e) => {
//     e.stopPropagation();
//     const shareData = {
//       title: name,
//       text: `Check out this product: ${name}`, // <-- FIXED: template literal in backticks
//       url: window.location.origin + `/product-details/${productId}`, // <-- FIXED
//     };

//     if (navigator.share) {
//       try {
//         await navigator.share(shareData);
//       } catch (err) {
//         console.error("Error sharing:", err);
//       }
//     } else {
//       alert("Sharing is not supported in this browser.");
//     }
//   };

//   return (
//     <div
//       className="relative bg-white rounded-lg border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden w-56 h-96"
//       onClick={handleViewDetails}
//     >
//       {/* Wishlist Heart */}
//       <button
//         onClick={handleWishlist}
//         className="absolute top-3 right-3 z-10 p-1"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <FaHeart
//           className={`w-5 h-5 transition-colors ${
//             isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-400"
//           }`}
//         />
//       </button>

//       {/* Discount Badge */}
//       {discountPercentage > 0 && (
//         <div className="absolute top-1.5 left-1.5 z-10">
//           <div className="bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 p-[1px] rounded-xl shadow-md">
//             <div className="bg-white rounded-xl px-2 py-1 backdrop-blur-sm">
//               <span className="text-[10px] font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
//                 {discountPercentage}% OFF
//               </span>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Product Image */}
//       <div className="relative h-40 flex items-center justify-center p-4">
//         <img
//           src={imgURL}
//           alt={name}
//           className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
//         />
//       </div>

//       {/* Product Details */}
//       <div className="px-3 pb-4 flex-1 flex flex-col">
//         <div className="mb-2 cursor-pointer">
//           <h3 className="font-medium text-gray-900 text-sm leading-tight mb-1 line-clamp-2">
//             {name}
//           </h3>
//           <p className="text-xs text-gray-500">{quantity}</p>
//         </div>

//         <div className="flex items-center justify-between mb-3">
//           <span className="font-bold text-gray-900 text-sm">₹{price}</span>
//           {originalprice && (
//             <span className="text-xs text-gray-400 line-through">₹{originalprice}</span>
//           )}
//         </div>

//         {/* Add to Cart */}
//         {showQuantityInput ? (
//           <div className="w-full bg-white border border-blue-400 rounded-md p-2">
//             <div className="text-center mb-2">
//               <p className="text-xs font-medium text-gray-700 mb-2">Select Quantity</p>
//               <div className="flex items-center justify-center gap-2">
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setCustomQuantity(Math.max(1, customQuantity - 1));
//                   }}
//                   className="w-6 h-6 border border-blue-400 text-blue-500 rounded-full flex items-center justify-center hover:bg-blue-50 text-xs"
//                 >
//                   <FaMinus className="w-2 h-2" />
//                 </button>
//                 <input
//                   type="number"
//                   value={customQuantity}
//                   onChange={(e) => {
//                     e.stopPropagation();
//                     setCustomQuantity(Math.max(1, parseInt(e.target.value) || 1));
//                   }}
//                   className="w-10 h-6 text-center border border-blue-400 rounded text-xs font-semibold focus:outline-none text-blue-600"
//                   min="1"
//                   onClick={(e) => e.stopPropagation()}
//                 />
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setCustomQuantity(customQuantity + 1);
//                   }}
//                   className="w-6 h-6 border border-blue-400 text-blue-500 rounded-full flex items-center justify-center hover:bg-blue-50 text-xs"
//                 >
//                   <FaPlus className="w-2 h-2" />
//                 </button>
//               </div>
//             </div>
//             <div className="flex gap-1">
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setShowQuantityInput(false);
//                   setCustomQuantity(1);
//                 }}
//                 className="flex-1 bg-white border border-gray-300 text-gray-600 font-medium py-1 px-2 rounded text-xs hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   confirmAddToCart();
//                 }}
//                 disabled={isAdding}
//                 className="flex-1 bg-white border border-blue-400 text-blue-500 font-medium py-1 px-2 rounded text-xs hover:bg-blue-50 disabled:opacity-50"
//               >
//                 {isAdding ? "Adding..." : "Confirm"}
//               </button>
//             </div>
//           </div>
//         ) : (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               addToCart();
//             }}
//             disabled={isAdding}
//             className="w-full bg-white border-2 border-blue-500 text-blue-500 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 text-sm disabled:opacity-50"
//           >
//             ADD TO CART
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductCard;




import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart, FaShare, FaPlus, FaMinus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { add } from "../store/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
  fetchWishlist,
} from "../store/wishlistSlice";
import { auth } from "../firebaseConfig";
import axios from "axios";

const ProductCard = ({
  productId,
  imgURL,
  name,
  quantity,
  price,
  originalprice,
  onNotify,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlist = useSelector((state) => state.wishlist.items);
  const isWishlisted = wishlist.some((item) => item.productId === productId);
  const [isAdding, setIsAdding] = useState(false);
  const [showQuantityInput, setShowQuantityInput] = useState(false);
  const [customQuantity, setCustomQuantity] = useState(1);
  const user = auth.currentUser;

  const discountPercentage = useMemo(() => {
    return originalprice && originalprice > price
      ? Math.round(((originalprice - price) / originalprice) * 100)
      : 0;
  }, [originalprice, price]);

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate("/signin");
      return;
    }

    const product = {
      productId,
      name,
      imgURL,
      price,
      quantity,
      originalprice,
      email: user.email,
    };

    try {
      if (isWishlisted) {
        dispatch(removeFromWishlist(productId));
        await axios.post("http://localhost:3000/api/wishlist/remove", {
          email: user.email,
          productId,
        });
      } else {
        dispatch(addToWishlist(product));
        await axios.post("http://localhost:3000/api/wishlist/add", product);
      }
    } catch (error) {
      console.error("Wishlist update failed:", error);
    }
  };

  const addToCart = () => {
    if (!user) {
      navigate("/signin");
      return;
    }
    setShowQuantityInput(true);
  };

  const confirmAddToCart = async () => {
    setIsAdding(true);
    const product = {
      productId,
      imgURL,
      name,
      price,
      originalprice,
      email: user.email,
      quantity: customQuantity,
    };

    try {
      await axios.post("http://localhost:3000/api/cart/add", product);
      dispatch(add(product));
      setShowQuantityInput(false);
      setCustomQuantity(1);
      if (onNotify) onNotify(`${name} added to cart!`, "cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleViewDetails = () => {
    navigate(`/product-details/${productId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    const shareData = {
      title: name,
      text: `Check out this product: ${name}`,
      url: `${window.location.origin}/product-details/${productId}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  return (
    <div
      className="relative bg-white rounded-lg border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden w-56 h-96"
      onClick={handleViewDetails}
    >
      {/* Wishlist Heart */}
      <button
        onClick={handleWishlist}
        className="absolute top-3 right-3 z-10 p-1"
      >
        <FaHeart
          className={`w-5 h-5 transition-colors ${
            isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-400"
          }`}
        />
      </button>

      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="absolute top-1.5 left-1.5 z-10">
          <div className="bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 p-[1px] rounded-xl shadow-md">
            <div className="bg-white rounded-xl px-2 py-1 backdrop-blur-sm">
              <span className="text-[10px] font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
                {discountPercentage}% OFF
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Product Image */}
      <div className="relative h-40 flex items-center justify-center p-4">
        <img
          src={imgURL}
          alt={name}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Product Details */}
      <div className="px-3 pb-4 flex-1 flex flex-col">
        <div className="mb-2">
          <h3 className="font-medium text-gray-900 text-sm leading-tight mb-1 line-clamp-2">
            {name}
          </h3>
          <p className="text-xs text-gray-500">{quantity}</p>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-gray-900 text-sm">₹{price}</span>
          {originalprice && (
            <span className="text-xs text-gray-400 line-through">
              ₹{originalprice}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        {showQuantityInput ? (
          <div className="w-full bg-white border border-blue-400 rounded-md p-2">
            <div className="text-center mb-2">
              <p className="text-xs font-medium text-gray-700 mb-2">
                Select Quantity
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCustomQuantity(Math.max(1, customQuantity - 1));
                  }}
                  className="w-6 h-6 border border-blue-400 text-blue-500 rounded-full flex items-center justify-center hover:bg-blue-50 text-xs"
                >
                  <FaMinus className="w-2 h-2" />
                </button>
                <input
                  type="number"
                  value={customQuantity}
                  onChange={(e) => {
                    e.stopPropagation();
                    const val = parseInt(e.target.value);
                    setCustomQuantity(isNaN(val) || val < 1 ? 1 : val);
                  }}
                  className="w-10 h-6 text-center border border-blue-400 rounded text-xs font-semibold focus:outline-none text-blue-600"
                  min="1"
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCustomQuantity(customQuantity + 1);
                  }}
                  className="w-6 h-6 border border-blue-400 text-blue-500 rounded-full flex items-center justify-center hover:bg-blue-50 text-xs"
                >
                  <FaPlus className="w-2 h-2" />
                </button>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQuantityInput(false);
                  setCustomQuantity(1);
                }}
                className="flex-1 bg-white border border-gray-300 text-gray-600 font-medium py-1 px-2 rounded text-xs hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  confirmAddToCart();
                }}
                disabled={isAdding}
                className="flex-1 bg-white border border-blue-400 text-blue-500 font-medium py-1 px-2 rounded text-xs hover:bg-blue-50 disabled:opacity-50"
              >
                {isAdding ? "Adding..." : "Confirm"}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart();
            }}
            disabled={isAdding}
            className="w-full bg-white border-2 border-blue-500 text-blue-500 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 text-sm disabled:opacity-50"
          >
            ADD TO CART
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

