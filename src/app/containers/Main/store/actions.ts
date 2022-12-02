import { createAsyncAction, createAction } from 'typesafe-actions';

export const loadSomeData = createAction('@@MAIN/SET_BRIDGE_TRANSACTIONS')<any>();

export const loadFromContract = createAsyncAction(
    '@@MAIN/LOAD_PARAMS',
    '@@MAIN/LOAD_PARAMS_SUCCESS',
    '@@MAIN/LOAD_PARAMS_FAILURE',
)<ArrayBuffer, any, any>();



