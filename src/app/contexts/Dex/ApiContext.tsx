import methods from "@app/library/dex/methods";
import ShaderApi from "@app/library/base/api/ShaderApi";
import { useWalletApiConnector } from "@app/library/wallet-react/context/WalletApiConnector/WalletApiConnectorContext";
import React, { useState, useCallback, useEffect, useRef, createContext, useContext } from "react";
import cloneDeep from 'lodash/cloneDeep';
import { AMM_CID } from "@app/constants";

let globalApiProviderValue: any/* ShaderActions */ = null;
export const getGlobalApiProviderValue = () => globalApiProviderValue;

type ApiContextType = {
  registeredMethods/* IRegisteredMethods<ShaderActions> */
};

export const ApiContext = createContext<ApiContextType | null>(null);

export const useApi = (): ApiContextType => {
  const context: ApiContextType | null = useContext(ApiContext);

  if (context === null) {
    throw new Error("You must add a <ApiContext> into the React tree");
  }

  return context;
};


export const ApiProvider: React.FC<{children: React.ReactNode}> = props => {
  const { children } = props;
  
  const [registeredMethods, setRegisteredMethods] = useState(null);
  const {walletShaders} = useWalletApiConnector();

  useEffect(() => {
    const shaders = walletShaders.filter((shader) => shader.cid === AMM_CID).pop();
    const api = new ShaderApi(shaders, methods);

    setRegisteredMethods(api.getRegisteredMethods());

    //for direct access outside of ApiProvider throught getGlobalApiProviderValue function
    globalApiProviderValue = cloneDeep(registeredMethods);
    
  }, [walletShaders]);

  const provider = {
    registeredMethods
  };
  return <ApiContext.Provider value={provider}>{children}</ApiContext.Provider>;
};
