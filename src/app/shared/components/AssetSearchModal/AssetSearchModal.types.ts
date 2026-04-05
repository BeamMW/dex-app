import { IOptions } from '@core/types';

export interface AssetSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called on asset selection (asset-only mode) or pool-filter selection (explore POOL tab) */
  onSelect: (option: IOptions) => void;
  excludeAssetId?: number | null;
  mode?: 'asset-only' | 'explore';
  title?: string;
  onPairSelect?: (aid1: number, aid2: number, label: string) => void;
}
