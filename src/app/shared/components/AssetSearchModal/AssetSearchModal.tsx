import React, { useEffect, useMemo, useState } from 'react';
import { styled } from '@linaria/react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IAsset, IOptions } from '@core/types';
import { assetShortLabel } from '@core/appUtils';
import { selectAssetsList, selectPoolsList } from '@app/containers/Pools/store/selectors';
import { ASSET_BEAM } from '@app/shared/constants';
import AssetIcon from '@app/shared/components/AssetsIcon';
import { CancelIcon } from '@app/shared/icons';
import { AssetSearchModalProps } from './AssetSearchModal.types';

const BEAM_ASSET: IAsset = {
  asset_id: 0,
  metadata: '',
  parsedMetadata: ASSET_BEAM as any,
  owner_pk: '',
};

type SearchTab = 'ALL' | 'ASSET' | 'POOL';

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10100;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalPanel = styled.div`
  width: 420px;
  max-width: 92vw;
  max-height: 70vh;
  background: var(--color-dark-blue);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 12px;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const ModalTitle = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  opacity: 0.5;
  &:hover { opacity: 1; }
`;

const SearchInput = styled.input`
  margin: 12px 16px 0;
  width: calc(100% - 32px);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: white;
  font-size: 14px;
  font-family: 'ProximaNova', 'SFProDisplay', sans-serif;
  padding: 10px 14px;
  outline: none;
  flex-shrink: 0;
  box-sizing: border-box;
  &::placeholder { color: rgba(255, 255, 255, 0.4); }
  &:focus { border-color: var(--color-green); }
`;

const TabBar = styled.div`
  display: flex;
  gap: 0;
  padding: 10px 16px 0;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const TabButton = styled.button<{ active: boolean }>`
  background: transparent;
  border: none;
  color: ${({ active }) => (active ? 'white' : 'rgba(255, 255, 255, 0.5)')};
  border-bottom: ${({ active }) => (active ? '2px solid var(--color-green)' : '2px solid transparent')};
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 12px 8px;
  cursor: pointer;
`;

const ResultList = styled.div`
  overflow-y: auto;
  flex: 1;
  padding: 6px 0 8px;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover { background: var(--color-green); }
`;

const SectionLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.35);
  padding: 10px 16px 4px;
`;

