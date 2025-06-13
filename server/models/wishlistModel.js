import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  imgURL: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: String, required: true },
  originalprice: { type: Number, required: true },
  userEmail: { type: String, required: true }, 
});


WishlistSchema.index({ productId: 1, userEmail: 1 }, { unique: true });


export default mongoose.model("Wishlist", WishlistSchema);