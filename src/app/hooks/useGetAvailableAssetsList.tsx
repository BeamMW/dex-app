import React, { Suspense, useEffect, useRef, useState } from 'react';
import { BeamIcon, BeamxIcon, EthIcon, NephriteIcon, SeperatorIcon } from '@app/assets/icons';
import styled from 'styled-components';
import { useStoreAccessor } from '@app/contexts/Store/StoreAccessorContext';
import { toJS } from 'mobx';
import _ from "lodash";
import SuspenseImage from '@app/components/SuspenseImage';
import { AssetsRegistry } from '@app/library/base/assets/AssetsRegistry';
import { Asset } from '@app/library/base/assets/types';
import useGetAllAssetsList from './useGetAllAssetsList';



function useGetAvailableAssetsList(): Asset[] {
  //const isIconsLoaded = useRef<boolean>(false);
  const [processedAssets, setProcessedAssets] = useState<Asset[]>(
    useGetAllAssetsList()
  );

  /* useEffect(() => {
    let loadedAssets: ComponentAsset[] = _(assets).value();

    (async () => {
      try {
        if (!isIconsLoaded.current) {
          for(const [i, asset] of loadedAssets.entries()) {
            loadedAssets[i].icon = <SuspenseImage src={`../library/base/assets/${asset.icon}`} />;
          }
        }
        isIconsLoaded.current = true;
        setProcessedAssets(loadedAssets);
      } catch(e) {
        console.log(e)
      }
      
    })();

    return () => {
      isIconsLoaded.current = false;
      loadedAssets = null;
    }
  }, []); */

  const storeAccessor = useStoreAccessor();

  const availableStoreAssets = storeAccessor.poolsStore.poolsAssetsIds
  return processedAssets.filter(asset => availableStoreAssets.includes(asset.id));
}


export default useGetAvailableAssetsList;