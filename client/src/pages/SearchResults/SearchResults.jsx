import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';


const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchResults = () => {
  const query = useQuery();
  const searchTerm = query.get('q');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchTerm) {
      fetchProducts();
    }
  }, [searchTerm]);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:3000/api/search?q=${searchTerm}`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-6 pt-28">
      <h1 className="text-2xl font-bold">Search Results for "{searchTerm}"</h1>

      {loading && <p className="mt-4 text-gray-600">Loading...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      <div className="mt-4">
        {products.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => (
       
              <ProductCard
              key={product._id}
              imgURL={product.image}
              name={product.name}
              quantity={product.quantity}
              price={product.price}
              originalprice={product.originalprice}
              productId={product.productId} 
            />
            ))}
          </ul>
        ) : (
          !loading && <p className="mt-4 text-gray-600">No products found.</p>
        )}
      </div>
    </div>
    
  );
};

export default SearchResults;



