import React, { createContext, useContext, useState } from "react";

type DexContextValue = {
  config: any;
};

const DexContext = createContext<DexContextValue | undefined>(undefined);

type DexProviderProps = {
    children: React.ReactNode
};

export const DexProvider: React.FC<DexProviderProps> = ({
  children,
}) => {

  const [config, setConfig] = useState();

  return (
    <DexContext.Provider value={{ config }}>
      {children}
    </DexContext.Provider>
  );
};

export const useDex = () => {
  const dexContext = useContext(DexContext);

  if (!dexContext) {
    throw new Error("You must provide a DexContext via DexProvider");
  }

  return dexContext;
};
