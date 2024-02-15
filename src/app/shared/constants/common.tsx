import { Kind } from '@core/types';

export const GROTHS_IN_BEAM = 100000000;
export const REG_AMOUNT = /^(?!0\d)(\d+)(\.)?(\d{0,8})?$/;

export enum NETWORK {
  MAINNET = "MAINNET",
  DAPPNET = "DAPPNET",}
const CID_MAINNET = '729fe098d9fd2b57705db1a05a74103dd4b891f535aef2ae69b47bcfdeef9cbf';
const CID_DAPPNET = '4e0a28b2b2a83b811ad17ba8228b0645dbce2969fd453a68fbc0b60bc8860e02';
// export const CURRENT_NETWORK: string = NETWORK.DAPPNET
export const CURRENT_NETWORK = NETWORK.MAINNET
export const BEAM_ID = 0


export const CID = CURRENT_NETWORK === NETWORK.MAINNET ?  CID_MAINNET :CID_DAPPNET;
export let BEAMX_ID = CURRENT_NETWORK === NETWORK.MAINNET ? 7 : 3;
export const NPH_ID = CURRENT_NETWORK === NETWORK.MAINNET ? 47 : 357;
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
  { name: 'Created', value: 'created' },
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
