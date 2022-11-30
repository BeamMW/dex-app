import _ from "lodash";

export const getAssetTokFromPool = ({pool, assetId}) => {
    const prefixAssetKey = "aid";

    const assetNumber = _.findKey(pool, (value, key) => {
        if(key.includes(prefixAssetKey) && value == assetId)
            return key;
    });

    //1 or 2
    const numberInPool = assetNumber.split(prefixAssetKey).pop();

    return pool["tok" + numberInPool]
}
