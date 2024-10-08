'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNetworkMode } from "@/hooks/useNetwork";
import { GetBalance, GetSolanaPrice } from "@/utils/GetBalance";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { ArrowRightLeft, Check, Copy, DollarSign, Plus, Send, ArrowUp, ArrowDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import QRCode from "react-qr-code";

export default function Page() {
  const router = useRouter();
  const [balance, setBalance] = useState<string | null>(null);
  const [dollarAmount, setDollarAmount] = useState<string | null>(null);
  const [priceChange, setPriceChange] = useState<number | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [mnemonic, setMnemonic] = useState<string>("");
  const [networkMode, setNetworkMode] = useNetworkMode();
  const [copied, setCopied] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const storedMnemonic = localStorage.getItem("mnemonic");
    const storedPublicKey = localStorage.getItem("PublicKey");
    if (!storedPublicKey || !storedMnemonic) {
      router.push('/');
    } else {
      setPublicKey(storedPublicKey);
      setMnemonic(storedMnemonic);
      if (networkMode) {
        getBalanceAndPrice(storedPublicKey, networkMode);
      }
    }
  }, [router, networkMode]);

  const getBalanceAndPrice = useCallback(async (publicKey: string, networkMode: string) => {
    try {
      const [balance, { price, priceChange24h }] = await Promise.all([
        GetBalance(publicKey),
        GetSolanaPrice()
      ]);      
      const solBalance = (balance / LAMPORTS_PER_SOL).toFixed(2);
      const usdAmount = (parseFloat(solBalance) * price).toFixed(2);
      setBalance(solBalance);
      setDollarAmount(usdAmount);
      setPriceChange(priceChange24h);
    } catch (error) {
      console.error("Error fetching balance or price:", error);
    }
  }, []);

  useEffect(() => {
    if (publicKey && networkMode) {
      getBalanceAndPrice(publicKey, networkMode);
    }
  }, [networkMode, publicKey, getBalanceAndPrice]);

  const handleNetworkModeChange = useCallback((newNetworkMode: string) => {
    setNetworkMode(newNetworkMode);
    if (publicKey) {
      getBalanceAndPrice(publicKey, newNetworkMode);
    }
  }, [publicKey, setNetworkMode, getBalanceAndPrice]);

  const handleCopy = useCallback(() => {
    if (publicKey && textAreaRef.current) {
      textAreaRef.current.value = publicKey;
      textAreaRef.current.select();
      try {
        navigator.clipboard.writeText(publicKey).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      } catch (err) {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  }, [publicKey]);

  if (networkMode === null) {
    return <SkeletonPage />;
  }

  const handleSend = () => {
    router.push('/transfer');
  }

  return (
    <main className="flex justify-center items-center h-screen bg-black font-mono">
      <Navbar onNetworkModeChange={handleNetworkModeChange} networkMode={networkMode} />
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="md:px-6 text-white">
          <div className="mx-auto max-w-2xl space-y-4 text-center animate-fade-in">
            <div className="text-5xl font-bold tracking-tighter sm:text-5xl  md:text-6xl text-white">
              {balance !== null ? (
                `${balance} SOL`
              ) : (
                <div className="flex justify-center items-center h-12">
                  <Skeleton className="w-32 h-full bg-gray-600" />
                </div>
              )}
            </div>
            {balance !== null && dollarAmount !== null ? (
              <div className='flex justify-center items-center'>
               <div>
               ${dollarAmount}
               </div>
                <div className="flex justify-center items-center space-x-2 pl-2">
                  {priceChange !== null && (
                    priceChange >= 0 ? (
                      <ArrowUp className="text-green-500" />
                    ) : (
                      <ArrowDown className="text-red-500" />
                    )
                  )}
                  <span className={`text-sm ${priceChange!=null && priceChange >= 0 ? "bg-[#22392B] text-green-500" : "bg-[#392827] text-red-500" }  px-4 py-2 rounded-md `}>
                    {priceChange !== null ? (
                      `${priceChange.toFixed(2)}%`
                    ) : (
                      <Skeleton className="w-8 h-4 bg-gray-600" />
                    )}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-12">
                <Skeleton className="md:w-10 w-10 h-full bg-gray-600" />
              </div>
            )}

            <Drawer>
              <DrawerTrigger>
                <Button className="m-2 md:p-10 px-5 py-10 bg-[#18181B] border border-[#27272B] hover:bg-green-950">
                  <div className="flex flex-col justify-center items-center">
                    <Plus className="size-7" stroke="green" />
                    <span>Receive</span>
                  </div>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-black border border-[#27272B] h-max outline-none ">
                <DrawerHeader>
                  <DrawerTitle className="mx-auto max-w-2xl">
                    <QRCode size={256} value={publicKey || ""} viewBox={`0 0 256 256`} className="border border-[#27272B] bg-white rounded-sm my-1  p-2" />
                  </DrawerTitle>
                  <DrawerDescription>
                    <div className="my-3 text-center text-3xl font-bold tracking-tighter sm:text-2xl  md:text-3xl text-white">
                      Your Solana Address
                    </div>
                    <div className="mx-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-[#18181B] p-4 rounded-lg shadow-md">
                      <div className="flex items-center justify-between space-x-2">
                        <div className="flex-1 truncate text-sm font-medium text-white">
                          {publicKey}
                        </div>
                        <Button
                          onClick={handleCopy}
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                        >
                          {copied ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                          <span className="sr-only">Copy</span>
                        </Button>
                      </div>
                    </div>
                    <textarea
                      ref={textAreaRef}
                      aria-hidden="true"
                      className="sr-only outline-none"
                      tabIndex={-1}
                      readOnly
                    />
                  </DrawerDescription>
                  <DrawerFooter className="text-center text-base font-bold sm:text-lg md:text-xl text-white">
                    Solana Wallet
                  </DrawerFooter>
                </DrawerHeader>
                <DrawerClose />
              </DrawerContent>
            </Drawer>

            <Button className="m-2 md:p-10 px-5 py-10 bg-[#18181B] border border-[#27272B] hover:bg-green-950" onClick={handleSend}>
              <div className="flex flex-col justify-center items-center">
                <Send className="size-7" stroke="green" />
                <span>Send</span>
              </div>
            </Button>
            <Toaster richColors />
          </div>
        </div>
      </section>
    </main>
  );
}

function SkeletonPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-black font-mono">
      <div className="animate-pulse space-y-2">
        <Skeleton className="w-32 h-12 bg-gray-600" />
        <Skeleton className="w-48 h-12 bg-gray-600" />
        <Skeleton className="w-24 h-12 bg-gray-600" />
      </div>
    </div>
  );
}
