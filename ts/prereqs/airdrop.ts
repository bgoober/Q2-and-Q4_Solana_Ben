import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js"

import wallet from "./dev-wallet-1.json"

// Get the keypair from the wallet
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet))

// Get the public key of the wallet
const pubkey  = keypair.publicKey.toBase58()

// Print the public key
console.log("Your public key is: ", pubkey)

// Create a connection to the cluster
const connection = new Connection("https://api.devnet.solana.com");

(async () => {
    try {
    // We're going to claim 2 devnet SOL tokens
    const txhash = await
    connection.requestAirdrop(keypair.publicKey, 2 * LAMPORTS_PER_SOL);
    console.log(`Success! Check out your TX here:
    https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch(e) {
    console.error(`Oops, something went wrong: ${e}`)
    }
    })();