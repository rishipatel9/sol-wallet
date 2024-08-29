'use client';

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNetworkMode } from "@/hooks/useNetwork";
import { GetBalance } from "@/utils/GetBalance";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { ArrowRightLeft, Check, Copy, DollarSign, Plus, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Toaster } from "sonner";
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
	const [publicKey, setPublicKey] = useState<string | null>(null);
	const [mnemonic, setMnemonic] = useState<string>("");
	const [networkMode, setNetworkMode] = useNetworkMode();
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		const storedMnemonic = localStorage.getItem("mnemonic");
		const storedPublicKey = localStorage.getItem("PublicKey");
		if (!storedPublicKey || !storedMnemonic) {
			router.push('/');
		} else {
			setPublicKey(storedPublicKey);
			setMnemonic(storedMnemonic);
			if (networkMode) {
				getBalance(storedPublicKey, networkMode);
			}
		}
	}, [router, networkMode]);

	const getBalance = useCallback(async (publicKey: string, networkMode: string) => {
		try {
			const bal = await GetBalance(publicKey);
			setBalance((bal / LAMPORTS_PER_SOL).toFixed(2));
		} catch (error) {
			console.error("Error fetching balance:", error);
		}
	}, []);

	useEffect(() => {
		if (publicKey && networkMode) {
			getBalance(publicKey, networkMode);
		}
	}, [networkMode, publicKey, getBalance]);

	const handleNetworkModeChange = useCallback((newNetworkMode: string) => {
		setNetworkMode(newNetworkMode);
		if (publicKey) {
			getBalance(publicKey, newNetworkMode);
		}
	}, [publicKey, setNetworkMode, getBalance]);
	const handleCopy = useCallback(() => {
		if (publicKey) {
			navigator.clipboard.writeText(publicKey)
				.then(() => {
					setCopied(true);
					setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
				})
				.catch((err) => console.error('Failed to copy: ', err));
		}
	}, [publicKey]);

	if (networkMode === null) {
		return <SkeletonPage />;
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
						{balance !== null ? (
							<div>
								{parseInt(balance) * 148}$
							</div>
						) :
							<div className="flex justify-center items-center h-12">
								<Skeleton className="md:w-10 w-10 h-full bg-gray-600" />
							</div>
						}
						<Drawer>
							<DrawerTrigger>
								<Button className="m-2 md:p-10 px-5 py-10 bg-black border border-[#27272B] hover:bg-green-950">
									<div className="flex flex-col justify-center items-center">
										<Plus className="size-7" stroke="green" />
										<span>Receive</span>
									</div>
								</Button>
							</DrawerTrigger>
							<DrawerContent className="bg-black border border-[#27272B] h-max outline-none ">
								<DrawerHeader>
									<DrawerTitle className="mx-auto max-w-2xl">
										<QRCode size={256} value={publicKey || ""} viewBox={`0 0 256 256`} className="border border-[#27272B]  p-2" />
									</DrawerTitle>
									<DrawerDescription>
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

									</DrawerDescription>
								</DrawerHeader>
								<DrawerFooter>
									<DrawerClose>
										<Button variant="outline">Close</Button>
									</DrawerClose>
								</DrawerFooter>
							</DrawerContent>
						</Drawer>

						<Button className="m-2 md:p-10 px-5 py-10 bg-black border border-[#27272B] hover:bg-red-950">
							<div className="flex flex-col justify-center items-center">
								<Send className="size-7" stroke="red" />
								Send
							</div>
						</Button>
						<Button className="m-2 md:p-10 px-5 py-10 bg-black border border-[#27272B] hover:bg-yellow-950">
							<div className="flex flex-col justify-center items-center">
								<ArrowRightLeft className="size-7" stroke="yellow" />
								Swap
							</div>
						</Button>
						<Button className="m-2 md:p-10 px-5 py-10 bg-black border border-[#27272B] hover:bg-blue-950">
							<div className="flex flex-col justify-center items-center">
								<DollarSign className=" size-7" stroke="blue" />
								Buy
							</div>
						</Button>
					</div>
				</div>
			</section>
			<Toaster />
		</main>
	);
}

function SkeletonPage() {
	return (
		<main className="flex justify-center items-center h-screen bg-black font-mono">
			<Skeleton className="w-32 h-12 bg-gray-600" />
		</main>
	);
}
