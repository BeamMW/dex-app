import {
  call, delay, put, select, takeLatest,
} from 'redux-saga/effects';
import {
  IAsset, IPoolCard, ITxId, ITxResult, ITxStatus, TxStatus,
} from '@core/types';
import {
  AddLiquidityApi, CreatePoolApi, LoadAssetsList, LoadPoolsList, TradePoolApi, WithdrawApi,
} from '@core/api';
import {
  checkTxStatus,
  getOptions,
  isInArray,
  onFilter, onSwitchToApi,
  parseMetadata,
  parsePoolMetadata,
  setStorage,
} from '@core/appUtils';
import { AppState } from '@app/shared/interface';
import * as mainActions from '@app/containers/Pools/store/actions';
import { selectFilter } from '@app/containers/Pools/store/selectors';
import { toast } from 'react-toastify';
import { navigate } from '@app/shared/store/actions';
import { ROUTES } from '@app/shared/constants';
import Utils from '@core/utils.js';
import { actions as Shared } from '@app/shared/store/index';
import { actions } from '.';

export function* loadParamsSaga(action: ReturnType<typeof actions.loadAppParams.request>): Generator {
  try {
    yield setStorage();
    const favoritesLocal = JSON.parse(localStorage.getItem('favorites'));
    const filter = yield select(selectFilter());
    const assetsList = (yield call(LoadAssetsList, action.payload ? action.payload : null)) as IAsset[];
    assetsList.forEach((asset) => {
      asset.parsedMetadata = parseMetadata(asset.metadata);
    });
    yield put(mainActions.setFavorites(favoritesLocal));
    yield put(mainActions.setAssetsList(assetsList));
    const options = getOptions(assetsList);
    yield put(mainActions.setOptions(options));
    const poolsList = (yield call(LoadPoolsList, action.payload ? action.payload : null)) as IPoolCard[];
    const newPoolList: IPoolCard[] = poolsList.map((pool) => parsePoolMetadata(pool, pool.aid1, pool.aid2, assetsList));
    const myPools = newPoolList.filter((el) => el.creator);
    yield put(mainActions.setMyPools(myPools));
    const filteredPools = onFilter(newPoolList, filter, favoritesLocal).map((pool) => parsePoolMetadata(pool, pool.aid1, pool.aid2, assetsList)) as IPoolCard[];
    yield put(mainActions.setPoolsList(filteredPools));
    yield put(Shared.setIsLoaded(true));
  } catch (e) {
    // @ts-ignore
    yield put(mainActions.loadAppParams.failure(e));
    toast(e.error);
  }
}
function* navigateToHome(txid: string) {
  if (txid) {
    yield put(navigate(ROUTES.POOLS.BASE));
  }
}
function* getStatus(txid: string) {
  const listStatus = yield select((state: AppState) => state.main.tx_status);
  const status = yield checkTxStatus(txid, listStatus as ITxStatus[]);
  if (status === TxStatus.Completed) {
    yield put(mainActions.setTransactionStatus(status));
    yield toast('Transaction is Completed');
    yield delay(1000);
    yield put(mainActions.setTransactionStatus(null));
  } else if (status === TxStatus.Failed) {
    yield toast('Transaction is Failed');
    yield put(mainActions.setTransactionStatus(status));
    yield delay(1000);
    yield put(mainActions.setTransactionStatus(null));
  } else if (status === TxStatus.Canceled) {
    yield put(mainActions.setTransactionStatus(status));
    yield delay(1000);
    yield put(mainActions.setTransactionStatus(null));
  } else if (status === TxStatus.InProgress || TxStatus.Registering) {
    yield put(mainActions.setTransactionStatus(status));
    yield delay(500);
    yield getStatus(txid);
  }
}
export function* createPool(action: ReturnType<typeof mainActions.onCreatePool.request>): Generator {
  if (yield Utils.isHeadless()) {
    yield onSwitchToApi();
  } else {
    try {
      // @ts-ignore
      const { txid } = (yield call(CreatePoolApi, action.payload ? action.payload : null)) as ITxId;
      if (txid) {
        yield navigateToHome(txid);
        yield getStatus(txid);
      }
    } catch (e) {
      // @ts-ignore
      yield put(mainActions.onCreatePool.failure(e));
      toast(e.error === 'pool already exists' ? 'This pool already exists' : e.error);
    }
  }
}

