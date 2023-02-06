import {
  IAsset, IOptions, IPoolCard, IPredict, ITxStatus, Kind,
} from '@core/types';
import { ASSET_BEAM, GROTHS_IN_BEAM } from '@app/shared/constants';

export function parseMetadata(metadata) {
  const splittedMetadata = metadata.split(';');
  splittedMetadata.shift();
  const obj = splittedMetadata.reduce((accumulator, value) => {
    const data = value.split(/=(.*)/s);
    return { ...accumulator, [data[0]]: data[1] };
  }, {});
  return obj;
}

export function getOptions(assets: IAsset[]) {
  let options = [
    {
      value: 0,
      label: 'BEAM',
    },
  ];

  assets.map((item) => {
    options = [...options, { value: item.aid, label: `${item.parsedMetadata.UN}` }];
    return options;
  });
  return options;
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
export function onFilter(data: IPoolCard[], filter) {
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
    default:
      return data.sort((a, b) => b.ctl - a.ctl);
  }
}

export const emptyPredict = (data: IPredict, amount: string | number): boolean => !data || !amount || amount === '0';
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
export const onPredictValue = (value, swap: boolean, predict: IPredict) => {
  if (!predict || value.value === 0) {
    return 0;
  }
  if (swap) {
    return fromGroths(predict.tok1);
  }
  return fromGroths(predict.tok2);
};

// export const getFilterPools = (filtered: IOptions[], data:IPoolCard[]):IPoolCard[] => {
//   if (filtered.length !== 0) {
//     let newList = [];
//     filtered.map((el) => {
//       data.map((item) => {
//         if (item.aid1 === el.value || item.aid2 === el.value) {
//           newList = [...newList, item];
//         }
//         return newList;
//       });
//       console.log(newList);
//       return newList;
//     });
//     return newList;
//   } return data;
// };
export const getFilterPools = (value: IOptions,
  data: IPoolCard[]): IPoolCard[] => {
  let newList = [];
  if (value !== null || undefined) {
    newList = data.filter((el) => el.aid1 === value.value || el.aid2 === value.value);
    return newList.length === 0 ? null : newList;
  } return data;
};

export const getTotalFee = (daoFee: number, poolFee: number) => daoFee + poolFee;
