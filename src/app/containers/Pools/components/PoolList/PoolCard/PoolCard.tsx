import React, { useCallback } from 'react';

import { IPoolCard } from '@core/types';
import {
  fromGroths, getPoolKind, parseIntToNum,
} from '@core/appUtils';
import { ROUTES_PATH } from '@app/shared/constants';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as mainActions from '@app/containers/Pools/store/actions';
import { Button, Section } from '@app/shared/components';
import { styled } from '@linaria/react';
import AssetIcon from '@app/shared/components/AssetsIcon';

interface PoolCardType {
  data: IPoolCard;
}

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;
export const PoolCard = ({ data }: PoolCardType) => {
  const nameToken1 = `${data.metadata1} ${data.aid1} ${data.metadata1.N}`;
  const nameToken2 = `${data.aid2} ${data.metadata2.N}`;
  // const isCreator = !!data.creator
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const addLiquidityNavigation = useCallback(() => {
    dispatch(mainActions.setCurrentPool(data));
    navigate(ROUTES_PATH.POOLS.ADD_LIQUIDITY);
  }, [navigate]);

  const tradePoolNavigation = useCallback(() => {
    dispatch(mainActions.setCurrentPool(data));
    navigate(ROUTES_PATH.POOLS.TRADE_POOL);
  }, [navigate]);

  const withdrawPoolNavigation = useCallback(() => {
    dispatch(mainActions.setCurrentPool(data));
    navigate(ROUTES_PATH.POOLS.WITHDRAW_POOL);
  }, [navigate]);

  return (
    <Section title={`${nameToken1} / ${nameToken2}`}>
      <div className="pool-card-header">
        <div className="pool-card-title">
          <AssetIcon asset_id={data.aid1} />
          {nameToken1}
          {' '}
          /
          <AssetIcon asset_id={data.aid2} />
          {nameToken2}
        </div>
        <div className="pool-fees">
          fee:
          {getPoolKind(data.kind)}
        </div>
        <div className="asset-icon-wrapper">
          <div className="asset-icon main" />
          <div className="asset-icon secondary" />
        </div>
      </div>
      <div className="pool-card-content">
        <div className="asset-count">{`${fromGroths(data.tok1)} ${data.metadata1.N}`}</div>
        <div className="asset-count">{`${fromGroths(data.tok2)} ${data.metadata2.N}`}</div>
        <div className="asset-exchange-rate">{`1 ${nameToken1} = ${parseIntToNum(data.k1_2)}  ${nameToken2}`}</div>
        <div className="asset-exchange-rate">{`1 ${nameToken2} = ${parseIntToNum(data.k2_1)}  ${nameToken1}`}</div>
      </div>
      <ButtonWrapper>
        <Button onClick={addLiquidityNavigation}>Add Liquidity</Button>
        <Button onClick={tradePoolNavigation}>Trade</Button>
        {data.ctl ? <Button onClick={withdrawPoolNavigation}>Withdraw</Button> : null}
      </ButtonWrapper>
    </Section>
  );
};
