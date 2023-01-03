import { call, put, takeLatest } from 'redux-saga/effects';
import {IAsset, IPoolCard} from "@core/types";
import { actions } from '.';
import {LoadAssetsList, LoadPoolsList} from "@core/api";
import {parseMetadata} from "@core/appUtils";



export function* loadParamsSaga(
    action: ReturnType<typeof actions.loadAppParams.request>,
): Generator {
    try {
        const assetsList = (yield call(LoadAssetsList, action.payload ? action.payload : null)) as IAsset[]
        assetsList.forEach((asset) => {
            asset['parsedMetadata'] = parseMetadata(asset.metadata);
        });
        yield put(actions.setAssetsList(assetsList));
        const poolsList = (yield call(LoadPoolsList, action.payload? action.payload : null)) as IPoolCard[];
        yield put(actions.setPoolsList(poolsList));


    }
    catch (e){
            // @ts-ignore
        yield put(actions.loadAppParams.failure(e));
    }
}


    function* mainSaga() {
        yield takeLatest(actions.loadAppParams.request, loadParamsSaga);
        // yield takeLatest(actions.loadRate.request, loadRate);
    }

    export default mainSaga;
