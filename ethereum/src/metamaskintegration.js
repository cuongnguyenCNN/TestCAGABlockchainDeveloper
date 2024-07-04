import React, { useState } from 'react';
import Web3 from 'web3';

const MetaMaskIntegration = () => {
    const [walletAddress, setWalletAddress] = useState('');
    const [ethBalance, setEthBalance] = useState('');
    const [usdtBalance, setUsdtBalance] = useState('');
    const usdtContractAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
    const infuraUrl = 'https://mainnet.infura.io/v3/aed4f8b8edc14abfbbaa92ae6c678080';

    const connectMetaMask = async () => {
        if (window.ethereum) {
           const web3 = new Web3(window.ethereum);
            //const web3 = new Web3.providers.HttpProvider(infuraUrl);
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const accounts = await web3.eth.getAccounts();
                const walletAddress = accounts[0];
                setWalletAddress(walletAddress);

                const ethBalance = await web3.eth.getBalance(walletAddress);
                setEthBalance(web3.utils.fromWei(ethBalance, 'ether'));

                const usdtAbi = [
                    {
                        "constant": true,
                        "inputs": [{ "name": "_owner", "type": "address" }],
                        "name": "balanceOf",
                        "outputs": [{ "name": "balance", "type": "uint256" }],
                        "type": "function"
                    }
                ];
                const usdtContract = new web3.eth.Contract(usdtAbi, usdtContractAddress);
                const usdtBalance = await usdtContract.methods.balanceOf(walletAddress).call();
                setUsdtBalance(web3.utils.fromWei(usdtBalance, 'mwei')); // USDT has 6 decimals
            } catch (error) {
                console.error(error);
            }
        } else {
            alert('MetaMask is not installed. Please install it to use this feature.');
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <button onClick={connectMetaMask}>Connect MetaMask</button>
            {walletAddress && (
                <div style={{ marginTop: '20px' }}>
                    <p>Wallet Address: {walletAddress}</p>
                    <p>ETH Balance: {ethBalance}</p>
                    <p>USDT Balance: {usdtBalance}</p>
                </div>
            )}
        </div>
    );
};

export default MetaMaskIntegration;
