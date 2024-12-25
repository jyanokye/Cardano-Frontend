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
  useTheme,
  Alert,
  Snackbar
} from '@mui/material';
import { ContentCopy, Check } from '@mui/icons-material';
import { useCart } from "react-use-cart";
import QRCode from "react-qr-code";
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Header from '../../_components/Header';
import CheckoutAnimation from '@/app/_components/CheckoutLoading';
import { completeOrder, fetchProductSeller, verifyPayment } from '../../../../utils/_products';
import { useCardano } from '@cardano-foundation/cardano-connect-with-wallet';


import { BrowserWallet, Transaction, MeshTxBuilder } from '@meshsdk/core';
const Checkout = () => {
  const [access_token, setAccessToken] = useState(null);
  const [wallet, setWallet] = useState(null);
  

  useEffect(() => {
    const data = localStorage.getItem('accessToken');
    
    setAccessToken(data);
  }, []);

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
  const [isLoading, setIsLoading] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [error, setError] = useState('');
  const [orderCreated, setOrderCreated] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');



  const isConfirmingPayment = searchParams.get('confirmPayment') === 'true';
  const isYoroiPayment = searchParams.get('YoroiPayment') === 'true';
  const product = items.find(item => item.id === parseInt(productId, 10));
  

  useEffect(() => {
    if (!product) {
      router.push('/cart');
    } else {
      const getWalletAddress = async () => {
        try {
          const sellerWalletId = await fetchProductSeller(productId, access_token);  
          setWalletAddress(sellerWalletId.length > 0 ? sellerWalletId : 'No Address Found');
        } catch (err) {
          console.error('Failed to fetch wallet address:', err);
          setError('Failed to load wallet address. Please try again.');
        }
      };
      getWalletAddress();
    }
  }, [product, productId, router, access_token]);
  const cardanoContext = useCardano();
  
  useEffect(() => {
    if (isConfirmingPayment || isYoroiPayment) {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const existingOrder = orders.find(o => o.id === productId);
      existingOrder ? setOrder(existingOrder) : router.push('/order');
    } else if (product) {
      setOrder({
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        product: product,
        quantity: product.quantity,
        total: product.price * product.quantity,
        status: 'Pending Payment',
        isPaid: false,
      });
    }
  }, [productId, items, router, isConfirmingPayment, product, isYoroiPayment]);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  if (isLoading || !product || !order) {
    return isLoading ? <CheckoutAnimation /> : null;
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

  const handleCreateUnpaidOrder = () => {
    const orderData = {
      product: productId,
      quantity: product.quantity,
      shipping_address: 'Ahodwo Oasis of Love street',
    };

    completeOrder(orderData, access_token)
      .then(paymentResult => {
        setOrderCreated(true);
        setAlertSeverity('info');
        setAlertMessage('Order created! Please complete the payment soon.');
        setAlertOpen(true);
      })
      .catch(error => {
        console.error('Error completing order and payment:', error);
        setAlertSeverity('error');
        setAlertMessage('An error occurred: ' + (error.response ? error.response.data : error.message));
        setAlertOpen(true);
      });
    handleCloseDialog();
    removeItem(productId);
  };

  const handleSubmitTransaction = (txId) => {
    const orderId = order?.id;
  
    verifyPayment(orderId, txId, access_token)
      .then(paymentResult => {
        setAlertSeverity('success');
        setAlertMessage('Payment confirmed! Thank you for your purchase.');
        setAlertOpen(true);
        setTimeout(() => router.push('/orders'), 2000);
      })
      .catch(error => {
        console.error('Error completing order and payment:', error);
        setAlertSeverity('error');
        setAlertMessage('An error occurred: ' + (error.response ? error.response.data : error.message));
        setAlertOpen(true);
      });
    handleCloseDialog();
    removeItem(productId);
  };

  const handleYoroiPayment = async () => {
    try {
      if (!wallet) {
        const connectedWallet = await BrowserWallet.enable('yoroi');
        setWallet(connectedWallet);
      }

      if (!wallet) {
        setAlertMessage('Failed to connect to Yoroi wallet');
        setAlertOpen(true);
        return;
      }

      const changeAddress = await wallet.getChangeAddress();
      const utxos = await wallet.getUtxos();
      const txBuilder = new MeshTxBuilder();

      const lovelaceAmount = (order.total * 1000000).toString(); //This is to Convert ADA to Lovelace

      const meshTxBody = {
        outputs: [
          {
            address: "addr1v9v7jqa56t53lup99ze7s4856jfkpplkjukp4qghmvzp62csjk2rp",
            amount: [{ unit: "lovelace", quantity: lovelaceAmount }],
          },
        ],
        changeAddress: changeAddress,
        extraInputs: utxos,
        selectionConfig: {
          threshold: "5000000",
          strategy: "largestFirst",
          includeTxFees: true,
        },
      };

      console.log(`Sending ${order.total} ADA (${lovelaceAmount} Lovelace) to ${walletAddress}`);

      const unsignedTx = await txBuilder.complete(meshTxBody);
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);

      if (txHash) {
        console.log(`Transaction successful: ${txHash}`);
        handleSubmitTransaction(txHash);
      } else {
        throw new Error('Transaction submission failed');
      }
    } catch (error) {
      console.error('Yoroi payment error:', error);
      setAlertSeverity('error');
      setAlertMessage('Yoroi payment failed: ' + error.message);
      setAlertOpen(true);
    }
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
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
              {`${walletAddress.slice(0, 14)}...${walletAddress.slice(-10)}`}
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
                    ₳{order.product.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {order.quantity}
                  </Typography>
                </Grid>
              </Grid>
              <Typography variant="h6" sx={{ mt: 2 }}>Total: ₳{order.total}</Typography>
              {orderCreated && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleConfirmPayment}
                  >
                    Confirm Payment
                  </Button>
                 
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={handleYoroiPayment}
                    >
                      Pay with Yoroi
                    </Button>
                </>
              )}
              {!isConfirmingPayment && !orderCreated && (
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={handleCreateUnpaidOrder}
                >
                  Create Order
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
          <Button onClick={() => handleSubmitTransaction(transactionId)} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Checkout;