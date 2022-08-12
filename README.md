# C-Wallet

- [Description](#description)
- [C-ETH Network](#C-ETH-Network)
- [Quickstart](#quick-start)
- [Advanced Usage](#advanced-usage)
- [License](#license)

## Description

This repo contains an experimental C-Wallet, allowing to use NFT on a C-ETH network.

It works by creating a wallet address to an C-ETH network (or importing existing address), and then running C-ETH clients locally.

Because it's in early stages, If used in a production environment, it should be tested well in advance.　　

## C-ETH Network
See [contenteth.net](https://contenteth.net/)

## Quick Start

### Executables (Only Windows, Android)
Binary archives are published at https://github.com/content-ethereum/c-wallet/releases.

### How to start C-Wallet in the local environment

You'll need:  
- Node v16.15.0 or higher.  

1. `git clone https://github.com/content-ethereum/c-wallet.git`
2. `cd c-wallet/`
3. `npm install`
4. config your environment. (See [Environment Variables](#environment-variables).)
5. `npm run start`
6. Open your browser on `http://localhost:4200/`

## Advanced Usage

### Environment Variables.

You can customize the behavior of C-Wallet using `src\environments\environment.ts`.

- `providerUrl` - A string specifying the URL on which the websocket provider listens.<br>
  For example - `wss://example.c-eth-node.net/ws`
- `ipfsUrl` - A string specifying the URL on which the ipfs-gateway server listens.<br>
  For example - `https://exmaple.ipfs-gw.net/ipfs/`

#### How Does "providerUrl" Work?
C-Wallet connects to a defined provider and execute RPC.
If you specify a Mainnet provider, C-Wallet will connect to Mainnet; if you specify a Testnet provider, C-Wallet will connect to Testnet.

#### How Does "ipfsUrl" Work?
C-Wallet can display images, as defined in a Content-NFT specifications (`mediaId` of DigitalContentSpec). C-Wallet will attempt to retrieve the image file against the IPFS gateway defined here.

### Smart contracts supported by C-Wallet.
C-Wallet supports the following committed or later versions of [Content-NFT](https://github.com/content-ethereum/Content-NFT/).<br>
commit: [a287be6838eb1aa17ab77038842e6e463dc9577c](https://github.com/content-ethereum/Content-NFT/tree/a287be6838eb1aa17ab77038842e6e463dc9577c)

### Specification of [DigitalContentSpec](https://github.com/content-ethereum/Content-NFT/#DigitalContentSpec) supported by C-Wallet.
In order for Content-NFT information to be displayed on C-Wallet, `mediaId` and `info` must be set to the following settings.

| Name                                                    | Description                                                                                                                                   |
| :------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------- |
| mediaId | A content identifier, also known as a CID, is a unique value used to identify files stored on the IPFS network.<br>For example - `'QmWgSQHsUjAmViSPFZcEAUBZsGvtU1mGdNgLF9QqpvkvNH'` |
| info | Simple string or JSON string. (Does not support JSON in nested structures.).<br>For example - `'This is info'` `'{"key1":"value1","key2":"value2"}'`|

## License

C-Wallet is released under the MIT License.
