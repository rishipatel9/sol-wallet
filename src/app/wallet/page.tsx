'use client';

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useNetworkMode } from "@/hooks/useNetwork";
import { GetBalance } from "@/utils/GetBalance";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Toaster } from "sonner";

export default function Page() {
  const router = useRouter();
  const [balance, setBalance] = useState<string>("0.00");
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [mnemonic, setMnemonic] = useState<string>("");
  const [networkMode, setNetworkMode] = useNetworkMode();

  useEffect(() => {
    const storedMnemonic = localStorage.getItem("mnemonic");
    const storedPublicKey = localStorage.getItem("PublicKey");
    if (!storedPublicKey || !storedMnemonic) {
      router.push('/');
    } else {
      setPublicKey(storedPublicKey);
      setMnemonic(storedMnemonic);
      getBalance(storedPublicKey, networkMode);
    }
  }, [router]);

  const getBalance = useCallback(async (publicKey: string, networkMode: string) => {
    try {
      const bal = await GetBalance(publicKey);
      setBalance((bal / LAMPORTS_PER_SOL).toFixed(2));
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  }, []);

  useEffect(() => {
    if (publicKey) {
      getBalance(publicKey, networkMode);
    }
  }, [networkMode, publicKey, getBalance]);

  const handleNetworkModeChange = (newNetworkMode: string) => {
    setNetworkMode(newNetworkMode);
    if (publicKey) {
      getBalance(publicKey, newNetworkMode);
    }
  };

  const clearWallet = () => {
    localStorage.clear();
    router.push('/');
  };

  return (
    <main className="flex justify-center items-center h-screen bg-black font-mono">
      <Navbar onNetworkModeChange={handleNetworkModeChange} />
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 text-white">
          <div className="mx-auto max-w-2xl space-y-4 text-center animate-fade-in">
            <div className="text-5xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-white">
              {balance} SOL
            </div>
            <div>
              {parseFloat(balance) * 148}
            </div>
            <Button
              className="w-full sm:w-auto animate-fade-in-up bg-white text-black hover:bg-gray-300"
              onClick={clearWallet}
            >
              Clear Wallet
            </Button>
          </div>
        </div>
      </section>
      <Toaster />
    </main>
  );
}
