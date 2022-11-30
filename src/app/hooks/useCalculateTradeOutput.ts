import { GROTHS_IN_BEAM } from "@app/constants";
import { toGroths } from "@app/library/base/appUtils";
import { Decimal } from "@app/library/base/Decimal";
import { getApi } from "@app/utils/getApi";


async function useCalculateTradeOutput({sendingAsset, receivingAsset, sendingAmount}) {
    
    if(sendingAmount.isZero) return null;
    console.log("sendingAsset, receivingAsset, sendingAmount",sendingAsset, receivingAsset, +sendingAmount);
    const dexApiMethods: any/* ShaderActions */ = getApi();
    
    try {
        const prediction = await dexApiMethods.poolTrade({
            aid1: sendingAsset, 
            aid2: receivingAsset,
            val1_buy: toGroths(sendingAmount),
            predict: true
        })

        return !!prediction?.res ? prediction?.res : null;
    } catch(e) {
        console.log(e);
        return null;
    }
    
}

export default useCalculateTradeOutput;