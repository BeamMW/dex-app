import React, { useEffect, useMemo, useState } from 'react';
import { ITrade } from '@core/types';
import {
  emptyPredict, fromGroths, setDataRequest, toGroths, truncate,
} from '@core/appUtils';
import {
  AssetsContainer,
  AssetsSection,
  Button,
  Container,
  Input,
  PoolStat,
  Section,
  Window,
} from '@app/shared/components';
import { useInput } from '@app/shared/hooks';
import * as mainActions from '@app/containers/Pools/store/actions';
import { useDispatch, useSelector } from 'react-redux';
import './index.scss';
import { selectAssetsList, selectCurrentPool, selectPredirect } from '@app/containers/Pools/store/selectors';
import { CancelIcon, DoneIcon, IconExchange } from '@app/shared/icons';
import { ROUTES, titleSections } from '@app/shared/constants';
import AssetLabel from '@app/shared/components/AssetLabel';
import { styled } from '@linaria/react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ExchangeWrapper = styled.div`
  position: absolute;
  top: 71px;
  left: 435px;
  @media (max-width: 913px) {
    top:135px;
    left: 44%;
  }
`;

const SectionWrapper = styled.div`
  margin: 10px 0 40px 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: auto;
  @media (max-width: 913px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const SummaryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 48px;
`;
const SummaryTitle = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  color: rgba(255, 255, 255, 0.5);
  max-width: 62px;
  width: 100%;
  margin-right: 30px;
`;
const TotalTitle = styled(SummaryTitle)`
  font-weight: 700;
  line-height: 17px;
  color: var(--color-white);
`;
const SummaryContainer = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 14px;
  align-items: center;
`;

const SummaryAsset = styled.div`
  display: flex;
`;
const AssetAmount = styled.div`
  justify-content: flex-start;
  display: flex;
`;
const Line = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  width: 412px;
  margin: 20px 0;
`;
const ButtonBlock = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;
const ButtonWrapper = styled.div`
  display: flex;
  max-width: 363px;
  width: 100%;
  justify-content: space-between;
`;

export const TradePool = () => {
  const data = useSelector(selectCurrentPool());
  const assets = useSelector(selectAssetsList());
  const predictData = useSelector(selectPredirect());
  const [currentToken, setCurrentToken] = useState(data.aid1);
  const [currentLPToken, setCurrentLPToken] = useState(null);
  const [currentTokAmount, setCurrentTokenAmount] = useState<number>(data.tok1);
  const [isSwap, setIsSwap] = useState<boolean>(false);
  const amountInput = useInput({
    initialValue: 0,
    validations: { isEmpty: true, isMax: fromGroths(currentTokAmount) },
  });
  const [requestData, setRequestData] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tokenName_1 = truncate(data.metadata1.UN);
  const tokenName_2 = truncate(data.metadata2.UN);

  const handleChange = () => {
    setIsSwap(!isSwap);
  };
  useEffect(() => {
    setCurrentToken(!isSwap ? data.aid1 : data.aid2);
    setCurrentTokenAmount(!isSwap ? data.tok1 : data.tok2);
  }, [isSwap]);

  useMemo(() => {
    setRequestData({
      aid1: currentToken,
      aid2: currentToken === data.aid1 ? data.aid2 : data.aid1,
      kind: data.kind,
      val1_buy: toGroths(Number(amountInput.value)),
    });
  }, [amountInput.value, currentToken]);

  useMemo(() => {
    if (amountInput.isMax) {
      toast('Amount assets > MAX');
    } else if (amountInput.isValid) {
      dispatch(mainActions.onTradePool.request(requestData));
    }
  }, [requestData, amountInput.value, amountInput.isValid]);
  useEffect(() => {
    if (data && assets) {
      setCurrentLPToken(assets.find((el) => el.aid === data['lp-token']));
    }
  }, [data, assets]);

  const onTrade = (dataTrade: ITrade) => {
    dispatch(mainActions.onTradePool.request(setDataRequest(dataTrade)));
  };

  const onPreviousClick = () => {
    navigate(ROUTES.POOLS.BASE);
  };

  return (
    <Window title="trade" backButton>
      <Container>
        <AssetsContainer>
          <Section title={titleSections.TRADE_RECEIVE}>
            <AssetsSection>
              <Input
                value={amountInput.value}
                variant="amount"
                pallete="blue"
                onChange={(e) => amountInput.onChange(e)}
              />
              <AssetLabel title={isSwap ? tokenName_2 : tokenName_1} assets_id={currentToken} />
            </AssetsSection>
            <ExchangeWrapper>
              <Button icon={IconExchange} variant="icon" onClick={() => handleChange()} />
            </ExchangeWrapper>
          </Section>
          <Section title={titleSections.TRADE_SEND}>
            <AssetsSection>
              <Input
                disabled
                pallete="purple"
                variant="amount"
                style={{ cursor: 'default', color: '--var(color-purple)', opacity: 1 }}
                value={emptyPredict(predictData, amountInput.value) ? '0' : fromGroths(predictData.pay)}
              />
              <AssetLabel
                title={isSwap ? tokenName_1 : tokenName_2}
                assets_id={currentToken === data.aid1 ? data.aid2 : data.aid1}
              />
            </AssetsSection>
          </Section>
        </AssetsContainer>
        <SectionWrapper>
          <Section title="trade summary">
            <SummaryWrapper>
              <SummaryContainer>
                <SummaryTitle>You buy</SummaryTitle>
                <SummaryAsset>
                  <AssetAmount>
                    <AssetLabel
                      variant="predict"
                      title={isSwap ? tokenName_2 : tokenName_1}
                      assets_id={currentToken === data.aid1 ? data.aid1 : data.aid2}
                      amount={predictData ? predictData.buy : 0}
                    />
                  </AssetAmount>
                </SummaryAsset>
              </SummaryContainer>
              <SummaryContainer>
                <SummaryTitle>DAO Fee</SummaryTitle>
                <SummaryAsset>
                  <AssetAmount>
                    <AssetLabel
                      variant="predict"
                      title={isSwap ? tokenName_1 : tokenName_2}
                      assets_id={currentToken === data.aid1 ? data.aid2 : data.aid1}
                      amount={predictData ? predictData.fee_dao : 0}
                    />
                  </AssetAmount>
                </SummaryAsset>
              </SummaryContainer>
              <SummaryContainer>
                <SummaryTitle>Pool Fee</SummaryTitle>
                <SummaryAsset>
                  <AssetAmount>
                    <AssetLabel
                      variant="predict"
                      title={isSwap ? tokenName_1 : tokenName_2}
                      assets_id={currentToken === data.aid1 ? data.aid2 : data.aid1}
                      amount={predictData ? predictData.fee_pool : 0}
                    />
                  </AssetAmount>
                </SummaryAsset>
              </SummaryContainer>
              <Line />
              <SummaryContainer>
                <TotalTitle>Total Pay</TotalTitle>
                <SummaryAsset>
                  <AssetAmount>
                    {/* <AssetLabel */}
                    {/*   variant="predict" */}
                    {/*   title={isSwap ? tokenName_2 : tokenName_1} */}
                    {/*   assets_id={currentToken === data.aid1 ? data.aid1 : data.aid2} */}
                    {/*   amount={predictData ? predictData.buy : 0} */}
                    {/*   id={false} */}
                    {/* /> */}
                    <div>
                      <AssetLabel
                        variant="predict"
                        title={isSwap ? tokenName_1 : tokenName_2}
                        assets_id={currentToken === data.aid1 ? data.aid2 : data.aid1}
                        amount={predictData ? predictData.pay : 0}
                        id={false}
                      />
                    </div>
                  </AssetAmount>
                </SummaryAsset>
              </SummaryContainer>
            </SummaryWrapper>
          </Section>
          <PoolStat data={data} lp={currentLPToken} />
        </SectionWrapper>
        <ButtonBlock>
          <ButtonWrapper>
            <Button icon={CancelIcon} variant="cancel" onClick={onPreviousClick}>
              Cancel
            </Button>
            <Button
              disabled={!amountInput.isValid}
              icon={DoneIcon}
              variant="approve"
              onClick={() => onTrade(requestData)}
            >
              Trade
            </Button>
          </ButtonWrapper>
        </ButtonBlock>
      </Container>
    </Window>
  );
};
