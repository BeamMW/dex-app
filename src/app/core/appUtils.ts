import {
  IAddLiquidity, IAsset, ICreatePool, IPoolCard, ITrade, ITxStatus, Kind,
} from '@core/types';
import { ASSET_BEAM, GROTHS_IN_BEAM } from '@app/shared/constants';

export function parseMetadata(metadata) {
  const splittedMetadata = metadata.split(';');
  splittedMetadata.shift();
  const obj = splittedMetadata.reduce((accumulator, value, index) => {
    const data = value.split(/=(.*)/s);
    return { ...accumulator, [data[0]]: data[1] };
  }, {});
  return obj;
}

export const getPoolKind = (kind: number) => {
  let kindDesc = null;

  if (kind === Kind.Low) kindDesc = '0.05%';

  if (kind === Kind.Mid) kindDesc = '0.3%';

  if (kind === Kind.High) kindDesc = '1%';

  return kindDesc;
};

export const parsePoolMetadata = (poolCard, aid1, aid2, assetList: IAsset[]) => {
  let data = poolCard;
  if (aid1 === 0) {
    data = { ...data, metadata1: ASSET_BEAM };
  } else {
    assetList.filter((item) => {
      if (aid1 === item.aid) {
        data = { ...data, metadata1: item.parsedMetadata };
      }
    });
  }
  if (aid2 === 0) {
    data = { ...data, metadata2: ASSET_BEAM };
  } else {
    assetList.filter((item) => {
      if (aid2 === item.aid) {
        data = { ...data, metadata2: item.parsedMetadata };
      }
    });
  }
  return data;
};

export function fromGroths(value: number): number {
  return value && value !== 0 ? value / GROTHS_IN_BEAM : 0;
}

export function toGroths(value: number): number {
  const val = Number(parseFloat((value * GROTHS_IN_BEAM).toString()).toPrecision(12));
  return value > 0 ? Math.floor(val) : 0;
}

export function parseIntToNum(value: string): number {
  const val = parseInt(value);
  return parseInt(value) > 0 ? Math.floor(val) : 0;
}

export function checkTxStatus(txId: string, txList: ITxStatus[]) {
  let status;
  txList.txs?.filter((item) => {
    if (item.txId === txId) {
      status = item.status;
    }
  });
  return status;
}

export function setDataRequest(data) {
  return { ...data, bPredictOnly: 0 };
}
export function onFilter(data: IPoolCard[], filter, assetsList: IAsset[]) {
  switch (filter) {
    case 'all': {
      return data;
    }
    case 'my': {
      return data.filter((el) => el.creator);
    }
    case 'liquid': {
      return data.filter((el) => el.ctl);
    }
    case 'empty': {
      return data.filter((el) => !el.ctl);
    }
    default:
      return data;
  }
}
