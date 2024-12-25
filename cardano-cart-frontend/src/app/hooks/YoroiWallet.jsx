'use client'
import React, { useState } from 'react';
import { BrowserWallet } from '@meshsdk/core';

function ConnectWalletButton() {
  const [walletName, setWalletName] = useState('');
  const [wallet, setWallet] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState(null);

  const handleConnectWallet = async () => {
    try {
      const wallet = await BrowserWallet.enable('yoroi');
      const balance = await wallet.getBalance();
      setWalletName('Yoroi');
      setWallet(wallet);
      setIsConnected(true);
      localStorage.setItem('balance', balance);
      localStorage.setItem('isConnected', true);
      localStorage.setItem('wallet', wallet);
     
      if (balance && balance.length > 0) {
        const lovelace = balance[0].quantity;
        const ada = parseInt(lovelace) / 1000000; 
        setBalance(ada.toFixed(2)); 
      }

      console.log('Wallet connected:', wallet);
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    }
  };

  return (
    <div>
      {!isConnected ? (
        <button onClick={handleConnectWallet} style={buttonStyle}>
          Connect Wallet
        </button>
      ) : (
        <p>Balance: {balance ? balance : 'Loading...'} ADA</p>
      )}
    </div>
  );
}

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};
export default ConnectWalletButton; 