import Utils from '@core/utils.js';
import {IAddLiquidity, ICreatePool, IError, ITrade, ITxId} from "@core/types";

const CID =  '4e0a28b2b2a83b811ad17ba8228b0645dbce2969fd453a68fbc0b60bc8860e02';

const onMakeTx = (err, sres, full, params: {id: number, vote: number} = null, toasted: string = null) => {
    if (err) {
        console.log(err, "Failed to generate transaction request")
    }
    return new Promise((resolve, reject) => {
        Utils.callApi(
            'process_invoke_data', {data: full.result.raw_data},
            (error, result, full) => {
                resolve(result)
            }
        )
    })
}

export function LoadAssetsList<T = any>(payload): Promise<T> {
    return new Promise((resolve, reject) => {
        Utils.invokeContract("action=view_all_assets,cid=" + CID,
            (error, result, full) => {
                resolve(result.res);
            }, payload ? payload : null);
    });
}

export function LoadPoolsList<T = any>(payload?): Promise<T> {
    return new Promise((resolve, reject) => {
        Utils.invokeContract("action=pools_view,cid=" + CID,
            (error, result, full) => {
                resolve(result.res);
            }, payload ? payload : null);
    });
}
export function CreatePoolApi<T = any>([{aid1,aid2,kind}]:ICreatePool[]): Promise<T> {
    return new Promise((resolve, reject) => {
        Utils.invokeContract("action=pool_create,aid1="+ aid1+ ",aid2="+ aid2 +",kind="+ kind +",cid=" + CID,
            (error: IError, result, full) => {
            if(error){
                reject(error)
            }
                onMakeTx(error, result, full)
                    .then((res: ITxId)=>{
                    resolve(res);
                });

            });
    });
}
export function AddLiquidityApi<T = any>({aid1,aid2,kind, val1, val2, bPredictOnly }:IAddLiquidity,): Promise<T> {
    return new Promise((resolve, reject) => {
        Utils.invokeContract("action=pool_add_liquidity,aid1="+ aid1+ ",aid2="+ aid2 +",kind="+ kind +",val1="+ val1 +",val2="+ val2 +",bPredictOnly="+ bPredictOnly +",cid=" + CID,
            (error, result, full) => {
                if(error){
                    reject(error)
                }
                onMakeTx(error, result, full)
                    .then((res: ITxId)=>{
                    resolve(res)
                })
            });
    });
}export function TradePoolApi<T = any>({aid1,aid2,kind, val1_buy, bPredictOnly = 1 }:ITrade,): Promise<T> {
    return new Promise((resolve, reject) => {
        Utils.invokeContract("action=pool_trade,aid1="+ aid1+ ",aid2="+ aid2 +",kind="+ kind +",val1_buy="+ val1_buy +",cid=" + CID,
            (error, result, full) => {
                if(error){
                    reject(error)
                }
                onMakeTx(error, result, full).then((res: ITxId)=>{
                    resolve({res, result})
                })
            });
    });
}
