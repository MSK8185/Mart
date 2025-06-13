import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { add } from "../store/cartSlice";
import { addToWishlist, removeFromWishlist } from "../store/wishlistSlice";
import { BsFillCartCheckFill } from "react-icons/bs";
import { FaHeart, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { auth } from "../firebaseConfig";
import ReactImageMagnify from "react-image-magnify";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const ProductDetails = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlist = useSelector((state) => state.wishlist.items);
  const [product, setProduct] = useState(null);
  const [purchaseQty, setPurchaseQty] = useState(1);
  const [notification, setNotification] = useState({
    visible: false,
    productName: "",
  });
  const [wishlistNotification, setWishlistNotification] = useState({
    visible: false,
    productName: "",
  });

  const [error, setError] = useState("");
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const user = auth.currentUser;

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/products/${productId}`);
        const productData = response.data;
        setProduct(productData);
        setPurchaseQty(productData.MOQ || 1);
        setSelectedImage(productData.image); // Set initial main image
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      if (product?.subCategory) {
        try {
          const response = await axios.post(
            "http://localhost:3000/api/products/similarProducts",
            {
              subCategory: product.subCategory,
            }
          );

          const filtered = response.data.products.filter(
            (p) => p.productId !== product.productId
          );
          setSimilarProducts(filtered);
        } catch (error) {
          console.error("Error fetching similar products:", error);
        }
      }
    };

    fetchSimilarProducts();
  }, [product]);

  if (!product) return <p>Loading...</p>;

  const isWishlisted = wishlist.some(
    (item) => item.productId === product.productId
  );

  const handleWishlist = () => {
    const wishlistItem = { ...product, imgURL: product.image };
    if (isWishlisted) {
      dispatch(removeFromWishlist(wishlistItem));
      showWishlistNotification(product.name);
    } else {
      dispatch(addToWishlist(wishlistItem));
      showWishlistNotification(product.name);
    }
  };

  const addToCart = async () => {
    if (!user) {
      navigate("/signin");
      return;
    }

    const cartItem = {
      productId: product.productId,
      name: product.name,
      imgURL: product.image,
      price: getUnitPrice(),
      originalprice: product.originalprice,
      quantity: purchaseQty,
      email: user.email,
      subCategory: product.subCategory,
    };

    try {
      await axios.post("http://localhost:3000/api/cart/add", cartItem);
      dispatch(add(cartItem));
      showNotification(product.name);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart. Please try again.");
    }
  };

  const showNotification = (productName) => {
    setNotification({ visible: true, productName });
    setTimeout(
      () => setNotification({ visible: false, productName: "" }),
      3000
    );
  };

  const showWishlistNotification = (productName) => {
    setWishlistNotification({ visible: true, productName });
    setTimeout(() => {
      setWishlistNotification({ visible: false, productName: "" });
    }, 3000); // 3 seconds
  };


  const getUnitPrice = () => {
    let unitPrice = product.price;
    if (product.bulkPricing && product.bulkPricing.length > 0) {
      const sortedTiers = [...product.bulkPricing].sort(
        (a, b) => a.minQty - b.minQty
      );
      for (let tier of sortedTiers) {
        if (purchaseQty >= tier.minQty) {
          unitPrice = tier.pricePerUnit;
        }
      }
    }
    return unitPrice;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 font-poppins text-gray-800">
      {/* Notification */}
      {notification.visible && (
        <div className="notify-box top-6 right-1/3 bg-cyan-600 animate-slide-down ">
          <p className="flex items-center gap-2">
            <BsFillCartCheckFill className="animate-pulse" />
            {notification.productName} added to cart!
          </p>


        </div>
      )}
      {wishlistNotification.visible && (
        <div className=" top-20 right-1/3 bg-cyan-600 notify-box animate-fade-in ">
          <p className="flex items-center gap-2">
            <svg className="w-5 h-5 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.343 3.172 10.828a4 4 0 010-5.656z" />
            </svg>
            {wishlistNotification.productName} added to wishlist!
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image Section */}

        <div className="rounded-xl p-4">
          {/* MOBILE SLIDER */}
          <div className="block md:hidden pb-6">
            <Slider
              dots={true}
              infinite={false}
              speed={500}
              slidesToShow={1}
              slidesToScroll={1}
              arrows={true}
            >
              {[product.image, ...(product.subImages || [])].map((img, idx) => (
                <div key={idx} className="px-2">
                  <img
                    src={img}
                    onClick={() => setSelectedImage(img)}
                    className="w-full h-80 object-cover rounded-md"
                    alt={`Image ${idx}`}
                  />
                </div>
              ))}
            </Slider>
          </div>

          <div className="hidden md:block lg:hidden">
            <div className="w-full aspect-[4/3]">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <div className="flex flex-wrap gap-3 mt-4 justify-center">
              {[product.image, ...(product.subImages || [])].map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 object-cover rounded-md border-2 cursor-pointer transition-all ${selectedImage === img
                      ? "border-cyan-600 ring-2 ring-cyan-300"
                      : "border-gray-300"
                    }`}
                  alt={`Preview ${idx}`}
                />
              ))}
            </div>
          </div>


          {/* DESKTOP ZOOM IMAGE */}
          <div className="hidden lg:block aspect-[4/3] max-w-full mx-auto">
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: product.name,
                  isFluidWidth: false,
                  src: selectedImage,
                  width: 500,          
                  height: 500,
                  style: {
                    objectFit: "cover",
                    borderRadius: "0.5rem",
                    width: "100%",
                    height: "auto",
                    aspectRatio: "1 / 1",
                    maxWidth: "200px",

                  },
                },
                largeImage: {
                  src: selectedImage,
                  width: 1100,
                  height: 1500,
                },
                enlargedImageContainerDimensions: {
                  width: "150%",
                  height: "150%",
                },
              }}
            />
          </div>

          {/* Thumbnails */}
          <div className=" flex-wrap gap-3 mt-4 justify-center hidden lg:flex">
            {[product.image, ...(product.subImages || [])].map((img, idx) => (
              <img
                key={idx}
                src={img}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 object-cover rounded-md border-2 cursor-pointer transition-all ${selectedImage === img
                    ? "border-cyan-600 ring-2 ring-cyan-300"
                    : "border-gray-300"
                  }`}
                alt={`Preview ${idx}`}
              />
            ))}
          </div>
        </div>


        {/* Details Section */}

        <div className="space-y-5 text-gray-800 text-base md:text-[17px]">
          <h1 className="text-2xl sm:text-3xl pt-2 sm:pt-3 font-bold leading-snug text-gray-900">
            {product.name}
          </h1>

          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            {product.productDetails}
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <p className="text-xl sm:text-2xl font-bold text-cyan-700">Rs. {getUnitPrice()}</p>
            <p className="text-base sm:text-xl text-gray-600 line-through">Rs. {product.originalprice}</p>
          </div>

          <p className="text-sm text-gray-700 font-medium">
            Minimum Order Quantity (MOQ): {product.MOQ}
          </p>

          {product.bulkPricing?.length > 0 && (
            <div className="mt-4 sm:mt-6">
              <h2 className="text-base sm:text-lg font-semibold mb-3">Bulk Pricing</h2>

              <div className="hidden sm:block">
                <table className="min-w-full border text-sm text-left">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="py-2 px-4 border">Minimum Quantity</th>
                      <th className="py-2 px-4 border">Price Per Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.bulkPricing.map((tier, index) => (
                      <tr key={index} className="hover:bg-cyan-50 transition">
                        <td className="py-2 px-4 border text-center">{tier.minQty}</td>
                        <td className="py-2 px-4 border text-center">Rs. {tier.pricePerUnit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bulk Pricing - Mobile Cards */}
              <div className="sm:hidden space-y-4">
                {product.bulkPricing.map((tier, index) => (
                  <div key={index} className="p-3 rounded-md border shadow-sm bg-gray-50">
                    <p className="text-sm">
                      <strong>Qty:</strong> {tier.minQty}+
                    </p>
                    <p className="text-sm">
                      <strong>Price:</strong> ₹{tier.pricePerUnit}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          )}

          <div className="flex flex-col">
            <label htmlFor="purchaseQty" className="mb-1 text-sm font-medium text-gray-700">
              Enter Quantity:
            </label>

            <input
              type="number"
              id="purchaseQty"
              min={product.MOQ}
              max={product.stock}
              value={purchaseQty}
              onChange={(e) => {
                const qty = Number(e.target.value);

                if (qty < product.MOQ) {
                  setError(`Minimum order is ${product.MOQ}`);
                } else if (qty > product.stock) {
                  setError(`Only ${product.stock} units available`);
                } else {
                  setError("");
                }

                setPurchaseQty(qty);
              }}
              className="w-28 sm:w-32 p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4 items-center">

            <button
              onClick={addToCart}
              disabled={purchaseQty < product.MOQ || purchaseQty > product.stock}
              className={`w-full sm:w-40 h-11 sm:h-12 text-white font-medium rounded-md shadow transition ${purchaseQty < product.MOQ || purchaseQty > product.stock
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-700 to-cyan-800 hover:from-cyan-600 hover:to-cyan-700"
                }`}
            >
              Add to Cart
            </button>

            <button
              onClick={handleWishlist}
              className={`flex items-center gap-2 text-sm sm:text-base ${isWishlisted ? "text-red-500" : "text-gray-500"
                } hover:text-red-600 transition`}
            >
              <FaHeart />
              <span>{isWishlisted ? "Wishlisted" : "Add to Wishlist"}</span>
            </button>
          </div>
          <div className="pt-4">
            <span className="font-semibold">Share:</span>
            <div className="flex gap-4 mt-2">
              <FaFacebook className="text-blue-600 hover:text-blue-800 cursor-pointer" />
              <FaTwitter className="text-blue-400 hover:text-blue-600 cursor-pointer" />
              <FaInstagram className="text-pink-500 hover:text-pink-700 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      <div className="mt-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">
          Similar Products
        </h2>

        {similarProducts.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {similarProducts.map((item) => (
              <div
                key={item.productId}
                className="border p-3 sm:p-4 rounded-xl shadow-sm hover:shadow-md transition bg-white"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-40 sm:h-48 object-cover rounded-md mb-2 sm:mb-3"
                />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">
                  {item.name}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">Rs. {item.price}</p>
                <button
                  onClick={() => navigate(`/product-details/${item.productId}`)}
                  className="mt-2 text-cyan-600 hover:underline text-sm"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-8 text-sm sm:text-base">
            <p>No similar products found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
