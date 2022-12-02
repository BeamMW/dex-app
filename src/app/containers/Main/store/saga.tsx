import { call, put, takeLatest, select } from 'redux-saga/effects';
import { navigate } from '@app/shared/store/actions';
import { ROUTES } from '@app/shared/constants';
import { LoadFromContract} from '@core/api';
import { actions } from '.';
import store from '../../../../index';
import { setIsLoaded } from '@app/shared/store/actions';
import { selectIsLoaded } from '@app/shared/store/selectors';


export function* loadParamsSaga(
    action: ReturnType<typeof actions.loadFromContract.request>,
  ): Generator {
    try {
      const pkey = yield call(LoadFromContract, action.payload ? action.payload : null);
      const isLoaded = yield select(selectIsLoaded());
      if (!isLoaded) {
        store.dispatch(setIsLoaded(true));
        yield put(navigate(ROUTES.MAIN.MAIN_PAGE));
      }
    } catch (e) {
      yield put(actions.loadFromContract.failure(e));
    }
}


function* mainSaga() {
    yield takeLatest(actions.loadFromContract.request, loadParamsSaga);
}

export default mainSaga;
