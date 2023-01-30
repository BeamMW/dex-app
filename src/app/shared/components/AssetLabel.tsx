import React from 'react';
import { styled } from '@linaria/react';
import AssetIcon from '@app/shared/components/AssetsIcon';

interface AssetLabeProps {
  title:string,
  assets_id: number
}
// TODO: LABEL POSITION
const AssetStyled = styled.div`
  max-width: 110px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  
`;
const Title = styled.h4`
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 20px;
  color: rgba(255,255,255, 0.7);
  text-transform: uppercase;
`;
const AssetLabel = ({ title, assets_id }:AssetLabeProps) => (
  <AssetStyled>
    <AssetIcon asset_id={assets_id} />
    <Title>{title}</Title>
  </AssetStyled>
);

export default AssetLabel;
