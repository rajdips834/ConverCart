import express from "express";
import { ingestProducts } from "../controllers/product.controller.js";
const router = express.Router();
router.get("/", ingestProducts);

export default router;
