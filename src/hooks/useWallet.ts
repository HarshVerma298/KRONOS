import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export function useWallet() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const accounts: string[] = await web3Provider.send("eth_requestAccounts", []); // ✅ must pass []
        setProvider(web3Provider);
        setAddress(accounts[0]); // ✅ take the first account only
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      alert("Please install a Web3 wallet like MetaMask.");
    }
  };

  useEffect(() => {
    // Optional: check if already connected
    (async () => {
      if (window.ethereum) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await web3Provider.send("eth_accounts", []);
        if (accounts.length > 0) {
          setProvider(web3Provider);
          setAddress(accounts[0]);
        }
      }
    })();
  }, []);

  return { provider, address, connectWallet };
}
