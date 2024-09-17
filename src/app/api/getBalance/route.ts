import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const { publicKey ,network} = await req.json(); 
    const body = {
      id: '1',
      jsonrpc: '2.0',
      method: 'getBalance',
      params: [publicKey],
    };

    const { data } = await axios.post(
      `https://solana-${network}.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
      body
    );
    return NextResponse.json({"balance":data.result.value});
  } catch (e: any) {
    console.error('Error:', e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
