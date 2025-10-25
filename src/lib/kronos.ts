// File: src/lib/kronos.ts

import { ethers } from 'ethers';
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";

// --- Quest Verification & Reward Logic (No changes here) ---
export async function verifySwapQuest(userAddress: string): Promise<boolean> {
  const SEPOLIA_CHAIN_ID = '11155111';
  const UNISWAP_ROUTER_ADDRESS = '0x3fC91A3afd70395E496CB848C926fE63489421p3'; 

  const apiUrl = `https://mcp.blockscout.com/api/v1/get_transactions_by_address?chain_id=${SEPOLIA_CHAIN_ID}&address=${userAddress}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (!data.result) return false;

    const hasSwapped = data.result.some(
      (tx: any) => tx.to.address.toLowerCase() === UNISWAP_ROUTER_ADDRESS.toLowerCase()
    );
    return hasSwapped;
  } catch (error) {
    console.error("Error verifying quest:", error);
    return false;
  }
}

export async function sendPyusdReward(recipientAddress: string, amountInDollars: number): Promise<string | null> {
    const treasuryPrivateKey = import.meta.env.VITE_TREASURY_PRIVATE_KEY;
    if (!treasuryPrivateKey) {
      console.error("VITE_TREASURY_PRIVATE_KEY not found in.env file.");
      alert("Server configuration error: Treasury key is missing.");
      return null;
    }
  
    const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.org");
    const treasuryWallet = new ethers.Wallet(treasuryPrivateKey, provider);
    const pyusdContract = new ethers.Contract("0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9", ["function transfer(address to, uint256 amount)"], treasuryWallet);
  
    try {
      const amount = ethers.parseUnits(amountInDollars.toString(), 6);
      const tx = await pyusdContract.transfer(recipientAddress, amount);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error("Failed to send PYUSD reward:", error);
      return null;
    }
}


// --- UPGRADED AI Chat Logic ---
const groq = createGroq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
});

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function getAIResponse(
  chatHistory: ChatMessage,
  userAddress: string
): Promise<string> {
  
  let onChainContext = "";

  // We will now always fetch general address info to give the AI some real data to work with.
  try {
    // Using the more general and robust 'get_address_info' endpoint for better context.
    const apiUrl = `https://mcp.blockscout.com/api/v1/get_address_info?chain_id=11155111&address=${userAddress}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Check if the API call was successful and data exists
    if (data && data.result) {
      // We create a clean summary object to avoid overwhelming the AI.
      const addressSummary = {
        address: data.result.address,
        balance: data.result.balance, // The user's ETH balance
        is_contract: data.result.is_contract,
        ens_name: data.result.ens_name,
        token_count: data.result.token_count, // How many different ERC-20 tokens they hold
        nft_count: data.result.nft_count,   // How many different NFT collections they hold
      };
      onChainContext = `Here is a summary of the user's on-chain data in JSON format: ${JSON.stringify(addressSummary)}`;
    } else {
      onChainContext = "I was unable to fetch the on-chain data for the user's address from Blockscout.";
    }
  } catch (error) {
    console.error("Failed to fetch from Blockscout:", error);
    onChainContext = "I encountered an error while trying to fetch data from Blockscout.";
  }

  // This new prompt teaches the AI how to use the new, richer data.
  const systemPrompt = `You are KRONOS, a friendly and helpful AI guide for the Web3 world, powered by Groq for lightning-fast responses.
    Your goal is to help users understand their on-chain activity based on the data provided.
    The user's wallet address is ${userAddress}.
    
    ON-CHAIN CONTEXT:
    ${onChainContext}
    
    Based on the provided on-chain context and the conversation history, provide a helpful and concise response to the user's last message.
    - When asked about "activity" or "what's in my wallet", use the provided context to give a summary (e.g., "I see your address has a balance of X ETH, and you're holding Y different tokens and Z NFTs.").
    - If the user asks for specific transactions, you can state that you can see their balance and token counts, but a detailed transaction history lookup is a separate step.
    - Keep your answers short and easy to understand for a beginner.
    - If the on-chain context says data was unavailable, inform the user politely.`;

  try {
    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      system: systemPrompt,
      messages: chatHistory,
    });
    return text;
  } catch (error) {
    console.error("Error generating Groq response:", error);
    return "I'm having a little trouble thinking right now. Please try again in a moment.";
  }
}