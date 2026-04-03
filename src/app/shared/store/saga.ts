import { call, take } from 'redux-saga/effects';

import { eventChannel, END } from 'redux-saga';
import { setSystemState } from '@app/shared/store/actions';
import { actions as mainActions } from '@app/containers/Pools/store/index';

import Utils from '@core/utils.js';
import { setTxStatus } from '@app/containers/Pools/store/actions';
import store from '../../../index';

const iFrameDetection = window !== window.parent;
export async function start() {
  Utils.download('./amm.wasm', (err, bytes) => {
    Utils.callApi('ev_subunsub', {
      ev_txs_changed: true,
      ev_system_state: true,
    }, (error, result) => {
      if (error) return;
      if (result) {
        store.dispatch(mainActions.loadAppParams.request(bytes));
        store.dispatch(mainActions.loadPoolsList.request(null));
      }
    });
  });
}
export function remoteEventChannel() {
  return eventChannel((emitter) => {
    Utils.initialize(
      {
        appname: 'DEX',
        min_api_version: '7.3',
        headless: !iFrameDetection || !!Utils.isHeadless(),
        apiResultHandler: (_error, result, full) => {
          if (!result && full) {
            emitter(full);
          }
        },
      },
      (err) => {
        if (err) return;
        start();
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
          // store.dispatch(mainActions.loadPoolsList.request(null));
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
