
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

import {observer} from 'mobx-react-lite'
import { RootAccessor } from "@app/store/RootAccessor";
import createStoreAccessor from "@app/store";

const StoreAccessorContext = createContext<RootAccessor>(null);

type StoreAccessorProvider = {
    children: React.ReactNode
};

export const StoreAccessorProvider: React.FC<StoreAccessorProvider> = ({
  children,
}) => {

  const store = useRef<RootAccessor>(createStoreAccessor())
/* 
  useEffect(() => {
    store.current = createStoreAccessor()

    return () => {
      console.log();
    }
  }, []) */

  if(store.current)
    return (
      <StoreAccessorContext.Provider value={store.current}>
        {children}
      </StoreAccessorContext.Provider>
    );

  return <></>
};

export const useStoreAccessor= () => {
  const dexContext = useContext(StoreAccessorContext);

  if (!dexContext) {
    throw new Error("You must provide a StoreAccessorContext via StoreAccessorProvider");
  }

  return dexContext;
};
