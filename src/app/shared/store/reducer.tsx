import produce from 'immer';
import { ActionType, createReducer } from 'typesafe-actions';

import { SharedStateType } from '../interface';
import * as actions from './actions';

type Action = ActionType<typeof actions>;

const initialState: SharedStateType = {
  routerLink: '',
  errorMessage: null,
  systemState: {
    current_height: 0,
  },
  isLoaded: false,
};

const reducer = createReducer<SharedStateType, Action>(initialState).handleAction(actions.navigate, (state, action) => produce(state, (nexState) => {
  nexState.routerLink = action.payload;
}));

export { reducer as SharedReducer };
