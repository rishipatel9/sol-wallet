'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GetBalance } from "@/utils/GetBalance";
import { PublicKey, Connection, Transaction, SystemProgram, Keypair } from "@solana/web3.js";
import { toast } from "sonner";

type NetworkMode = "devnet" | "mainnet";

export default function Page() {
    const [networkMode, setNetworkMode] = useState<string>("devnet");
    const [amount, setAmount] = useState<string>("");
    const [maxBalance, setMaxBalance] = useState<number>(0);
    const [recipient, setRecipient] = useState<string>("");
    const [isRecipientValid, setIsRecipientValid] = useState<boolean>(true);
    const [isSending, setIsSending] = useState<boolean>(false);
    const [endpoint, setEndpoint] = useState<string>("");


    useEffect(() => {
        const fetchEndpoint = async () => {
            const response = await fetch(`/api/getSolanaEndpoint?networkMode=${networkMode}`);
            const data: { endpoint: string } = await response.json();
            setEndpoint(data.endpoint);
        };
        fetchEndpoint();
    }, [networkMode]);

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

    // Handle network mode change
    const handleNetworkModeChange = useCallback((newNetworkMode: string) => {
        setNetworkMode(newNetworkMode);
    }, []);

    // Handle max balance click
    const handleMaxClick = () => {
        setAmount(maxBalance.toString());
    };

    // Validate Solana public key
    const validatePublicKey = (key: string): boolean => {
        try {
            new PublicKey(key);
            return true;
        } catch {
            return false;
        }
    };

    // Handle recipient input change
    const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setRecipient(value);
        setIsRecipientValid(validatePublicKey(value));
    };

    // Handle amount input change
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!isNaN(Number(value)) && parseFloat(value) >= 0 && parseFloat(value) <= maxBalance) {
            setAmount(value);
        }
    };

    // Handle sending transfer
    const sendTransfer = async () => {
        if (!isRecipientValid || recipient === "" || !amount) {
            toast.error("Please enter valid recipient and amount");
            return;
        }

        try {
            setIsSending(true);
            const connection = new Connection(endpoint);
            const fromPublicKey = new PublicKey(localStorage.getItem("PublicKey") || "");
            const toPublicKey = new PublicKey(recipient);
            const privateKeyString = localStorage.getItem("PrivateKey");
            if (!privateKeyString) {
                throw new Error("Private key not found in local storage");
            }
            const fromKeypair = Keypair.fromSecretKey(new Uint8Array(JSON.parse(privateKeyString)));

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: fromPublicKey,
                    toPubkey: toPublicKey,
                    lamports: Math.round(Number(amount) * 1e9), 
                })
            );

            const signature = await connection.sendTransaction(transaction, [fromKeypair]);
            await connection.confirmTransaction(signature);

            toast.success("Transaction Successful");

            // Refresh balance
            const newBalance = await GetBalance(fromPublicKey.toString());
            setMaxBalance(newBalance / 1e9); 

            // Clear input fields
            setAmount("");
            setRecipient("");
        } catch (error) {
            console.error("Transfer failed", error);
            toast.error(`Transaction Failed: ${error instanceof Error ? error.message : String(error)}`);
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
                            onClick={sendTransfer}
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
