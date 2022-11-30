import React from 'react';
import useGetAvailableAssetsList from "./useGetAvailableAssetsList";
import styled from 'styled-components';
import { AssetInPool } from '@app/library/dex/types';
import { Asset } from '@app/library/base/assets/types';

const LabelStyled = styled.div`
  font-family: 'ProximaNova';
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 20px;
  color: #FFFFFF;
  margin-left: 8px;
  vertical-align: super;
`;

function useProcessAssetsForSelect(assets: Asset[]) {
    return assets.map(asset => {
        return {
          value: asset,
          label: <>{/* {asset.meta.assetIconPath} */} <LabelStyled>{asset.id} {asset.meta.assetName}</LabelStyled></>,
          key: asset.id,
        }
    })
}

export default useProcessAssetsForSelect