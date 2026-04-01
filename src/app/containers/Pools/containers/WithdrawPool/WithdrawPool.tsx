import React, { useEffect, useState } from 'react';
import { ITrade } from '@core/types';
import {
  emptyPredict, fromGroths, setDataRequest, toGroths, truncate,
} from '@core/appUtils';
import {
  AssetsSection,
  Button,
  Input,
  Container,
  PoolStat,
  Window,
} from '@app/shared/components';
import { useInput } from '@app/shared/hooks';
import * as mainActions from '@app/containers/Pools/store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { selectAssetsList, selectCurrentPool, selectPredirect } from '@app/containers/Pools/store/selectors';
import { ROUTES } from '@app/shared/constants';
import AssetLabel from '@app/shared/components/AssetLabel';
import { ArrowDownIcon, CancelIcon } from '@app/shared/icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  BlockLabel,
  ButtonWrapper,
  EmbeddedLayout,
  EmbeddedTradeButtonWrap,
  InputRow,
  RightPanel,
  SwapBlock,
  SwapCard,
} from '@app/containers/Pools/containers/shared/poolFlowLayout';
import { styled } from '@linaria/react';

const ActionsRow = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 24px;
`;

const purpleDisabled = { cursor: 'default' as const, color: 'var(--color-purple)', opacity: 1 };

export const WithdrawPool = () => {
  const data = useSelector(selectCurrentPool());
  const assets = useSelector(selectAssetsList());
  const predictData = useSelector(selectPredirect());
  const [currentLPToken, setCurrentLPToken] = useState(null);
  const [currentAmountCtl, setCurrentAmount] = useState(data.ctl);
  const nameToken1 = truncate(data?.metadata1?.UN || `Token ${data?.aid1 ?? ''}`);
  const nameToken2 = truncate(data?.metadata2?.UN || `Token ${data?.aid2 ?? ''}`);
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
  useEffect(() => {
    setRequestData({
      aid1: data.aid1,
      aid2: data.aid2,
      kind: data.kind,
      ctl: toGroths(Number(amountInput.value)),
    });
  }, [amountInput.value, data.aid1, data.aid2, data.kind]);
  useEffect(() => {
    setCurrentAmount(data.ctl);
  }, [data.ctl]);

  useEffect(() => {
    if (amountInput.isMax) {
      toast('Amount assets > MAX');
    } else if (amountInput.isValid) {
      dispatch(mainActions.onWithdraw.request(requestData));
    }
  }, [requestData, amountInput.value, amountInput.isValid, amountInput.isMax, dispatch]);

  const assetLabel = currentLPToken?.parsedMetadata?.UN ? truncate(currentLPToken.parsedMetadata.UN) : 'AMML';
  const assetId = currentLPToken ? currentLPToken.aid : data['lp-token'];

  const onWithdraw = (dataReq: ITrade) => {
    dispatch(mainActions.onWithdraw.request(setDataRequest(dataReq)));
  };
  const onPreviousClick = () => {
    navigate(ROUTES.POOLS.BASE);
  };

  return (
    <Window hideHeader>
      <Container>
        <EmbeddedLayout>
          <SwapCard>
            <SwapBlock>
              <BlockLabel>Withdraw LP</BlockLabel>
              <AssetsSection>
                <InputRow>
                  <Input
                    value={amountInput.value}
                    variant="amount"
                    pallete="blue"
                    onChange={(e) => amountInput.onChange(e)}
                  />
                  <AssetLabel title={assetLabel} assets_id={assetId} />
                </InputRow>
              </AssetsSection>
            </SwapBlock>
            <SwapBlock>
              <BlockLabel>You receive</BlockLabel>
              <AssetsSection>
                <InputRow>
                  <Input
                    disabled
                    pallete="purple"
                    variant="amount"
                    style={purpleDisabled}
                    value={emptyPredict(predictData, amountInput.value) ? '0' : fromGroths(predictData.tok1)}
                  />
                  <AssetLabel title={nameToken1} assets_id={data.aid1} />
                </InputRow>
              </AssetsSection>
              <AssetsSection>
                <InputRow>
                  <Input
                    disabled
                    pallete="purple"
                    variant="amount"
                    style={purpleDisabled}
                    value={emptyPredict(predictData, amountInput.value) ? '0' : fromGroths(predictData.tok2)}
                  />
                  <AssetLabel title={nameToken2} assets_id={data.aid2} />
                </InputRow>
              </AssetsSection>
            </SwapBlock>
            <EmbeddedTradeButtonWrap>
              <ActionsRow>
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
              </ActionsRow>
            </EmbeddedTradeButtonWrap>
          </SwapCard>
          <RightPanel>
            <PoolStat data={data} lp={currentLPToken} showFavorite plain />
          </RightPanel>
        </EmbeddedLayout>
      </Container>
    </Window>
  );
};
