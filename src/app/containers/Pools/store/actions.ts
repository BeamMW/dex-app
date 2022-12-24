import {createAction, createAsyncAction} from "typesafe-actions";
import {IAsset, IPoolCard} from "@core/types";

export const setAssetsList = createAction('@@MAIN/SET_ASSETS_LIST')<IAsset[]>();
export const setPoolsList = createAction('@@MAIN/SET_POOLS_LIST')<IPoolCard[]>();

export const loadAppParams = createAsyncAction(
    '@@MAIN/LOAD_PARAMS',
    '@@MAIN/LOAD_PARAMS_SUCCESS',
    '@@MAIN/LOAD_PARAMS_FAILURE',
)<ArrayBuffer>();

export const loadPoolsList = createAsyncAction(
    '@@MAIN/LOAD_POOLS_LIST',
    '@@MAIN/LOAD_POOLS_LIST_SUCCESS',
    '@@MAIN/LOAD_POOLS_LIST_FAILURE',
)<ArrayBuffer>();
