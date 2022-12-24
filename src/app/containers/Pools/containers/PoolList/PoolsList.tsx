import React, { useCallback } from "react";
import "./index.scss";
import { Input, Button, Title } from "@app/shared/components";
import { PoolCard } from "@app/containers/Pools/components/PoolList";
import { useNavigate } from "react-router-dom";
import { ROUTES_PATH } from "@app/shared/constants";
import {useSelector} from "react-redux";
import {selectAssetsList, selectPoolsList} from "@app/containers/Pools/store/selectors";


export const PoolsList = () => {
  const navigate = useNavigate();

  const poolsList = useSelector(selectPoolsList())
  const assetsList = useSelector(selectAssetsList());


  const createPoolNavigation = useCallback(() => {
    navigate(ROUTES_PATH.POOLS.CREATE_POOL);
  }, [navigate]);

  return (
    <div className="pool-list-container-wrapper">
      <Title>Pools</Title>
      <div className="pool-list-header-wrapper">
        <Input placeholder="Enter asset ticker" />
        <Button onClick={createPoolNavigation}>Create Pool</Button>
      </div>

      <div className="pool-list-wrapper">
          {poolsList.map((item, idx)=>
              <PoolCard data={item}  assets={assetsList} key={idx} />
          )}
      </div>
    </div>
  );
};
