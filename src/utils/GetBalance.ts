import axios from "axios";
import { toast } from "sonner";

export const GetBalance = async (publicKey: string): Promise<number> => {
  try {
    const network = localStorage.getItem("networkMode");
    const body = {
      id: "1",
      jsonrpc: "2.0",
      method: "getBalance",
      params: [publicKey],
    };
    const { data } = await axios.post(
      `https://solana-${network}.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
      body
    );
    return data.result.value;
  } catch (e) {
    toast.error("Unable to Fetch Balance");
    return 0;
  }
};

export const GetSolanaPrice = async () => {
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

    return { price, priceChange24h };

  } catch (e) {
    toast.error("Unable to Fetch Balance");
    return { price: 0, priceChange24h: 0 };
  }
};
