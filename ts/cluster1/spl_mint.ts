import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import wallet from "../wba-wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection and set the commitment to confirmed (so the "await" function in line 20 will wait for the transaction to be confirmed)
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment); // connection to devnet

const token_decimals = 1_000_000n; // 6 decimals (n means bigint in typescript)

// Mint address (derived from the spl_init.ts file and its createMint function output)
const mint = new PublicKey("Dr4QQ3bASMt9RvAHaNd6Bx3kGfwWrNJZThNjDgENSwbR");

(async () => {
    try {
        // Create an ATA, with your keypair as the owner of the token account, and the mint account as the mint of the token account
        // the "mint" is simply the mint address of the token you want to mint. Each token has its own mint address.
        const ata = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);
        console.log(`Your ata is: ${ata.address.toBase58()}`);
    

        // Mint to the ATA we created for our keypair, to hold the tokens we mint, which are only associated with the mint address
        const mintTx = await mintTo(connection, keypair, mint, ata.address, keypair, 100n * token_decimals);
        console.log(`Your mint txid: ${mintTx}`);
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()