const AssetRow = styled.button<{ excluded?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 16px;
  background: transparent;
  border: none;
  cursor: ${({ excluded }) => (excluded ? 'not-allowed' : 'pointer')};
  color: white;
  text-align: left;
  opacity: ${({ excluded }) => (excluded ? 0.3 : 1)};
  &:hover { background: ${({ excluded }) => (excluded ? 'transparent' : 'rgba(255, 255, 255, 0.05)')}; }
`;

const AssetRowText = styled.div`
  flex: 1;
  min-width: 0;
`;

const AssetName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AssetSub = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
  text-transform: uppercase;
  margin-top: 1px;
`;

const AssetIdBadge = styled.span`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.3);
  white-space: nowrap;
  flex-shrink: 0;
`;

const RowAction = styled.span`
  font-size: 10px;
  color: var(--color-green);
  opacity: 0.6;
  white-space: nowrap;
  flex-shrink: 0;
  margin-left: 4px;
`;

const NoResults = styled.div`
  padding: 24px 16px;
  color: rgba(255, 255, 255, 0.35);
  font-size: 13px;
  text-align: center;
`;

const AssetSearchModal: React.FC<AssetSearchModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  excludeAssetId = null,
  mode = 'asset-only',
  title,
  onPairSelect,
}) => {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<SearchTab>('ALL');
  const assetsList = useSelector(selectAssetsList());
  const poolsList = useSelector(selectPoolsList());
  const navigate = useNavigate();

  const getAssetId = (asset: IAsset) => asset.asset_id ?? (asset as any).aid ?? 0;

  const allAssets = useMemo<IAsset[]>(() => [BEAM_ASSET, ...(assetsList || [])], [assetsList]);

  const filteredAssets = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allAssets;
    return allAssets.filter((asset) => {
      const id = String(asset.asset_id ?? (asset as any).aid ?? '');
      const m = asset.parsedMetadata;
      return (
        id === q
        || (m?.SN || '').toLowerCase().includes(q)
        || (m?.UN || '').toLowerCase().includes(q)
        || (m?.N || '').toLowerCase().includes(q)
      );
    });
  }, [allAssets, query]);

  const poolPairResults = useMemo(() => {
    if (mode !== 'explore' || !query.includes('/')) return [];
    const [leftQ, rightQ] = query.split('/').map((s) => s.trim().toLowerCase());
    if (!leftQ) return [];

    const matchAssets = (q: string, exact = false) => allAssets.filter((a) => {
      const m = a.parsedMetadata;
      const idStr = String(a.asset_id ?? (a as any).aid ?? '');
      if (exact) {
        return (m?.SN || '').toLowerCase() === q
          || (m?.UN || '').toLowerCase() === q
          || (m?.N || '').toLowerCase() === q
          || idStr === q;
      }
      return (m?.SN || '').toLowerCase().includes(q)
        || (m?.UN || '').toLowerCase().includes(q)
        || (m?.N || '').toLowerCase().includes(q)
        || idStr.includes(q);
    });

    const lefts = matchAssets(leftQ, true); // exact: "BEAM" must not match "BEAMX"
    const results: Array<{ aid1: number; aid2: number; label: string }> = [];
    const seen = new Set<string>();

    for (const l of lefts) {
      const lid = getAssetId(l);
      const matchingPools = (poolsList || []).filter((p) => p.aid1 === lid || p.aid2 === lid);

      for (const pool of matchingPools) {
        const otherId = pool.aid1 === lid ? pool.aid2 : pool.aid1;

        // If right side is being typed, filter the other asset by it
        if (rightQ) {
          const otherAsset = allAssets.find((a) => getAssetId(a) === otherId);
          if (!otherAsset) continue;
          const om = otherAsset.parsedMetadata;
          const matches = (om?.SN || '').toLowerCase().includes(rightQ)
            || (om?.UN || '').toLowerCase().includes(rightQ)
            || (om?.N || '').toLowerCase().includes(rightQ)
            || String(otherId).includes(rightQ);
          if (!matches) continue;
        }

        const key = `${pool.aid1}-${pool.aid2}`;
        if (seen.has(key)) continue;
        seen.add(key);

        const otherAsset = allAssets.find((a) => getAssetId(a) === otherId);
        const otherLabel = otherAsset ? assetShortLabel(otherAsset.parsedMetadata) : String(otherId);
        const leftFirst = pool.aid1 === lid;
        results.push({
          aid1: leftFirst ? lid : otherId,
          aid2: leftFirst ? otherId : lid,
          label: `${assetShortLabel(l.parsedMetadata)}/${otherLabel}`,
        });
      }
    }
    return results;
  }, [mode, query, allAssets, poolsList]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTab('ALL');
    }
  }, [isOpen]);

  useEffect(() => {
    if (mode === 'explore' && query.includes('/')) setTab('POOL');
  }, [mode, query]);

  if (!isOpen) return null;

  const buildOption = (asset: IAsset): IOptions => ({
    value: getAssetId(asset),
    label: assetShortLabel(asset.parsedMetadata),
  });

  const handleAssetOnlySelect = (asset: IAsset) => {
    const id = getAssetId(asset);
    if (id === excludeAssetId) return;
    onSelect(buildOption(asset));
    onClose();
  };

  const handleNavigateToAsset = (asset: IAsset) => {
    navigate(`/asset/${getAssetId(asset)}`);
    onClose();
  };

  const handleFilterSelect = (asset: IAsset) => {
    onSelect(buildOption(asset));
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const defaultTitle = mode === 'explore' ? 'Search' : 'Select a token';

  const KIND_PCT: Record<number, string> = { 0: '0.05%', 1: '0.3%', 2: '1%' };

  const getAmmLabel = (asset: IAsset): string | null => {
    const m = asset.parsedMetadata;
    if ((m as any)?.SN !== 'AmmL') return null;
    const match = ((m as any)?.N || '').match(/Amm Liquidity Token (\d+)-(\d+)-(\d+)/);
    if (!match) return null;
    const aid1 = parseInt(match[1], 10);
    const aid2 = parseInt(match[2], 10);
    const kind = parseInt(match[3], 10);
    const a1 = allAssets.find((a) => getAssetId(a) === aid1);
    const a2 = allAssets.find((a) => getAssetId(a) === aid2);
    const t1 = a1 ? assetShortLabel(a1.parsedMetadata) : String(aid1);
    const t2 = a2 ? assetShortLabel(a2.parsedMetadata) : String(aid2);
    return `AMML (${t1}/${t2} - ${KIND_PCT[kind] ?? `${kind}`})`;
  };

  const renderAssetRow = (
    asset: IAsset,
    onClick: (a: IAsset) => void,
    actionLabel?: string,
    keyPrefix = '',
  ) => {
    const id = getAssetId(asset);
    const m = asset.parsedMetadata;
    const ammLabel = getAmmLabel(asset);
    const name = ammLabel || m?.UN || m?.N || 'Unknown';
    const ticker = ammLabel ? null : assetShortLabel(m);
    const isExcluded = mode === 'asset-only' && id === excludeAssetId;

    return (
      <AssetRow
        key={`${keyPrefix}${id}`}
        type="button"
        excluded={isExcluded}
        onClick={() => !isExcluded && onClick(asset)}
        disabled={isExcluded}
      >
        <AssetIcon asset_id={id} />
        <AssetRowText>
          <AssetName>{name}</AssetName>
          {ticker && ticker !== name && <AssetSub>{ticker}</AssetSub>}
        </AssetRowText>
        <AssetIdBadge>{`id:${id}`}</AssetIdBadge>
        {actionLabel && <RowAction>{actionLabel}</RowAction>}
      </AssetRow>
    );
  };

  const noResults = filteredAssets.length === 0;

  const renderAssetList = (onClick: (a: IAsset) => void, action?: string, prefix = '', emptyMsg = 'No assets found') => (
    noResults
      ? <NoResults>{emptyMsg}</NoResults>
      : filteredAssets.map((a) => renderAssetRow(a, onClick, action, prefix))
  );

  const renderContent = () => {
    if (mode === 'asset-only') {
      return renderAssetList(handleAssetOnlySelect);
    }

    if (tab === 'ASSET') {
      return renderAssetList(handleNavigateToAsset, '→ info', 'nav-');
    }

    if (tab === 'POOL') {
      return renderAssetList(handleFilterSelect, '→ filter', 'flt-', 'No pools found');
    }

    // ALL tab
    return (
      <>
        <SectionLabel>Assets</SectionLabel>
        {renderAssetList(handleNavigateToAsset, '→ info', 'all-nav-')}
        <SectionLabel>Filter pools by asset</SectionLabel>
        {renderAssetList(handleFilterSelect, '→ filter', 'all-flt-', 'No pools found')}
      </>
    );
  };

  const modal = (
    <ModalBackdrop onClick={handleBackdropClick}>
      <ModalPanel onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{title || defaultTitle}</ModalTitle>
          <CloseButton onClick={onClose} aria-label="Close">
            <CancelIcon />
          </CloseButton>
        </ModalHeader>

        <SearchInput
          autoFocus
          placeholder="Search for a name or ID"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {mode === 'explore' && (
          <TabBar>
            {(['ALL', 'ASSET', 'POOL'] as SearchTab[]).map((t) => (
              <TabButton key={t} active={tab === t} onClick={() => setTab(t)}>
                {t}
              </TabButton>
            ))}
          </TabBar>
        )}

        <ResultList>
          {query.includes('/') && tab !== 'ASSET' ? (
            poolPairResults.length > 0 ? (
              <>
                <SectionLabel>Pools</SectionLabel>
                {poolPairResults.map((pair) => (
                  <AssetRow
                    key={`pair-${pair.aid1}-${pair.aid2}`}
                    type="button"
                    onClick={() => {
                      onPairSelect?.(pair.aid1, pair.aid2, pair.label);
                      onClose();
                    }}
                  >
                    <AssetIcon asset_id={pair.aid1} />
                    <AssetIcon asset_id={pair.aid2} />
                    <AssetRowText>
                      <AssetName>{pair.label}</AssetName>
                    </AssetRowText>
                    <RowAction>→ filter</RowAction>
                  </AssetRow>
                ))}
              </>
            ) : <NoResults>No pools found</NoResults>
          ) : renderContent()}
        </ResultList>
      </ModalPanel>
    </ModalBackdrop>
  );

  return modal;
};

export default AssetSearchModal;
