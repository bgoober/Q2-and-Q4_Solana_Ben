import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image = 'https://pdgbdew2s32ym2oufndtcwbhdkvokttfrk4fq75fju77wtik62ma.arweave.net/eMwRktqW9YZp1CtHMVgnGqrlTmWKuFh_pU0_-00K9pg'
        const metadata = {
            name: "blueboi",
            symbol: "BB",
            description: "it's blue",
            image: "https://pdgbdew2s32ym2oufndtcwbhdkvokttfrk4fq75fju77wtik62ma.arweave.net/eMwRktqW9YZp1CtHMVgnGqrlTmWKuFh_pU0_-00K9pg",
            attributes: [
                {trait_type: 'basethread', value: 'blue'},
                {trait_type: 'offthread', value: 'green'},
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: "https://pdgbdew2s32ym2oufndtcwbhdkvokttfrk4fq75fju77wtik62ma.arweave.net/eMwRktqW9YZp1CtHMVgnGqrlTmWKuFh_pU0_-00K9pg"
                    },
                ]
            },
            creators: [keypair.publicKey]
        };
        const myUri = await umi.uploader.uploadJson(metadata);
        console.log("Your metadata URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();