# BlockPetz

## Motivation

BlockPetz is a showcase project demonstrating the capabilities of the
[Metaplex "Core"](https://developers.metaplex.com/core). It's a web application
where users can mint, feed, and burn their virtual pets, called BlockPetz. It's
a great starting point for developers interested in building NFT projects on the
Solana blockchain using the latest Metaplex spec for digital assets.

## Installation

To install and run the development environment for this project, follow these
steps:

1. Install the project dependencies:

```sh
pnpm install
```

2. Copy the `.env.example` file to a new file named `.env.local` and fill in the
   necessary environment variables.

3. Start the development server:

```sh
pnpm run dev
```

This will start the development server on `http://localhost:3000`. You can open
this URL in your web browser to view the application.

## Important Source Code

The important source code to highlight in this project is in the hooks that
handle minting, burning, and feeding:

- Minting: The `useHandleMint` hook in
  [src/hooks/use-handle-mint.ts](https://github.com/sultanpeyek/blockpetz/blob/212d23c2ccd13e13273ed01d3e42c8158ed233ca/src/hooks/use-handle-mint.ts)
  is used to handle the minting of BlockPetz.
- Fetching Assets: The `useAssetsByOwner` hook in
  [src/hooks/use-assets-by-owner.ts](https://github.com/sultanpeyek/blockpetz/blob/212d23c2ccd13e13273ed01d3e42c8158ed233ca/src/hooks/use-assets-by-owner.ts)
  is used to handle the fetching all BlockPetz that owned by a wallet.
- Burning: The `useHandleBurn` hook in
  [src/hooks/use-handle-burn.ts](https://github.com/sultanpeyek/blockpetz/blob/212d23c2ccd13e13273ed01d3e42c8158ed233ca/src/hooks/use-handle-burn.ts)
  is used to handle the burning of BlockPetz.
- Feeding: The `useHandleFeed` hook in
  [src/hooks/use-handle-feed.ts](https://github.com/sultanpeyek/blockpetz/blob/212d23c2ccd13e13273ed01d3e42c8158ed233ca/src/hooks/use-handle-feed.ts)
  is used to handle the feeding of BlockPetz. This feature is particularly
  interesting as it demonstrates how attributes of an NFT can be updated
  on-chain, opening up a whole new range of possibilities such as NFT-based
  gaming.

Each of these hooks makes use of the Metaplex "Core" capabilities.

## Formatting using Biome

```sh
pnpm dlx @biomejs/biome format ./src --write
pnpm dlx @biomejs/biome lint ./src
pnpm dlx @biomejs/biome check --apply-unsafe ./src
```
