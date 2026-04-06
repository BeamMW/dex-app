import { CURRENT_NETWORK, NETWORK } from '@app/shared/constants';
// eslint-disable-next-line import/no-named-as-default, import/extensions
import BeamDappConnector from './BeamDappConnector.js';

const headlessNode = CURRENT_NETWORK === NETWORK.MAINNET
  ? 'eu-node01.mainnet.beam.mw:8200'
  : 'eu-node02.dappnet.beam.mw:8200';

const connector = new BeamDappConnector({
  appName: 'DEX',
  minApiVersion: '7.3',
  headlessNode,
  network: CURRENT_NETWORK === NETWORK.MAINNET ? 'mainnet' : 'dappnet',
  debug: false,
});

export default connector;
