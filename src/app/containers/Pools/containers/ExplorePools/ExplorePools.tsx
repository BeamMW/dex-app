import React, { useMemo, useState } from 'react';
import { styled } from '@linaria/react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IPoolCard } from '@core/types';
import {
  Button, Container, ReactSelect, Window,
} from '@app/shared/components';
import {
  fromGroths, getPoolKind, getFilterPools, onFilter, truncate,
} from '@core/appUtils';
import { IconFavorite, IconFavoriteFilled, IconPlus } from '@app/shared/icons';
import { ROUTES, SORT } from '@app/shared/constants';
import {
  selectFavorites, selectFilter, selectMyPools, selectOptions, selectPoolsList,
} from '@app/containers/Pools/store/selectors';
import * as mainActions from '@app/containers/Pools/store/actions';
import AssetIcon from '@app/shared/components/AssetsIcon';

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
  width: 260px;
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
  border-bottom: ${({ active }) => (active ? '2px solid var(--color-green)' : 'transparent')};
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 8px;
  cursor: pointer;
`;

const Table = styled.table`
  width: 100%;
  max-width: 1100px;
  border-collapse: collapse;
  th,
  td {
    text-align: left;
    padding: 10px 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
  th {
    font-size: 12px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.6);
  }
`;
const FavButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
`;
const Row = styled.tr`
  cursor: pointer;
`;
const PairCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const PairText = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;
const TokenCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ExplorePools = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector(selectPoolsList());
  const favorites = useSelector(selectFavorites());
  const options = useSelector(selectOptions());
  const currentFilter = useSelector(selectFilter());
  const myPools = useSelector(selectMyPools());
  const [assetFilter, setAssetFilter] = useState(null);
  const formatNum = (value) => Number(value).toLocaleString('en-US', { maximumFractionDigits: 8 });
  const favoriteSet = useMemo(
    () => new Set((favorites || []).map((item: IPoolCard) => `${item.aid1}-${item.aid2}-${item.kind}`)),
    [favorites],
  );

  const rows = useMemo(() => {
    const filteredByTab = onFilter(data, currentFilter, favorites);
    return getFilterPools(assetFilter, filteredByTab) || [];
  }, [data, currentFilter, favorites, assetFilter]);

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
            <ReactSelect
              options={options}
              isClearable
              onChange={(value) => setAssetFilter(value)}
              isIcon
              hideValueWhileSearching
              placeholder="Search..."
              customPrefix="custom-filter"
            />
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
        <Table>
          <thead>
            <tr>
              <th>Favorite</th>
              <th>Pair</th>
              <th>Token 1</th>
              <th>Token 2</th>
              <th>Fee Rate</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((pool) => (
              <Row
                key={`${pool.aid1}_${pool.aid2}_${pool.kind}`}
                onClick={() => onOpenTrade(pool)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenTrade(pool);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <td>
                  <FavButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavorite(pool);
                    }}
                    type="button"
                    aria-label="Toggle pool favorite"
                  >
                    {favoriteSet.has(`${pool.aid1}-${pool.aid2}-${pool.kind}`)
                      ? <IconFavoriteFilled />
                      : <IconFavorite />}
                  </FavButton>
                </td>
                <td>
                  <PairCell>
                    <AssetIcon asset_id={pool.aid1} />
                    <AssetIcon asset_id={pool.aid2} />
                    <PairText>
                      {`${truncate(pool.metadata1?.UN || 'Token')} (id:${pool.aid1}) / ${
                        truncate(pool.metadata2?.UN || 'Token')
                      } (id:${pool.aid2})`}
                    </PairText>
                  </PairCell>
                </td>
                <td>
                  <TokenCell>
                    <AssetIcon asset_id={pool.aid1} />
                    {formatNum(fromGroths(pool.tok1))}
                  </TokenCell>
                </td>
                <td>
                  <TokenCell>
                    <AssetIcon asset_id={pool.aid2} />
                    {formatNum(fromGroths(pool.tok2))}
                  </TokenCell>
                </td>
                <td>{getPoolKind(pool.kind)}</td>
              </Row>
            ))}
          </tbody>
        </Table>
      </Container>
    </Window>
  );
};

export default ExplorePools;
