"use client"// app/layout.js
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider} from "react-use-cart";
import theme from "./_components/theme";
import { ThemeProvider } from "@mui/material";
import { WalletProvider } from "./_components/WalletContext";
import { UserProvider } from "../../utils/UserContext"; // Import the correct provider

// Load local fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});



// Root layout component
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
          <link rel="icon" href="/images/Cart-Logo1.ico" type="image/png"/>
        <title>Cardano Cart</title>
        </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ThemeProvider theme={theme}>
            <WalletProvider>
            <UserProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </UserProvider>
            </WalletProvider>
          </ThemeProvider>
      
      </body>
    </html>
  );
}