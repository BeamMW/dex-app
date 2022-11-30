import React from "react";
import { useTransactionFunction } from "@app/library/transaction-react/useTransactionFunction";
import { Button } from 'theme-ui';
import { toGroths } from "@app/library/base/appUtils";
import { useApi } from "@app/contexts/Dex/ApiContext";


export const LiquidityAction: React.FC<any> = ({
    children,
    transactionId,
    fromAsset,
    toAsset,
    fromAmount,
    toAmount,
    disabled
}) => {

    const { registeredMethods } = useApi();
    //const { foundDomain : {name: name} } = useMainView();

    const [sendTransaction] = useTransactionFunction(
        transactionId,
        () => registeredMethods.userAddLiquidity({ aid1: fromAsset, aid2: toAsset,  val1: toGroths(fromAmount), val2: toGroths(toAmount), })
    );

    return (
        <Button sx={{ background: '#00F6D2', }}
         onClick={!disabled ? sendTransaction : null}
         >
            {children}
        </Button>
    );
}