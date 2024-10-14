'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Grid,
  useMediaQuery,
  useTheme
} from '@mui/material';
import Image from 'next/image';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import Header from '../_components/Header';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  padding: theme.spacing(1),
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor: 
    status === 'Delivered' ? theme.palette.success.main :
    status === 'Processing' ? theme.palette.warning.main :
    status === 'Shipped' ? theme.palette.info.main :
    status === 'Pending Payment' ? theme.palette.error.main :
    theme.palette.grey[500],
  color: theme.palette.common.white,
}));

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  const handleConfirmPayment = (orderId) => {
    router.push(`/checkout/${orderId}?confirmPayment=true`);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, px: { xs: 1, sm: 2, md: 3 } }}>
        <Typography variant="h4" gutterBottom>
          Your Orders
        </Typography>
        {orders.length === 0 ? (
          <Typography variant="body1">You have no orders yet.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table size="small" aria-label="orders table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>ID</StyledTableCell>
                  <StyledTableCell align="right">Total</StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                  <StyledTableCell align="center">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell component="th" scope="row" sx={{ padding: 1 }}>
                      {order.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell align="right" sx={{ padding: 1 }}>₳{order.total.toFixed(2)}</TableCell>
                    <TableCell align="center" sx={{ padding: 1 }}>
                      <StatusChip 
                        label={order.status} 
                        status={order.status} 
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ padding: 1 }}>
                      <Button 
                        variant="outlined" 
                        onClick={() => handleOpenDetails(order)} 
                        size="small"
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>

      <Dialog open={Boolean(selectedOrder)} onClose={handleCloseDetails} maxWidth="sm" fullWidth>
        <DialogTitle>Order Details - #{selectedOrder?.id}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" gutterBottom>
            Date: {selectedOrder?.date}
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            Status: <StatusChip label={selectedOrder?.status} status={selectedOrder?.status} size="small" />
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            Payment: 
            <Chip 
              label={selectedOrder?.isPaid ? "Paid" : "Unpaid"} 
              color={selectedOrder?.isPaid ? "success" : "error"} 
              size="small"
              sx={{ ml: 1 }}
            />
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Items:
          </Typography>
          <List disablePadding>
            <ListItem disablePadding>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                  <Image
                    src={selectedOrder?.product.image || '/placeholder.svg'}
                    alt={selectedOrder?.product.name}
                    width={60}
                    height={60}
                    layout="responsive"
                  />
                </Grid>
                <Grid item xs={9}>
                  <ListItemText
                    primary={selectedOrder?.product.name}
                    secondary={`Qty: ${selectedOrder?.quantity} - Price: ₳${selectedOrder?.product.price.toFixed(2)}`}
                  />
                </Grid>
              </Grid>
            </ListItem>
          </List>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Total: ₳{selectedOrder?.total.toFixed(2)}
          </Typography>
          {!selectedOrder?.isPaid && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => handleConfirmPayment(selectedOrder.id)}
            >
              Confirm Payment
            </Button>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderPage;