

import React from 'react';
import Lottie from 'lottie-react';
import animationData from './WalletAnimation.json';
import { Box, Typography } from '@mui/material';

const CheckoutAnimation = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 9999,
      }}
    >
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        style={{ width: 300, height: 300 }}
      />
      <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold', color: 'primary.main' }}>
        Cardano Cart
      </Typography>
      <Typography variant="body1" sx={{ mt: 1 }}>
        Loading your ADA shopping experience...
      </Typography>
    </Box>
  );
};

export default  CheckoutAnimation;