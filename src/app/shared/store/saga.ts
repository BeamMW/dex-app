import { call, take, takeLatest } from 'redux-saga/effects';

import { eventChannel, END } from 'redux-saga';
import { setSystemState } from '@app/shared/store/actions';
import { actions as mainActions } from '@app/containers/Pools/store/index';

import Utils from '@core/utils.js';
import { setTxStatus } from '@app/containers/Pools/store/actions';
import { actions } from '@app/shared/store/index';
import store from '../../../index';

export async function start() {
  await Utils.download('./amm.wasm', async (err, bytes) => {
    await Utils.callApi('ev_subunsub', { ev_txs_changed: true, ev_system_state: true }, (error, result, full) => {
      if (error) {
        console.log(err);
      }
      if (result) {
        store.dispatch(mainActions.loadAppParams.request(bytes));
        store.dispatch(mainActions.loadPoolsList.request(null));
      }
    });
  });
}
export async function remoteEventChannel() {
  return eventChannel((emitter) => {
    Utils.initialize(
      {
        appname: 'DEX',
        min_api_version: '6.2',
        headless: !!Utils.isWeb(),
        apiResultHandler: (error, result, full) => {
          console.log('api result data: ', result, full);
          if (!result) {
            emitter(full);
          }
        },
      },
      (err) => {
        if (!err) {
          store.dispatch(actions.setIsLoaded(true));
          start();
        }
      },
    );
    const unsubscribe = () => {
      emitter(END);
    };
    return unsubscribe;
  });
}

function* sharedSaga() {
  const remoteChannel = yield call(remoteEventChannel);

  while (true) {
    try {
      const payload: any = yield take(remoteChannel);
      switch (payload.id) {
        case 'ev_system_state':
          store.dispatch(setSystemState(payload.result));
          store.dispatch(mainActions.loadAppParams.request(null));
          store.dispatch(mainActions.loadPoolsList.request(null));
          break;
        case 'ev_txs_changed':
          store.dispatch(setTxStatus(payload.result));
          break;
        default:
          break;
      }
    } catch (err) {
      remoteChannel.close();
    }
  }
}

export default sharedSaga;
