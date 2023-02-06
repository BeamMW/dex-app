import React, { useCallback, useState } from 'react';

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
import { css } from '@linaria/core';
import {
  IconExchange, IconExchangeTrade, IconReceive, IconShieldChecked,
} from '@app/shared/icons';

interface PoolCardType {
  data: IPoolCard;
}

const HeaderCardWrapper = styled.div`
  position: relative;
display: flex;
width: 100%;`;
const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 80%;
  align-self: center;
  line-height: 17px;
  margin-bottom: 20px;
  padding: 3px 0 0 0;
  &>span{
    display: flex;
    font-weight: 700;
    font-size: 14px;
    line-height: 17px;
    letter-spacing: 3.11111px;
    text-transform: uppercase;
    color: white;
  }
`;
const Title = styled.div`
  display: flex;
  font-weight: 700;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: 3.11111px;
  text-transform: uppercase;
  color: white;
  
`;
const id = css`
    font-weight: 400;
    text-transform: lowercase;
    line-height: 14px;
    color: rgba(255,255,255, 0.5);
    letter-spacing: 0;
  `;
const Kind = styled.div`
  position: absolute;
  top: 0;
  right: -10px;
  //width: 35px;
  height: 22px;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 8px;
  border-radius: 20px;
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
`;

const AmountWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const AssetWrapper = styled.div`
  display: flex;
  margin-bottom: 14px;
  align-items: center;
  justify-content: flex-start;
`;
const AssetName = styled.div`;
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  color: #8897A8;
  text-transform: uppercase;
  max-width: 65px;
  width: 100%;
`;
const AssetAmount = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  color:white`;

const ControlWrapper = styled.div`

  display: flex;
  justify-content: space-between;
  margin: 30px 0 20px 0;
`;

export const PoolCard = ({ data }: PoolCardType) => {
  const nameToken1 = `${data.metadata1.UN}`;
  const nameToken2 = `${data.metadata2.UN}`;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentCourseMain = `1 ${data.metadata2.UN} = ${parseIntToNum(data.k2_1)} ${data.metadata1.UN}`;
  const currentCourseSecond = `1 ${data.metadata1.UN} = ${parseIntToNum(data.k1_2)} ${data.metadata2.UN}`;
  const [exchange, setExchange] = useState(currentCourseMain);

  const addLiquidityNavigation = useCallback(() => {
    dispatch(mainActions.setCurrentPool(data));
    dispatch(mainActions.setPredict(null));
    navigate(ROUTES_PATH.POOLS.ADD_LIQUIDITY);
  }, [navigate]);

  const tradePoolNavigation = useCallback(() => {
    dispatch(mainActions.setCurrentPool(data));
    dispatch(mainActions.setPredict(null));
    navigate(ROUTES_PATH.POOLS.TRADE_POOL);
  }, [navigate]);

  const withdrawPoolNavigation = useCallback(() => {
    dispatch(mainActions.setCurrentPool(data));
    dispatch(mainActions.setPredict(null));
    navigate(ROUTES_PATH.POOLS.WITHDRAW_POOL);
  }, [navigate]);

  const changeCourse = () => {
    setExchange(exchange !== currentCourseMain ? currentCourseMain : currentCourseSecond);
  };
  // TODO: break down into components
  return (
    <Section variant="card">
      <HeaderCardWrapper>
        <TitleWrapper>
          <Title>
            {nameToken1}
          </Title>
          {' '}
          <div className={id}>{`(id:${data.aid1})`}</div>
          {' '}
          <span>/</span>
          {' '}
          <Title>
            {nameToken2}
          </Title>
          {' '}
          <div className={id}>{`(id:${data.aid2})`}</div>
        </TitleWrapper>
        <Kind>{`${getPoolKind(data.kind)}`}</Kind>
      </HeaderCardWrapper>
      <AmountWrapper>
        <AssetWrapper>
          <AssetIcon asset_id={data.aid1} />
          <AssetName>{nameToken1}</AssetName>
          <AssetAmount>{fromGroths(data.tok1)}</AssetAmount>
        </AssetWrapper>
        <AssetWrapper>
          <AssetIcon asset_id={data.aid2} />
          <AssetName>{nameToken2}</AssetName>
          <AssetAmount>{fromGroths(data.tok2)}</AssetAmount>
        </AssetWrapper>
      </AmountWrapper>
      <Section variant="exchange">
        <div style={{ textTransform: 'uppercase' }}>{exchange}</div>
        <Button icon={IconExchange} variant="icon" onClick={() => changeCourse()} />
      </Section>
      <ControlWrapper>
        <Button icon={IconShieldChecked} variant="control" onClick={addLiquidityNavigation}>add liquidity</Button>
        <Button icon={IconReceive} variant="control" pallete="blue" onClick={withdrawPoolNavigation}>withdraw</Button>
      </ControlWrapper>
      <Button variant="trade" icon={IconExchangeTrade} pallete="green" onClick={tradePoolNavigation}>trade</Button>
    </Section>
  );
};
