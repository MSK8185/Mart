import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { add } from "../../store/cartSlice";
import { removeFromWishlist, fetchWishlist } from "../../store/wishlistSlice";
import { FaHeart, FaPlus, FaMinus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig";
import axios from "axios";
import { BsFillCartCheckFill } from "react-icons/bs";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlist = useSelector((state) => state.wishlist.items);
  const user = auth.currentUser;

  const [quantityStates, setQuantityStates] = useState({});
  const [notification, setNotification] = useState({ visible: false, productName: "" });

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const getUnitPrice = (product, quantity) => {
    if (!product) return 0;
    let unitPrice = product.price;
    if (product.bulkPricing?.length) {
      const sorted = [...product.bulkPricing].sort((a, b) => a.minQty - b.minQty);
      for (let tier of sorted) {
        if (quantity >= tier.minQty) {
          unitPrice = tier.pricePerUnit;
        }
      }
    }
    return unitPrice;
  };

  const fetchProductDetails = async (productId) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/products/${productId}`);
      return res.data;
    } catch (err) {
      console.error("Fetch error:", err);
      return null;
    }
  };

  const toggleQuantityInput = (productId) => {
    setQuantityStates((prev) => ({
      ...prev,
      [productId]: { showInput: true, quantity: 1, isAdding: false }
    }));
  };

  const updateQuantity = (productId, quantity) => {
    setQuantityStates((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], quantity: Math.max(1, quantity) }
    }));
  };

  const cancelQuantityInput = (productId) => {
    setQuantityStates((prev) => {
      const newState = { ...prev };
      delete newState[productId];
      return newState;
    });
  };

  const confirmAddToCart = async (item) => {
    const productId = item.productId;
    const state = quantityStates[productId];
    if (!state) return;

    const quantity = state.quantity;

    if (!user) {
      navigate("/signin");
      return;
    }

    const product = await fetchProductDetails(productId);
    if (!product) {
      alert("Product fetch failed.");
      return;
    }

    const cartItem = {
      productId: productId,
      name: product.name,
      imgURL: product.image || item.imgURL,
      price: getUnitPrice(product, quantity),
      originalprice: product.originalprice || item.originalprice,
      quantity: quantity,
      email: user.email,
    };

    try {
      setQuantityStates((prev) => ({
        ...prev,
        [productId]: { ...prev[productId], isAdding: true }
      }));

      await axios.post("http://localhost:3000/api/cart/add", cartItem);
      dispatch(add(cartItem));
      dispatch(removeFromWishlist(productId)); // ✅ Remove from wishlist
      showNotification(product.name);
      cancelQuantityInput(productId);
    } catch (err) {
      console.error("Cart add error:", err);
      alert("Add to cart failed.");
    }
  };

  const showNotification = (name) => {
    setNotification({ visible: true, productName: name });
    setTimeout(() => setNotification({ visible: false, productName: "" }), 3000);
  };

  return (
    <div className="container mx-auto p-4 pt-24 sm:pt-32 font-poppins">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">My Wishlist</h1>
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => {
            const state = quantityStates[item.productId] || {};
            const isAdding = state.isAdding;
            const showInput = state.showInput;
            const quantity = state.quantity || 1;

            const discount =
              item.originalprice && item.price
                ? Math.round(((item.originalprice - item.price) / item.originalprice) * 100)
                : 0;

            return (
              <div
                key={item.productId}
                className="relative bg-white rounded-lg border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden w-56 h-auto"
                onClick={() => navigate(`/product-details/${item.productId}`)}
              >
                {/* Heart */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(removeFromWishlist(item.productId));
                  }}
                  className="absolute top-3 right-3 z-10 p-1"
                >
                  <FaHeart className="text-red-500 w-5 h-5" />
                </button>

                {/* Discount */}
                {discount > 0 && (
                  <div className="absolute top-1.5 left-1.5 z-10">
                    <div className="bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 p-[1px] rounded-xl shadow-md">
                      <div className="bg-white rounded-xl px-2 py-1">
                        <span className="text-[10px] font-bold text-transparent bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text">
                          {discount}% OFF
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Image */}
                <div className="relative h-40 flex items-center justify-center p-4">
                  <img
                    src={item.imgURL}
                    alt={item.name}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Info */}
                <div className="px-3 pb-4 flex-1 flex flex-col">
                  <div className="mb-2">
                    <h3 className="font-medium text-gray-900 text-sm leading-tight mb-1 line-clamp-2">{item.name}</h3>
                    <p className="text-xs text-gray-500">{item.quantity}</p>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-gray-900 text-sm">₹{item.price}</span>
                    {item.originalprice && (
                      <span className="text-xs text-gray-400 line-through">₹{item.originalprice}</span>
                    )}
                  </div>

                  {/* Quantity and Add to Cart */}
                  {showInput ? (
                    <div className="w-full bg-white border border-blue-400 rounded-md p-2">
                      <div className="text-center mb-2">
                        <p className="text-xs font-medium text-gray-700 mb-2">Select Quantity</p>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(item.productId, quantity - 1);
                            }}
                            className="w-6 h-6 border border-blue-400 text-blue-500 rounded-full flex items-center justify-center hover:bg-blue-50 text-xs"
                          >
                            <FaMinus className="w-2 h-2" />
                          </button>
                          <input
                            type="number"
                            value={quantity}
                            onChange={(e) => {
                              e.stopPropagation();
                              const val = parseInt(e.target.value);
                              updateQuantity(item.productId, isNaN(val) || val < 1 ? 1 : val);
                            }}
                            className="w-10 h-6 text-center border border-blue-400 rounded text-xs font-semibold text-blue-600"
                            min="1"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(item.productId, quantity + 1);
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
                            cancelQuantityInput(item.productId);
                          }}
                          className="flex-1 bg-white border border-gray-300 text-gray-600 font-medium py-1 px-2 rounded text-xs hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmAddToCart(item);
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
                        toggleQuantityInput(item.productId);
                      }}
                      className="w-full bg-white border-2 border-blue-500 text-blue-500 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 text-sm disabled:opacity-50"
                    >
                      ADD TO CART
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>Your wishlist is empty.</p>
      )}

      {/* Notification */}
      {notification.visible && (
        <div className="fixed top-4 right-1/3 bg-green-600 text-white py-3 px-6 rounded-xl shadow-lg text-lg font-bold animate-slide-down z-50">
          <p className="flex items-center gap-2">
            <BsFillCartCheckFill className="animate-pulse" />
            {notification.productName} added to cart!
          </p>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
