
import { useState, useEffect } from "react";

export const useNetworkMode = () => {
  const [networkMode, setNetworkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedValue = localStorage.getItem("networkMode");
      return storedValue ? storedValue : "mainnet"; 
    }
    return "mainnet";
  });

  useEffect(() => {
    localStorage.setItem("networkMode", networkMode);
  }, [networkMode]);

  return [networkMode, setNetworkMode] as const;
};
