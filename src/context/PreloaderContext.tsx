"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type PreloaderType = "initial" | "login" | "logout" | null;

interface PreloaderContextProps {
  preloaderType: PreloaderType;
  triggerPreloader: (type: "initial" | "login" | "logout", durationMs?: number) => Promise<void>;
  hidePreloader: () => void;
}

const PreloaderContext = createContext<PreloaderContextProps | undefined>(undefined);

export function PreloaderProvider({ children }: { children: React.ReactNode }) {
  const [preloaderType, setPreloaderType] = useState<PreloaderType>("initial");

  // Clear initial visit preloader after timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setPreloaderType(null);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const triggerPreloader = (type: "initial" | "login" | "logout", durationMs = 2500) => {
    setPreloaderType(type);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setPreloaderType(null);
        resolve();
      }, durationMs);
    });
  };

  const hidePreloader = () => {
    setPreloaderType(null);
  };

  return (
    <PreloaderContext.Provider value={{ preloaderType, triggerPreloader, hidePreloader }}>
      {children}
    </PreloaderContext.Provider>
  );
}

export function usePreloader() {
  const context = useContext(PreloaderContext);
  if (!context) {
    throw new Error("usePreloader must be used within a PreloaderProvider");
  }
  return context;
}
