import React from 'react';
import { useStoreAccessor } from '@app/contexts/Store/StoreAccessorContext';
import useGetAvailableAssetsList from './useGetAvailableAssetsList';
  


function useFilterSuitableAssets({choosenAsset}) {
    const storeAccessor = useStoreAccessor();
    const assets = useGetAvailableAssetsList();

    const receiverAssets = storeAccessor.poolsStore.uniquePoolsPairs.get(choosenAsset)

    return assets.filter(asset => receiverAssets.includes(asset.id))
}

export default useFilterSuitableAssets;