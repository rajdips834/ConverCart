import cron from "node-cron";
import {
  fetchProducts,
  mapProductData,
} from "./src/services/inject.service.js";

import mongoose from "mongoose";
import {
  bulkUpload,
  createProduct,
  getAllProducts,
} from "./src/services/product.service.js";
async function ingest() {
  try {
    // Normalize all existing product ids to trimmed strings
    const products = await getAllProducts();
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
    console.log("Products ingested successfully", inserted);
  } catch (error) {
    console.error("Failed to ingest products", error);
  }
}

export async function startCron() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  ingest(); // Initial fetch on startup

  console.log("Cron job started: ingestion every hour");
}
