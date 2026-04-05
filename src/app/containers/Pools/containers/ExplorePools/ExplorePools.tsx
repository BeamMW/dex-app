import React, { useMemo, useState } from 'react';
import { styled } from '@linaria/react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IOptions, IPoolCard } from '@core/types';
import {
  Button, Container, Window,
} from '@app/shared/components';
import { AssetSelectorButton } from '@app/shared/components/AssetSearchModal';
import { getFilterPools, onFilter } from '@core/appUtils';
import { CancelIcon, IconPlus } from '@app/shared/icons';
import { ROUTES, SORT } from '@app/shared/constants';
import {
  selectFavorites, selectFilter, selectMyPools, selectPoolsList,
} from '@app/containers/Pools/store/selectors';
import * as mainActions from '@app/containers/Pools/store/actions';
import { PoolTable } from '@app/containers/Pools/containers/shared/PoolTable';

const Header = styled.div`
  width: 100%;
  max-width: 1100px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  @media (max-width: 913px) {
    flex-direction: column;
  }
`;

const Left = styled.div`
  flex: 0 0 260px;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
`;

const SelectorWrap = styled.div`
  flex: 1;
  min-width: 0;
`;

const Center = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const Right = styled.div`
  width: 180px;
  display: flex;
  justify-content: flex-end;
`;

const Sort = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const SortButton = styled.button<{ active: boolean }>`
  background: transparent;
  border: none;
  color: ${({ active }) => (active ? 'white' : 'rgba(255, 255, 255, 0.5)')};
  border-bottom: ${({ active }) => (active ? '2px solid var(--color-green)' : '2px solid transparent')};
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 8px;
  cursor: pointer;
`;

const ClearBtn = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.4);
  padding: 4px;
  flex-shrink: 0;

  &:hover { color: white; }
`;

export const ExplorePools = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector(selectPoolsList());
  const favorites = useSelector(selectFavorites());
  const currentFilter = useSelector(selectFilter());
  const myPools = useSelector(selectMyPools());
  const [assetFilter, setAssetFilter] = useState<IOptions | null>(null);
  const [pairFilter, setPairFilter] = useState<{ aid1: number; aid2: number; label: string } | null>(null);

  const rows = useMemo(() => {
    const filteredByTab = onFilter(data, currentFilter, favorites);
    if (pairFilter) {
      return filteredByTab.filter((p) => (p.aid1 === pairFilter.aid1 && p.aid2 === pairFilter.aid2)
        || (p.aid1 === pairFilter.aid2 && p.aid2 === pairFilter.aid1));
    }
    return getFilterPools(assetFilter, filteredByTab) || [];
  }, [data, currentFilter, favorites, assetFilter, pairFilter]);

  const handleFavorite = (pool: IPoolCard) => {
    dispatch(mainActions.onFavorites.request(pool));
  };

  const onOpenTrade = (pool: IPoolCard) => {
    dispatch(mainActions.setCurrentPool(pool));
    dispatch(mainActions.setPredict(null));
    navigate(ROUTES.NAV.TRADE);
  };

  return (
    <Window hideHeader>
      <Container>
        <Header>
          <Left>
            <SelectorWrap>
              <AssetSelectorButton
                value={pairFilter ? { value: -1, label: pairFilter.label } : assetFilter}
                onSelect={(opt) => { setAssetFilter(opt); setPairFilter(null); }}
                placeholder="Search..."
                mode="explore"
                onPairSelect={(aid1, aid2, label) => { setPairFilter({ aid1, aid2, label }); setAssetFilter(null); }}
              />
            </SelectorWrap>
            {(assetFilter || pairFilter) && (
              <ClearBtn onClick={() => { setAssetFilter(null); setPairFilter(null); }} type="button" aria-label="Clear filter">
                <CancelIcon />
              </ClearBtn>
            )}
          </Left>
          <Center>
            <Sort>
              {SORT.map((item) => (
                <SortButton
                  key={item.value}
                  active={currentFilter === item.value}
                  onClick={() => dispatch(mainActions.setFilter(item.value))}
                  disabled={!!((item.value === 'fav' && !favorites.length) || (item.value === 'created' && !myPools.length))}
                >
                  {item.name}
                </SortButton>
              ))}
            </Sort>
          </Center>
          <Right>
            <Button icon={IconPlus} variant="ghost" onClick={() => navigate(ROUTES.POOLS.CREATE_POOL)}>
              Create Pool
            </Button>
          </Right>
        </Header>
        <PoolTable
          rows={rows}
          favorites={favorites || []}
          onFavorite={handleFavorite}
          onOpenTrade={onOpenTrade}
        />
      </Container>
    </Window>
  );
};

export default ExplorePools;
