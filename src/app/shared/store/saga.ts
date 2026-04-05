import { call, take } from 'redux-saga/effects';

import { eventChannel, END } from 'redux-saga';
import { setSystemState } from '@app/shared/store/actions';
import { actions as mainActions } from '@app/containers/Pools/store/index';

import connector from '@core/connector';
import { setTxStatus } from '@app/containers/Pools/store/actions';
import store from '../../../index';

const iFrameDetection = window !== window.parent;

let shaderBytes: number[] | null = null;

export async function start() {
  const bytes = await connector.downloadShader('./amm.wasm');
  shaderBytes = Array.from(bytes);
  await connector.callApi('ev_subunsub', {
    ev_txs_changed: true,
    ev_system_state: true,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store.dispatch(mainActions.loadAppParams.request(shaderBytes as any));
  store.dispatch(mainActions.loadPoolsList.request(null));
}

export function remoteEventChannel() {
  return eventChannel((emitter) => {
    connector.on('apiEvent', (response: any) => {
      if (response) {
        emitter(response);
      }
    });

    const headless = !iFrameDetection || connector.isHeadless();
    connector.connect({ headless })
      .then(() => start())
      .catch(() => {});

    return () => emitter(END);
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
          break;

        case 'ev_txs_changed':
          store.dispatch(setTxStatus(payload.result));
          if (shaderBytes) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            store.dispatch(mainActions.loadAppParams.request(shaderBytes as any));
          }
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
