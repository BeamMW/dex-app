import { createSelector } from 'reselect';
import { AppState } from '../../../shared/interface';

const selectMain = (state: AppState) => state.main;

export const selectSomeData = () => createSelector(selectMain, (state) => state.someData);

