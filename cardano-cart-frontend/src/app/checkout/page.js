'use client'

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ContentCopyOutlined, Check } from '@mui/icons-material';
import Header from '../_components/Header';
import { useCart } from "react-use-cart";
import QRCode from "react-qr-code";

export default function Checkout() {
  const {
    isEmpty,
    cartTotal,
    totalUniqueItems,
    items,
    totalItems,
    updateItemQuantity,
    removeItem,
  } = useCart();
  const [openDialog, setOpenDialog] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const walletAddress = 'addr1v9w8x44wkuqujvv3mxfshqtvk7ymwfm8luxv04q7z8373g52ujk0';

  const [copied, setCopied] = useState(false);
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
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
    alert('Payment confirmed! Thank you for your purchase.');
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Checkout
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Payment
              </Typography>
              <Typography variant="body1" gutterBottom>
                Scan QR Code to make payment
              </Typography>
              <Box sx={{ width: '100%', maxWidth: 256, height: 'auto', mb: 2 }}>
                <QRCode value={walletAddress} size={256} style={{ height: 'auto', maxWidth: '100%', width: '100%' }} />
              </Box>
              <Typography variant="body2" sx={{ wordBreak: 'break-all', textAlign: 'center' }}>
                {walletAddress}
                <IconButton onClick={handleCopyAddress} size="small">
                  {copied ? <Check color="success" /> : <ContentCopyOutlined />}
                </IconButton>
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 2,
              }}>
                <Typography variant="h6" sx={{
                  fontWeight: 'bold',
                  fontFamily: 'Poppins, Arial, sans-serif',
                }}>
                  PRODUCT
                </Typography>
                <Typography variant="h6">
                  SUBTOTAL
                </Typography>
              </Box>
              {items.map((item) => (
                <Grid container spacing={2} key={item.id} sx={{ mb: 2, alignItems: 'center' }}>
                  <Grid item xs={3} sm={2}>
                    <Box sx={{ width: '100%', paddingTop: '100%', position: 'relative' }}>
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        style={{ 
                          position: 'absolute', 
                          top: 0, 
                          left: 0, 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover' 
                        }} 
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={5} sm={6}>
                    <Typography variant="body2">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.price} ₳
                    </Typography>
                  </Grid>
                  <Grid item xs={2} sm={2}>
                    <Typography variant="body2"> x {item.quantity}</Typography>
                  </Grid>
                  <Grid item xs={2} sm={2}>
                    <Typography variant="body2" align="right">{item.price * item.quantity} ₳</Typography>
                  </Grid>
                </Grid>
              ))}
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="body1">Subtotal: {cartTotal} ₳</Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>Total: {cartTotal} ₳</Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleConfirmPayment}
                sx={{ mt: 2 }}
              >
                Confirm Payment
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Dialog open={openDialog} onClose={handleCloseDialog} fullScreen={isMobile}>
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
}