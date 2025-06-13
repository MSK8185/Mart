import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import ProductCard from "../../components/ProductCard";
import { FaHeart } from "react-icons/fa";
import { BsFillCartCheckFill } from "react-icons/bs";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ShopProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 32;

  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "cart",
  });
  const cardRefs = useRef([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://20.40.59.234:3000/api/products/get");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Removed filtering by category and search query
  useEffect(() => {
    setFilteredProducts(products);
    setCurrentPage(1);
  }, [products]);

  useLayoutEffect(() => {
    cardRefs.current = [];
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    if (cardRefs.current.length > 0) {
      gsap.set(cardRefs.current, { opacity: 0, y: 40 });
      cardRefs.current.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(card, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              delay: i * 0.02,
            });
          },
        });
      });
    }
  }, [filteredProducts, currentPage]);

  const showToast = (message, type = "cart") => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: "", type: "cart" });
    }, 3000);
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      scrollToTop();
    }
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      scrollToTop();
    }
  };
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    scrollToTop();
  };

  const setCardRef = useCallback((el) => {
    if (el) cardRefs.current.push(el);
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 py-20">Error: {error}</div>;

  return (
    <>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="py-8 px-4 max-w-[1280px] mx-auto">
        {toast.visible && (
          <div
            className={`fixed z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg backdrop-blur-md border 
              ${
                toast.type === "wishlist"
                  ? "bg-pink-100/80 border-pink-300 text-pink-900"
                  : "bg-blue-100/80 border-blue-300 text-blue-900"
              }
              ${
                toast.type === "wishlist"
                  ? "top-5 right-5"
                  : "bottom-5 left-1/2 transform -translate-x-1/2"
              }`}
          >
            <div className="text-xl animate-bounce">
              {toast.type === "wishlist" ? (
                <FaHeart className="text-pink-600" />
              ) : (
                <BsFillCartCheckFill className="text-blue-600" />
              )}
            </div>
            <span className="font-medium text-sm">{toast.message}</span>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
          {currentProducts.map((product) => (
            <div
              key={product.id}
              ref={setCardRef}
              className="bg-white rounded-lg shadow-md h-full min-h-[320px]"
            >
              <ProductCard
                imgURL={product.image}
                name={product.name}
                quantity={product.quantity}
                price={product.price}
                originalprice={product.originalprice}
                productId={product.productId}
                onNotify={showToast}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-16 flex-wrap gap-2">
          <button
            className={`px-4 py-2 ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-200 hover:bg-blue-300"
            } rounded transition`}
            disabled={currentPage === 1}
            onClick={handlePrevPage}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded transition ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white font-semibold"
                  : "bg-blue-100 hover:bg-blue-200 text-blue-700"
              }`}
              onClick={() => handlePageClick(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className={`px-4 py-2 ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-200 hover:bg-blue-300"
            } rounded transition`}
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default ShopProducts;
