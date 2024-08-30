"use client";


import { useState, useEffect } from "react";
import BlurFade from "./magicui/blur-fade";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { validateMnemonic } from "bip39";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { GenerateKey } from "@/utils/GenerateKey";

const BLUR_FADE_DELAY = 0.7;

export function Landingpage() {
  const [toggleSecretPhase, setToggleSecretPhase] = useState<Boolean>(false);
  const [generatePhrase, setGeneratePhrase] = useState<Boolean>(true);
  const [inputValue, setInputValue] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router=useRouter();

  useEffect(() => {
    if (inputValue.trim() === "") {
      setGeneratePhrase(true);
      localStorage.setItem("theme","dark");
    } else {
      setGeneratePhrase(false);
    }
    if(localStorage.getItem("mnemonic")) router.push('/wallet')
  }, [inputValue]);

  const getMnemonic = async () => {
    if (!generatePhrase) {
      let mnemonic = inputValue.trim();
      if (mnemonic && validateMnemonic(mnemonic)) {
        toast.success("Right mnemonic");
        localStorage.setItem("mnemonic",mnemonic);
      } else {
        toast.error("Wrong mnemonic");
      }
    } else {
      GenerateKey();
      router.push('/wallet')
    }
  };

  return (
    <main className="flex justify-center items-center h-screen bg-black font-mono">
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          {!toggleSecretPhase && (
            <BlurFade
              delay={BLUR_FADE_DELAY}
              className="mx-auto max-w-2xl space-y-4 text-center animate-fade-in"
            >
              <BlurFade className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Create a Solana Wallet
              </BlurFade>
              <BlurFade className="text-gray-400 md:text-xl/relaxed">
                Unlock the power of the Solana blockchain by creating your own
                secure wallet. Manage your digital assets, participate in
                decentralized applications, and explore the thriving Solana
                ecosystem with ease.
              </BlurFade>
              <Button
                onClick={() => setToggleSecretPhase(true)}
                className="w-full sm:w-auto animate-fade-in-up bg-white text-black hover:bg-gray-300"
              >
                Create Wallet
              </Button>
            </BlurFade>
          )}
          {toggleSecretPhase && (
            <BlurFade
              delay={BLUR_FADE_DELAY}
              className="mx-auto max-w-2xl space-y-4 text-center animate-fade-in"
            >
              <BlurFade className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Secret Recovery Phrase
              </BlurFade>
              <BlurFade className="text-gray-400 md:text-xl/relaxed">
                Paste your secret phrase if you have one or leave it empty.
              </BlurFade>
              <div className="relative w-full md:w-3/4 lg:w-5/6 mx-auto my-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="bg-black w-full text-[rgb(161,161,169)]"
                  placeholder="Secret Phrase"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-4 py-2 text-sm  text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <Button
                onClick={getMnemonic}
                className="w-full sm:w-auto animate-fade-in-up bg-white text-black hover:bg-gray-300 font-mono"
              >
                {generatePhrase ? "Generate Wallet" : "Add Wallet"}
              </Button>
            </BlurFade>
          )}
        </div>
      </section>
      <Toaster />
    </main>
  );
}
