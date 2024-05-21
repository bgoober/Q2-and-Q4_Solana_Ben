import { Keypair } from "@solana/web3.js";

// Generate a new wallet keypair
let kp = Keypair.generate()

// Print the public key
console.log("You've generated a new Solana wallet: ", kp.publicKey.toBase58());

// print the private key
console.log("Your private key is: ", kp.secretKey);
