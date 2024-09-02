'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GetBalance } from "@/utils/GetBalance";
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { toast } from "sonner";
import {
    ConnectionProvider,
    useConnection,
    useWallet,
    WalletProvider
} from '@solana/wallet-adapter-react';

export default function Page() {
    const [networkMode, setNetworkMode] = useState<string>("devnet");
    const [amount, setAmount] = useState<string>("");
    const [maxBalance, setMaxBalance] = useState<number>(0);
    const [recipient, setRecipient] = useState<string>("");
    const [isRecipientValid, setIsRecipientValid] = useState<boolean>(true);
    const [isSending, setIsSending] = useState<boolean>(false);

    const wallet = useWallet();
    const { connection } = useConnection();

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

    const SendTokens = async () => {
        setIsSending(true);
        try {
            // Retrieve the publicKey from localStorage
            const storedPublicKey = localStorage.getItem("PublicKey");
            console.log(storedPublicKey);


            if (!storedPublicKey) {
                throw new Error("Public key not found in local storage");
            }

            if (!validatePublicKey(storedPublicKey)) {
                throw new Error("Invalid public key stored in local storage");
            }

            if (!wallet.publicKey) {
                throw new Error("Wallet not connected");
            }

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: new PublicKey(storedPublicKey), // Use the stored public key
                    toPubkey: new PublicKey(recipient),
                    lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
                })
            );

            await wallet.sendTransaction(transaction, connection);
            toast.success("Sent Successfully");
        } catch (e: any) {
            console.log(e);
            toast.error(e.message || "An error occurred");
        } finally {
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
                            onClick={SendTokens}
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
