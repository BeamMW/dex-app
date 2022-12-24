import {DexStateType} from "@app/containers/Pools/interfaces/DexStateType";
import {ActionType, createReducer} from "typesafe-actions";
import * as actions from './actions';
import produce from "immer";

type Action = ActionType<typeof actions>;


const initialState: DexStateType = {
    assetsList: [],
    poolsList: [],
};


const reducer = createReducer<DexStateType, Action>(initialState)
    .handleAction(actions.setAssetsList, (state, action) => produce(state, (nexState) => {
        nexState.assetsList = action.payload;
    }))
    .handleAction(actions.setPoolsList, (state, action) => produce(state, (nexState) => {
        nexState.poolsList = action.payload;
    }))


export { reducer as MainReducer };
