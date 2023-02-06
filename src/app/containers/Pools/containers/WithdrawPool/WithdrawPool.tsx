import React, { useMemo, useState } from 'react';
import { ITrade } from '@core/types';
import {
  emptyPredict, fromGroths, setDataRequest, toGroths,
} from '@core/appUtils';
import {
  AssetsContainer, AssetsSection, Button, Input, Section, Title, Window, Container,
} from '@app/shared/components';
import { useInput } from '@app/shared/hooks';
import * as mainActions from '@app/containers/Pools/store/actions';
import { useDispatch, useSelector } from 'react-redux';
import './index.scss';
import {
  selectCurrentPool,
  selectPredirect,
} from '@app/containers/Pools/store/selectors';
import { ROUTES, titleSections } from '@app/shared/constants';
import AssetLabel from '@app/shared/components/AssetLabel';
import { ArrowDownIcon, CancelIcon, DoneIcon } from '@app/shared/icons';
import { styled } from '@linaria/react';
import { useNavigate } from 'react-router-dom';

const ButtonBlock = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top:40px;
`;
const ButtonWrapper = styled.div`
  display: flex;
  max-width: 363px;
  width: 100%;
  justify-content: space-evenly; 
`;

export const WithdrawPool = () => {
  const data = useSelector(selectCurrentPool());
  const predictData = useSelector(selectPredirect());
  const amountInput = useInput(0);
  const [requestData, setRequestData] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useMemo(() => {
    setRequestData({
      aid1: data.aid1,
      aid2: data.aid2,
      kind: data.kind,
      ctl: toGroths(Number(amountInput.value)),
    });
  }, [amountInput.value]);

  useMemo(() => {
    if (amountInput.value !== 0) {
      dispatch(mainActions.onWithdraw.request(requestData));
    }
  }, [requestData, amountInput.value]);

  const onWithdraw = (dataReq: ITrade) => {
    dispatch(mainActions.onWithdraw.request(setDataRequest(dataReq)));
  };
  const onPreviousClick = () => {
    navigate(ROUTES.POOLS.BASE);
  };

  return (
    <Window title="Withdraw" backButton>
      <Container>
        <AssetsContainer variant="center">
          <Section title={titleSections.ADD_LIQUIDITY_SEND}>
            <AssetsSection>
              <Input
                type="number"
                value={amountInput.value}
                variant="amount"
                pallete="blue"
                onChange={(e) => amountInput.onChange(e)}
              />
              <h4>AMML</h4>
            </AssetsSection>
          </Section>
          <Section title={titleSections.TRADE_RECEIVE}>
            <AssetsSection>
              <Input
                type="number"
                disabled
                pallete="purple"
                variant="amount"
                style={{ cursor: 'default', color: '--var(color-purple)', opacity: 1 }}
                value={emptyPredict(predictData, amountInput.value) ? '0' : fromGroths(predictData.tok1)}
              />
              <AssetLabel title={data.metadata1.UN} assets_id={data.aid1} />
            </AssetsSection>
            <AssetsSection>
              <Input
                type="number"
                disabled
                pallete="purple"
                variant="amount"
                style={{ cursor: 'default', color: '--var(color-purple)', opacity: 1 }}
                value={emptyPredict(predictData, amountInput.value) ? '0' : fromGroths(predictData.tok2)}
              />
              <AssetLabel title={data.metadata2.UN} assets_id={data.aid2} />
            </AssetsSection>
          </Section>
        </AssetsContainer>

        <ButtonBlock>
          <ButtonWrapper>
            <Button icon={CancelIcon} variant="cancel" onClick={onPreviousClick}>
              Cancel
            </Button>
            <Button icon={ArrowDownIcon} variant="withdraw" onClick={() => onWithdraw(requestData)}>Withdraw</Button>
          </ButtonWrapper>
        </ButtonBlock>
      </Container>
    </Window>
  );
};
