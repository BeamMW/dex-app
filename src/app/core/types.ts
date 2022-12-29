export type Pallete = 'green' | 'ghost' | 'purple' | 'blue' | 'red' | 'white' | 'vote-red';

export type ButtonVariant = 'regular' | 'ghost' | 'ghostBordered' | 'block' | 'link' | 'icon';

export enum Kind {
    Low = 0,
    Mid = 1,
    High = 2,
}

export enum TxStatus {
    Pending  = 0 ,
    InProgress =  1,
    Canceled = 2,
    Completed = 3,
    Failed = 4,
    Registering= 5
}
export interface IMetadataPairs {
    N: string;
    NTHUN?: string;
    SCH_VER?: string;
    SN: string;
    UN?: string;
    OPT_COLOR?: string;
}
export interface IAsset {
    aid: number,
    metadata: string,
    mintedHi: number,
    mintedLo: number,
    owner_pk: string,
    parsedMetadata: IMetadataPairs,
    limitHi?: number,
    limitLo?: number,
}
export interface IPoolCard {
    aid1: number,
    aid2: number,
    ctl: number,
    k1_2: string,
    k1_ctl: string,
    k2_1: string,
    k2_ctl: string,
    kind: number,
    lp_token: number,
    tok1: number,
    tok2: number,
    metadata1?: IMetadataPairs,
    metadata2?: IMetadataPairs,
    creator?: number;
}
export interface ICreatePool{
    aid1: number,
    aid2: number,
    kind:number,

}
export interface IAddLiquidity extends ICreatePool{
    val1:number,
    val2:number,
    bPredictOnly: number
}

export interface ITsx {
    txId: string;
    asset_id: number;
    comment: string;
    fee: number;
    kernel: string;
    receiver: string;
    sender: string;
    status: number;
    status_string: string;
    tx_type: number;
    tx_type_string: string;
    failure_reason: string;
    value: number;
    create_time: number;
    income: boolean;
    rates: any[];
    sender_identity: string;
    receiver_identity: string;
    token: string;
}

export interface ITxStatus {
    change: number;
    change_str: string;
    txs: ITsx[];
}

export interface ITxId {
    txid: string
}
