import React from 'react';
import { useRoutes } from "react-router-dom";
import { ROUTES_PATH } from "@app/shared/constants";
import {CreatePool, PoolsList, AddLiquidity, TradePool} from "../";



const routes = [
  {
    path: ROUTES_PATH.POOLS.BASE,
    element: <PoolsList/>,
    exact: true,
  },
  {
    path: ROUTES_PATH.POOLS.CREATE_POOL,
    element: <CreatePool/>,
    exact: true,
  },
  {
    path: ROUTES_PATH.POOLS.ADD_LIQUIDITY,
    element: <AddLiquidity/>,
    exact: true,
  },
  {
    path: ROUTES_PATH.POOLS.TRADE_POOL,
    element: <TradePool/>,
    exact: true,
  },

];

export const PoolsContainer = () =>{
  const content = useRoutes(routes);
  return <>{content}</>
};
