import React, { useMemo } from 'react';
import { styled } from '@linaria/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Button, Container, TableScrollViewport, Window,
} from '@app/shared/components';
import { ROUTES } from '@app/shared/constants';
import { selectFavorites, selectMyPools } from '@app/containers/Pools/store/selectors';
import * as mainActions from '@app/containers/Pools/store/actions';
import {
  IconExchangeTrade, IconFavorite, IconFavoriteFilled, IconShieldChecked,
} from '@app/shared/icons';
import { fromGroths, getPoolKind, truncate } from '@core/appUtils';
import { IPoolCard } from '@core/types';
import AssetIcon from '@app/shared/components/AssetsIcon';
import { iconButtonReset, rowCenter } from '../../../../styles/linariaShared';

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

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;
const Row = styled.tr`
  cursor: pointer;
`;
const FavButton = styled('button')`
  ${iconButtonReset}
`;
const PairCell = styled('div')`
  ${rowCenter}
  gap: 8px;
`;
const PairText = styled('div')`
  ${rowCenter}
  gap: 4px;
`;
const TokenCell = styled('div')`
  ${rowCenter}
  gap: 8px;
`;

export const MyPools = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const myPools = useSelector(selectMyPools());
  const favorites = useSelector(selectFavorites());
  const favoriteSet = useMemo(
    () => new Set((favorites || []).map((item: IPoolCard) => `${item.aid1}-${item.aid2}-${item.kind}`)),
    [favorites],
  );
  const formatNum = (value) => Number(value).toLocaleString('en-US', { maximumFractionDigits: 8 });

  const onTrade = (pool) => {
    dispatch(mainActions.setCurrentPool(pool));
    dispatch(mainActions.setPredict(null));
    navigate(ROUTES.NAV.TRADE);
  };

  const onAddLiquidity = (pool) => {
    dispatch(mainActions.setCurrentPool(pool));
    dispatch(mainActions.setPredict(null));
    navigate(ROUTES.POOLS.ADD_LIQUIDITY);
  };
  const handleFavorite = (pool: IPoolCard) => {
    dispatch(mainActions.onFavorites.request(pool));
  };

  return (
    <Window hideHeader>
      <Container>
        <TableScrollViewport tableMinWidth={780}>
          <Table>
            <thead>
              <tr>
                <th>Favorite</th>
                <th>Pair</th>
                <th>Token 1</th>
                <th>Token 2</th>
                <th>Fee Rate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myPools.map((pool) => (
                <Row
                  key={`${pool.aid1}_${pool.aid2}_${pool.kind}`}
                  onClick={() => onTrade(pool)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onTrade(pool);
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
                  <td>
                    <Actions>
                      <Button
                        icon={IconExchangeTrade}
                        variant="control"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTrade(pool);
                        }}
                      >
                        Trade
                      </Button>
                      <Button
                        icon={IconShieldChecked}
                        variant="control"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddLiquidity(pool);
                        }}
                      >
                        Add
                      </Button>
                    </Actions>
                  </td>
                </Row>
              ))}
            </tbody>
          </Table>
        </TableScrollViewport>
      </Container>
    </Window>
  );
};

export default MyPools;
