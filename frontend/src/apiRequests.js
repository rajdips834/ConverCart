import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
export const getAllProducts = async () => {
  const response = await axios.get(BACKEND_URL + "/products");
  return response.data;
};

export const getFilteredProducts = async (filter) => {
  const url = BACKEND_URL + "/products/segments/evaluate";
  const response = await axios.post(url, { filter: filter });
  return response.data;
};
