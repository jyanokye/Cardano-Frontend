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
} from '@mui/material';
import { ContentCopy, Check } from '@mui/icons-material';
import { useCart } from "react-use-cart";
import QRCode from "react-qr-code";
import { useParams, useRouter } from 'next/navigation';
import Header from '../../_components/Header';


const Checkout = () => {
  const { productId } = useParams();
  const router = useRouter();
  const { items, removeItem, updateItemQuantity } = useCart();
  const [openDialog, setOpenDialog] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [copied, setCopied] = useState(false);

  const walletAddress = 'addr1v9w8x44wkuqujvv3mxfshqtvk7ymwfm8luxv04q7z8373g52ujk0';

  const product = items.find(item => item.id === parseInt(productId, 10));

  useEffect(() => {
    if (!product) {
      router.push('/cart');
    }
  }, [product, router]);

  if (!product) {
    return null;
  }

  const total = product.price * product.quantity;
  const quantity = product.quantity;

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
    removeItem(product.id);
    alert('Payment confirmed! Thank you for your purchase.');
    router.push('/');
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Checkout
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ display: 'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Payment
              </Typography>
              <Typography variant="body1" gutterBottom>
                Scan QR Code to make payment
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <QRCode value={walletAddress} size={256} />
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
                  <img src={product.image} alt={product.name} style={{ width: '100%' }} /> 
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body1">{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ₳{product.price.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                          Quantity: {quantity}
                   </Typography>
                </Grid>
              </Grid>
              <Typography variant="h6" sx={{ mt: 2 }}>Total: ₳{total.toFixed(2)}</Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleConfirmPayment}
              >
                Confirm Payment
              </Button>
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