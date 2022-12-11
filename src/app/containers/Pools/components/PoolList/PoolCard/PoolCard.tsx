import React from "react";

export const PoolCard = () => {
  return (
    <div className="pool-card-wrapper">
      <div className="pool-card">
        <div className="pool-card-header">
          <div className="pool-card-title">BEAM/BEAMX</div>
          <div className="pool-fees">fee:0.03%</div>

          <div className="asset-icon-wrapper">
            <div className="asset-icon main" />
            <div className="asset-icon secondary" />
          </div>
        </div>
        <div className="pool-card-content">
          <div className="asset-count">1,304,524 BEAM</div>
          <div className="asset-count">1,304,524 BEAM</div>
          <div className="asset-exchange-rate">1 BEAMX = 3 BEAM</div>
        </div>
      </div>
    </div>
  );
};
