"use client";

import { useState, useEffect } from "react";
import BlurFade from "./magicui/blur-fade";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { generateMnemonic } from "bip39";

const BLUR_FADE_DELAY = 0.7;

export function Landingpage() {
  const [toggleSecretPhase, setToggleSecretPhase] = useState<Boolean>(false);
  const [generatePhrase, setGeneratePhrase] = useState<Boolean>(true);
  const [inputValue, setInputValue] = useState<string>("");
  const [mnemonic,setMnemonic]=useState<String>("");

  useEffect(() => {
    if (inputValue.trim() === "") {
      setGeneratePhrase(true);
    } else {
      setGeneratePhrase(false);
    }
  }, [inputValue]);

  const getMnemonic=async ()=>{
    const mn=await generateMnemonic();
    setMnemonic(mn)
    console.log(mn);
  }
  return (
    <main className="flex justify-center items-center h-screen bg-black font-mono">
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          {!toggleSecretPhase && 
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
            <Button onClick={() => setToggleSecretPhase(true)}
             className="w-full sm:w-auto animate-fade-in-up bg-white text-black hover:bg-gray-300">
              Create Wallet
            </Button>
          </BlurFade>}
          {toggleSecretPhase && 
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
            <Input 
              onChange={(e) => setInputValue(e.target.value)} 
              className="bg-black w-full md:w-3/4 lg:w-5/6 text-gray-400 my-2 mx-auto"
              placeholder="Secret Phrase"
            />
            <Button onClick={getMnemonic}
             className="w-full sm:w-auto animate-fade-in-up bg-white text-black hover:bg-gray-300">
             {generatePhrase ? "Generate Wallet" : "Add Wallet"}
            </Button>
          </BlurFade>}
        </div>
      </section>
    </main>
  );
}
