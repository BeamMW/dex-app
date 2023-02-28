import {
  IAsset, IOptions, IPoolCard, IPredict, ITxStatus, Kind,
} from '@core/types';
import { ASSET_BEAM, GROTHS_IN_BEAM } from '@app/shared/constants';

const LENGTH_MAX = 6;

export function parseMetadata(metadata) {
  const splittedMetadata = metadata.split(';');
  splittedMetadata.shift();
  const obj = splittedMetadata.reduce((accumulator, value) => {
    const data = value.split(/=(.*)/s);
    return { ...accumulator, [data[0]]: data[1] };
  }, {});
  return obj;
}
export function truncate(value: string, len = LENGTH_MAX): string {
  if (!value) {
    return '';
  }

  if (value.length <= len) {
    return value;
  }

  return `${value.slice(0, len)}…`;
}

export function getOptions(assets: IAsset[]) {
  let options = [
    {
      value: 0,
      label: 'BEAM',
    },
  ];

  assets.map((item) => {
    options = [...options, { value: item.aid, label: `${truncate(item.parsedMetadata.UN)}` }];
    return options;
  });
  return options;
}
export function numFormatter(num) {
  if (num > 999 && num < 1000000) {
    return `${parseFloat((num / 1000).toFixed(2))}K`;
  }
  if (num >= 1000000) {
    return `${parseFloat((num / 1000000).toFixed(2))}M`;
  }
  if (num <= 999) {
    return parseFloat(num.toFixed(2));
  }
}

export const getPoolKind = (kind: number) => {
  let kindDesc = null;

  if (kind === Kind.Low) {
    kindDesc = '0.05%';
  }

  if (kind === Kind.Mid) {
    kindDesc = '0.3%';
  }

  if (kind === Kind.High) {
    kindDesc = '1%';
  }

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
      return data;
    });
  }
  if (aid2 === 0) {
    data = { ...data, metadata2: ASSET_BEAM };
  } else {
    assetList.filter((item) => {
      if (aid2 === item.aid) {
        data = { ...data, metadata2: item.parsedMetadata };
      }
      return data;
    });
  }
  return data;
};

export function fromGroths(value: number): string | number {
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
  // TODO: type rr
  // @ts-ignore
  txList.txs.find((item) => {
    if (item.txId === txId) {
      status = item.status;
    }
    return status;
  });
  return status;
}

export function setDataRequest(data) {
  return { ...data, bPredictOnly: 0 };
}
export function onFilter(data: IPoolCard[], filter, favorite: IPoolCard[]) {
  switch (filter) {
    case 'all': {
      return data.sort((a, b) => b.ctl - a.ctl);
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
    case 'fav': {
      return favorite;
    }
    default:
      return data.sort((a, b) => b.ctl - a.ctl);
  }
}

export const emptyPredict = (data: IPredict, amount: string | number): boolean => !data || !amount || amount === '0';

export const onPredictValue = (value, swap: boolean, predict: IPredict) => {
  if (!predict || value.value === 0) {
    return 0;
  }
  if (swap) {
    return fromGroths(predict.tok1);
  }
  return fromGroths(predict.tok2);
};
export const getFilterPools = (value: IOptions, data: IPoolCard[]): IPoolCard[] => {
  let newList = [];
  if (value !== null || undefined) {
    newList = data.filter((el) => el.aid1 === value.value || el.aid2 === value.value || el['lp-token'] === value.value);
    return newList.length === 0 ? null : newList;
  }
  return data;
};

export const getTotalFee = (daoFee: number, poolFee: number) => daoFee + poolFee;
export function convertLowAmount(explicitNum) {
  if (explicitNum !== undefined) {
    const data = explicitNum.split(/[eE]/);
    if (data.length === 1) {
      return data[0];
    }
    let z = '';
    const sign = explicitNum.slice(0, 1) === '-' ? '-' : '';
    const str = data[0].replace('.', '');
    let mag = Number(data[1]) + 1;
    if (mag <= 0) {
      z = `${sign}0.`;
      while (!(mag >= 0)) {
        z += '0';
        ++mag;
      }
      const num = z + str.replace(/^\-/, '');
      if (explicitNum) {
        return parseFloat(num);
      }
      return num;
    }
    if (str.length <= mag) {
      mag -= str.length;
      while (!(mag <= 0)) {
        z += 0;
        --mag;
      }
      const num = str + z;
      if (explicitNum) {
        return parseFloat(num);
      }
      return num;
    }
    const leader = parseFloat(data[0]);
    const multiplier = Math.pow(10, parseInt(data[1]));
    return leader * multiplier;
  }
  return 0;
}

export function isInArray(card, arr: IPoolCard[]) {
  if (card && arr) {
    if (card.isArray) {
      card.map((item: IPoolCard) => item.aid1 === card.aid1 && item.aid2 === card.aid2 && item.kind === card.kind);
    } else {
      if (arr.some((e) => e.aid1 === card.aid1 && e.aid2 === card.aid2 && e.kind === card.kind)) {
        return true;
      }
      return false;
    }
    return false;
  }
  return false;
}

export function getLPToken(poolCard: IPoolCard, assets: IAsset[]): IAsset {
  let currentLpToken = null;
  if (poolCard && assets) {
    currentLpToken = assets.find((el) => el.aid === poolCard['lp-token']);
    return currentLpToken;
  }
  return currentLpToken;
}

export function setStorage() {
  const fav = JSON.parse(localStorage.getItem('favorites'));
  if (!fav) {
    localStorage.setItem('favorites', JSON.stringify([]));
  }
  return fav;
}
