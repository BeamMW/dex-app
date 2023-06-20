import { call, take } from 'redux-saga/effects';

import { eventChannel, END } from 'redux-saga';
import { setSystemState } from '@app/shared/store/actions';
import { actions as mainActions } from '@app/containers/Pools/store/index';

import Utils from '@core/utils.js';
import { setTxStatus } from '@app/containers/Pools/store/actions';
import store from '../../../index';

const iFrameDetection = window !== window.parent;
export  function start(): void {
  Utils.download('./amm.wasm', (err, bytes) => {
    Utils.callApi('ev_subunsub', {
      ev_txs_changed: true,
      ev_system_state: true,
    }, (error, result, full) => {
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
export function remoteEventChannel() {
  Utils.initialize(
    {
      appname: 'DEX',
      min_api_version: '7.3',
      headless: !iFrameDetection || !!Utils.isHeadless(),
      apiResultHandler: (error, result, full) => {
        console.log('api result data: ', result, full);
        if (!result) {
          emitter(full);
        }
      },
    },
    (err) => {
      if (err) {
        console.log(err);
      }
      start();
      // store.dispatch(actions.setIsLoaded(true));
      // Utils.downloadAsync('./amm.wasm', (errs, res) => {
      //   if (errs) {
      //     const errTemplate = 'Failed to load shader,';
      //     const errMsg = [errTemplate, errs].join(' ');
      //     return this.setError(errMsg);
      //   }
      //   console.log(res.length);
      //   store.dispatch(mainActions.loadAppParams.request(res));
      //   store.dispatch(mainActions.loadPoolsList.request(null));
      // });
      // .then((res) => {
      //     if()
      //       Utils.callApiAsync('ev_subunsub', { ev_txs_changed: true, ev_system_state: true }).then(() => {
      //         store.dispatch(mainActions.loadAppParams.request(res));
      //         store.dispatch(mainActions.loadPoolsList.request(null));
      //         store.dispatch(actions.setIsLoaded(true));
      //         console.log('BBBBS');
      //         console.log(res);
      //       }).catch((e) => {
      //         console.log(e);
      //       });
      //   }).catch((e) => { console.log(e); });
      // console.log(res);
      // await Utils.callApi('ev_subunsub', { ev_txs_changed: true, ev_system_state: true }, (error, result, full) => {
      //   if (error) {
      //     console.log(err);
      //   }
      //   if (result) {
      //     console.log(full);
      //     console.log('result');
      //     store.dispatch(actions.setIsLoaded(true));
      //
      //     store.dispatch(mainActions.loadPoolsList.request(null));
      //   }
      // });
      // // store.dispatch(actions.setIsLoaded(true));
      // store.dispatch(mainActions.loadAppParams.request(res));
      // store.dispatch(mainActions.loadPoolsList.request(null));
    },
  );
  return eventChannel((emitter) => {
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
          console.log(1);
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
