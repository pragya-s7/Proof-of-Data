"use client";

import * as React from "react";
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { Chain } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

const galileo = {
  id: 16602,
  name: "0G Galileo Testnet",
  network: "galileo",
  nativeCurrency: {
    name: "OG",
    symbol: "OG",
    decimals: 18
  },
  rpcUrls: {
    default: { http: ["https://rpc.ankr.com/0g_galileo_testnet_evm"] },
    public: { http: ["https://rpc.ankr.com/0g_galileo_testnet_evm"] },
  },
  blockExplorers: {
    default: { name: "0G Explorer", url: "https://explorer.0g.ai" },
    etherscan: { name: "0G Explorer", url: "https://explorer.0g.ai" }
  },
  testnet: true
};

const { wallets } = getDefaultWallets();

const WALLETCONNECT_PROJECT_ID = "3466d8d21eab51e02b0f74adc79def7a";

const config = getDefaultConfig({
  appName: "DeTrain",
  projectId: WALLETCONNECT_PROJECT_ID,
  wallets: [
    ...wallets,
    {
      groupName: "Other",
      wallets: [argentWallet, trustWallet, ledgerWallet],
    },
  ],
  chains: [galileo], // only allow 0G Galileo
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}