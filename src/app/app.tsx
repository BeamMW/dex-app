import React, { useEffect } from 'react';
import { css } from '@linaria/core';

import {
  actions as sharedActions,
  selectors as sharedSelectors,
} from '@app/shared/store';
import 'react-toastify/dist/ReactToastify.css';

import { useNavigate, useRoutes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { ToastContainer } from 'react-toastify';
import { Scrollbars } from 'react-custom-scrollbars';

import './styles';
import {
  PoolsContainer, CreatePool, AddLiquidity, TradePool, WithdrawPool,
} from '@app/containers';
import { ROUTES } from '@app/shared/constants';

const trackStyle = css`
  z-index: 999;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.2);
`;

const routes = [
  {
    path: ROUTES.POOLS.BASE,
    element: <PoolsContainer />,
  },
  {
    path: ROUTES.POOLS.CREATE_POOL,
    element: <CreatePool />,
  },
  {
    path: ROUTES.POOLS.ADD_LIQUIDITY,
    element: <AddLiquidity />,
  },
  {
    path: ROUTES.POOLS.TRADE_POOL,
    element: <TradePool />,
  },
  {
    path: ROUTES.POOLS.WITHDRAW_POOL,
    element: <WithdrawPool />,
  },
];

const App = () => {
  const dispatch = useDispatch();
  const content = useRoutes(routes);
  const navigate = useNavigate();
  const navigateURL = useSelector(sharedSelectors.selectRouterLink());

  useEffect(() => {
    if (navigateURL) {
      navigate(navigateURL);
      dispatch(sharedActions.navigate(''));
    }
  }, [navigateURL, dispatch, navigate]);

  return (
    <Scrollbars
      renderThumbVertical={(props) => <div {...props} className={trackStyle} />}
    >
      {content}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        closeButton={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        icon={false}
        toastStyle={{
          textAlign: 'center',
          background: '#22536C',
          color: 'white',
          width: '90%',
          margin: '0 auto 36px',
          borderRadius: '10px',
        }}
      />
    </Scrollbars>
  );
};

export default App;
