import { useStoreAccessor } from '@app/contexts/Store/StoreAccessorContext';
import { Pool } from '@app/library/dex/Pool';
import { autorun, toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react'

import { Container } from 'theme-ui';
import Tabs from '../../views/navTabs/Tabs';
import { LoadingOverlay } from '../LoadingOverlay';

export interface BansLayoutProps {
  children?: React.ReactNode;
}
export const DexLayout: FC<BansLayoutProps> = observer(({ children }) => {

  const storeAccessor = useStoreAccessor();

  useEffect(() => {
    const disposert1 = autorun(() => console.log("transactions", toJS(storeAccessor.transactionsStore.transactions)))
    const disposert2 = autorun(() => console.log("pools", toJS(storeAccessor.poolsStore.pools)))
    const disposert3 = autorun(() => console.log("uniquePoolsPairs", toJS(storeAccessor.poolsStore.uniquePoolsPairs).keys(), toJS(storeAccessor.poolsStore.uniquePoolsPairs).values()))

    /* const disposert3 = autorun(() => console.log("poolsAssets", toJS(storeAccessor.poolsStore.poolsAssets)))
    const disposert4 = autorun(() => console.log("uniquePoolsPairs", toJS(storeAccessor.poolsStore.uniquePoolsPairs))) */

    return () => {
      disposert1()
      disposert2()
      disposert3()
      /* disposert2()
      disposert3()
      disposert4() */
    }
  }, [])
  
  return (
    storeAccessor.poolsStore.uniquePoolsPairs.size() ? 
    <Container sx={{variant: 'layout.window'}}>
      <Tabs />
      {children}
    </Container> : <LoadingOverlay />)

});
