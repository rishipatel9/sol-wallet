'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
	const router=useRouter();
	useEffect(() => {
		 if(!localStorage.getItem("mnemonic")) router.push('/')
	}, []);
	return (
		<div></div>
	);
}
