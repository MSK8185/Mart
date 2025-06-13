import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  add,
  remove,
  increment,
  decrement,
  setCart,
} from "../../store/cartSlice";
import { useNavigate } from "react-router-dom";
import CartBanner from "../../section/Cart/CartBanner";
import axios from "axios";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  
  // Coupon related states
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Clear coupon message after timeout
  useEffect(() => {
    if (couponMessage.text) {
      const timer = setTimeout(() => {
        setCouponMessage({ type: '', text: '' });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [couponMessage]);

  useEffect(() => {
    const fetchCartAndProducts = async () => {
      if (!userEmail) return;

      try {
        setLoading(true);

        // Step 1: Get cart items
        const cartResponse = await axios.get(
          `http://localhost:3000/api/cart/${userEmail}`
        );
        const cartItems = cartResponse.data;

        dispatch(setCart(cartItems));

        // Step 2: Fetch all product details in parallel
        const productDetailRequests = cartItems.map((item) =>
          axios.get(`http://localhost:3000/api/products/${item.productId}`)
        );

        const productResponses = await Promise.all(productDetailRequests);
        const productData = productResponses.map((res) => res.data);
        console.log(productData);

        setProductDetails(productData);
      } catch (error) {
        console.error("Error fetching cart or product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartAndProducts();
  }, [userEmail, dispatch]);

  const removeFromCart = (product) => {
    dispatch(remove(product));
    axios.post("http://localhost:3000/api/cart/removeItem", {
      email: userEmail,
      productId: product.productId,
    });
  };

  // Increment product quantity & sync with backend
  const incrementQuantity = (product) => {
    dispatch(increment(product));
    axios.post("http://localhost:3000/api/cart/incrementCart", {
      ...product,
      email: userEmail,
    });
  };

  // Decrement product quantity & sync with backend
  const decrementQuantity = (product) => {
    dispatch(decrement(product));
    axios.post("http://localhost:3000/api/cart/remove", {
      email: userEmail,
      productId: product.productId,
    });
  };

  const getUnitPrice = (product, purchaseQty) => {
    if (!product) {
      return 0;
    }

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

  // Calculate subtotal (before coupon discount)
  const subtotal = cartItems.reduce((total, item) => {
    const product = productDetails.find(p => p.productId === item.productId);
    if (!product) return total;
    const unitPrice = getUnitPrice(product, item.quantity);
    return total + parseFloat(unitPrice) * item.quantity;
  }, 0);

  // Apply coupon validation (without marking as used)
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponMessage({ type: 'error', text: 'Please enter a coupon code' });
      return;
    }

    if (appliedCoupon) {
      setCouponMessage({ type: 'error', text: 'A coupon is already applied' });
      return;
    }

    try {
      setCouponLoading(true);
      const response = await axios.post('http://localhost:3000/api/admin/vouchers/validateVoucher', {
        code: couponCode.trim().toUpperCase(),
        purchaseAmount: subtotal,
        userEmail: userEmail
      });

      if (response.data.success) {
        setAppliedCoupon(response.data.voucher);
        setCouponMessage({ type: 'success', text: 'Coupon applied successfully!' });
      } else {
        setCouponMessage({ type: 'error', text: response.data.message || 'Invalid coupon code' });
      }
    } catch (error) {
      setCouponMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to validate coupon' 
      });
    } finally {
      setCouponLoading(false);
    }
  };

  // Remove applied coupon
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponMessage({ type: 'success', text: 'Coupon removed' });
  };

  // Calculate discount amount
  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;

    let discount = 0;
    if (appliedCoupon.type === 'percentage') {
      discount = (subtotal * appliedCoupon.discount) / 100;
      // Apply max discount limit if exists
      if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
        discount = appliedCoupon.maxDiscount;
      }
    } else {
      // Fixed amount discount
      discount = Math.min(appliedCoupon.discount, subtotal);
    }

    return discount;
  };

  const discountAmount = calculateDiscount();
  const totalAmount = subtotal - discountAmount;

  // Handle checkout process with Razorpay integration
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    if (!userEmail) {
      alert("Please log in to proceed with the checkout.");
      return;
    }
    setLoading(true);
    try {
      // Step 1: Create a Razorpay order
      const { data: order } = await axios.post(
        "http://localhost:3000/api/create-razorpay-order",
        { amount: totalAmount }
      );

      const options = {
        key: "rzp_test_GsUAh2atNEW2CJ",
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "QuickMart Checkout",
        description: "Complete your payment",
        handler: async (response) => {
          try {
            // Step 2: Verify payment and save order details
            const verification = await axios.post(
              "http://localhost:3000/api/verify-razorpay-payment",
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderDetails: cartItems.map((item) => ({
                  productName: item.name,
                  productImage: item.imgURL,
                  quantity: item.quantity,
                  price: item.price,
                })),
                subtotal: subtotal,
                discountAmount: discountAmount,
                totalAmount: totalAmount,
                couponCode: appliedCoupon?.code || null,
                userEmail,
                userName: "User",
              }
            );
            if (verification.data.success) {
              // Mark coupon as used only after successful payment
              if (appliedCoupon) {
                try {
                  await axios.post('http://localhost:3000/api/admin/vouchers/use', {
                    code: appliedCoupon.code,
                    userEmail: userEmail,
                    orderAmount: totalAmount,
                    orderId: verification.data.orderId || response.razorpay_payment_id
                  });
                } catch (couponError) {
                  console.error('Error marking coupon as used:', couponError);
                  // Don't fail the entire process if coupon marking fails
                }
              }

              await axios.post("http://localhost:3000/api/cart/clear", {
                email: userEmail,
              });
              
              // Clear the Redux store cart
              dispatch(setCart([]));
              
              // Reset coupon state
              setAppliedCoupon(null);
              setCouponCode("");
              
              navigate("/orderplaced");
            } else {
              alert("Payment verification failed!");
            }
          } catch (err) {
            console.error("Error verifying payment:", err);
            alert("An error occurred while verifying the payment.");
          }
        },
        prefill: {
          name: "User",
          email: userEmail,
          contact: "1234567890",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error initiating Razorpay payment:", error);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading cart...</p>;

  return (
    <div className="pt-20">
      <div className="hidden sm:block">
        <CartBanner />
      </div>
      <div className="container mx-auto p-4 md:p-8 font-poppins max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Table Section */}
          <div className="w-full lg:w-3/4">
            {/* Responsive Table Wrapper */}
            <div className="overflow-x-auto max-w-full">
              <table className="w-full border-collapse hidden lg:table">
                <thead>
                  <tr className="bg-beige-200 rounded-t-lg font-semibold text-gray-700">
                    <th className="text-center pr-24 p-2">Product</th>
                    <th className="text-center pr-24 p-2">Price</th>
                    <th className="text-center pr-24 p-2">Quantity</th>
                    <th className="text-center pr-24 p-2">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-4 text-center">
                        Your cart is empty
                      </td>
                    </tr>
                  ) : (
                    cartItems.map((item, index) => {
                      const product = productDetails.find(
                        (p) => p.productId === item.productId
                      );
                      if (!product) {
                        return null;
                      }
                      return (
                        <tr
                          key={item.productId || index}
                          className="border-b border-gray-200"
                        >
                          <td className="p-4 flex items-center space-x-2">
                            <img
                              src={item.imgURL}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <span className="text-sm lg:text-base font-medium">
                              {item.name}
                            </span>
                          </td>
                          <td className="p-4 text-gray-600">
                            Rs.{" "}
                            {parseFloat(
                              getUnitPrice(product, item.quantity)
                            ).toFixed(2)}
                          </td>

                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => decrementQuantity(item)}
                                className="px-2 py-1 bg-gray-300 rounded-l-lg text-black"
                              >
                                -
                              </button>
                              <span className="px-3 py-1 border">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => incrementQuantity(item)}
                                className="px-2 py-1 bg-gray-300 rounded-r-lg text-black"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="p-4 flex justify-between items-center">
                            <p className="text-gray-600">
                              Rs.{" "}
                              {(parseFloat(getUnitPrice(product, item.quantity)) * item.quantity).toFixed(2)}
                            </p>
                            <button
                              onClick={() => removeFromCart(item)}
                              className="text-yellow-500 hover:text-yellow-700 text-xl"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cart Totals Section */}
          <div className="w-full lg:w-1/4 space-y-6">
            {/* Coupon Section */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Have a Coupon?</h3>
              
              {/* Coupon Message */}
              {couponMessage.text && (
                <div className={`p-3 mb-4 rounded text-sm ${
                  couponMessage.type === 'error' 
                    ? 'bg-red-100 text-red-700 border border-red-200' 
                    : 'bg-green-100 text-green-700 border border-green-200'
                }`}>
                  {couponMessage.text}
                </div>
              )}

              {!appliedCoupon ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={couponLoading}
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                  >
                    {couponLoading ? 'Validating...' : 'Apply Coupon'}
                  </button>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-green-800">
                        Coupon Applied: {appliedCoupon.code}
                      </p>
                      <p className="text-sm text-green-600">
                        {appliedCoupon.type === 'percentage' 
                          ? `${appliedCoupon.discount}% discount` 
                          : `₹${appliedCoupon.discount} off`}
                      </p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-red-600 hover:text-red-800 text-sm underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Totals */}
            <div className="p-6 bg-beige-100 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Cart Totals</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>Rs. {subtotal.toFixed(2)}</p>
                </div>
                
                {appliedCoupon && discountAmount > 0 && (
                  <>
                    <div className="flex justify-between text-green-600">
                      <p>Discount ({appliedCoupon.code})</p>
                      <p>-Rs. {discountAmount.toFixed(2)}</p>
                    </div>
                    <hr className="border-gray-300" />
                  </>
                )}
                
                <div className="flex justify-between font-bold text-lg">
                  <p>Total</p>
                  <p>Rs. {totalAmount.toFixed(2)}</p>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={cartItems.length === 0 || loading}
                className="w-full mt-6 px-4 py-2 border border-black rounded-lg hover:bg-black hover:text-white transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Check Out"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;