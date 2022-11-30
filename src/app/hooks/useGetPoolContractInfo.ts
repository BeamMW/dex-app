import { getApi } from "@app/utils/getApi";

async function useGetPoolContractInfo({sendingAsset, receivingAsset}) {
    const dexApiMethods: any/* ShaderActions */ = getApi();
    
    try {
        const pool = await dexApiMethods.poolView({
            aid1: sendingAsset, 
            aid2: receivingAsset,
        })

        return !!pool?.res ? pool.res : null;
    } catch(e) {
        console.log(e);
        return null;
    }
}

export default useGetPoolContractInfo;