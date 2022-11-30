import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import { ThemeProvider } from '@theme-ui/core';
import theme from '@app/theme';
import { Loader } from '@app/components/BeamLoader';
import { DexLayout } from './components/Dex/DexLayout';
import Trading from '@app/pages/Trading';
import ProvideLiquidity from '@app/pages/ProvideLiquidity/ProvideLiquidity';

import './styles';
import './styles.css';

import { WalletApiConnector } from './components/WalletApiConnector';
import { DexProvider } from './contexts/Dex/DexContext';
import { TransactionProvider } from './library/transaction-react/context/TransactionProvider';
import { TransactionMonitor } from './library/transaction-react/TransactionMonitor';
import { observer } from 'mobx-react-lite';
import { useStoreAccessor } from './contexts/Store/StoreAccessorContext';
import { ApiProvider } from './contexts/Dex/ApiContext';
import PoolsList from './pages/PoolsList';
import CreatePool from './pages/PoolCreation';

const App = () => {
  const navigate = useNavigate();

  const storeAccessor = useStoreAccessor();

  const TransactionMonitorObserver = observer(({transactions, showStatusBlock} : any) => {
    return <><TransactionMonitor shaderTransactions={transactions} showStatusBlock={false} /></>
  });

  return (
      <ThemeProvider theme={theme}>
        <WalletApiConnector>
          <ApiProvider>
            <DexProvider>
              <TransactionProvider>
                <DexLayout>
                  <Routes>
                    <Route index element={<PoolsList />} />
                    <Route path='/pools/trading' element={<Trading />} />
                    <Route path='/pools/provide-liquidity' element={<ProvideLiquidity />} />
                    <Route path='/create-pool' element={<CreatePool />} />
                  </Routes>
                </DexLayout>
                <TransactionMonitorObserver transactions={storeAccessor.transactionsStore.transactions} showStatusBlock={true} />
              </TransactionProvider>
            </DexProvider>
          </ApiProvider>
        </WalletApiConnector>
      </ThemeProvider>
  );
};

export default App;
