"use client";
import { useMemo } from "react";
import { Contract, BrowserProvider } from "ethers";
import DataTrainingABI from "../abis/DataTraining.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DETRAIN_CONTRACT_ADDRESS || "0xbd10d0eC2B534A1d1E5A5228b7B3909C92af902f";

export function useDeTrainContract() {
  return useMemo(() => {
    if (typeof window === "undefined" || !(window as any).ethereum) return null;
    try {
      const provider = new BrowserProvider((window as any).ethereum);
      // WARNING: getSigner() is asynchronous in ethers v6, so we can't return a contract-with-signer synchronously.
      // Instead, we return the provider-attached contract for reads; writes must call .connect(signer).
      return new Contract(
        CONTRACT_ADDRESS,
        DataTrainingABI.abi || DataTrainingABI,
        provider
      );
    } catch {
      return null;
    }
  }, []);
}
