import { Keypair } from "@solana/web3.js";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { toast } from "sonner";
import nacl from "tweetnacl";
import bs58 from "bs58";

interface wallet {
  PrivateKey: string;
  PublicKey: string;
  mnemonic: string;
  path: string;
}

export const GenerateKey = async () => {
  try {
    const mn = await generateMnemonic();
    console.log(mn);
    const seedBuffer = mnemonicToSeedSync(mn);
    const path = `m/44'/501'/0'/0'`;
    const { key: derivedSeed } = derivePath(path, seedBuffer.toString("hex"));
    let publicKeyEncoded: string;
    let privateKeyEncoded: string;
    const { secretKey } = nacl.sign.keyPair.fromSeed(derivedSeed);
    const keypair = Keypair.fromSecretKey(secretKey);
    privateKeyEncoded = bs58.encode(secretKey);
    publicKeyEncoded = keypair.publicKey.toBase58();
    localStorage.setItem("mnemonic", mn);
    localStorage.setItem("PublicKey", publicKeyEncoded);
    localStorage.setItem("PrivateKey", privateKeyEncoded);
    
  } catch (e) {
    toast.error("Failed to generate wallet. Please try again.");
  }
};
