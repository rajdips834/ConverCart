import Product from "../model/productModel.js";
export const createProduct = async (productData) => {
  const product = new Product(productData);
  return await product.save();
};

export function parseQueryToMongoFilter(query) {
  const conditions = query
    .split(",")
    .map((cond) => {
      // Extract key, operator, value from each condition string
      const match = cond.match(/(.+?)(>=|<=|!=|=|>|<)(.+)/);
      if (!match) return null;
      let [, key, operator, value] = match;
      key = key.trim();
      value = value.trim();

      // Convert numeric fields values to numbers
      const numericFields = ["price", "stock_quantity"];
      if (numericFields.includes(key)) {
        value = Number(value);
        if (isNaN(value)) throw new Error(`Invalid number value for ${key}`);
      }

      // Map operators to MongoDB query operators
      switch (operator) {
        case "=":
          return { [key]: value };
        case "!=":
          return { [key]: { $ne: value } };
        case ">":
          return { [key]: { $gt: value } };
        case "<":
          return { [key]: { $lt: value } };
        case ">=":
          return { [key]: { $gte: value } };
        case "<=":
          return { [key]: { $lte: value } };
        default:
          return null;
      }
    })
    .filter(Boolean);

  // Combine conditions into one MongoDB filter object with $and
  if (conditions.length === 1) return conditions[0];
  return { $and: conditions };
}

// Usage example (async function)
export async function filterProducts(queryText) {
  try {
    const filter = parseQueryToMongoFilter(queryText);
    const products = await Product.find(filter);
    return products;
  } catch (error) {
    console.error("Filter error:", error.message);
    return [];
  }
}

export const getAllProducts = async () => {
  return await Product.find();
};
export const getProductById = async (id) => {
  return await Product.findOne({ id });
};
export const updateProduct = async (id, updateData) => {
  return await Product.findOneAndUpdate({ id }, updateData, { new: true });
};
export const deleteProduct = async (id) => {
  return await Product.findOneAndDelete({ id });
};
export const bulkUpload = async (productsData) => {
  if (!Array.isArray(productsData)) {
    throw new Error("Input must be an array of product data");
  }

  // Prepare bulk operations, for each product do an upsert by unique field (e.g., id)
  const bulkOps = productsData.map((product) => ({
    updateOne: {
      filter: { id: product.id }, // match product by unique id
      update: { $set: product },
      upsert: true, // insert if not found
    },
  }));

  // Execute bulkWrite operation
  const result = await Product.bulkWrite(bulkOps);
  return result;
};
