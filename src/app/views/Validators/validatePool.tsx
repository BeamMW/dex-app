import React from "react";
import { ErrorDescription } from "@app/components/ErrorDescription";
import { useStoreAccessor } from "@app/contexts/Store/StoreAccessorContext";
import { AssetInPool, Kind } from "@app/library/dex/types";
import { validationErrorMessage } from "./validationErrorMessage";

export const validatePool = ({
    storeAccessor,
    assetA,
    assetB,
    kind,
}: {storeAccessor, assetA: AssetInPool, assetB: AssetInPool, kind: Kind}) => {
    const pool = storeAccessor.poolsStore.resolvePoolByKindAssets({assetA, assetB, kind});
    
    if (pool) {
        return (
            <ErrorDescription>
                You could not create {pool.assetA.id}/{pool.assetB.id} pool with kind: {pool.poolType}
            </ErrorDescription>
            );
    }
    
    return null;
}


export const assetsListError = validationErrorMessage(
    {text: `List is empty`}
)