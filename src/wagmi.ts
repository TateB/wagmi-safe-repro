import { configureChains, createConfig } from "wagmi";
import { goerli } from "wagmi/chains";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { NewSafeConnector } from "./utils/safe";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [goerli],
  [
    jsonRpcProvider({
      rpc: () => ({ http: "https://web3.ens.domains/v1/goerli" }),
    }),
  ]
);

export const config = createConfig({
  autoConnect: true,
  connectors: [
    new NewSafeConnector({ chains }),
    new MetaMaskConnector({ chains }),
  ],
  publicClient,
  webSocketPublicClient,
});
