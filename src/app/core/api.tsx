import Utils from '@core/utils.js';

const CID =  '4e0a28b2b2a83b811ad17ba8228b0645dbce2969fd453a68fbc0b60bc8860e02';

export function LoadFromContract<T = any>(payload): Promise<T> {
    return new Promise((resolve, reject) => {
        Utils.invokeContract("role=user,action=get_some_action,cid=" + CID,
        (error, result, full) => {
            resolve(result.data);
        }, payload ? payload : null);
    });
}

export function UserDeposit<T = any>(amount: number, aid: number): Promise<T> {
    return new Promise((resolve, reject) => {
        Utils.invokeContract("role=user,action=deposit,amount="+ amount +",aid=" + aid + ",cid=" + CID,
        (error, result, full) => {
            onMakeTx(error, result, full);
            resolve(result);
        });
    });
}

const onMakeTx = (err, sres, full, params: {id: number, vote: number} = null, toasted: string = null) => {
    if (err) {
        console.log(err, "Failed to generate transaction request")
    }

    Utils.callApi(
        'process_invoke_data', {data: full.result.raw_data},
        (error, result, full) => {
        }
    )
}
export function LoadAssetsList<T = any>(payload): Promise<T> {
    return new Promise((resolve, reject) => {
        Utils.invokeContract("action=view_all_assets,cid=" + CID,
            (error, result, full) => {
                resolve(result.res);
            }, payload ? payload : null);
    });
}

export function LoadPoolsList<T = any>(payload): Promise<T> {
    return new Promise((resolve, reject) => {
        Utils.invokeContract("action=pools_view,cid=" + CID,
            (error, result, full) => {
                resolve(result.res);
            }, payload ? payload : null);
    });
}
