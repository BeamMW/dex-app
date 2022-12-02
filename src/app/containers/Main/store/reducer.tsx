import produce from 'immer';
import { ActionType, createReducer } from 'typesafe-actions';
import * as actions from './actions';

type Action = ActionType<typeof actions>;

const initialState = {
  someData: [],
};

const reducer = createReducer<any, Action>(initialState)
  .handleAction(actions.loadSomeData, (state, action) => produce(state, (nexState) => {
    nexState.someData = action.payload;
  }));

export { reducer as MainReducer };
