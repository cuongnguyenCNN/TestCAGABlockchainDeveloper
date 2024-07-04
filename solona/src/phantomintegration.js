import React, { useState } from 'react';
import * as solanaWeb3 from '@solana/web3.js';
import { Connection, PublicKey } from '@solana/web3.js';

const PhantomIntegration = () => {const [walletAddress, setWalletAddress] = useState(null);
    const [solBalance, setSolBalance] = useState(0);
    const [usdtBalance, setUsdtBalance] = useState(0);
  
    const connectWallet = async () => {
      if (window.solana) {
        try {
          const response = await window.solana.connect();
          setWalletAddress(response.publicKey.toString());
          getBalances(response.publicKey);
        } catch (err) {
          console.error(err);
        }
      } else {
        alert('Please install the Phantom wallet extension.');
      }
    };
  
    const getBalances = async (publicKey) => {
      const connection = new Connection('https://api.mainnet-beta.solana.com');
  
      const solBalance = await connection.getBalance(publicKey);
      setSolBalance(solanaWeb3.LAMPORTS_PER_SOL * solBalance);
  
      const usdtPublicKey = new PublicKey('USDT_TOKEN_ADDRESS'); // Replace with the actual USDT token address
      const tokenBalance = await connection.getTokenAccountsByOwner(publicKey, {
        mint: usdtPublicKey,
      });
      setUsdtBalance(tokenBalance.value[0].account.data.parsed.info.tokenAmount.uiAmount);
    };
  
    return (
      <div>
        <button onClick={connectWallet}>Connect Phantom</button>
        {walletAddress && (
          <div>
            <p>Wallet Address: {walletAddress}</p>
            <p>SOL Balance: {solBalance}</p>
            <p>USDT Balance: {usdtBalance}</p>
          </div>
        )}
      </div>
    );
};

export default PhantomIntegration;
