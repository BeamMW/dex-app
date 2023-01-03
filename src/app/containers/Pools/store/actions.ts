import {createAction, createAsyncAction} from "typesafe-actions";
import {IAsset, IPoolCard} from "@core/types";
import {MainActionsTypes} from "@app/containers/Pools/store/constants";

export const setAssetsList = createAction(MainActionsTypes.SET_ASSETS_LIST)<IAsset[]>();
export const setPoolsList = createAction(MainActionsTypes.SET_POOLS_LIST)<IPoolCard[]>();

export const loadAppParams = createAsyncAction(
    MainActionsTypes.LOAD_PARAMS,
    MainActionsTypes.LOAD_PARAMS_SUCCESS,
    MainActionsTypes.LOAD_PARAMS_FAILURE
)<ArrayBuffer>();

export const loadPoolsList = createAsyncAction(
    MainActionsTypes.LOAD_POOLS_LIST,
    MainActionsTypes.LOAD_POOLS_LIST_SUCCESS,
    MainActionsTypes.LOAD_POOLS_LIST_FAILURE,
)<ArrayBuffer>();
