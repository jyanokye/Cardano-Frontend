'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  IconButton,
  Button,
  TextField,
} from '@mui/material';
import { Add, Remove, Close } from '@mui/icons-material';
import { useCart } from "react-use-cart";
import Header from '../_components/Header';

const CartPage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  
  const {
    isEmpty,
    cartTotal,
    items,
    updateItemQuantity,
    removeItem,
  } = useCart();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Header/>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Your Cart
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="cart table">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isEmpty ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
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
                        <TableCell align="right">₳{item.price}</TableCell>
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
                              onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 1)}
                            />
                            <IconButton size="small" onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>
                              <Add />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell align="right">₳{(item.price * item.quantity)}</TableCell>
                        <TableCell align="center">
                          <Link href={`/checkout/${item.id}`} passHref>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                            >
                              Checkout
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          {!isEmpty && (
            <Grid item xs={12} md={4} sx={{ ml: 'auto', mt: 2 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Cart Total
                </Typography>
                <Typography variant="h5">
                  ₳{cartTotal}
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default CartPage;