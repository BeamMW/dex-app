import {
  IAccumulatorRewardsState, IAsset, IOptions, IPoolCard, IPredict, ITxStatus,
} from '@core/types';
import { ShaderRuntimeMap } from '@app/core/shaderRegistry';

export interface DexStateType {
  assetsList: IAsset[];
  poolsList: IPoolCard[];
  tx_status: ITxStatus[] | null;
  statusTransaction: number | null;
  predict: IPredict;
  currentPool: IPoolCard;
  filter: string;
  options: IOptions[];
  favorites: IPoolCard[];
  favoriteAssets: number[];
  currentLPToken: IPoolCard;
  isLoading: boolean;
  myPools: IPoolCard[];
  isHeadless: boolean;
  shaderRuntimeMap: ShaderRuntimeMap | null;
  rewards: IAccumulatorRewardsState;
}