export function* addLiquidity(action: ReturnType<typeof mainActions.onAddLiquidity.request>): Generator {
  if (yield Utils.isHeadless()) {
    yield onSwitchToApi();
  } else {
    try {
      // @ts-ignore
      const {
        txid,
        res,
      } = (yield call(AddLiquidityApi, action.payload ? action.payload : null)) as ITxResult;
      if (res) {
        yield put(mainActions.setPredict(res));
      }
      if (txid) {
        yield navigateToHome(txid);
        yield getStatus(txid);
      }
    } catch (e) {
      // @ts-ignore
      console.log(e);
      yield put(mainActions.onAddLiquidity.failure(e));
      // toast(e.error);
    }
  }
}
export function* tradePool(action: ReturnType<typeof mainActions.onTradePool.request>): Generator {
  if (yield Utils.isHeadless()) {
    yield onSwitchToApi();
  } else {
    try {
      // @ts-ignore0
      const {
        res,
        txid,
      } = (yield call(TradePoolApi, action.payload ? action.payload : null)) as ITxResult;
      if (res) {
        yield put(mainActions.setPredict(res));
      }
      if (txid) {
        yield navigateToHome(txid);
        yield getStatus(txid);
      }
    } catch (e) {
      // @ts-ignore
      // yield put(mainActions.onTradePool.failure(e));
      yield put(mainActions.setErrorMessage(e));
      // toast(e.error);
    }
  }
}
export function* withdrawPool(action: ReturnType<typeof mainActions.onWithdraw.request>): Generator {
  if (yield Utils.isHeadless()) {
    yield onSwitchToApi();
  } else {
    try {
      // @ts-ignore
      const {
        res,
        txid,
      } = (yield call(WithdrawApi, action.payload ? action.payload : null)) as ITxResult;
      if (res) {
        yield put(mainActions.setPredict(res));
      }
      if (txid) {
        yield navigateToHome(txid);
        yield getStatus(txid);
      }
    } catch (e) {
      // @ts-ignore
      yield put(mainActions.onWithdraw.failure(e));
      // toast(e.error);
    }
  }
}
export function* favorites(action: ReturnType<typeof mainActions.onFavorites.request>): Generator {
  try {
    const favoritesList = yield select((state: AppState) => state.main.favorites);
    const pool = action.payload as IPoolCard;
    let storage = (favoritesList as IPoolCard[]) || [];
    if (storage) {
      const isFav = isInArray(pool, storage);
      if (isFav) {
        const filtered = storage.filter((e: IPoolCard) => JSON.stringify(e) !== JSON.stringify(pool));
        yield localStorage.setItem('favorites', JSON.stringify(filtered));
        yield put(mainActions.setFavorites(filtered as IPoolCard[]));
        return;
      }
      storage = [...storage, pool];
    } else {
      storage.push(pool);
    }
    yield localStorage.setItem('favorites', JSON.stringify(storage));
    yield put(mainActions.setFavorites(storage as IPoolCard[]));
  } catch (e) {
    // @ts-ignore
    // yield put(mainActions.onWithdraw.failure(e));
    toast(e.error);
  }
}

function* mainSaga() {
  yield takeLatest(mainActions.loadAppParams.request, loadParamsSaga);
  yield takeLatest(mainActions.onCreatePool.request, createPool);
  yield takeLatest(mainActions.onAddLiquidity.request, addLiquidity);
  yield takeLatest(mainActions.onTradePool.request, tradePool);
  yield takeLatest(mainActions.onWithdraw.request, withdrawPool);
  yield takeLatest(mainActions.onFavorites.request, favorites);
}

export default mainSaga;
