import { Kind } from '@core/types';

export const GROTHS_IN_BEAM = 100000000;
export const REG_AMOUNT = /^(?!0\d)(\d+)(\.)?(\d{0,8})?$/;

export const BEAM_ID = 0;
export const BEAMX_ID = 3;
// export const BEAMX_ID = 7;
export const NPH_ID = 357;
// export const NPH_ID = 47;
export const ULR_WEB_WALLET = 'https://chrome.google.com/webstore/detail/beam-web-wallet/ilhaljfiglknggcoegeknjghdgampffk';

export const ASSET_BEAM = {
  N: 'Beam Coin',
  SN: 'BEAM',
  UN: 'Beam',
  NTHUN: 'Groth',
};

export const kindSelect = [
  { value: Kind.Low, label: '0.05%' },
  { value: Kind.Mid, label: '0.3%' },
  { value: Kind.High, label: '1%' },
];

export const SORT = [
  { name: 'All', value: 'all' },
  { name: 'My', value: 'my' },
  { name: 'Liquid', value: 'liquid' },
  { name: 'Empty', value: 'empty' },
  { name: 'Favorites', value: 'fav' },
];

export const titleSections = {
  ADD_LIQUIDITY: 'input deposit asset',
  ADD_LIQUIDITY_SEND: 'Send Amount',
  TRADE_RECEIVE: 'Receive Amount',
  TRADE_SEND: 'Send Amount (estimated) ',
  CREATE_FIRST: 'Select first asset',
  CREATE_SECOND: 'Select second asset',
  FEE: 'select FEE TIER',
};

export const placeHolder = {
  ASSETS: 'Select asset',
  FEE: 'select FEE TIER',
  SEARCH: 'All assets',
};
