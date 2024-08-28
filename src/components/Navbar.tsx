'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Switch } from "./ui/switch";

interface NavbarProps {
    networkMode: string;
    onNetworkModeChange: (networkMode: string) => void;
}

export default function Navbar({ networkMode, onNetworkModeChange }: NavbarProps) {
    const [isMainnet, setIsMainnet] = useState<boolean>(networkMode === "mainnet");

    useEffect(() => {
        setIsMainnet(networkMode === "mainnet");
    }, [networkMode]);

    const handleSwitchChange = () => {
        const newNetworkMode = isMainnet ? "devnet" : "mainnet";
        setIsMainnet(!isMainnet);
        onNetworkModeChange(newNetworkMode);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black text-white border-b border-[#27272B]">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3 md:py-4">
                <div className="text-2xl font-bold">
                    <Link href="/wallet">Wallet</Link>
                </div>
                <div className="md:flex space-x-8">
                    <div className="flex items-center space-x-2">
                        <label htmlFor="network-mode">Devnet</label>
                        <Switch
                            id="network-mode"
                            checked={isMainnet}
                            onCheckedChange={handleSwitchChange}
                        />
                        <label htmlFor="network-mode">Mainnet</label>
                    </div>
                </div>
            </div>
        </nav>
    );
}
