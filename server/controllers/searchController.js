import Product from '../models/admin/product.js';

// Controller for handling search
export const searchProducts = async (req, res) => {
    try {
      const query = req.query.q; 
      if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
      }
  
      // Case-insensitive search on the product name
      const results = await Product.find({
        name: { $regex: query, $options: 'i' },
      });
  
      // Check if there are results, if not, return an empty array
      if (results.length === 0) {
        return res.status(200).json([]); 
      }
  
      res.status(200).json(results); 
    } catch (error) {
      console.error('Error fetching search results:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  