import { Kind } from '@core/types';

export const GROTHS_IN_BEAM = 100000000;

export const ASSET_BEAM = {
  N: 'Beam Coin',
  SN: 'BEAM',
  UN: 'Beam',
  NTHUN: 'Groth',
};

export const kindSelect = [
  { value: Kind.Low, label: '0.05%' },
  { value: Kind.Mid, label: '0.03%' },
  { value: Kind.High, label: '1%' },
];

export const SORT = [
  { name: 'All', value: 'all' },
  { name: 'My', value: 'my' },
  { name: 'Liquid', value: 'liquid' },
  { name: 'Empty', value: 'empty' },
];
