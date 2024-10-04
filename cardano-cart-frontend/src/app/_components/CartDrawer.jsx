import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Button,
  Box,
  Divider,
} from '@mui/material';
import { Close, Delete } from '@mui/icons-material';
import { useCart } from "react-use-cart";
import Link from 'next/link';


const CartDrawer = ({ open, onClose }) => {
  const { items, removeItem, cartTotal, emptyCart } = useCart();

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 350, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Your Cart</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        {items.length === 0 ? (
          <Typography>Your cart is empty</Typography>
        ) : (
          <>
            <List>
              {items.map((item) => (
                <ListItem key={item.id}>
                  <ListItemText
                    primary={item.name}
                    secondary={`Quantity: ${item.quantity} - ₳${(item.price * item.quantity).toFixed(2)}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={() => removeItem(item.id)}>
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Total: ₳{cartTotal.toFixed(2)}
            </Typography>
            <Button variant="outlined" color="secondary" onClick={emptyCart} sx={{ mb: 2 }}>
              Clear Cart
            </Button>
            <Link href="/cart" passHref>
              <Button variant="outlined" fullWidth sx={{ mb: 2 }} onClick={onClose}>
                View Full Cart
              </Button>
            </Link>
            <Link href="/checkout" passHref>
              <Button variant="contained" color="primary" fullWidth onClick={onClose}>
                Proceed to Checkout
              </Button>
            </Link>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default CartDrawer;