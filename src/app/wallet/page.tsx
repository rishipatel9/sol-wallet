'use client'
import { Button } from "@/components/ui/button";
import { GetBalance } from "@/utils/GetBalance";
import { GetTransaction } from "@/utils/GetTransaction";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Toaster } from "sonner";

export default function Page() {
	const router = useRouter();
	const [balance, setBalance] = useState<string>("0.00");
	const [publicKey, setPublicKey] = useState<string | null>(null);
	const [mnemonic, setmnemonic] = useState<string>("");

	useEffect(() => {
		const storedMnemonic = localStorage.getItem("mnemonic");
		const storedPublicKey = localStorage.getItem("PublicKey");
		if (!storedPublicKey || !storedMnemonic) {
			router.push('/');
		} else {
			setPublicKey(storedPublicKey);
			setmnemonic(storedMnemonic);
			getBalance(storedPublicKey);
		}
	}, [router]);

	const getBalance = async (publicKey: string) => {
		GetTransaction();
		try {
			const bal = await GetBalance(publicKey);
			setBalance((bal / LAMPORTS_PER_SOL).toFixed(2));
		} catch (error) {
			console.error("Error fetching balance:", error);
		}
	};
	const clearWallet = () => {
		localStorage.clear()
		router.push('/');
	}

	return (
		<main className="flex justify-center items-center h-screen bg-black font-mono">
			<section className="w-full py-12 md:py-24 lg:py-32">
				<div className="container px-4 md:px-6 text-white ">
					<div className="mx-auto max-w-2xl space-y-4 text-center animate-fade-in  ">
						<div className="text-5xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-white">
							{balance} SOL
						</div>
						<div>
						{parseInt(balance) * 158}
						</div>
						<Button className="w-full sm:w-auto animate-fade-in-up bg-white text-black hover:bg-gray-300"
							onClick={clearWallet}
						>Clear Wallet</Button>
					</div>
				</div>
			</section>
			<Toaster />
		</main>
	);
}
