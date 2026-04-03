import React, { useEffect, useMemo, useState } from 'react';
import { IOptions, ITrade, IPoolCard } from '@core/types';
import {
  emptyPredict, fromGroths, getPoolKind, setDataRequest, toGroths, truncate,
} from '@core/appUtils';
import { styled } from '@linaria/react';
import {
  AssetsContainer,
  AssetsSection,
  Button,
  Container,
  Input,
  PoolStat,
  ReactSelect,
  Section,
  Window,
} from '@app/shared/components';
import { useInput } from '@app/shared/hooks';
import * as mainActions from '@app/containers/Pools/store/actions';
import { useDispatch, useSelector } from 'react-redux';
import './index.scss';
import {
  selectAssetsList,
  selectCurrentPool,
  selectOptions,
  selectPredirect,
  selectPoolsList,
} from '@app/containers/Pools/store/selectors';
import {
  CancelIcon, DoneIcon, IconExchange, IconReceive, IconShieldChecked,
} from '@app/shared/icons';
import {
  BEAM_ID, BEAMX_ID, ROUTES, titleSections,
} from '@app/shared/constants';
import AssetLabel from '@app/shared/components/AssetLabel';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  AssetAmount,
  BlockLabel,
  ButtonBlock,
  ButtonWrapper,
  EmbeddedActionRow,
  EmbeddedExchangeWrap,
  EmbeddedLayout,
  EmbeddedTradeButtonWrap,
  EmptyPoolState,
  ExchangeWrapper,
  InlineSelect,
  InputRow,
  Line,
  RateRow,
  RateText,
  RightPanel,
  SearchHint,
  SectionWrapper,
  SelectWrapper,
  SummaryAsset,
  SummaryContainer,
  SummaryHeader,
  SummaryPanel,
  SummaryTitle,
  SummaryWrapper,
  SwapBlock,
  SwapCard,
  TotalTitle,
} from '@app/containers/Pools/containers/shared/poolFlowLayout';

const FeeTierRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;
  flex-wrap: wrap;
`;

const FeeTierButton = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  padding: 4px 12px;
  margin-right: 8px;
  border-radius: 20px;
  border: 1px solid ${({ active }) => (active ? 'var(--color-purple)' : 'rgba(255,255,255,0.15)')};
  background: ${({ active }) => (active ? 'rgba(162,98,247,0.15)' : 'transparent')};
  color: ${({ active }) => (active ? 'var(--color-purple)' : 'rgba(255,255,255,0.5)')};
  font-size: 13px;
  cursor: pointer;
`;

const BestBadge = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: #00e2c2;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-left: 4px;
`;

const AutoButton = styled.button`
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.15);
  background: transparent;
  color: rgba(255,255,255,0.4);
  font-size: 12px;
  cursor: pointer;
