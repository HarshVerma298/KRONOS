import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipientAddress, amount, questId } = await req.json();
    console.log('Send reward request:', { recipientAddress, amount, questId });

    const TREASURY_PRIVATE_KEY = Deno.env.get('TREASURY_PRIVATE_KEY');
    if (!TREASURY_PRIVATE_KEY) {
      throw new Error('TREASURY_PRIVATE_KEY not configured');
    }

    // PYUSD Contract Address on Sepolia Testnet
    const PYUSD_CONTRACT = '0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9';
    
    // For production, use ethers.js or web3.js to sign and send transaction
    // This is a placeholder that shows the structure needed
    
    // In a real implementation, you would:
    // 1. Import ethers.js (Deno-compatible version)
    // 2. Create a wallet from TREASURY_PRIVATE_KEY
    // 3. Connect to Sepolia RPC
    // 4. Create PYUSD contract instance
    // 5. Call transfer(recipientAddress, amountInWei)
    // 6. Wait for transaction confirmation

    // Example structure (requires ethers.js for Deno):
    /*
    import { ethers } from "npm:ethers@6";
    
    const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/YOUR_KEY');
    const wallet = new ethers.Wallet(TREASURY_PRIVATE_KEY, provider);
    
    const pyusdAbi = ['function transfer(address to, uint256 amount) returns (bool)'];
    const contract = new ethers.Contract(PYUSD_CONTRACT, pyusdAbi, wallet);
    
    const amountInWei = ethers.parseUnits(amount.toString(), 6); // PYUSD has 6 decimals
    const tx = await contract.transfer(recipientAddress, amountInWei);
    const receipt = await tx.wait();
    */

    // Placeholder response
    const mockTxHash = `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    
    return new Response(
      JSON.stringify({
        success: true,
        transactionHash: mockTxHash,
        amount,
        recipient: recipientAddress,
        questId,
        message: 'PYUSD reward sent successfully',
        note: 'This is a demo response. In production, integrate ethers.js to send real transactions.'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in send-reward:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
