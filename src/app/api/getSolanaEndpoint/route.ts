
export default function handler(req:any, res:any) {
    const networkMode = req.query.networkMode || 'devnet';
    const alchemyApiKey = process.env.ALCHEMY_API_KEY;
    
    let endpoint;
    switch(networkMode) {
      case 'mainnet':
        endpoint = `https://solana-mainnet.g.alchemy.com/v2/${alchemyApiKey}`;
        break;
      case 'devnet':
      default:
        endpoint = `https://solana-devnet.g.alchemy.com/v2/${alchemyApiKey}`;
    }
  
    res.status(200).json({ endpoint });
  }