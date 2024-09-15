'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GetBalance } from "@/utils/GetBalance";
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, Keypair, Connection } from "@solana/web3.js";
import { toast } from "sonner";
import bs58  from "bs58";

const connection = new Connection(`https://solana-devnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`);

export default function Page() {
    const [networkMode, setNetworkMode] = useState<string>("devnet");
    const [amount, setAmount] = useState<string>("");
    const [maxBalance, setMaxBalance] = useState<number>(0);
    const [recipient, setRecipient] = useState<string>("");
    const [isRecipientValid, setIsRecipientValid] = useState<boolean>(true);
    const [isSending, setIsSending] = useState<boolean>(false);
    
    useEffect(() => {
        const fetchBalance = async () => {
            const publicKey = localStorage.getItem("PublicKey");
            if (publicKey) {
                const balance = await GetBalance(publicKey);
                setMaxBalance(balance / 1e9);
            }
        };
        fetchBalance();
    }, [networkMode]);

    const handleNetworkModeChange = useCallback((newNetworkMode: string) => {
        setNetworkMode(newNetworkMode);
    }, []);

    const handleMaxClick = () => {
        setAmount(maxBalance.toString());
    };

    const validatePublicKey = (key: string): boolean => {
        try {
            new PublicKey(key);
            return true;
        } catch {
            return false;
        }
    };

    const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setRecipient(value);
        setIsRecipientValid(validatePublicKey(value));
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!isNaN(Number(value)) && parseFloat(value) >= 0 && parseFloat(value) <= maxBalance) {
            setAmount(value);
        }
    };
    // 5gvieTd4X5t3wbJQtDeHzv8iPJBtQbJ9waRG39asj31s
    const SendSol = async () => {
        try {
            setIsSending(true);
            const secretKeyBase58 = localStorage.PrivateKey;
            const payer = Keypair.fromSecretKey(bs58.decode(secretKeyBase58));
            const recipientPublicKey = new PublicKey(recipient);
            const lamportsToSend = parseFloat(amount) * LAMPORTS_PER_SOL;  
    
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: payer.publicKey,
                    toPubkey: recipientPublicKey,
                    lamports: lamportsToSend,
                })
            );
    
            const signature = await connection.sendTransaction(transaction, [payer]);
            console.log('Transaction sent with signature:', signature);
            toast.success(`Transaction Completed Successfully ${signature}`);
            setIsSending(false);
        } catch (e: any) {
            toast.error(e);
            setIsSending(false);
        }
    };
    

    return (
        <main className="flex justify-center items-center h-screen bg-black font-mono">
            <Navbar onNetworkModeChange={handleNetworkModeChange} networkMode={networkMode} />
            <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="md:px-6 px-4 text-white">
                    <div className="bg-[#18181B] border border-[#27272B] shadow-lg rounded-md mx-auto max-w-2xl space-y-4 text-center animate-fade-in text-3xl font-bold sm:text-4xl md:text-5xl text-white p-4">
                        <div>Send Solana</div>
                        <Input
                            type="text"
                            className={`bg-black border shadow-lg border-[#27272B] text-white py-4 ${!isRecipientValid ? 'border-red-500' : 'border-green-500'}`}
                            placeholder={`Recipient's Solana ${networkMode} Address`}
                            value={recipient}
                            onChange={handleRecipientChange}
                        />
                        {!isRecipientValid && recipient && (
                            <p className="text-red-500 text-sm">Invalid Solana address</p>
                        )}
                        <div className="flex bg-black border shadow-lg border-[#27272B] text-white">
                            <Input
                                type="text"
                                className="bg-black border shadow-lg border-[#27272B] text-white pr-16 py-4"
                                placeholder="Amount"
                                value={amount}
                                onChange={handleAmountChange}
                            />
                            <Button onClick={handleMaxClick} className="bg-white text-black hover:bg-gray-300">
                                Max
                            </Button>
                        </div>

                        <div className="text-sm text-gray-400">
                            Available Balance: {maxBalance} SOL
                        </div>
                        <Button
                            className="w-full sm:w-auto animate-fade-in-up bg-white text-black hover:bg-gray-300"
                            onClick={SendSol}
                            disabled={!isRecipientValid || recipient === "" || !amount || isSending}
                        >
                            {isSending ? "Sending..." : "Send"}
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    );
}