import axios from "axios";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextApiResponse) {
    try {
        const body = {
          tokens: [
            {
              token: {
                chainId: "solana:101",
                resourceType: "nativeToken",
                slip44: "501",
              },
            },
          ],
        };
    
        const { data } = await axios.post(`https://api.phantom.app/price/v1`, body);
    
        const priceData = data.prices["solana:101/nativeToken:501"];
        const price = priceData.price;
        const priceChange24h = priceData.priceChange24h;
    
        return NextResponse.json({ price, priceChange24h })
    }catch(e){
        return NextResponse.json({error:e})

    }
}