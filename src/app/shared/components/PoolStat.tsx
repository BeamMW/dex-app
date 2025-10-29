import React from 'react';
import { IAsset, IPoolCard } from '@core/types';
import { Section } from '@app/shared/components/index';
import AssetLabel from '@app/shared/components/AssetLabel';
import { fromGroths, truncate } from '@core/appUtils';
import { styled } from '@linaria/react';

interface PoolStatType {
  data: IPoolCard;
  lp: IAsset;
}

const AmountWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100px;
  justify-content: flex-start;
  margin-bottom: 20px;
`;
const AssetAmount = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: white;
`;
const SideLeftWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
`;
const SideRightWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
`;

const PoolStat = ({ data, lp }: PoolStatType) => {
  const nameToken1 = truncate(data.metadata1.UN);
  const nameToken2 = truncate(data.metadata2.UN);
  const nameLPToken = lp ? truncate(lp.parsedMetadata.UN) : 'AMML';
  const lpId = lp ? lp.aid : data['lp-token'];

  return (
    <Section title="Pool info">
      <AmountWrapper>
        <SideLeftWrap>
          <AssetLabel title={nameToken1} assets_id={data.aid1} id variant="predict" />
          <AssetLabel title={nameToken2} assets_id={data.aid2} id variant="predict" />
          <AssetLabel title={nameLPToken} assets_id={lpId} id variant="predict" />
        </SideLeftWrap>
        <SideRightWrap>
          <AssetAmount>{fromGroths(data.tok1)}</AssetAmount>
          <AssetAmount>{fromGroths(data.tok2)}</AssetAmount>
          <AssetAmount>{fromGroths(data.ctl)}</AssetAmount>
        </SideRightWrap>
      </AmountWrapper>
    </Section>
  );
};

export default PoolStat;
