import Utils from '@core/utils.js';
import {
  IAddLiquidity, ICreatePool, IError, ITrade, ITxId, IWithdraw,
} from '@core/types';
import {CID} from "@app/shared/constants";


const onMakeTx = (err, sres, full) => {
  if (err) {
    console.log(err, 'Failed to generate transaction request');
  }
  return new Promise((resolve) => {
    Utils.callApi('process_invoke_data', { data: full.result.raw_data }, (error, result) => {
      resolve(result);
    });
  });
};

export function LoadAssetsList<T = any>(payload): Promise<T> {
  return new Promise((resolve, reject) => {
    Utils.callApi(
       'assets_list', { refresh: true},
      (error, result) => {
        if (error) {
          reject(error);
          console.log('errrrrrr');
        }
        resolve(result.assets);
        console.log(result);
        console.log('apiREs');
      },
      payload || null,
    );
  });
}

export function LoadPoolsList<T = any>(payload?): Promise<T> {
  return new Promise((resolve) => {
    Utils.invokeContract(
      `action=pools_view,cid=${CID}`,
      (error, result) => {
        resolve(result.res);
      },
      payload || null,
    );
  });
}
export function CreatePoolApi<T = any>([{ aid1 = 180, aid2 = 210, kind = 1 }]: ICreatePool[]): Promise<T> | any {
  return new Promise((resolve, reject) => {
    Utils.invokeContract(
      `action=pool_create,aid1=${aid1},aid2=${aid2},kind=${kind},cid=${CID}`,
      (error: IError, result, full) => {
        if (error) {
          reject(error);
        }
        onMakeTx(error, result, full).then((res: ITxId) => {
          resolve(res);
        });
      },
    );
  });
}
export function AddLiquidityApi<T = any>({
  aid1,
  aid2,
  kind,
  val1,
  val2,
  bPredictOnly = 1,
}: IAddLiquidity): Promise<T> | any {
  return new Promise((resolve, reject) => {
      console.log( aid1,
          aid2,
          kind,
          val1,
          val2,)
    Utils.invokeContract(
      `action=pool_add_liquidity,aid1=${aid1},aid2=${aid2},kind=${kind},val1=${val1},val2=${val2},bPredictOnly=${bPredictOnly},cid=${CID}`,
      (error, result, full) => {
        if (error) {
          reject(error);
        }
        onMakeTx(error, result, full).then((res) => {
          if (res) {
            resolve(res);
          }
          resolve(result);
        });
      },
    );
  });
}
export function TradePoolApi<T = any>({
  aid1, aid2, kind, val1_buy, val2_pay, bPredictOnly = 1,
}: ITrade): Promise<T> | any {
  return new Promise((resolve, reject) => {
    Utils.invokeContract(
      `action=pool_trade,aid1=${aid1},aid2=${aid2},kind=${kind},val1_buy=${val1_buy || 0}, val2_pay=${val2_pay || 0},bPredictOnly=${bPredictOnly},cid=${CID}`,
      (error, result, full) => {
        if (error) {
          reject(error);
        }
        onMakeTx(error, result, full).then((res) => {
          if (res) {
            resolve(res);
          }
          resolve(result);
        });
      },
    );
  });
}

export function WithdrawApi<T = any>({
  aid1, aid2, kind, ctl, bPredictOnly = 1,
}: IWithdraw): Promise<T> | any {
  return new Promise((resolve, reject) => {
    Utils.invokeContract(
      `action=pool_withdraw,aid1=${aid1},aid2=${aid2},kind=${kind},ctl=${ctl},bPredictOnly=${bPredictOnly},cid=${CID}`,
      (error, result, full) => {
        if (error) {
          reject(error);
        }
        onMakeTx(error, result, full).then((res) => {
          if (res) {
            resolve(res);
          }
          resolve(result);
        });
      },
    );
  });
}
// TODO: ADD TYPE
