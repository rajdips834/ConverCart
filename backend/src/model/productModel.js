import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock_status: { type: String, required: true },
  stock_quantity: { type: Number, required: true },
  category: { type: String, required: true },
  tags: { type: [String], default: [] },
  on_sale: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});
export default mongoose.model("Product", productSchema);
