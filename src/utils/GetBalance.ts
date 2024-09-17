import axios from "axios";
import { toast } from "sonner";

export const GetBalance = async (publicKey: string): Promise<number> => {
  try {
    const network = localStorage.getItem("networkMode");
    const res=await axios.post("/api/getBalance",{
      publicKey,network
    })
    return res.data.balance;
  } catch (e) {
    toast.error("Unable to Fetch Balance");
    return 0;
  }
};

export const GetSolanaPrice = async () => {
  try {
    const res=await axios.get(`/api/getSolPrice`);
    console.log(res);
    return res.data;
  } catch (e) {
    console.log(e)
    toast.error("Unable to Fetch Balance");
    return { price: 0, priceChange24h: 0 };
  }
};
