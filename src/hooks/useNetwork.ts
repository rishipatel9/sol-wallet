import { useState, useEffect } from "react";

export const useNetworkMode = () => {
  const [networkMode, setNetworkMode] = useState<string | null>(null);

  useEffect(() => {
    const storedValue = localStorage.getItem("networkMode") || "mainnet";
    setNetworkMode(storedValue);
  }, []);

  useEffect(() => {
    if (networkMode !== null) {
      localStorage.setItem("networkMode", networkMode);
    }
  }, [networkMode]);

  return [networkMode, setNetworkMode] as const;
};
