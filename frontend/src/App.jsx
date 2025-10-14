import "./App.css";
import ProductCardList from "./components/ProductCardList";
import FilterEditor from "./components/Filter";
import { getAllProducts, getFilteredProducts } from "./apiRequests";
import { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const initialProducts = await getAllProducts();
    console.log(initialProducts, "initialProducts");
    setProducts(initialProducts);
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  const handleEval = async (filter) => {
    console.log("Evaluating filter:", filter);
    const filteredProducts = await getFilteredProducts(filter);
    setProducts(filteredProducts);
  };

  return (
    <>
      <FilterEditor onEval={handleEval} />

      <ProductCardList data={products} />
    </>
  );
}

export default App;
