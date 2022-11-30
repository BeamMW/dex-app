import React, { FC } from 'react';
import { NavLink } from "react-router-dom";
import { Flex } from 'theme-ui';
import Button from 'app/components/Button';

import { PullStatsIcon, CheckShieldIcon } from 'app/assets/icons';
import { TabsContainer, TabsChildren, LinkText } from './Tabs.style';

const Tabs:FC = () => {


  return (
    <>
  <TabsContainer>
    <TabsChildren>
      <NavLink
       to="/"
       >
      <Button
       variant='link'
       pallete='opacity'
       >
        <Flex sx={{justifyContent: 'center'}}>
          <PullStatsIcon/> <LinkText>Pools</LinkText>
        </Flex>
      </Button>
      </NavLink>
      <NavLink
       to="/pools/provide-liquidity">
        <Button
          variant='link'
          pallete='opacity'
        >
          <Flex sx={{justifyContent: 'center'}}>
            <CheckShieldIcon/>
            <LinkText>Provide liquidity</LinkText>
          </Flex>
        </Button>
      </NavLink>
    </TabsChildren>
  </TabsContainer>
  </>
  )
}


export default Tabs;