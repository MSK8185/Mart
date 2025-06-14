import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
 
  createdAt: { type: Date, default: Date.now },
});

const Banner = mongoose.model("Banner", bannerSchema);
export default Banner;
