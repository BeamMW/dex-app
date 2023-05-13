export enum MainActionsTypes {
  SET_ASSETS_LIST = '@@MAIN/SET_ASSETS_LIST',
  SET_POOLS_LIST = '@@MAIN/SET_POOLS_LIST',
  SET_TX_STATUS = '@@MAIN/SET_TX_STATUS',

  SET_TRANSACTIONS_STATUS = 'SET_TRANSACTIONS_STATUS',
  SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE',
  SET_PREDICT = 'SET_PREDICT',
  SET_CURRENT_POOL = '@@MAIN/SET_CURRENT_POOL',
  SET_FILTER = 'SET_FILTER',
  SET_OPTIONS = 'SET_OPTIONS',
  SET_FAVORITES = 'SET_FAVORITES',
  REMOVE_FAVORITES = 'REMOVE_SET_FAVORITES',
  SET_CURRENT_LP_TOKEN = 'SET_CURRENT_LP_TOKEN',
  SET_IS_LOADING = 'SET_IS_LOADING',
  SET_MY_POOLS = 'SET_MY_POOLS',
  SET_IS_HEADLESS = 'SET_IS_HEADLESS',

  LOAD_PARAMS = '@@MAIN/LOAD_PARAMS',
  LOAD_PARAMS_SUCCESS = '@@MAIN/LOAD_PARAMS_SUCCESS',
  LOAD_PARAMS_FAILURE = '@@MAIN/LOAD_PARAMS_FAILURE',

  LOAD_POOLS_LIST = '@@MAIN/LOAD_POOLS_LIST',
  LOAD_POOLS_LIST_SUCCESS = '@@MAIN/LOAD_POOLS_LIST_SUCCESS',
  LOAD_POOLS_LIST_FAILURE = '@@MAIN/LOAD_POOLS_LIST_FAILURE',

  CREATE_POOL = '@@MAIN/CREATE_POOL',
  CREATE_POOL_SUCCESS = '@@MAIN/CREATE_POOL_SUCCESS',
  CREATE_POOL_FAILURE = '@@MAIN/CREATE_POOL_FAILURE',
  ADD_LIQUIDITY = '@@MAIN/ADD_LIQUIDITY',
  ADD_LIQUIDITY_SUCCESS = '@@MAIN/ADD_LIQUIDITY_SUCCESS',
  ADD_LIQUIDITY_FAILURE = '@@MAIN/ADD_LIQUIDITY_FAILURE',
  TRADE_POOL = '@@MAIN/TRADE_POOL',
  TRADE_POOL_SUCCESS = '@@MAIN/TRADE_POOL_SUCCESS',
  TRADE_POOL_FAILURE = '@@MAIN/TRADE_POOL_FAILURE',
  WITHDRAW = '@@MAIN/WITHDRAW',
  WITHDRAW_SUCCESS = '@@MAIN/WITHDRAW_SUCCESS',
  WITHDRAW_FAILURE = '@@MAIN/WITHDRAW_FAILURE',
  FAVORITES = '@@MAIN/FAVORITES',
  FAVORITES_SUCCESS = '@@MAIN/FAVORITES_SUCCESS',
  FAVORITES_FAILURE = '@@MAIN/FAVORITES_FAILURE',
}
