import { createAction, createAsyncAction } from 'typesafe-actions';
import {
  IAddLiquidity, IAsset, ICreatePool, IPoolCard, IPredict, ITrade, ITxStatus, IWithdraw,
} from '@core/types';
import { MainActionsTypes } from '@app/containers/Pools/store/constants';

export const setAssetsList = createAction(MainActionsTypes.SET_ASSETS_LIST)<IAsset[]>();
export const setPoolsList = createAction(MainActionsTypes.SET_POOLS_LIST)<IPoolCard[]>();
export const setTxStatus = createAction(MainActionsTypes.SET_TX_STATUS)<ITxStatus[]>();
export const setErrorMessage = createAction(MainActionsTypes.SET_ERROR_MESSAGE)<string | null>();
export const setTransactionStatus = createAction(MainActionsTypes.SET_TRANSACTIONS_STATUS)<Number>();
export const setPredict = createAction(MainActionsTypes.SET_PREDICT)<IPredict>();
export const setCurrentPool = createAction(MainActionsTypes.SET_CURRENT_POOL)<IPoolCard>();
export const setFilter = createAction(MainActionsTypes.SET_FILTER)<string>();

export const loadAppParams = createAsyncAction(
  MainActionsTypes.LOAD_PARAMS,
  MainActionsTypes.LOAD_PARAMS_SUCCESS,
  MainActionsTypes.LOAD_PARAMS_FAILURE,
)<ArrayBuffer, any>();

export const loadPoolsList = createAsyncAction(
  MainActionsTypes.LOAD_POOLS_LIST,
  MainActionsTypes.LOAD_POOLS_LIST_SUCCESS,
  MainActionsTypes.LOAD_POOLS_LIST_FAILURE,
)<ArrayBuffer, any>();
export const onCreatePool = createAsyncAction(
  MainActionsTypes.CREATE_POOL,
  MainActionsTypes.CREATE_POOL_SUCCESS,
  MainActionsTypes.CREATE_POOL_FAILURE,
)<ICreatePool[], any>();
export const onAddLiquidity = createAsyncAction(
  MainActionsTypes.ADD_LIQUIDITY,
  MainActionsTypes.ADD_LIQUIDITY_SUCCESS,
  MainActionsTypes.ADD_LIQUIDITY_FAILURE,
)<IAddLiquidity, any>();

export const onTradePool = createAsyncAction(
  MainActionsTypes.TRADE_POOL,
  MainActionsTypes.TRADE_POOL_SUCCESS,
  MainActionsTypes.TRADE_POOL_FAILURE,
)<ITrade, any>();
export const onWithdraw = createAsyncAction(
  MainActionsTypes.WITHDRAW,
  MainActionsTypes.WITHDRAW_SUCCESS,
  MainActionsTypes.WITHDRAW_FAILURE,
)<IWithdraw, any>();
