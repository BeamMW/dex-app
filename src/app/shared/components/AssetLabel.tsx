import React from 'react';
import { styled } from '@linaria/react';
import AssetIcon from '@app/shared/components/AssetsIcon';
import { fromGroths } from '@core/appUtils';

interface AssetLabeProps {
  title:string,
  assets_id: number,
  amount?: number,
  variant?: 'regular' | 'predict'
  id?: boolean
}
// TODO: LABEL POSITION
const AssetStyled = styled.div`
  //max-width: 110px;
  //width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  
`;
const RegularTitleStyled = styled.span`
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 20px;
  color: rgba(255,255,255, 0.7);
  text-transform: uppercase;
`;
const Amount = styled(RegularTitleStyled)`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  color: var(--color-white);
  text-transform: uppercase;
  margin-right: 4px;
`;

const PredictTitleStyled = styled(RegularTitleStyled)`
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  color: var(--color-white);
`;
const AssetsId = styled(PredictTitleStyled)`
  display: flex;
  margin-left: 4px;
  color: rgba(255,255,255, 0.7);
  text-transform: lowercase;
`;
// const AssetsId = styled.h5`
//   display: flex;
//   color: rgba(255,255,255, 0.7);
// `;
const AssetLabel = ({
  title, assets_id, amount, variant = 'regular', id = true,
}:AssetLabeProps) => {
  const TitleComponent = {
    regular: RegularTitleStyled,
    predict: PredictTitleStyled,
  }[variant];

  return (
    <AssetStyled variant={variant}>
      <AssetIcon asset_id={assets_id} />
      {amount >= 0 && <Amount>{fromGroths(amount)}</Amount>}
      <TitleComponent>{title}</TitleComponent>
      {id && <AssetsId>{`(id:${assets_id})`}</AssetsId>}
    </AssetStyled>
  );
};

export default AssetLabel;
