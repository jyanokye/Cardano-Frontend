'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { ContentCopy, Check } from '@mui/icons-material';
import { useCart } from "react-use-cart";
import QRCode from "react-qr-code";
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Header from '../../_components/Header';

const Checkout = () => {
  const { productId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, removeItem, updateItemQuantity } = useCart();
  const [openDialog, setOpenDialog] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [copied, setCopied] = useState(false);
  const [order, setOrder] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const walletAddress = 'addr1v9w8x44wkuqujvv3mxfshqtvk7ymwfm8luxv04q7z8373g52ujk0';

  const isConfirmingPayment = searchParams.get('confirmPayment') === 'true';

  useEffect(() => {
    if (isConfirmingPayment) {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const existingOrder = orders.find(o => o.id === productId);
      if (existingOrder) {
        setOrder(existingOrder);
      } else {
        router.push('/orders');
      }
    } else {
      const product = items.find(item => item.id === parseInt(productId, 10));
      if (product) {
        setOrder({
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          product: product,
          quantity: product.quantity,
          total: product.price * product.quantity,
          status: 'Pending Payment',
          isPaid: false,
        });
      } else {
        router.push('/cart');
      }
    }
  }, [productId, items, router, isConfirmingPayment]);

  if (!order) {
    return null;
  }

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTransactionId('');
  };

  const handleSubmitTransaction = () => {
    console.log('Transaction ID submitted:', transactionId);
    handleCloseDialog();
    
    const updatedOrder = {
      ...order,
      status: 'Processing',
      isPaid: true,
      transactionId: transactionId
    };

    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedOrders = isConfirmingPayment
      ? existingOrders.map(o => o.id === order.id ? updatedOrder : o)
      : [...existingOrders, updatedOrder];
    
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    if (!isConfirmingPayment) {
      removeItem(order.product.id);
    }
    
    alert('Payment confirmed! Thank you for your purchase.');
    router.push('/order');
  };

  const handleCreateUnpaidOrder = () => {
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedOrders = [...existingOrders, order];
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    if (!isConfirmingPayment) {
      removeItem(order.product.id);
    }

    alert('Order created! Please complete the payment soon.');
    router.push('/orders');
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {isConfirmingPayment ? 'Confirm Payment' : 'Checkout'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ display: 'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Payment
              </Typography>
              <Typography variant="body1" gutterBottom>
                Scan QR Code to make payment
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <QRCode value={walletAddress} size={isMobile ? 200 : 256} />
              </Box>
              <Typography variant="body2" sx={{ mt: 2, wordBreak: 'break-all' }}>
                {walletAddress}
                <IconButton onClick={handleCopyAddress} size="small">
                  {copied ? <Check color="success" /> : <ContentCopy />}
                </IconButton>
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Your Order
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={3}>
                  <img src={order.product.image} alt={order.product.name} style={{ width: '100%' }} /> 
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body1">{order.product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ₳{order.product.price.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {order.quantity}
                  </Typography>
                </Grid>
              </Grid>
              <Typography variant="h6" sx={{ mt: 2 }}>Total: ₳{order.total.toFixed(2)}</Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleConfirmPayment}
              >
                Confirm Payment
              </Button>
              {!isConfirmingPayment && (
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={handleCreateUnpaidOrder}
                >
                  Create Order Without Payment
                </Button>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Enter Transaction ID</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Transaction ID"
            type="text"
            fullWidth
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmitTransaction} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Checkout;