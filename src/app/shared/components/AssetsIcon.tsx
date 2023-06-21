import React from 'react';

import {
  BeamIcon as BeamIconSvg,
  BeamXIcon as BeamXIconSvg,
  AssetIcon as AssetIconSvg,
  IconNPHAsset
} from '@app/shared/icons';

import { styled } from '@linaria/react';
import {BEAM_ID, BEAMX_ID, PALLETE_ASSETS, NPH_ID} from '@app/shared/constants';

export interface AssetIconProps {
  asset_id?: number;
  className?: string;
}

const ContainerStyled = styled.div<AssetIconProps>`
  display: inline-block;
  vertical-align: middle;
  width: 18px;
  height: 18px;
  margin-right: 10px;
  color: ${({ asset_id }) => (PALLETE_ASSETS[asset_id] ? PALLETE_ASSETS[asset_id] : PALLETE_ASSETS[asset_id % PALLETE_ASSETS.length])};
`;

const AssetIcon: React.FC<AssetIconProps> = ({ asset_id = 0, className }) => {
  let IconComponent: any;
  if (asset_id === BEAM_ID) {
    IconComponent = BeamIconSvg;
  } else {
    IconComponent = asset_id === BEAMX_ID ? BeamXIconSvg : asset_id === NPH_ID ? IconNPHAsset : AssetIconSvg;
  }
  return (
    <ContainerStyled asset_id={asset_id} className={className}>
      <IconComponent />
    </ContainerStyled>
  );
};

export default AssetIcon;
