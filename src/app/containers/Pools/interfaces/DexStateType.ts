import { IAsset, IOptions, IPoolCard, IPredict, ITxStatus } from "@core/types";


export interface DexStateType {
        assetsList: IAsset[];
        poolsList: IPoolCard[];
        tx_status: ITxStatus[] | null,
        statusTransaction: number | null,
        predict: IPredict,
        currentPool: IPoolCard,
        filter: string,

        options: IOptions[];
}
