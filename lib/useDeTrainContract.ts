"use client";
import { useMemo } from "react";
import { Contract, BrowserProvider } from "ethers";
import DataTrainingABI from "../abis/DataTraining.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DETRAIN_CONTRACT_ADDRESS || "0xbd10d0eC2B534A1d1E5A5228b7B3909C92af902f";

export function useDeTrainContract() {
  return useMemo(() => {
    if (typeof window === "undefined" || !(window as any).ethereum) {
      // Return a minimal object that works with wagmi even before wallet connection
      return {
        address: CONTRACT_ADDRESS,
        abi: DataTrainingABI.abi || DataTrainingABI,
        read: null,
      };
    }
    try {
      const provider = new BrowserProvider((window as any).ethereum);
      const contract = new Contract(
        CONTRACT_ADDRESS,
        DataTrainingABI.abi || DataTrainingABI,
        provider
      );
      // Return object with both wagmi-compatible properties and ethers contract
      return {
        address: CONTRACT_ADDRESS,
        abi: DataTrainingABI.abi || DataTrainingABI,
        read: contract,
      };
    } catch {
      return {
        address: CONTRACT_ADDRESS,
        abi: DataTrainingABI.abi || DataTrainingABI,
        read: null,
      };
    }
  }, []);
}
