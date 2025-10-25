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
    const { walletAddress, questId } = await req.json();
    console.log('Verifying quest:', { walletAddress, questId });

    const BLOCKSCOUT_API_KEY = Deno.env.get('BLOCKSCOUT_API_KEY');
    if (!BLOCKSCOUT_API_KEY) {
      throw new Error('BLOCKSCOUT_API_KEY not configured');
    }

    // Blockscout MCP API base URL (using Sepolia testnet)
    const BLOCKSCOUT_BASE = 'https://eth-sepolia.blockscout.com/api/v2';
    
    let verified = false;
    let details = {};

    // Quest-specific verification logic
    switch (questId) {
      case 'quest-1': {
        // Verify wallet received first PYUSD
        const response = await fetch(
          `${BLOCKSCOUT_BASE}/addresses/${walletAddress}/token-transfers`,
          {
            headers: {
              'Authorization': `Bearer ${BLOCKSCOUT_API_KEY}`,
            },
          }
        );
        const data = await response.json();
        
        // Check if wallet has received any token transfers
        verified = data.items && data.items.length > 0;
        details = { transferCount: data.items?.length || 0 };
        break;
      }

      case 'quest-2': {
        // Verify wallet received an NFT (ERC-721)
        const response = await fetch(
          `${BLOCKSCOUT_BASE}/addresses/${walletAddress}/nft`,
          {
            headers: {
              'Authorization': `Bearer ${BLOCKSCOUT_API_KEY}`,
            },
          }
        );
        const data = await response.json();
        
        verified = data.items && data.items.length > 0;
        details = { nftCount: data.items?.length || 0 };
        break;
      }

      case 'quest-3': {
        // Verify wallet interacted with Uniswap (check transactions)
        const UNISWAP_ROUTER = '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD'; // Uniswap V3 Router on Sepolia
        
        const response = await fetch(
          `${BLOCKSCOUT_BASE}/addresses/${walletAddress}/transactions`,
          {
            headers: {
              'Authorization': `Bearer ${BLOCKSCOUT_API_KEY}`,
            },
          }
        );
        const data = await response.json();
        
        // Check if any transaction interacted with Uniswap Router
        verified = data.items?.some((tx: any) => 
          tx.to?.hash?.toLowerCase() === UNISWAP_ROUTER.toLowerCase()
        ) || false;
        
        details = { transactionCount: data.items?.length || 0 };
        break;
      }

      default:
        throw new Error(`Unknown quest ID: ${questId}`);
    }

    return new Response(
      JSON.stringify({ verified, questId, walletAddress, details }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in verify-quest:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
