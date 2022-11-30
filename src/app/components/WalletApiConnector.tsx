import React, { useEffect, useReducer, useState, useCallback, useMemo, useContext } from "react";
import Utils from '../library/base/utils';
import UtilsShader from '../library/base/shader/utilsShader';
import ShaderApi, { ShaderStore } from "@library/base/api/ShaderApi";
import methods from "@library/dex/methods";
import { WalletApiConnectorProvider } from "@app/library/wallet-react/context/WalletApiConnector/WalletApiConnectorProvider";
import { AMM_CID } from "@app/constants";
import { Loader } from './BeamLoader';
import Window from "./Window";
import _ from "lodash";
import { observer } from "mobx-react-lite";

import { useStoreAccessor } from "@app/contexts/Store/StoreAccessorContext";
import { runInAction } from "mobx";
import { RootAccessor } from "@app/store/RootAccessor";


const shadersData = Array.from([
  ["amm", AMM_CID, "./amm.wasm", 0],
], params => new UtilsShader(...params));

const walletEventhandler = ({ walletEventPayload, storeAccessor } : {walletEventPayload: any, storeAccessor: RootAccessor}) => {
  if (walletEventPayload) {
    try {
      switch (walletEventPayload.id) {
        case 'ev_system_state':
            runInAction(() => storeAccessor.sharedStore.setSystemState(walletEventPayload.result))
          break;

        case 'ev_txs_changed':
            console.log("ev_txs_changed", walletEventPayload.result);
          _.isObject(walletEventPayload.result) &&
            walletEventPayload.result &&
            runInAction(() => storeAccessor.transactionsStore.udpateTransactions(walletEventPayload.result))

          break;

        case 'ev_assets_changed':
          console.log("ev_assets_changed", walletEventPayload.result);
          break;

        default:
          break;
      }
    } catch (e) {
      console.log("Error has been thrown:", e);
    }
  }
}

export const WalletApiConnector: React.FC<{children}> = observer(({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    
  const storeAccessor = useStoreAccessor();

  /**
   * Duplicate ShaderStore logic! In the future have to  resolve to keep one of shaders 'stores'
   */
  const [walletShaders, setWalletShaders] = useState<Array<UtilsShader>>(null);

  const isLoaded = storeAccessor.sharedStore.isLoaded;

  useEffect(() => {
    if (!isAuthorized) {
      try {
        Utils.initialize({
          "appname": "BEAM DEX APP",
          "min_api_version": "7.0",
          "headless": false,
          "apiResultHandler": (error, result, full) => {
            //console.log('api result data: ', full);
            result && walletEventhandler({ walletEventPayload: full, storeAccessor });
          }
        }, (err) => {
          Utils.bulkShaderDownload(shadersData, (err, shadersData: Array<UtilsShader>) => {
            console.log("shadersData", shadersData);
            err ? (() => { throw new err })() : setIsAuthorized(true);

            const apiShaderRegester: ShaderStore = ShaderApi.useShaderStore;

            /**
             * Put shadersData in ShaderStore
             */
            shadersData.forEach(
              (shaderData) => (apiShaderRegester as typeof ShaderStore).addShaderToStore(shaderData)
            );

            /**
             * Duplicate put shaders data in wallet provider
             */
            setWalletShaders(shadersData);

            //Initialize stores initasync methods after shader bytes has loaded
            (async () => await storeAccessor.initStoresShaderAsync())();

            //we load rate from manager view params method
            /* if (rate.isZero) {
              dispatch(loadRate.request());
            } */

            if (storeAccessor.rateStore.isZero) {
                runInAction(() => storeAccessor.rateStore.startLoadRateInterval())
            }

            if (!storeAccessor.assetsStore.assetsList.length) {
              runInAction(() => storeAccessor.assetsStore.loadAssetsList())
          }

            Utils.callApi("ev_subunsub", {
              /* "ev_sync_progress": true, */
              "ev_system_state": true,
              "ev_txs_changed": true,
              "ev_assets_changed": true,

            },
              (error, result, full) => {
                if (result) {
                    console.log("loadAppParams");
                    runInAction(()=>storeAccessor.sharedStore.loadAppParams());
                }
              }
            );

            Utils.callApi("get_version", false,
              (error, result, full) => {
                if (error) {
                  throw new Error("version could't fetch!");
                }

                if (result) {
                    runInAction(() => storeAccessor.sharedStore.setDappVersion(result));
                }
              }
            );
          });
          
        });
      } catch (e) {
        console.log("Error has been thrown:", e);
      }
    }
  }, [isAuthorized, isLoaded]/* do not use [] cause halt infinite loop */);

  return <WalletApiConnectorProvider
    isLoaded={isLoaded}
    loader={<Window><Loader /></Window>}
    isAuthorized={isAuthorized}
    connectorWalletShaders={walletShaders}>{children}</WalletApiConnectorProvider>;
});
