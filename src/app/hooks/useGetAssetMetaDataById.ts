import useGetAvailableAssetsList, { ComponentAsset } from "./useGetAvailableAssetsList";
import _ from  "lodash";

export default function useGetAssetMetaDataById({assetId}: {assetId:number}): ComponentAsset {
    const assets = useGetAvailableAssetsList();
    return _(assets).find(asset => assetId === asset.asset_id);
}