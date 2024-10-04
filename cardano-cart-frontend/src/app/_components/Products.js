// src/components/Products/Product.js
import React from "react";

const Product = ({ _id, img, productName, price, color, badge, des }) => {
  return (
    <div className="border p-4 rounded-lg shadow-lg">
      {badge && <span className="badge">New</span>}
      <img src={img} alt={productName} className="w-full h-48 object-cover mb-4" />
      <h3 className="text-lg font-semibold mb-2">{productName}</h3>
      <p className="text-gray-600">{des}</p>
      <p className="text-gray-800 font-bold">${price}</p>
      <p className="text-gray-500">Color: {color}</p>
    </div>
  );
};

export default Product;
