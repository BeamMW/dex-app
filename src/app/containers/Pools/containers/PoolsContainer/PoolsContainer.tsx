import React from 'react';
import { useRoutes } from "react-router-dom";
import { ROUTES_PATH } from "@app/shared/constants";
import { CreatePool, PoolsList } from "../";



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

];

export const PoolsContainer = () =>{
  const content = useRoutes(routes);
  return <>{content}</>
};
