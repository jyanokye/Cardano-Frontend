"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  AppBar, Toolbar, Typography, IconButton, Badge, TextField, Button,
  Container, Grid, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Box, Divider, Link
} from '@mui/material';
import { styled } from '@mui/system';
import {
  Search, FavoriteBorder, ShoppingCart, Person, Add, Remove, Close
} from '@mui/icons-material';
import { useCart } from "react-use-cart";
import Header from '../_components/Header';
import { products } from '../data';

// Styled badge for the cart icon
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid blue`,
    padding: '0 4px',
  },
}));

const CartPage = () => {
  

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // or a loading spinner
  }
  
  const {
    isEmpty,
    cartTotal,
    totalUniqueItems,
    items,
    totalItems,
    updateItemQuantity,
    removeItem,
  } = useCart();

  

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Header/>
      {/* Main Cart Page Content */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {/* Cart Items Table */}
          <Grid item xs={12} md={8}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="cart table">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
  {isEmpty ? (
    <TableRow>
      <TableCell colSpan={4} align="center">
        Your cart is empty.
      </TableCell>
    </TableRow>
  ) : (
    items.map((item) => (
      <TableRow key={item.id}>
        <TableCell component="th" scope="row">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small" onClick={() => removeItem(item.id)}>
              <Close />
            </IconButton>
            <Image
              src={item.image || '/placeholder.svg'}
              alt={item.name}
              width={80}
              height={80}
            />
            <Typography sx={{ ml: 2 }}>{item.name}</Typography>
          </Box>
        </TableCell>
        <TableCell align="right">₳{item.price.toFixed(2)}</TableCell>
        <TableCell align="center">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconButton size="small" onClick={() => updateItemQuantity(item.id, Math.max(item.quantity - 1, 1))}>
              <Remove />
            </IconButton>
            <TextField
              size="small"
              value={item.quantity}
              inputProps={{ style: { textAlign: 'center' } }}
              sx={{ width: '50px', mx: 1 }}
              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
            />
            <IconButton size="small" onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>
              <Add />
            </IconButton>
          </Box>
        </TableCell>
        <TableCell align="right">₳{(item.price * item.quantity).toFixed(2)}</TableCell>
      </TableRow>
    ))
  )}
</TableBody>

              </Table>
            </TableContainer>
            {/* Coupon and Cart Update Buttons */}

          </Grid>

          {/* Cart Totals Section */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Cart totals
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal</Typography>
                <Typography>₳{cartTotal}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Shipping</Typography>
                <Box>
                  <Typography>Free shipping</Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">₳{cartTotal}</Typography>
              </Box>
              <Button variant="contained" color="primary" fullWidth>
              <Link href="/checkout" variant="body2"sx={{ color: 'white',textDecoration: 'none', 
      '&:hover': {
        textDecoration: 'none', 
      }}} >
                Proceed to checkout
                </Link>
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6, mt: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Footer Content can be added here */}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default CartPage;
