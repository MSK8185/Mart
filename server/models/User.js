import mongoose from "mongoose";

const profileInformationSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  mobile: { type: String },
  dateOfBirth: { type: Date },
});

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name:   { type: String, required: true },
  email:  { type: String, required: true, unique: true },
  password: { type: String, required: true },
  wallet: {
    coins: { type: Number, default: 0 },
  },
  wishlist: [
    {
      productId:    { type: String, required: true },
      name:         { type: String, required: true },
      imgURL:       { type: String, required: true },
      price:        { type: Number, required: true },
      quantity:     { type: String, required: true },
      originalprice:{ type: Number, required: true },
    },
  ],
  cart: [
    {
      productId:    { type: String, required: true },
      name:         { type: String, required: true },
      imgURL:       { type: String, required: true },
      price:        { type: Number, required: true },
      originalprice:{ type: Number },
      quantity:     { type: Number, default: 1 },
    },
  ],
  profileInformation: profileInformationSchema,
});

export default mongoose.model("User", userSchema);

