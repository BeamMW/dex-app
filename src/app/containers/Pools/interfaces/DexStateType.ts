import {IAsset, IPoolCard, ITxStatus} from "@core/types";


export interface DexStateType {
        assetsList: IAsset[];
        poolsList: IPoolCard[];
        tx_status: ITxStatus,
        statusTransaction: number
        errorMessage: string | null
}
