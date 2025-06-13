import User from "../models/User.js";

export const addToCart = async (req, res) => {
    try {
      const { email, productId, name, imgURL, price, quantity, originalprice } = req.body;
  
      if (!email) {
        return res.status(400).json({ error: "User email is required" });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const existingItem = user.cart.find(item => item.productId === productId);
      
      // if (existingItem) {
      //   existingItem.quantity += 1; // Increase quantity
      // } else {
      //   user.cart.push({ productId, name, imgURL, price, quantity, originalprice });
      // }

    const qty = Number(quantity);
    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      user.cart.push({ productId, name, imgURL, price, quantity: qty, originalprice });
    }
  
      await user.save();
      res.status(200).json({ message: "Product added to cart", cart: user.cart });
    } catch (error) {
      console.error(" Server error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };


  export const incrementCart = async (req, res) => {
  const { email, productId } = req.body;

  if (!email) {
    return res.status(400).json({ error: "User email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingItem = user.cart.find(item => item.productId === productId);
    
    if (existingItem) {
      if (existingItem.quantity > 0) {
        existingItem.quantity += 1; // Increase quantity
      }

      await user.save();
      return res.status(200).json({ message: "Product updated in cart", cart: user.cart });
    } else {
      return res.status(404).json({ error: "Product not found in cart" });
    }
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

  
//  Remove a product from the cart
// export const removeFromCart = async (req, res) => {
//   const { email, productId } = req.body;

//   if (!email) {
//     return res.status(400).json({ error: "User email is required" });
//   }

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     user.cart = user.cart.filter(item => item.productId !== productId);
//     await user.save();

//     res.status(200).json({ message: "Product removed from cart", cart: user.cart });
//   } catch (error) {
//     console.error("Error removing from cart:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

export const removeItem = async (req, res) => {
  const { email, productId } = req.body;

  if (!email) {
    return res.status(400).json({ error: "User email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.cart = user.cart.filter(item => item.productId !== productId);
    await user.save();

    res.status(200).json({ message: "Product removed from cart", cart: user.cart });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const removeFromCart = async (req, res) => {
  const { email, productId } = req.body;

  if (!email) {
    return res.status(400).json({ error: "User email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingItem = user.cart.find(item => item.productId === productId);
    
    if (existingItem) {
      if (existingItem.quantity > 1) {
        existingItem.quantity -= 1; // Decrease quantity
      } else {
        // If quantity is 1, remove the item from the cart
        user.cart = user.cart.filter(item => item.productId !== productId);
      }

      await user.save();
      return res.status(200).json({ message: "Product updated in cart", cart: user.cart });
    } else {
      return res.status(404).json({ error: "Product not found in cart" });
    }
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


// Get the cart for a user
export const getCart = async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ error: "User email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//clear cart
export const clearCart = async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "User email is required" });
      }
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      user.cart = []; 
      await user.save();
      res.status(200).json({ message: "Cart cleared", cart: user.cart });
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };