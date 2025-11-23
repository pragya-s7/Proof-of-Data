"use client";
import { useWalletClient } from "wagmi";
import { useMemo } from "react";
import { Contract } from "ethers";
import DeTrainMarketplaceABI from "../abis/DeTrainMarketplace.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DETRAIN_CONTRACT_ADDRESS || "0x34979fE1D92054AA28c7a8a7748C3177752E0c81";

export function useDeTrainContract() {
  const { data: walletClient } = useWalletClient();
  return useMemo(() => {
    if (!walletClient) return null;
    // For ethers v6, wagmi walletClient should be compatible as a signer
    return new Contract(
      CONTRACT_ADDRESS,
      DeTrainMarketplaceABI.abi || DeTrainMarketplaceABI,
      walletClient as any
    );
  }, [walletClient]);
}
