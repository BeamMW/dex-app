import React from "react";
import { useTransactionFunction } from "@app/library/transaction-react/useTransactionFunction";
import { Button } from 'theme-ui';
import { toGroths } from "@app/library/base/appUtils";
import { useApi } from "@app/contexts/Dex/ApiContext";
import { Kind } from "@app/library/dex/types";
import { Decimal } from "@app/library/base/Decimal";
import { Asset } from "@app/library/base/assets/types";


export const CreatePoolAction: React.FC<{
    children: React.ReactNode,
    transactionId: string,
    assetA: Asset,
    assetB: Asset,
    /* amountAssetA: Decimal
    amountAssetB: Decimal */
    poolType: Kind,
    disabled: boolean,
}> = ({
    children,
    transactionId,
    assetA,
    assetB,
    /* amountAssetA,
    amountAssetB, */
    poolType,
    disabled
}) => {

    const { registeredMethods } = useApi();
    const [aid1, /* aidTok1, */ aid2/* , aidTok2 */] = assetA.id < assetB.id ? 
    [assetA.id, /* toGroths(+amountAssetA), */ assetB.id, /* toGroths(+amountAssetB) */] : 
    [assetB.id, /* toGroths(+amountAssetB), */ assetA.id, /* toGroths(+amountAssetA) */];

    const [sendCreatePoolTransaction] = useTransactionFunction(
        transactionId,
        () => registeredMethods.poolCreate({ aid1, aid2,  kind: poolType})
    );


    return (
        <Button sx={{ background: '#00F6D2', }}
         onClick={!disabled ? sendCreatePoolTransaction : null}
         disabled={disabled}
         >
            {children}
        </Button>
    );
}