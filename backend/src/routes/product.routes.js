import express from "express";
import {
  deleteProductController,
  filterProductsController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
} from "../controllers/product.controller.js";
const router = express.Router();
router.get("/", getAllProductsController);
router.post("/segments/evaluate", filterProductsController);
router.get("/:id", getProductByIdController);
router.post("/", updateProductController);
router.delete("/:id", deleteProductController);
export default router;
