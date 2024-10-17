import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { create, createV1 } from '@metaplex-foundation/mpl-core'

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCore } from '@metaplex-foundation/mpl-core'

import wallet from "../../Turbin3-wallet.json"

// const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi('http://127.0.0.1:8899').use(mplCore())

const assetAddress = generateSigner(umi)

const result = createV1(umi, {
  asset: assetAddress,
  name: 'BLUEBOI',
  uri: 'https://example.com/my-nft',
}).sendAndConfirm(umi)