import axios from "axios";

export const GetTransaction = async () => {
  try {
    const body = {
      id: 1,
      jsonrpc: "2.0",
      method: "getBalance",
      params: ["CRvefUCa3kCJAUmQ99imDizNy2KNciEB6QAZtw4RVZp5", {"commitment":"confirmed"}],
    };
    const res = await axios.post(
      `https://solana-devnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
      body
    );
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};
