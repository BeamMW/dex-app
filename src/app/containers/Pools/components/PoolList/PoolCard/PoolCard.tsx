import React from "react";

import {IAsset, IPoolCard} from "@core/types";
import {fromGroths, getNameToken, getPoolKind} from "@core/appUtils";

interface IPoolCardType  {
  data: IPoolCard,
  assets: IAsset[]
}

export const PoolCard = ({data, assets}: IPoolCardType) => {

  const nameToken1 = getNameToken(data.aid1, assets)
  const nameToken2 = getNameToken(data.aid2, assets)


  return (
    <div className="pool-card-wrapper">
      <div className="pool-card">
        <div className="pool-card-header">
          <div className="pool-card-title">{nameToken1} / {nameToken2}</div>
          <div className="pool-fees">fee: {getPoolKind(data.kind)}</div>

          <div className="asset-icon-wrapper">
            <div className="asset-icon main" />
            <div className="asset-icon secondary" />
          </div>
        </div>
        <div className="pool-card-content">
          <div className="asset-count">{`${fromGroths(data.tok1)} ${nameToken1}`}</div>
          <div className="asset-count">{`${fromGroths(data.tok2)} ${nameToken2}`}</div>

          <div className="asset-exchange-rate">1 BEAMX = 3 BEAM</div>
        </div>
      </div>
    </div>
  );
};
