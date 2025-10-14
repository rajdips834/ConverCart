import * as productService from "../services/product.service.js";
import { fetchProducts, mapProductData } from "../services/inject.service.js";
import Product from "../model/productModel.js";
export async function ingestProducts(req, res) {
  try {
    const products = await productService.getAllProducts();
    const existingIds = new Set(products.map((p) => String(p.id).trim()));

    const wcProducts = await fetchProducts();
    const batchIds = new Set();

    let inserted = 0;
    for (const wcProduct of wcProducts) {
      const mapped = mapProductData(wcProduct);
      const mappedId = String(mapped.id).trim();

      if (existingIds.has(mappedId) || batchIds.has(mappedId)) {
        continue;
      }

      await createProduct(mapped);
      batchIds.add(mappedId);
      inserted++;
    }
    res.status(200).json({
      message: "Products ingested successfully",
      count: wcProducts.length,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to ingest products" });
  }
}
export async function filterProductsController(req, res) {
  try {
    console.log("Filtering products with body:", req.body);
    const { filter } = req.body;

    const mongoFilter = productService.parseQueryToMongoFilter(filter);
    const products = await Product.find(mongoFilter);
    return res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const createProductController = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getAllProductsController = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getProductByIdController = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const updateProductController = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const deleteProductController = async (req, res) => {
  try {
    const product = await productService.deleteProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
