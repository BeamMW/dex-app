import { createSelector } from 'reselect';
import { AppState } from '@app/shared/interface';

const selectMain = (state: AppState) => state.main;

export const selectAssetsList = () => createSelector(selectMain, (state) => state.assetsList);
export const selectPoolsList = () => createSelector(selectMain, (state) => state.poolsList);
export const selectTxStatus = () => createSelector(selectMain, (state) => state.statusTransaction);
export const selectPredirect = () => createSelector(selectMain, (state) => state.predict);
export const selectCurrentPool = () => createSelector(selectMain, (state) => state.currentPool);
export const selectFilter = () => createSelector(selectMain, (state) => state.filter);
export const selectOptions = () => createSelector(selectMain, (state) => state.options);
export const selectFavorites = () => createSelector(selectMain, (state) => state.favorites);
export const selectCurrentLPToken = () => createSelector(selectMain, (state) => state.currentLPToken);
