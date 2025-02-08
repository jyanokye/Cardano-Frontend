'use client'

import React, { useState, useContext } from 'react'
import {
  Typography,
  IconButton,
  AppBar,
  Badge,
  Toolbar,
  Button,
  Box,
  Popover,
  Link,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'
import NextLink from 'next/link'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { motion } from 'framer-motion'
import { styled } from '@mui/system'
import { useCart } from 'react-use-cart'
import CartDrawer from './CartDrawer'
import { WalletContext } from './WalletContext'
import { UserContext } from '../../../utils/UserContext' // Adjust the path as necessary
import ConnectWallet from '../hooks/YoroiWallet'

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { totalItems } = useCart()
  const { user, loading, setUser } = useContext(UserContext)
  const { isConnected, walletName, balance, connectWallet, disconnectWallet } =
    useContext(WalletContext);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleCartOpen = () => {
    setCartOpen(true)
  }

  const handleCartClose = () => {
    setCartOpen(false)
  }

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -3,
      top: 13,
      border: `2px solid blue`,
      padding: '0 4px',
    },
  }))

  const open = Boolean(anchorEl)
  const id = open ? 'account-popover' : undefined

  const fadeInFromLeft = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: [0.175, 0.885, 0.32, 1.275],
      },
    },
  }

  const menuItems = [
    { text: 'Home', href: '/' },
    { text: 'Shop', href: '/shop' },
    { text: 'Orders', href: '/orders' },
    { text: 'About', href: '/about' },
    
  ]

  if (loading) {
    return null // Or a loader, depending on your UI
  }

  return (
    <AppBar position="static" color="transparent" className="bg-white shadow-md">
      <Toolbar className="flex justify-between items-center">
        <motion.div
          className="flex items-center"
          initial="hidden"
          animate="visible"
          variants={fadeInFromLeft}
        >
          <Typography variant="h6" className="text-black font-bold mr-2">
            Cardano Cart
          </Typography>
        </motion.div>

        <motion.div className="flex items-center space-x-4" variants={fadeInFromLeft} initial="hidden" animate="visible">
          {/* Menu Links */}
          <motion.div className="hidden md:flex space-x-4" variants={fadeInFromLeft}>
            {menuItems.map((item) => (
              <Button key={item.text} className="text-black" component={NextLink} href={item.href}>
              {item.text}
            </Button>
            ))}
          </motion.div>

          {/* Cart & Auth */}
          <motion.div className="flex items-center space-x-4" variants={fadeInFromLeft}>
            {/* Account Icon */}
            <IconButton className="text-black" onClick={handleClick}>
              <AccountCircleIcon />
            </IconButton>

            {/* Popover for Profile or Login/Signup */}
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {user ? (
                  <>
                    <Link href="/profile" style={{ textDecoration: 'none', width: '100%', marginBottom: '8px' }}>
                      <Button variant="outlined" color="primary" fullWidth>
                        Profile
                      </Button>
                    </Link>
                    <Link href="/">
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => {
                          localStorage.removeItem('accessToken')
                          setUser(null) // Update context to reflect logout
                        }}
                      >
                        Logout
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/sign-in" prefetch="true" style={{ textDecoration: 'none', width: '100%', marginBottom: '8px' }}>
                      <Button variant="outlined" color="primary" fullWidth>
                        Login
                      </Button>
                    </Link>
                    <Link href="/sign-up" prefetch="true" style={{ textDecoration: 'none', width: '100%' }}>
                      <Button variant="contained" color="primary" fullWidth>
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </Box>
            </Popover>
            <ConnectWallet />
            {/* Shopping Cart Icon */}
            <IconButton aria-label="cart" className="text-black">
              <StyledBadge badgeContent={totalItems} color="primary" onClick={handleCartOpen}>
                <ShoppingCartIcon />
              </StyledBadge>
            </IconButton>
          </motion.div>

          {/* Mobile Menu */}
          <motion.div className="md:hidden" variants={fadeInFromLeft}>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMobileMenuToggle}>
              <MenuIcon className="text-black" />
            </IconButton>
          </motion.div>
        </motion.div>
        <CartDrawer open={cartOpen} onClose={handleCartClose} />

        {/* Mobile Menu Drawer */}
        <Drawer anchor="right" open={mobileMenuOpen} onClose={handleMobileMenuToggle}>
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={handleMobileMenuToggle}
            onKeyDown={handleMobileMenuToggle}
          >
            <List>
              {menuItems.map((item) => (
                <ListItem button key={item.text} component={Link} href={item.href}>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  )
}

export default Header

