// src/app/api/getSolanaEndpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const networkMode = searchParams.get('networkMode') || 'devnet';
  
  const alchemyApiKey = process.env.ALCHEMY_API_KEY;

  if (!alchemyApiKey) {
    return NextResponse.json({ error: 'ALCHEMY_API_KEY is not set' }, { status: 500 });
  }
  
  let endpoint: string;
  switch(networkMode) {
    case 'mainnet':
      endpoint = `https://solana-mainnet.g.alchemy.com/v2/${alchemyApiKey}`;
      break;
    case 'devnet':
    default:
      endpoint = `https://solana-devnet.g.alchemy.com/v2/${alchemyApiKey}`;
  }

  return NextResponse.json({ endpoint });
}