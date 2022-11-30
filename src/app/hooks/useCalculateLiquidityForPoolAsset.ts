import { Decimal } from "@app/library/base/Decimal";
import useCalculateRatioBetweenPoolAssets from "./useCalculateRatioBetweenPoolAssets";

function useCalculateLiquidityForPoolAsset({pool, fromAsset, toAsset, fromAmount}): Decimal {
    try {
        if(fromAmount.isZero) return null;

        const ratio = useCalculateRatioBetweenPoolAssets({pool, fromAsset, toAsset})
        
        console.log("ratio", ratio, ratio.prettify());

        return fromAmount.mul(ratio);
    } catch(e) {
        console.log(e);
        return null;
    }
    
}

export default useCalculateLiquidityForPoolAsset;