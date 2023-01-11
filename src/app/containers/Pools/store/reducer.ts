import {DexStateType} from "@app/containers/Pools/interfaces/DexStateType";
import {ActionType, createReducer} from "typesafe-actions";
import * as actions from './actions';
import produce from "immer";

type Action = ActionType<typeof actions>;


const initialState: DexStateType = {
    assetsList: [],
    poolsList: [],
    tx_status: null,
    statusTransaction: null ,
    errorMessage: ''
};


const reducer = createReducer<DexStateType, Action>(initialState)
    .handleAction(actions.setAssetsList, (state, action) => produce(state, (nexState) => {
        nexState.assetsList = action.payload;
    }))
    .handleAction(actions.setPoolsList, (state, action) => produce(state, (nexState) => {
        nexState.poolsList = action.payload;
    }))
    .handleAction(actions.setTxStatus, (state, action ) => produce(state, (nexState) => {
        nexState.tx_status = action.payload
    }))
    .handleAction(actions.setTransactionStatus, (state, action ) => produce(state, (nexState) => {
        nexState.statusTransaction = action.payload
    }))
    .handleAction(actions.setErrorMessage, (state, action) => produce(state, (nexState) => {
        nexState.errorMessage = action.payload;
    }))


export { reducer as MainReducer };
