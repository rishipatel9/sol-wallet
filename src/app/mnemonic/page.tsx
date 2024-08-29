"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function MnemonicDisplay() {
    const [mnemonic, setMnemonic] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [networkMode, setNetworkMode] = useState<string | null>(null);

    // Handle network mode change
    const handleNetworkModeChange = useCallback((newNetworkMode: string) => {
        setNetworkMode(newNetworkMode);
    }, []);

    // Fetch mnemonic from localStorage on component mount
    useEffect(() => {
        const storedMnemonic = localStorage.getItem("mnemonic");
        if (storedMnemonic) {
            setMnemonic(storedMnemonic);
        }
    }, []);

    // Handle copy to clipboard
    const handleCopy = useCallback(() => {
        if (mnemonic) {
            navigator.clipboard.writeText(mnemonic)
                .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
                })
                .catch((err) => console.error('Failed to copy: ', err));
        }
    }, [mnemonic]);

    if (!mnemonic) {
        return <div className="text-white">Loading...</div>;
    }

    const mnemonicLines = mnemonic.split(" ");

    return (
        <main className="flex justify-center items-center h-screen bg-black font-mono">
            <Navbar onNetworkModeChange={handleNetworkModeChange} networkMode={networkMode || ""} />
            <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="md:px-6 px-4 text-white">
                    <div className="mx-auto max-w-2xl space-y-4 text-center animate-fade-in text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white m-2">
                        Mnemonic Phrase
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 bg-[#18181B] p-2 rounded-sm mx-auto max-w-2xl">
                        {mnemonicLines.map((word, index) => (
                            <div key={index} className="flex items-center p-2 bg-black rounded-md shadow-inner justify-center hover:bg-[#424247] transition-all duration-100 ">
                                <span className="text-lg">{word}</span>
                            </div>
                        ))}
                    </div>
                    <Button
                    onClick={handleCopy}
                    variant="outline"
                    className="mt-6 flex w-full  items-center justify-center  border bg-white text-black hover:bg-gray-300 mx-auto max-w-2xl"
                >
                    {copied ? (
                        <Check className="h-5 w-5 text-green-400" />
                    ) : (
                        <Copy className="h-5 w-5"  />
                    )}
                    <span className="ml-2">{copied ? "Copied!" : "Copy Mnemonic"}</span>
                </Button>
                </div>
            </section>
        </main>
    );
}
