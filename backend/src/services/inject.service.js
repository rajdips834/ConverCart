import axios from "axios";

export async function fetchProducts() {
  const baseUrl = process.env.WC_BASE_URL;
  const consumerKey = process.env.WC_CONSUMER_KEY;
  const consumerSecret = process.env.WC_CONSUMER_SECRET;

  const url = `${baseUrl}/wp-json/wc/v3/products`;
  console.log(
    "Fetching products from:",
    url + `?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`
  );
  try {
    const response = await axios.get(
      url + `?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching WooCommerce products:", error.message);
    throw error;
  }
}

export function mapProductData(wcProduct) {
  return {
    id: wcProduct.id,
    title: wcProduct.name,
    price: parseFloat(wcProduct.price) || 0,
    stock_status: wcProduct.stock_status,
    stock_quantity: wcProduct.stock_quantity || 0,
    category:
      wcProduct.categories && wcProduct.categories.length > 0
        ? wcProduct.categories[0].name
        : null,
    tags: wcProduct.tags ? wcProduct.tags.map((tag) => tag.name) : [],
    on_sale: wcProduct.on_sale,
    created_at: new Date(wcProduct.date_created),
  };
}
