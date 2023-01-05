import React, {useCallback} from "react";

import {IAsset, IPoolCard} from "@core/types";
import {fromGroths, getPoolKind, parseIntToNum} from "@core/appUtils";
import {ROUTES_PATH} from "@app/shared/constants";
import {useNavigate} from "react-router-dom";

interface PoolCardType  {
  data: IPoolCard,
  assets: IAsset[]
}

export const PoolCard = ({data, assets}:PoolCardType) => {
  const nameToken1 = data.metadata1.N
  const nameToken2 = data.metadata2.N
  const isCreator = !!data.creator
  const navigate = useNavigate()
  
  

  const addLiquidityNavigation = useCallback(() => {
    navigate(ROUTES_PATH.POOLS.ADD_LIQUIDITY, {state: data});
  }, [navigate]);

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
          <div className="asset-exchange-rate">{`1 ${nameToken1} = ${parseIntToNum(data.k1_2)}  ${nameToken2}`}</div>
          <div className="asset-exchange-rate">{`1 ${nameToken2} = ${parseIntToNum(data.k2_1)}  ${nameToken1}`}</div>
        </div>
        <div className="pool-control-wrapper">
          {isCreator && <button onClick={addLiquidityNavigation}>Add Liquidity</button>}
        </div>
      </div>
    </div>
  );
};
