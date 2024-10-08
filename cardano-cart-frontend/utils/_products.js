// product.js
import axios from 'axios';

// Function to get all products
export const getAllProducts = async (endpoint, access_token) => {
  console.log(`Bearer ${access_token}`)
  try {
    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};


// function to create a new product
export const createProduct = async (endpoint, productData, access_token) => {
  try {
    const response = await axios.post(endpoint, productData, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};
