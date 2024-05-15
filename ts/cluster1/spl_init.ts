import { Keypair, Connection, Commitment } from "@solana/web3.js";
import { createMint } from '@solana/spl-token';
import wallet from "../wba-wallet.json" // import wallet from file
import { connect } from "http2";

// Import our keypair from the wallet
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet)); 

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

(async () => {
    try {
        // Start here
        // create mint authority with our wallet keypair. Our wallet is also the authority of the mint
        const mint = await createMint(connection, keypair, keypair.publicKey, null, 6);
        // log to base 58
        console.log(`Your mint address is: ${mint.toBase58()}`);


    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()