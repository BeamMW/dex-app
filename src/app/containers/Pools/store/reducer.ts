import { DexStateType } from '@app/containers/Pools/interfaces/DexStateType';
import { ActionType, createReducer } from 'typesafe-actions';
import produce from 'immer';
import * as actions from './actions';

type Action = ActionType<typeof actions>;

const initialState: DexStateType = {
  assetsList: [],
  poolsList: [],
  tx_status: null,
  statusTransaction: null,
  predict: null,
  currentPool: null,
  filter: 'all',
};

const reducer = createReducer<DexStateType, Action>(initialState)
  .handleAction(actions.setAssetsList, (state, action) => produce(state, (nexState) => {
    nexState.assetsList = action.payload;
  }))
  .handleAction(actions.setPoolsList, (state, action) => produce(state, (nexState) => {
    nexState.poolsList = action.payload;
  }))
  .handleAction(actions.setTxStatus, (state, action) => produce(state, (nexState) => {
    nexState.tx_status = action.payload;
  }))
  .handleAction(actions.setTransactionStatus, (state, action) => produce(state, (nexState) => {
    nexState.statusTransaction = action.payload;
  }))
  .handleAction(actions.setPredict, (state, action) => produce(state, (nexState) => {
    nexState.predict = action.payload;
  }))
  .handleAction(actions.setCurrentPool, (state, action) => produce(state, (nexState) => {
    nexState.currentPool = action.payload;
  }))
  .handleAction(actions.setFilter, (state, action) => produce(state, (nexState) => {
    nexState.filter = action.payload;
  }));

export { reducer as MainReducer };
