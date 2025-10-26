// File: src/lib/kronos.ts

import { ethers } from 'ethers';
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";

// --- Quest Verification & Reward Logic (No changes here) ---
export async function verifySwapQuest(userAddress: string): Promise<boolean> {
  const UNISWAP_ROUTER_ADDRESS = '0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3'; 

  const apiUrl = `https://eth-sepolia.blockscout.com/api?module=account&action=txlist&address=${userAddress}&startblock=0&endblock=99999999&sort=desc`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (!data.result || !Array.isArray(data.result)) return false;

    const hasSwapped = data.result.some(
      (tx: any) =>
        tx.to && tx.to.toLowerCase() === UNISWAP_ROUTER_ADDRESS.toLowerCase()
    );

    return hasSwapped;
  } catch (error) {
    console.error("Error verifying swap quest:", error);
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
  chatHistory: ChatMessage[],
  userAddress: string
): Promise<string> {
  let onChainContext = "";

  // --- Fetch last 10 transactions from Sepolia Blockscout ---
  try {
    const apiUrl = `https://eth-sepolia.blockscout.com/api?module=account&action=txlist&address=${userAddress}&startblock=0&endblock=99999999&sort=desc`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data && Array.isArray(data.result) && data.result.length > 0) {
      // Take the last 10 transactions
      const recentTxs = data.result.slice(0, 10);

      const incoming: any[] = [];
      const outgoing: any[] = [];

      recentTxs.forEach((tx) => {
        const txData = {
          hash: tx.hash.slice(0, 10) + "…",
          from: tx.from,
          to: tx.to,
          value: Number(ethers.formatEther(tx.value)),
          block: tx.blockNumber,
        };
        if (tx.to.toLowerCase() === userAddress.toLowerCase()) {
          incoming.push(txData);
        } else {
          outgoing.push(txData);
        }
      });

      const formatTxs = (txs: any[]) =>
        txs
          .map(
            (tx, i) =>
              `${i + 1}. Tx Hash: ${tx.hash}\n   From: ${tx.from}\n   To: ${tx.to}\n   Value: ${tx.value} ETH\n   Block: ${tx.block}`
          )
          .join("\n");

      // Build a clean on-chain context string
      let context = "";
      if (incoming.length > 0) {
        context += "**Incoming Transactions:**\n" + formatTxs(incoming) + "\n\n";
        const incomingAddresses = [...new Set(incoming.map((tx) => tx.from))];
        context += `Summary: You received ETH from ${incomingAddresses.length} different addresses:\n- ${incomingAddresses.join(
          "\n- "
        )}\n\n`;
      } else {
        context += "No incoming transactions in the last 10 transactions.\n\n";
      }

      if (outgoing.length > 0) {
        context += "**Outgoing Transactions:**\n" + formatTxs(outgoing) + "\n\n";
        const outgoingAddresses = [...new Set(outgoing.map((tx) => tx.to))];
        context += `Summary: You sent ETH to ${outgoingAddresses.length} different addresses:\n- ${outgoingAddresses.join(
          "\n- "
        )}\n`;
      } else {
        context += "No outgoing transactions in the last 10 transactions.\n";
      }

      onChainContext = context;
    } else {
      onChainContext = "No recent transactions found for this wallet.";
    }
  } catch (error) {
    console.error("❌ Failed to fetch Blockscout data:", error);
    onChainContext = "I encountered an error while trying to fetch data from Blockscout.";
  }

  // --- AI system prompt ---
  const systemPrompt = `
You are KRONOS, a friendly Web3 assistant.
The user's wallet address is ${userAddress}.

ON-CHAIN CONTEXT:
${onChainContext}

Task:
- Summarize the user's transactions clearly.
- Keep incoming and outgoing separate.
- Use bullet points and shortened hashes.
- Highlight trends (like multiple addresses).
- Keep answers short and beginner-friendly.
- If no transactions exist, respond politely.
`;

  // --- Generate AI response ---
  try {
    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      system: systemPrompt,
      messages: chatHistory,
    });
    return text;
  } catch (error) {
    console.error("❌ Error generating Groq response:", error);
    return "I'm having a little trouble thinking right now. Please try again in a moment.";
  }
}


  