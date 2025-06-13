import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'subCategory', default: null },
  stock: { type: Number, required: true },
  originalprice: { type: Number, required: true },
  // quantity: { type: String, required: true },
  quantity: { type: String, required: false },
  productId: { type: String, required: true },
  productDetails: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  bulkPricing: [
    {
      minQty: { type: Number, required: true }, 
      pricePerUnit: { type: Number, required: true }, 
    },
  ],
  MOQ: { type: Number, default: 1 }, 
  subImages: {
  type: [String],
  default: []
}

});

export default mongoose.model('Product', productSchema);


