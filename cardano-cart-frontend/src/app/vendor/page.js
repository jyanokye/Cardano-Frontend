"use client";
import { useState, useRef } from "react";
import Button from "@mui/material/Button";
import Header from "../_components/Header";
import { CircularProgress, Snackbar, Alert } from "@mui/material";
import { createProduct } from "../../../utils/_products"; // Adjust the import path as necessary

export default function CreateProduct() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: 0,
    category: "",
    images: [{ image: "" }]
  });

  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: name === "price" || name === "stock" ? Number(value) : value
    }));
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setProduct(prevProduct => ({
      ...prevProduct,
      images: [{ image: event.target.files[0].name }]
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const access_token = localStorage.getItem('accessToken'); // Assuming you store the token in localStorage
      if (!access_token) {
        throw new Error('No access token found. Please log in.');
      }

      const productData = {
        ...product,
        price: parseFloat(product.price),
        stock: parseInt(product.stock),
      };

      if (file) {
        // If you need to handle file upload, you'll need to modify the createProduct function
        // or create a separate function for file upload
        console.log('File selected:', file.name);
      }

      const createdProduct = await createProduct(productData, access_token);
      console.log('Product created:', createdProduct);
      setSuccess(true);
      setProduct({
        name: "",
        description: "",
        price: "",
        stock: 0,
        category: "",
        images: [{ image: "" }]
      });
      setFile(null);
    } catch (err) {
      console.error('Error creating product:', err);
      setError(err.message || 'Failed to create product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <form className="container mx-auto p-6" onSubmit={handleSubmit}>
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Create Product</h2>
          <div className="border-dashed border-2 border-gray-300 rounded-lg p-6 text-center mb-6">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              ref={fileInputRef}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer p-4 rounded-lg"
            >
              <p>Max 5 MB, PNG, JPEG</p>
              <Button
                variant="contained"
                color="primary"
                className="mt-2 px-4 py-2 text-white rounded"
                onClick={() => fileInputRef.current.click()}
              >
                Browse File
              </Button>
            </label>
            {file && <p className="mt-2">{file.name}</p>}
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Product Details</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-600 mb-1">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
                  placeholder="Product Name"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Price (ADA)</label>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={product.stock}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={product.category}
                  onChange={handleInputChange}
                  placeholder="Category"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Description</label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleInputChange}
                placeholder="Provide a detailed description of the product."
                className="w-full px-3 py-2 border rounded-lg resize-none focus:outline-none"
                rows="4"
                required
              ></textarea>
            </div>
          </div>
          <div className="text-center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="px-6 py-3 text-white rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create Product'}
            </Button>
          </div>
        </div>
      </form>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError("")}>
        <Alert onClose={() => setError("")} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Product created successfully!
        </Alert>
      </Snackbar>
    </>
  );
}

