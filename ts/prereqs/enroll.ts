import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor";
import { IDL, WbaPrereq } from "./programs/wba_prereq";

// import wallet from ./dev-wallet-1.json
import wallet from "./wallet.json";

// import keypair from ./dev-wallet-1.json
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// define pubkey object to send to
const to = new PublicKey("88qcoAYGpHhyKsoLYfcM9ghNkxtAw29sQAbN4YybmqNA");

// devnet conenction
const connection = new Connection("https://api.devnet.solana.com");

// github username
const github = Buffer.from("bgoober", "utf8");

// create anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), {
  commitment: "confirmed",
});

// create program object
const program: Program<WbaPrereq> = new Program(IDL, provider);

// Create the PDA for our enrollment account
const enrollment_seeds = [Buffer.from("prereq"), keypair.publicKey.toBuffer()];
const [enrollment_key, _bump] = PublicKey.findProgramAddressSync(
  enrollment_seeds,
  program.programId
);

// Execute our enrollment transaction
(async () => {
  try {
    const txhash = await program.methods
      .complete(github)
      .accounts({
        signer: keypair.publicKey,
      })
      .signers([keypair])
      .rpc();
    console.log(`Success! Check out your TX here:
    https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
