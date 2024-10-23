'use client'

import { useState } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from Next.js
import { CssVarsProvider, extendTheme, useColorScheme } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Checkbox from '@mui/joy/Checkbox';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton from '@mui/joy/IconButton';

import Avatar from '@mui/material/Avatar';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';

import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import  GoogleIcon  from './GoogleIcon';


import { Auth } from '../../../utils/_auth';

const BASE_URL = 'https://charming-ninnetta-knust-028ea081.koyeb.app/api/v1';
//const BASE_URL = 'http://127.0.0.1:8000/api/v1';

const auth = new Auth();


function ColorSchemeToggle(props) {
  const { onClick, ...other } = props;
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  return (
    <IconButton
      aria-label="toggle light/dark mode"
      size="sm"
      variant="outlined"
      disabled={!mounted}
      onClick={(event) => {
        setMode(mode === 'light' ? 'dark' : 'light');
        onClick?.(event);
      }}
      {...other}
    >
      {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  );
}

const customTheme = extendTheme({ defaultColorScheme: 'dark' });


export  default function JoySignInSideTemplate() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailSignIn = async (event) => {
    event.preventDefault();

    const credentials = {
      email: email,
      password: password,
    };
  
    const endpoint = `${BASE_URL}/users/login/`;
  
    auth.Credentials(credentials, endpoint)
    .then(user => {
      console.log('Authenticated user:', user)

      const accessToken = user.access;  // Adjust this based on your API response structure
    
      // Save the access token (or other user data) to localStorage
      localStorage.setItem('accessToken', accessToken);
    
      // Redirect the user to the homepage
      router.push('/');
    })
    .catch(error => console.error('Error:', error));
  }



  return (
    <CssVarsProvider theme={customTheme} disableTransitionOnChange>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ':root': {
            '--Form-maxWidth': '800px',
            '--Transition-duration': '0.4s', 
          },
        }}
      />
      <Box
        sx={(theme) => ({
          width: { xs: '100%', md: '50vw' },
          transition: 'width var(--Transition-duration)',
          transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255 255 255 / 0.2)',
          [theme.getColorSchemeSelector('dark')]: {
            backgroundColor: 'rgba(19 19 24 / 1)',
          },
        })}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100dvh',
            width: '100%',
            px: 2,
          }}
        >
          <Box
            component="header"
            sx={{ py: 3, display: 'flex', justifyContent: 'space-between' }}
          >
            <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
              <IconButton variant="soft" color="primary" size="sm">
                <img src='images/Cart Logo.png' 
              style={{ width: '80px', height: '80px' }}
              />
              
              </IconButton>
              <Typography level="title-lg" style={{ fontSize: '30px' }}>Cardano Cart</Typography>
            </Box>
            <Box sx={{ transform: 'scale(0.8)' }}>
            <ColorSchemeToggle />
            </Box>
          </Box>
          <Box
            component="main"
            sx={{
              my: 'auto',
              py: 2,
              pb: 5,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: 400,
              maxWidth: '100%',
              mx: 'auto',
              borderRadius: 'sm',
              '& form': {
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              },
              [`& .MuiFormLabel-asterisk`]: {
                visibility: 'hidden',
              },
            }}
          >
            <Stack sx={{ gap: 4, mb: 2 }}>
              <Stack sx={{ gap: 1 }}>
                <Typography component="h1" level="h2">
                  Sign in
                </Typography>
                <Typography level="body-sm">
                  New to user?{' '}
                  <Link href="/sign-up" level="title-sm">
                    Sign up!
                  </Link>
                </Typography>
              </Stack>
            </Stack>
            
            <Stack sx={{ gap: 4, mt: 2 }}>
              <form onSubmit={handleEmailSignIn}>
                <FormControl required>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" name="email" onChange={(e) => (setEmail(e.target.value))} />
                </FormControl>
                <FormControl required>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" name="password" onChange={(e) => (setPassword(e.target.value))} />
                </FormControl>
                <Stack sx={{ gap: 4, mt: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Checkbox size="sm" label="Remember me" name="persistent" />
                    <Link level="title-sm" href="#replace-with-a-link">
                      Forgot your password?
                    </Link>
                  </Box>

                  <Link href="/home">
                  <Button type="submit" fullWidth>
                    Sign in
                  </Button>
                  </Link>
                </Stack>
              </form>
            </Stack>
          </Box>
          <Box component="footer" sx={{ py: 3 }}>
            <Typography level="body-xs" sx={{ textAlign: 'center' }}>
              © Cardano Cart {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={(theme) => ({
          height: '100%',
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          left: { xs: '100vw', md: '50vw' },
          transition:
            'background-image var(--Transition-duration), left var(--Transition-duration) !important',
          transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
          backgroundColor: 'background.level1',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundImage:
            'url(/images/image2.png)',
          [theme.getColorSchemeSelector('dark')]: {
            backgroundImage:
              'url(/images/image1.png)',
          },
        })}
      />
    </CssVarsProvider>
  );
}
