import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black' }}>
      <Toolbar>
        
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          Cardano Cart
        </Typography>
        <Button color="inherit">Home</Button>
        <Button color="inherit">Components</Button>
        <Button color="inherit">Promotion</Button>
        <Button color="inherit">About</Button>
        <IconButton color="inherit">
          <SearchIcon />
        </IconButton>
        <IconButton color="inherit">
          <FavoriteIcon />
        </IconButton>
        <IconButton color="inherit">
          <ShoppingCartIcon />
        </IconButton>
        <Button color="inherit">Log In / Sign Up</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
