import { Asset } from "@app/library/base/assets/types";
import { Decimal } from "@app/library/base/Decimal";
import { Pool } from "@app/library/dex/Pool";

function useCalculateRatioBetweenPoolAssets({pool, fromAsset, toAsset}: {pool: Pool, fromAsset:Asset, toAsset: Asset}) {
    const fromAssetTok = pool.getAssetTokFromPool(fromAsset);
    const toAssetTok = pool.getAssetTokFromPool(toAsset);
    console.log("useCalculateRatioBetweenPoolAssets", fromAssetTok.prettify(), toAssetTok.prettify());
    return fromAssetTok.div(toAssetTok);
}

export default useCalculateRatioBetweenPoolAssets;