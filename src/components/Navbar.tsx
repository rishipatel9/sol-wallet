'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Switch } from "./ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { AlignJustify, EyeOff, GithubIcon, HomeIcon, Plus, Settings, Trash2, TwitterIcon, User } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface NavbarProps {
    networkMode: string;
    onNetworkModeChange: (networkMode: string) => void;
}

export default function Navbar({ networkMode, onNetworkModeChange }: NavbarProps) {
    const [isMainnet, setIsMainnet] = useState<boolean>(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const storedNetworkMode = localStorage.getItem("networkMode");
        setIsMainnet(storedNetworkMode === "mainnet");
    }, []);

    useEffect(() => {
        setIsMainnet(networkMode === "mainnet");
    }, [networkMode]);

    const handleSwitchChange = () => {
        const newNetworkMode = isMainnet ? "devnet" : "mainnet";
        setIsMainnet(!isMainnet);
        localStorage.setItem("networkMode", newNetworkMode);
        onNetworkModeChange(newNetworkMode);
    };

    const clearWallet = () => {
        localStorage.clear();
        router.push('/');
        setIsAlertOpen(false);
    }

    const secretPhrase=()=>{
        router.push('/mnemonic')
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black text-white border-b border-[#27272B]">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3 md:py-4">
                <div className="text-2xl font-bold">
                    <Link href="/wallet">Wallet</Link>
                </div>
                <div className="md:flex space-x-8">
                    <div className="flex items-center space-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <AlignJustify  className="cursor-pointer">Open</AlignJustify>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 mt-4 bg-transparent backdrop-blur-md text-white border-[#27272B]">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-[#27272B]" />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={()=>router.push('/wallet')}>
                                        <HomeIcon className="mr-2 h-4 w-4" />
                                        <span>Home</span>
                                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Plus className="mr-2 h-4 w-4" />
                                        <span>Add Wallet</span>
                                        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={secretPhrase}>
                                        <EyeOff  className="mr-2 h-4 w-4" />
                                        <span>Secret Phrase</span>
                                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator className="bg-[#27272B]" />
                                <DropdownMenuLabel>Network Mode</DropdownMenuLabel>
                                <DropdownMenuItem>
                                    <span>Devnet</span>
                                    <Switch
                                        id="network-mode"
                                        checked={isMainnet}
                                        onCheckedChange={handleSwitchChange}
                                        className="mx-2 bg-white"
                                    />
                                    <span>Mainnet</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-[#27272B]" />
                                <DropdownMenuLabel>Connect</DropdownMenuLabel>
                                <DropdownMenuItem>
                                    <GithubIcon className="mr-2 h-4 w-4" />
                                    <a href="https://github.com/rishipatel9/sol-wallet" target="_main">GitHub</a>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <TwitterIcon className="mr-2 h-4 w-4" />
                                    <a href="https://x.com/Rishi99876" target="_main">X</a>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-[#27272B]" />
                                <DropdownMenuItem className="bg-red-500" onSelect={(event) => {
                                    event.preventDefault();
                                    setIsAlertOpen(true);
                                }}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Delete Wallet</span>
                                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent className="bg-black border-[#27272B] text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="text-black" onClick={() => setIsAlertOpen(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-700 hover:bg-red-600"  onClick={clearWallet}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </nav>
    );
}