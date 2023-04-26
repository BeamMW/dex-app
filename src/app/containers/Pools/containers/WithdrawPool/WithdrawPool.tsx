import React, { useEffect, useMemo, useState } from 'react';
import { ITrade } from '@core/types';
import {
  emptyPredict, fromGroths, setDataRequest, toGroths, truncate,
} from '@core/appUtils';
import {
  AssetsContainer,
  AssetsSection,
  Button,
  Input,
  Section,
  Window,
  Container,
  PoolStat,
} from '@app/shared/components';
import { useInput } from '@app/shared/hooks';
import * as mainActions from '@app/containers/Pools/store/actions';
import { useDispatch, useSelector } from 'react-redux';
import './index.scss';
import { selectAssetsList, selectCurrentPool, selectPredirect } from '@app/containers/Pools/store/selectors';
import { ROUTES, titleSections } from '@app/shared/constants';
import AssetLabel from '@app/shared/components/AssetLabel';
import { ArrowDownIcon, CancelIcon } from '@app/shared/icons';
import { styled } from '@linaria/react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ButtonBlock = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 40px;
`;
const ButtonWrapper = styled.div`
  display: flex;
  max-width: 363px;
  width: 100%;
  justify-content: space-evenly;
`;
const SectionWrapper = styled.div`
  margin: 10px 0 40px 0;
  display: flex;
  justify-content: flex-start;
  width: 100%;
`;

export const WithdrawPool = () => {
  const data = useSelector(selectCurrentPool());
  const assets = useSelector(selectAssetsList());
  const predictData = useSelector(selectPredirect());
  const [currentLPToken, setCurrentLPToken] = useState(null);
  const [currentAmountCtl, setCurrentAmount] = useState(data.ctl);
  const nameToken1 = truncate(data.metadata1.UN);
  const nameToken2 = truncate(data.metadata2.UN);
  const amountInput = useInput({
    initialValue: 0,
    validations: { isEmpty: true, isMax: fromGroths(currentAmountCtl) },
  });
  const [requestData, setRequestData] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (data && assets) {
      setCurrentLPToken(assets.find((el) => el.aid === data['lp-token']));
    }
  }, [data, assets]);
  useMemo(() => {
    setRequestData({
      aid1: data.aid1,
      aid2: data.aid2,
      kind: data.kind,
      ctl: toGroths(Number(amountInput.value)),
    });
  }, [amountInput.value]);
  useMemo(() => {
    setCurrentAmount(data.ctl);
  }, [data.ctl]);

  useMemo(() => {
    if (amountInput.isMax) {
      toast('Amount assets > MAX');
    } else if (amountInput.isValid) {
      dispatch(mainActions.onWithdraw.request(requestData));
    }
  }, [requestData, amountInput.value, amountInput.isValid, amountInput.isMax]);

  const assetLabel = currentLPToken ? truncate(currentLPToken.parsedMetadata.UN) : 'AMML';
  const assetId = currentLPToken ? currentLPToken.aid : data['lp-token'];

  const onWithdraw = (dataReq: ITrade) => {
    dispatch(mainActions.onWithdraw.request(setDataRequest(dataReq)));
  };
  const onPreviousClick = () => {
    navigate(ROUTES.POOLS.BASE);
  };
  return (
    <Window title="Withdraw" backButton>
      <Container>
        <AssetsContainer variant="space-between">
          <div style={{ height: '100% !important' }}>
            <Section title={titleSections.ADD_LIQUIDITY_SEND}>
              <AssetsSection>
                <Input
                  value={amountInput.value}
                  variant="amount"
                  pallete="blue"
                  onChange={(e) => amountInput.onChange(e)}
                />
                <AssetLabel title={assetLabel} assets_id={assetId} />
              </AssetsSection>
            </Section>
          </div>
          <Section title={titleSections.TRADE_RECEIVE}>
            <AssetsSection>
              <Input
                disabled
                pallete="purple"
                variant="amount"
                style={{ cursor: 'default', color: '--var(color-purple)', opacity: 1 }}
                value={emptyPredict(predictData, amountInput.value) ? '0' : fromGroths(predictData.tok1)}
              />
              <AssetLabel title={nameToken1} assets_id={data.aid1} />
            </AssetsSection>
            <AssetsSection>
              <Input
                disabled
                pallete="purple"
                variant="amount"
                style={{ cursor: 'default', color: '--var(color-purple)', opacity: 1 }}
                value={emptyPredict(predictData, amountInput.value) ? '0' : fromGroths(predictData.tok2)}
              />
              <AssetLabel title={nameToken2} assets_id={data.aid2} />
            </AssetsSection>
          </Section>
        </AssetsContainer>

        <SectionWrapper>
          <PoolStat data={data} lp={currentLPToken} />
        </SectionWrapper>

        <ButtonBlock>
          <ButtonWrapper>
            <Button icon={CancelIcon} variant="cancel" onClick={onPreviousClick}>
              Cancel
            </Button>
            <Button
              disabled={!amountInput.isValid}
              icon={ArrowDownIcon}
              variant="withdraw"
              onClick={() => onWithdraw(requestData)}
            >
              Withdraw
            </Button>
          </ButtonWrapper>
        </ButtonBlock>
      </Container>
    </Window>
  );
};
