import { Transaction, SystemProgram, Connection, Keypair, LAMPORTS_PER_SOL, sendAndConfirmTransaction, PublicKey } from "@solana/web3.js"

// import wallet from ./dev-wallet-1.json
import wallet from "./dev-wallet-1.json"

// import keypair from ./dev-wallet-1.json
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet))

// define pubkey object to send to
const to = new PublicKey("88qcoAYGpHhyKsoLYfcM9ghNkxtAw29sQAbN4YybmqNA");

// devnet conenction
const connection = new Connection("https://api.devnet.solana.com");

// send 0.1 SOL to the pubkey from the keypair
(async () => {
    try {
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: keypair.publicKey,
                toPubkey: to,
                lamports: LAMPORTS_PER_SOL / 100
            })
        );
        const signature = await sendAndConfirmTransaction(connection, transaction, [keypair]);
        console.log(`Success! TX: ${signature}`);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();