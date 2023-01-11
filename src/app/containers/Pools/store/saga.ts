import {call, delay, put, select, takeLatest} from 'redux-saga/effects';
import {IAsset, IPoolCard, ITxId, ITxStatus, TxStatus} from "@core/types";
import {actions} from '.';
import {AddLiquidityApi, CreatePoolApi, LoadAssetsList, LoadPoolsList} from "@core/api";
import {checkTxStatus,  parseMetadata, parsePoolMetadata} from "@core/appUtils";
import {AppState} from "@app/shared/interface";
import * as mainActions from "@app/containers/Pools/store/actions";

export function* loadParamsSaga(
    action: ReturnType<typeof actions.loadAppParams.request>,
): Generator {
    try {
        const assetsList = (yield call(LoadAssetsList, action.payload ? action.payload : null)) as IAsset[]
        assetsList.forEach((asset) => {
            asset['parsedMetadata'] = parseMetadata(asset.metadata);
        });
        yield put(mainActions.setAssetsList(assetsList));
        const poolsList = (yield call(LoadPoolsList, action.payload? action.payload : null)) as IPoolCard[];
        const newPoolList = poolsList.map((pool)=>{
           return   parsePoolMetadata(pool,pool.aid1, pool.aid2, assetsList)
        })
        yield put(mainActions.setPoolsList(newPoolList));
    }
    catch (e){
            // @ts-ignore
        yield put(mainActions.loadAppParams.failure(e));
    }
}

function* getStatus (txid: string) {
    const listStatus = yield  select((state:AppState) => state.main.tx_status )
    console.log({txid, listStatus})
    const status = yield checkTxStatus(txid, listStatus as ITxStatus[])
    if(status === TxStatus.Completed) {
        yield put(mainActions.setTransactionStatus(status))
    } else if (status === TxStatus.Failed) {
        yield put(mainActions.setTransactionStatus(status))
    }
    else if( status === TxStatus.Canceled) {
        yield put(mainActions.setTransactionStatus(status))
    }  else if (status === TxStatus.InProgress || TxStatus.Registering) {
        console.log('in_prog')
        yield put(mainActions.setTransactionStatus(status))
        yield delay(2000)
        yield getStatus(txid)
    }
}
export function* createPool(
    action: ReturnType<typeof mainActions.onCreatePool.request>,

): Generator{
    try {
        // @ts-ignore
        const  { txid } = (yield call(CreatePoolApi, action.payload ? action.payload : null)) as ITxId;
        yield getStatus(txid)
    }
    catch (e) {
        // @ts-ignore
        yield put(mainActions.onCreatePool.failure(e));
        yield put(mainActions.setErrorMessage(e));
    }
}

export function* addLiquidity(
    action: ReturnType<typeof mainActions.onAddLiquidity.request>,

): Generator{
    try {
        // @ts-ignore
        const  { txid } = (yield call(AddLiquidityApi, action.payload ? action.payload : null)) as ITxId;
        console.log('saga')
        yield getStatus(txid)
    }
    catch (e) {
        // @ts-ignore
        yield put(mainActions.onAddLiquidity.failure(e));
        yield put(mainActions.setErrorMessage(e));


    }
}

    function* mainSaga() {
        yield takeLatest(mainActions.loadAppParams.request, loadParamsSaga);
        yield takeLatest(mainActions.onCreatePool.request, createPool);
        yield takeLatest(mainActions.onAddLiquidity.request, addLiquidity);
    }

    export default mainSaga;
