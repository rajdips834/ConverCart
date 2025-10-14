import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-100 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 ease-in-out max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-3 text-gray-900">{product.title}</h2>

      <p className="text-gray-800 text-lg mb-2">
        Price:{" "}
        <span className="font-semibold text-indigo-600">${product.price}</span>
      </p>

      <p className="mb-2">
        Stock Status:{" "}
        <span
          className={`inline-block font-semibold rounded-full px-3 py-1 text-sm ${
            product.stock_status === "instock"
              ? "bg-green-100 text-green-700"
              : product.stock_status === "outofstock"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {product.stock_status}
        </span>
      </p>

      <p className="text-gray-700 mb-2">
        Stock Quantity: {product.stock_quantity}
      </p>

      <p className="text-gray-700 mb-3">
        Category:{" "}
        <span className="font-medium text-indigo-700">{product.category}</span>
      </p>

      <div className="mb-3">
        <p className="text-gray-700 mb-1 font-medium">Tags:</p>
        {product.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 italic">No tags</p>
        )}
      </div>

      <p className="text-gray-800">
        On Sale:{" "}
        <span
          className={`font-semibold ${
            product.on_sale ? "text-green-600" : "text-gray-500"
          }`}
        >
          {product.on_sale ? "Yes" : "No"}
        </span>
      </p>
    </div>
  );
};

export default ProductCard;
