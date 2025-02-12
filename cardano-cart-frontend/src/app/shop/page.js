'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  TextField, 
  Slider, 
  Box,
  InputAdornment,
  Paper,
  useMediaQuery,
  useTheme,
  Alert,
  Snackbar
} from '@mui/material';
import { useCart } from "react-use-cart";
import Header from '../_components/Header';
import { current_products } from '../data';
import { Search } from '@mui/icons-material';
import { getAllProducts } from '../../../utils/_products';

const ShopAnimation = dynamic(() => import('../_components/ShopLoading'), { ssr: false });

const Shop = () => {
  const [products, setProducts] = useState(current_products)
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    if (typeof window !== "undefined") {
      const access_token = localStorage.getItem("accessToken")
      if (access_token) {
        try {
          const fetchedProducts = await getAllProducts(access_token)
          setProducts(fetchedProducts)
        } catch (error) {
          console.error("Error fetching products:", error)
          // Fallback to current_products if there's an error
          setProducts(current_products)
        }
      } else {
        // If no access token is available, use current_products
        setProducts(current_products)
      }
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchProducts()
  }, []) //Fixed useEffect dependency issue

  if (isLoading) {
    return <ShopAnimation />;
  }
  

  return (
    <div>
      <Header/>
      <h1>Shop</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - ${product.price}
          </li>
        ))}
      </ul>
    </div>
  )
}


export default Shop;

