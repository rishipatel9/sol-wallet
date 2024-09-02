'use client';

import { ConnectionProvider, useConnection, useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletDisconnectButton, WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import React from 'react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

const Page = () => {
    const { connection } = useConnection();
    const wallet = useWallet();

    const airDrop = async () => {
        console.log(wallet);
        if (!wallet.publicKey) {
            alert("Connect your wallet first");
            return;
        }
        try {
            const airdropSignature = await connection.requestAirdrop(
                new PublicKey(wallet.publicKey),
                LAMPORTS_PER_SOL // 1 SOL airdrop
            );
            await connection.confirmTransaction(airdropSignature);
            alert("Airdrop successful!");
        } catch (error) {
            console.error(error);
            alert("Airdrop failed!");
        }
    };
    return (
        <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
            <WalletProvider wallets={[]} autoConnect>
                <WalletModalProvider>
                    <div>
                        <div>{wallet.publicKey ? wallet.publicKey.toBase58() : "No wallet connected"}</div>
                        <input type="text" readOnly value={wallet.publicKey ? wallet.publicKey.toBase58() : ""} />
                        <button onClick={airDrop}>Airdrop</button>
                        <WalletMultiButton />
                        <WalletDisconnectButton />
                    </div>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default Page;