`;

const parseAmount = (v: string | number) => Number(String(v).replace(/,/g, ''));

const formatPredictAmount = (v: string | number) => {
  const [int, frac] = String(v).split('.');
  const intFormatted = Number(int).toLocaleString('en-US');
  return frac !== undefined ? `${intFormatted}.${frac}` : intFormatted;
};

const formatUserInput = (v: string) => {
  const stripped = v.replace(/,/g, '');
  return stripped ? formatPredictAmount(stripped) : '';
};

interface TradePoolProps {
  embedded?: boolean;
}

export const TradePool = ({ embedded = false }: TradePoolProps) => {
  const data = useSelector(selectCurrentPool());
  const assets = useSelector(selectAssetsList());
  const pools = useSelector(selectPoolsList());
  const options = useSelector(selectOptions());
  const predictData = useSelector(selectPredirect());
  const [currentToken, setCurrentToken] = useState<number | null>(data?.aid1 ?? null);
  const [secondToken, setSecondToken] = useState<number | null>(data?.aid2 ?? null);
  const [currentLPToken, setCurrentLPToken] = useState(null);
  const [manualKind, setManualKind] = useState<number | null>(null);
  const [bestKind, setBestKind] = useState<number | null>(null);
  const [currentTokAmount, setCurrentTokenAmount] = useState<number>(data?.tok1 ?? 0);
  const [secondTokAmount, setSecondTokenAmount] = useState<number>(data?.tok2 ?? 0);
  const amountInput = useInput({
    initialValue: 0,
    validations: { isEmpty: true, isMax: fromGroths(currentTokAmount) },
  });
  const amountSendInput = useInput({
    initialValue: 0,
    validations: { isEmpty: true, isMax: fromGroths(secondTokAmount) },
  });
  const [requestData, setRequestData] = useState(null);
  const [lastChangedInput, setLastChangedInput] = useState<number>(1);
  const [flipRate, setFlipRate] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const matchedPools = useMemo<IPoolCard[]>(() => {
    if (currentToken === null || secondToken === null) return [];
    return pools
      .filter((pool) => (
        (pool.aid1 === currentToken && pool.aid2 === secondToken)
        || (pool.aid1 === secondToken && pool.aid2 === currentToken)
      ))
      .sort((a, b) => b.ctl - a.ctl);
  }, [pools, currentToken, secondToken]);

  const activePool = useMemo<IPoolCard | null>(() => {
    if (!matchedPools.length) return null;
    if (manualKind !== null) {
      return matchedPools.find((p) => p.kind === manualKind) || matchedPools[0];
    }
    if (data && matchedPools.some((p) => p.kind === data.kind)) {
      return data;
    }
    return matchedPools[0];
  }, [matchedPools, data, manualKind]);

  const getTokenTitle = (assetId: number | null) => {
    const option = options.find((item) => item.value === assetId);
    return truncate(option?.label || 'Asset');
  };

  const tokenName_1 = getTokenTitle(currentToken);
  const tokenName_2 = getTokenTitle(secondToken);

  const handleChange = () => {
    setCurrentToken(secondToken);
    setSecondToken(currentToken);
    setLastChangedInput(1);
    amountSendInput.onPredict('');
  };

  useEffect(() => {
    if (!embedded) {
      if (currentToken === null || secondToken === null) {
        const pool = pools[0];
        if (pool) {
          setCurrentToken(pool.aid1);
          setSecondToken(pool.aid2);
        }
      }
      return;
    }
    if (currentToken === null || secondToken === null) {
      const hasBeam = options.some((item) => item.value === BEAM_ID);
      const hasBeamX = options.some((item) => item.value === BEAMX_ID);
      if (hasBeam && hasBeamX) {
        setCurrentToken(BEAM_ID);
        setSecondToken(BEAMX_ID);
      } else if (pools[0]) {
        setCurrentToken(pools[0].aid1);
        setSecondToken(pools[0].aid2);
      }
    }
  }, [embedded, pools, options, currentToken, secondToken]);

  useEffect(() => {
    if (!embedded && data?.aid1 && data?.aid2) {
      setCurrentToken(data.aid1);
      setSecondToken(data.aid2);
    }
  }, [embedded, data?.aid1, data?.aid2]);

  useEffect(() => {
    setManualKind(null);
    setBestKind(null);
  }, [currentToken, secondToken]);

  useEffect(() => {
    if (!activePool || currentToken === null) {
      setCurrentTokenAmount(0);
    setSecondTokenAmount(0);
      return;
    }
    setCurrentTokenAmount(currentToken === activePool.aid1 ? activePool.tok1 : activePool.tok2);
    setSecondTokenAmount(currentToken === activePool.aid1 ? activePool.tok2 : activePool.tok1);
  }, [activePool, currentToken]);

  useEffect(() => {
    if (
      activePool
      && (!data || data.aid1 !== activePool.aid1 || data.aid2 !== activePool.aid2 || data.kind !== activePool.kind)
    ) {
      dispatch(mainActions.setCurrentPool(activePool));
    }
  }, [activePool, data, dispatch]);

  useEffect(() => {
    if (lastChangedInput === 1) {
      setRequestData({
        aid1: secondToken,
        aid2: currentToken,
        kind: activePool?.kind ?? 0,
        val2_pay: toGroths(parseAmount(amountInput.value)),
      });
      if (!manualKind && matchedPools.length > 1) {
        const amount = toGroths(parseAmount(amountInput.value));
        if (amount > 0) {
          dispatch(mainActions.onFindBestPool.request({
            pools: matchedPools,
            aid1: secondToken,
            aid2: currentToken,
            val2_pay: amount,
            val1_buy: 0,
          }));
        }
      }
    }
  }, [amountInput.value, currentToken, secondToken, lastChangedInput, activePool?.kind]);

  useEffect(() => {
    if (lastChangedInput === 2) {
      setRequestData({
        aid1: secondToken,
        aid2: currentToken,
        kind: activePool?.kind ?? 0,
        val1_buy: toGroths(parseAmount(amountSendInput.value)),
      });
      if (!manualKind && matchedPools.length > 1) {
        const amount = toGroths(parseAmount(amountSendInput.value));
        if (amount > 0) {
          dispatch(mainActions.onFindBestPool.request({
            pools: matchedPools,
            aid1: secondToken,
            aid2: currentToken,
            val2_pay: 0,
            val1_buy: amount,
          }));
        }
      }
    }
  }, [amountSendInput.value, currentToken, secondToken, lastChangedInput, activePool?.kind]);

  useEffect(() => {
    if (!requestData || !activePool) {
      return;
    }
    if (amountInput.isMax) {
      toast('Amount assets > MAX', { toastId: 'amount-max-input' });
    } else if (amountInput.isValid && lastChangedInput === 1) {
      dispatch(mainActions.onTradePool.request(requestData));
    }
  }, [requestData, amountInput.isMax, amountInput.isValid, lastChangedInput, activePool, dispatch]);

  useEffect(() => {
    if (!requestData || !activePool) {
      return;
    }
    if (amountSendInput.isMax) {
      toast('Amount assets > MAX', { toastId: 'amount-max-send' });
    } else if (amountSendInput.isValid && lastChangedInput === 2) {
      dispatch(mainActions.onTradePool.request(requestData));
    }
  }, [requestData, amountSendInput.isMax, amountSendInput.isValid, lastChangedInput, activePool, dispatch]);

  useEffect(() => {
    if (activePool && assets) {
      setCurrentLPToken(assets.find((el) => el.aid === activePool['lp-token']));
    }
  }, [activePool, assets]);

  const onTrade = (dataTrade: ITrade) => {
    dispatch(mainActions.onTradePool.request(setDataRequest(dataTrade)));
  };

  const onPreviousClick = () => {
    navigate(ROUTES.POOLS.BASE);
  };

  const isTradeDisabled = !activePool || (!amountInput.isValid && !amountSendInput.isValid);

  const selectValue = (assetId: number | null): IOptions | null => (
    options.find((item) => item.value === assetId) || null
  );
  const fromReserve = activePool
    ? (currentToken === activePool.aid1 ? fromGroths(activePool.tok1) : fromGroths(activePool.tok2))
    : 0;
  const toReserve = activePool
    ? (currentToken === activePool.aid1 ? fromGroths(activePool.tok2) : fromGroths(activePool.tok1))
    : 0;
  const poolRate = Number(fromReserve) > 0 ? Number(toReserve) / Number(fromReserve) : 0;
  const effectivePayRaw = predictData?.pay ?? predictData?.pay_raw ?? predictData?.tok2 ?? 0;
  const effectiveBuyRaw = predictData?.buy ?? predictData?.tok1 ?? 0;
  const execPay = Number(fromGroths(effectivePayRaw));
  const execBuy = Number(fromGroths(effectiveBuyRaw));
  const feeDao = Number(predictData?.fee_dao || 0);
  const feePool = Number(predictData?.fee_pool || 0);
  const feeTotal = feeDao + feePool;
  const executionRate = execPay > 0 ? execBuy / execPay : 0;
  const priceImpact = poolRate > 0 && executionRate > 0 ? ((poolRate - executionRate) / poolRate) * 100 : 0;
  const activeAmount = lastChangedInput === 1 ? parseAmount(amountInput.value) : parseAmount(amountSendInput.value);
  const hasActiveQuoteInput = Number.isFinite(activeAmount) && activeAmount > 0;
  const displayedBuyRaw = hasActiveQuoteInput ? effectiveBuyRaw : 0;
  const displayedPayRaw = hasActiveQuoteInput ? effectivePayRaw : 0;
  const displayedFeeDao = hasActiveQuoteInput ? feeDao : 0;
  const displayedFeePool = hasActiveQuoteInput ? feePool : 0;
  const displayedFeeTotal = hasActiveQuoteInput ? feeTotal : 0;
  const displayedRate = hasActiveQuoteInput ? executionRate : 0;
  const displayedImpact = hasActiveQuoteInput ? priceImpact : 0;
  const shownRate = flipRate && displayedRate > 0 ? 1 / displayedRate : displayedRate;
  const rateLeft = flipRate ? tokenName_2 : tokenName_1;
  const rateRight = flipRate ? tokenName_1 : tokenName_2;

  useEffect(() => {
    if (!predictData) {
      return;
    }
    if (lastChangedInput === 1 && !emptyPredict(predictData, amountInput.value)) {
      amountSendInput.onPredict(formatPredictAmount(fromGroths(effectiveBuyRaw)));
    }
    if (lastChangedInput === 2 && !emptyPredict(predictData, amountSendInput.value)) {
      amountInput.onPredict(formatPredictAmount(fromGroths(effectivePayRaw)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [predictData, lastChangedInput, effectiveBuyRaw, effectivePayRaw]);

  useEffect(() => {
    if (!hasActiveQuoteInput) {
      if (predictData) {
        dispatch(mainActions.setPredict(null));
      }
      if (lastChangedInput === 1) {
        amountSendInput.onPredict('');
      } else {
        amountInput.onPredict('');
      }
    }
  }, [hasActiveQuoteInput, predictData, dispatch, lastChangedInput]);

  if (embedded) {
    return (
      <Window hideHeader>
        <Container>
          <EmbeddedLayout>
            <div>
              <SwapCard>
                <SwapBlock>
                  <BlockLabel>From</BlockLabel>
                  <AssetsSection>
                    <InputRow>
                      <Input
                        value={amountInput.value}
                        variant="amount"
                        pallete="blue"
                        onChange={(e) => {
                          amountInput.onPredict(formatUserInput(e.target.value));
                          setLastChangedInput(1);
                        }}
                        onFocus={() => {
                          if (
                            emptyPredict(predictData, amountSendInput.value)
                            && (amountInput.value === 0 || amountInput.value === '0')
                          ) {
                            amountInput.onPredict('');
                          }
                        }}
                      />
                      <InlineSelect>
                        <ReactSelect
                          key={`embedded-buy-${currentToken}`}
                          options={options}
                          defaultValue={selectValue(currentToken)}
                          onChange={(value: IOptions) => {
                            setCurrentToken(value?.value ?? null);
                            if (value?.value === secondToken) {
                              setSecondToken(currentToken);
                            }
                            dispatch(mainActions.setPredict(null));
                          }}
                          isIcon
                          hideValueWhileSearching
                          placeholder="Search..."
                          customPrefix="custom-filter"
                        />
                      </InlineSelect>
                    </InputRow>
                  </AssetsSection>
                  <SearchHint>Click asset selector to search.</SearchHint>
                </SwapBlock>
                <EmbeddedExchangeWrap>
                  <Button icon={IconExchange} variant="icon" onClick={() => handleChange()} />
                </EmbeddedExchangeWrap>
                <SwapBlock>
                  <BlockLabel>To</BlockLabel>
                  <AssetsSection>
                    <InputRow>
                      <Input
                        pallete="purple"
                        variant="amount"
                        style={{ cursor: 'default', color: 'var(--color-purple)', opacity: 1 }}
                        value={amountSendInput.value}
                        onChange={(e) => {
                          amountSendInput.onPredict(formatUserInput(e.target.value));
                          setLastChangedInput(2);
                        }}
                        onFocus={() => {
                          if (
                            emptyPredict(predictData, amountInput.value)
                            && (amountSendInput.value === 0 || amountSendInput.value === '0')
                          ) {
                            amountSendInput.onPredict('');
                          }
                        }}
                      />
                      <InlineSelect>
                        <ReactSelect
                          key={`embedded-pay-${secondToken}`}
                          options={options}
                          defaultValue={selectValue(secondToken)}
                          onChange={(value: IOptions) => {
                            setSecondToken(value?.value ?? null);
                            if (value?.value === currentToken) {
                              setCurrentToken(secondToken);
                            }
                            dispatch(mainActions.setPredict(null));
                          }}
                          isIcon
                          hideValueWhileSearching
                          placeholder="Search..."
                          customPrefix="custom-filter"
                        />
                      </InlineSelect>
                    </InputRow>
                  </AssetsSection>
                  <SearchHint>Click asset selector to search.</SearchHint>
                </SwapBlock>
                <SummaryPanel>
                  <SummaryHeader>trade summary</SummaryHeader>
                  <SummaryWrapper style={{ marginTop: 0 }}>
                    <RateRow>
                      <SummaryTitle>Rate</SummaryTitle>
                      <RateText>{`1 ${rateLeft} = ${shownRate.toFixed(6)} ${rateRight}`}</RateText>
                      <Button icon={IconExchange} variant="icon" onClick={() => setFlipRate(!flipRate)} />
                    </RateRow>
                    <SummaryContainer>
                      <SummaryTitle>You buy</SummaryTitle>
                      <SummaryAsset>
                        <AssetLabel
                          variant="predict"
                          title={tokenName_2}
                          assets_id={secondToken ?? 0}
                          amount={displayedBuyRaw}
                        />
                      </SummaryAsset>
                    </SummaryContainer>
                    <SummaryContainer>
                      <SummaryTitle>DAO Fee</SummaryTitle>
                      <SummaryAsset>
                        <AssetLabel
                          variant="predict"
                          title={tokenName_2}
                          assets_id={secondToken ?? 0}
                          amount={displayedFeeDao}
                        />
                      </SummaryAsset>
                    </SummaryContainer>
                    <SummaryContainer>
                      <SummaryTitle>LP Fee</SummaryTitle>
                      <SummaryAsset>
                        <AssetLabel
                          variant="predict"
                          title={tokenName_2}
                          assets_id={secondToken ?? 0}
                          amount={displayedFeePool}
                        />
                      </SummaryAsset>
                    </SummaryContainer>
                    <SummaryContainer>
                      <SummaryTitle>Total Fee</SummaryTitle>
                      <SummaryAsset>
                        <AssetLabel
                          variant="predict"
                          title={tokenName_2}
                          assets_id={secondToken ?? 0}
                          amount={displayedFeeTotal}
                        />
                      </SummaryAsset>
                    </SummaryContainer>
                    <SummaryContainer>
                      <SummaryTitle>Total Pay</SummaryTitle>
                      <SummaryAsset>
                        <AssetLabel
                          variant="predict"
                          title={tokenName_1}
                          assets_id={currentToken ?? 0}
                          amount={displayedPayRaw}
                        />
                      </SummaryAsset>
                    </SummaryContainer>
                    <SummaryContainer>
                      <SummaryTitle>Impact</SummaryTitle>
                      <SummaryAsset>{`${displayedImpact.toFixed(2)}%`}</SummaryAsset>
                    </SummaryContainer>
                  </SummaryWrapper>
                </SummaryPanel>
                <EmbeddedTradeButtonWrap>
                  <Button
                    disabled={isTradeDisabled}
                    icon={DoneIcon}
                    variant="approve"
                    onClick={() => requestData && onTrade(requestData)}
                  >
                    Trade
                  </Button>
                </EmbeddedTradeButtonWrap>
              </SwapCard>
            </div>
            <RightPanel>
              {activePool ? (
                <>
                  <PoolStat data={activePool} lp={currentLPToken} showFavorite plain />
                  {matchedPools.length > 1 && (
                    <FeeTierRow>
                      {matchedPools.map((pool) => (
                        <FeeTierButton
                          key={pool.kind}
                          active={activePool?.kind === pool.kind}
                          onClick={() => {
                            if (manualKind === null) setBestKind(data?.kind ?? null);
                            setManualKind(pool.kind);
                            dispatch(mainActions.setCurrentPool(pool));
                          }}
                        >
                          {getPoolKind(pool.kind)}
                          {(manualKind === null ? data?.kind : bestKind) === pool.kind && (
                            <BestBadge>Best</BestBadge>
                          )}
                        </FeeTierButton>
                      ))}
                      {manualKind !== null && (
                        <AutoButton
                          onClick={() => {
                            setManualKind(null);
                            setBestKind(null);
                            dispatch(mainActions.setCurrentPool(matchedPools[0]));
                          }}
                        >
                          Auto
                        </AutoButton>
                      )}
                    </FeeTierRow>
                  )}
                  <EmbeddedActionRow>
                    <Button
                      icon={IconShieldChecked}
                      variant="control"
                      onClick={() => navigate(ROUTES.POOLS.ADD_LIQUIDITY)}
                      disabled={!activePool}
                    >
                      Add Liquidity
                    </Button>
                    <Button
                      icon={IconReceive}
                      variant="control"
                      pallete="blue"
                      onClick={() => navigate(ROUTES.POOLS.WITHDRAW_POOL)}
                      disabled={!activePool}
                    >
                      Withdraw
                    </Button>
                  </EmbeddedActionRow>
                </>
              ) : (
                <EmptyPoolState>No pool matches this pair and filter combination.</EmptyPoolState>
              )}
            </RightPanel>
          </EmbeddedLayout>
        </Container>
      </Window>
    );
  }

  return (
    <Window title="trade" backButton>
      <Container>
        <SelectWrapper>
          <SearchHint>Search asset directly inside each amount row selector.</SearchHint>
        </SelectWrapper>
        <AssetsContainer>
          <Section title={titleSections.TRADE_RECEIVE}>
            <AssetsSection>
              <InputRow>
                <Input
                  value={amountInput.value}
                  variant="amount"
                  pallete="blue"
                  onChange={(e) => {
                    amountInput.onPredict(formatUserInput(e.target.value));
                    setLastChangedInput(1);
                  }}
                  onFocus={() => {
                    if (
                      emptyPredict(predictData, amountSendInput.value)
                      && (amountInput.value === 0 || amountInput.value === '0')
                    ) {
                      amountInput.onPredict('');
                    }
                  }}
                />
                <InlineSelect>
                  <ReactSelect
                    key={`buy-${currentToken}`}
                    options={options}
                    defaultValue={selectValue(currentToken)}
                    onChange={(value: IOptions) => {
                      setCurrentToken(value?.value ?? null);
                      if (value?.value === secondToken) {
                        setSecondToken(currentToken);
                      }
                      dispatch(mainActions.setPredict(null));
                    }}
                    isIcon
                    hideValueWhileSearching
                    placeholder="Search..."
                    customPrefix="custom-filter"
                  />
                </InlineSelect>
              </InputRow>
            </AssetsSection>
            <ExchangeWrapper>
              <Button icon={IconExchange} variant="icon" onClick={() => handleChange()} />
            </ExchangeWrapper>
          </Section>
          <Section title={titleSections.TRADE_SEND}>
            <AssetsSection>
              <InputRow>
                <Input
                  pallete="purple"
                  variant="amount"
                  style={{ cursor: 'default', color: 'var(--color-purple)', opacity: 1 }}
                  value={amountSendInput.value}
                  onChange={(e) => {
                    amountSendInput.onPredict(formatUserInput(e.target.value));
                    setLastChangedInput(2);
                  }}
                  onFocus={() => {
                    if (
                      emptyPredict(predictData, amountInput.value)
                      && (amountSendInput.value === 0 || amountSendInput.value === '0')
                    ) {
                      amountSendInput.onPredict('');
                    }
                  }}
                />
                <InlineSelect>
                  <ReactSelect
                    key={`pay-${secondToken}`}
                    options={options}
                    defaultValue={selectValue(secondToken)}
                    onChange={(value: IOptions) => {
                      setSecondToken(value?.value ?? null);
                      if (value?.value === currentToken) {
                        setCurrentToken(secondToken);
                      }
                      dispatch(mainActions.setPredict(null));
                    }}
                    isIcon
                    hideValueWhileSearching
                    placeholder="Search..."
                    customPrefix="custom-filter"
                  />
                </InlineSelect>
              </InputRow>
            </AssetsSection>
          </Section>
        </AssetsContainer>
        {!embedded && (
        <SectionWrapper>
          <Section title="trade summary">
            <SummaryWrapper>
              <SummaryContainer>
                <SummaryTitle>You buy</SummaryTitle>
                <SummaryAsset>
                  <AssetAmount>
                    <AssetLabel
                      variant="predict"
                      title={tokenName_1}
                      assets_id={currentToken ?? 0}
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
                      title={tokenName_2}
                      assets_id={secondToken ?? 0}
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
                      title={tokenName_2}
                      assets_id={secondToken ?? 0}
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
                    <div>
                      <AssetLabel
                        variant="predict"
                        title={tokenName_2}
                        assets_id={secondToken ?? 0}
                        amount={predictData ? predictData.pay : 0}
                        id={false}
                      />
                    </div>
                  </AssetAmount>
                </SummaryAsset>
              </SummaryContainer>
            </SummaryWrapper>
          </Section>
          {activePool ? (
            <>
              <PoolStat data={activePool} lp={currentLPToken} />
              {matchedPools.length > 1 && (
                <FeeTierRow>
                  {matchedPools.map((pool) => (
                    <FeeTierButton
                      key={pool.kind}
                      active={activePool?.kind === pool.kind}
                      onClick={() => {
                        if (manualKind === null) setBestKind(data?.kind ?? null);
                        setManualKind(pool.kind);
                        dispatch(mainActions.setCurrentPool(pool));
                      }}
                    >
                      {getPoolKind(pool.kind)}
                      {(manualKind === null ? data?.kind : bestKind) === pool.kind && (
                        <BestBadge>Best</BestBadge>
                      )}
                    </FeeTierButton>
                  ))}
                  {manualKind !== null && (
                    <AutoButton
                      onClick={() => {
                        setManualKind(null);
                        setBestKind(null);
                        dispatch(mainActions.setCurrentPool(matchedPools[0]));
                      }}
                    >
                      Auto
                    </AutoButton>
                  )}
                </FeeTierRow>
              )}
            </>
          ) : null}
        </SectionWrapper>
        )}
        <ButtonBlock>
          <ButtonWrapper>
            {!embedded && (
              <Button icon={CancelIcon} variant="cancel" onClick={onPreviousClick}>
                Cancel
              </Button>
            )}
            <Button
              disabled={isTradeDisabled}
              icon={DoneIcon}
              variant="approve"
              onClick={() => requestData && onTrade(requestData)}
            >
              Trade
            </Button>
          </ButtonWrapper>
        </ButtonBlock>
      </Container>
    </Window>
  );
};
