import { toGroths } from "@app/library/base/appUtils";
import { getApi } from "@app/utils/getApi";

async function useCheckProvidingLiquidityToPool({fromAsset, toAsset, fromAmount, toAmount}) {
    if(fromAmount.isZero || toAmount.isZero) return null;
    console.log("fromAsset, toAsset, fromAmount, toAmount",fromAsset, toAsset, +fromAmount, +toAmount);
    const dexApiMethods: any/* ShaderActions */ = getApi();
    
    try {
        const prediction = await dexApiMethods.poolAddLiquidity({
            aid1: fromAsset, 
            aid2: toAsset,
            val1: toGroths(fromAmount),
            val2: toGroths(toAmount),
            predict: true
        })
        console.log("prediction",prediction);
        return !!prediction?.res ? prediction?.res : null;
    } catch(e) {
        console.log(e);
        return null;
    }
    
}

export default useCheckProvidingLiquidityToPool;