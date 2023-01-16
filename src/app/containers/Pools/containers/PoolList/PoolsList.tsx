import React, { useCallback } from "react";
import "./index.scss";
import { Input, Button, Title } from "@app/shared/components";
import { PoolCard } from "@app/containers/Pools/components/PoolList";
import { useNavigate } from "react-router-dom";
import { ROUTES_PATH, SORT } from "@app/shared/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAssetsList,
  selectPoolsList,
} from "@app/containers/Pools/store/selectors";
import { setFilter } from "@app/containers/Pools/store/actions";
import * as mainActions from "@app/containers/Pools/store/actions";

export const PoolsList = () => {
  const navigate = useNavigate();

  const poolsList = useSelector(selectPoolsList());
  const assetsList = useSelector(selectAssetsList());

  const dispatch = useDispatch();

  const createPoolNavigation = useCallback(() => {
    navigate(ROUTES_PATH.POOLS.CREATE_POOL);
  }, [navigate]);

  const handleSort = (filter) => {
    dispatch(setFilter(filter));
    dispatch(mainActions.loadAppParams.request(null))
  };

  return (
    <div className="pool-list-container-wrapper">
      <Title>Pools</Title>
      <div className="pool-list-header-wrapper">
        <div className="poop-list-sort-wrapper">
          <Input placeholder="Enter asset ticker" />
          {SORT.map((el) => <Button variant="link" onClick={() => handleSort(el.value)}>{el.name}
            </Button>
          )}
        </div>
        <Button onClick={createPoolNavigation}>Create Pool</Button>
      </div>

      <div className="pool-list-wrapper">
        {poolsList.map((item, idx) => (
          <PoolCard data={item} assets={assetsList} key={idx} />
        ))}
      </div>
    </div>
  );
};
