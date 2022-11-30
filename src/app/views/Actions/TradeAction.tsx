import React from "react";
import { useTransactionFunction } from "@app/library/transaction-react/useTransactionFunction";
import { Button } from 'theme-ui';
import { toGroths } from "@app/library/base/appUtils";
import { useApi } from "@app/contexts/Dex/ApiContext";


export const TradeAction: React.FC<any> = ({
    children,
    transactionId,
    sendingAsset,
    receivingAsset,
    sendingAmount,
    amount,
    disabled
}) => {

    const { registeredMethods } = useApi();
    //const { foundDomain : {name: name} } = useMainView();

    const [sendTransaction] = useTransactionFunction(
        transactionId,
        () => registeredMethods.userTrade({ aid1: sendingAsset, aid2: receivingAsset,  val1_buy: toGroths(sendingAmount), })
    );

    return (
        <Button sx={{ background: '#00F6D2', }}
         onClick={!disabled ? sendTransaction : null}
         >
            {children}
        </Button>
    );
}