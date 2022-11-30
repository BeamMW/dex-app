import { Asset } from "../base/assets/types";
import { Decimal } from "../base/Decimal";

export type ShaderActions =
    "view_deployed" |
    "pools_view" |
    "pool_view" |
    "pool_create" |
    "pool_destroy" |
    "pool_add_liquidity" |
    "pool_withdraw" |
    "pool_trade" |
    "view_all_assets";

export enum ShaderTransactionComments {
    setCreatePool = "Amm create pool",
    setDestroyPool = "Amm destroy pool",
    setAddLiquidity = "Amm add",
    setWithdraw = "Amm withdraw",
    setTrade = "Amm trade",
}

export type PoolRaw = {
    aid1: number;
    aid2: number;
    kind: number;
    ctl: number;
    tok1: number;
    tok2: number;
    "lp-token": number;
    k1_2?: string;
    k2_1?: string;
    k1_ctl?: string;
    k2_ctl?: string;
    creator?: number;
}

export enum Kind {
    Low = 0,
    Mid = 1,
    High = 2,
}

export type AssetInPool = Asset & {
    amountInGroth: Decimal;
    amount: Decimal;
}

export type MetaInfo = {
    name: string;
    icon?: any;
}