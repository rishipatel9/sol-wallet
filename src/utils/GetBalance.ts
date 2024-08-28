import axios from "axios";
import { toast } from "sonner";

export const GetBalance = async (publicKey: string): Promise<number> => {

  try {
    const network=localStorage.getItem("networkMode");
    console.log(network);
    const body = {
      id: "1",
      jsonrpc: "2.0",
      method: "getBalance",
      params: [publicKey],
    };
    console.log(publicKey);
    const { data } = await axios.post(
      `https://solana-${network}.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
      body
    );
    console.log("Req sent");
    return data.result.value; 
  } catch (e) {
    toast.error("Unable to Fetch Balance");
    return 0; 
  }
};
