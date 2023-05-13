import React, { useEffect, useMemo, useState } from 'react';
import Utils from '@core/utils.js';
import { styled } from '@linaria/react';
import { Button } from '@app/shared/components/index';
import { ULR_WEB_WALLET } from '@app/shared/constants';
import { onSwitchToApi } from '@core/appUtils';

const Wrapper = styled.div`
width: 100%;
  min-height: 50px;
  background: rgba(3, 91, 133, 0.95);
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 10px;
  @media (max-width: 480px) {
    flex-direction: column;
    span{
      text-align: center;
    };
  }
`;
const WrapperButton = styled.div`
  width: 100%;
  max-width: 300px;
  display: flex;
  button:not(:last-child) {
    margin-right: 0.5rem}
`;

const onInstall = () => {
  const newWindow = window.open(ULR_WEB_WALLET, '_blank', 'noopener,noreferrer');
  if (newWindow) newWindow.opener = null;
};
const onConnect = async () => {
  await onSwitchToApi();
};
const AlertWallet = () => (
  <>
    <Wrapper>
      <span>To use DEX you should have BEAM Web Wallet installed and allow connection.</span>
      <WrapperButton>
        <Button onClick={onConnect}>CONNECT</Button>
        <Button onClick={onInstall}>INSTALL</Button>
      </WrapperButton>
    </Wrapper>
  </>

);

export default AlertWallet;
