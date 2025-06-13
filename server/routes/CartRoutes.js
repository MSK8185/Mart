import express from "express";
import { addToCart, removeFromCart, getCart, clearCart,removeItem, incrementCart} from "../controllers/CartController.js";

const router = express.Router();

// Add product to cart
router.post("/add", addToCart);

// Remove product from cart
router.post("/remove", removeFromCart);

router.post('/incrementCart', incrementCart)

router.post("/removeItem",removeItem );

// Get cart for a specific user
router.get("/:email", getCart);


router.post("/clear", clearCart);
export default router;
