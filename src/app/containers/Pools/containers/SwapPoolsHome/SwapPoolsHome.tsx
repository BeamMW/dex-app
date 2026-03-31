import React from 'react';
import { styled } from '@linaria/react';
import { TradePool } from '@app/containers/Pools/containers/TradePool';

const Wrapper = styled.div`
  width: 100%;
`;

export const SwapPoolsHome = () => (
  <Wrapper>
    <TradePool embedded />
  </Wrapper>
);
