import connector from '@core/connector';
import {
  IAddLiquidity, ICreatePool, ITrade, IWithdraw,
} from '@core/types';
import { CID } from '@app/shared/constants';

/**
 * Call invoke_contract and return { shaderResult, rawData }.
 * We call callApi directly (not invokeContract) so we retain raw_data
 * alongside the parsed shader output.
 */
async function invokeRaw(args: string, contractBytes?: number[] | null) {
  const params: Record<string, any> = { create_tx: false, args };
  if (contractBytes) params.contract = contractBytes;

  const result = await connector.callApi('invoke_contract', params);

  let shaderResult: any = null;
  if (result?.output && typeof result.output === 'string') {
    const parsed = JSON.parse(result.output);
    if (parsed.error) throw new Error(parsed.error);
    shaderResult = parsed;
  }

  return { shaderResult, rawData: result?.raw_data ?? null };
}

/**
 * Submit raw_data via process_invoke_data and return the txid.
 * Swallows user-cancel/rejection by returning undefined.
 */
async function makeTx(rawData: any[]): Promise<string | undefined> {
  try {
    const res: any = await connector.processInvokeData(rawData);
    return res?.txid;
  } catch (e: any) {
    // Connector rejects with Error('Wallet is locked') for user-cancel (-32021)
    if (e instanceof Error && e.message === 'Wallet is locked') return undefined;
    throw e;
  }
}

export async function LoadAssetsList<T = any>(): Promise<T> {
  const result = await connector.callApi('assets_list', { refresh: true });
  const assets = Array.isArray(result) ? result : (result?.assets ?? []);
  return assets as unknown as T;
}

export async function LoadPoolsList<T = any>(payload?): Promise<T> {
  const { shaderResult } = await invokeRaw(`action=pools_view,cid=${CID}`, payload || null);
  return shaderResult?.res as unknown as T;
}

export async function CreatePoolApi<T = any>([{ aid1 = 180, aid2 = 210, kind = 1 }]: ICreatePool[]): Promise<T> {
  const { rawData } = await invokeRaw(`action=pool_create,aid1=${aid1},aid2=${aid2},kind=${kind},cid=${CID}`);
  const txid = rawData ? await makeTx(rawData) : undefined;
  return { txid } as unknown as T;
}

export async function AddLiquidityApi<T = any>({
  aid1,
  aid2,
  kind,
  val1,
  val2,
  bPredictOnly = 1,
}: IAddLiquidity): Promise<T> {
  const { shaderResult, rawData } = await invokeRaw(
    `action=pool_add_liquidity,aid1=${aid1},aid2=${aid2},kind=${kind},`
    + `val1=${val1},val2=${val2},bPredictOnly=${bPredictOnly},cid=${CID}`,
  );
  if (rawData?.length) {
    const txid = await makeTx(rawData);
    return { txid } as unknown as T;
  }
  return (shaderResult ?? {}) as unknown as T;
}

export async function TradePoolApi<T = any>({
  aid1, aid2, kind, val1_buy, val2_pay, bPredictOnly = 1,
}: ITrade): Promise<T> {
  const { shaderResult, rawData } = await invokeRaw(
    `action=pool_trade,aid1=${aid1},aid2=${aid2},kind=${kind},val1_buy=${val1_buy || 0},`
    + ` val2_pay=${val2_pay || 0},bPredictOnly=${bPredictOnly},cid=${CID}`,
  );
  if (rawData?.length) {
    const txid = await makeTx(rawData);
    return { txid } as unknown as T;
  }
  return (shaderResult ?? {}) as unknown as T;
}

export async function WithdrawApi<T = any>({
  aid1, aid2, kind, ctl, bPredictOnly = 1,
}: IWithdraw): Promise<T> {
  const { shaderResult, rawData } = await invokeRaw(
    `action=pool_withdraw,aid1=${aid1},aid2=${aid2},kind=${kind},ctl=${ctl},bPredictOnly=${bPredictOnly},cid=${CID}`,
  );
  if (rawData?.length) {
    const txid = await makeTx(rawData);
    return { txid } as unknown as T;
  }
  return (shaderResult ?? {}) as unknown as T;
}
