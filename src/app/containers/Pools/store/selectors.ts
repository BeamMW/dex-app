import { createSelector } from 'reselect';
import {AppState} from "@app/shared/interface";


const selectMain = (state: AppState) => state.main;

export const selectAssetsList = () => createSelector(selectMain, (state) => state.assetsList);
export const selectPoolsList = () => createSelector(selectMain, (state) => state.poolsList);
export const selectTxStatus = () => createSelector(selectMain, (state) => state.tx_status);
