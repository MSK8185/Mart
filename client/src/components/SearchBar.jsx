import { useState } from "react";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError("Please enter a search term");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://20.40.59.234:3000/api/search?q=${query}`
      );
      if (!response.ok) {
        throw new Error("Error fetching search results");
      }
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Search Products</h2>
      <form onSubmit={handleSearch} className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search for products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      {loading && <p className="mt-4 text-gray-600">Loading...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      <div className="mt-6">
        {results.length > 0 ? (
          <ul className="space-y-4">
            {results.map((product) => (
              <li key={product._id} className="border p-4 rounded-lg shadow">
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="text-gray-600">Price: ₹{product.price}</p>
                <p className="text-gray-500">{product.productDetails}</p>
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p className="mt-4 text-gray-600">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
