import { AMM_CID } from "@app/constants";
import { getGlobalApiProviderValue } from "@app/contexts/Dex/ApiContext";
import methods from "@app/library/dex/methods";
import ShaderApi, { ShaderStore } from "@app/library/base/api/ShaderApi";
import { delay } from "@app/library/base/appUtils";
import _ from "lodash";

export const getApi = () => {
    let dexApi;

    try {
        dexApi = !_.isEmpty(getGlobalApiProviderValue()) ? getGlobalApiProviderValue() : (() => {
            const dexShader = (ShaderApi.useShaderStore as typeof ShaderStore).retriveShader(AMM_CID)
            const dexApi = new ShaderApi(dexShader, methods);

            return dexApi.getRegisteredMethods();
        })()
    } catch (e) {
        throw new Error(e.message);        
    }


    return dexApi;
}
