import React, { useEffect, useState } from 'react';
import { IAddLiquidity } from '@core/types';
import {
  emptyPredict, fromGroths, getLPToken, setDataRequest, toGroths, truncate,
} from '@core/appUtils';
import {
  AssetsSection, Button, Container, Input, PoolStat, Window,
} from '@app/shared/components';
import { useDispatch, useSelector } from 'react-redux';
import * as mainActions from '@app/containers/Pools/store/actions';
import { selectAssetsList, selectCurrentPool, selectPredirect } from '@app/containers/Pools/store/selectors';
import { useInput } from '@app/shared/hooks';
import { ROUTES } from '@app/shared/constants';
import { CancelIcon, DoneIcon, IconExchange } from '@app/shared/icons';
import AssetLabel from '@app/shared/components/AssetLabel';
import { useNavigate } from 'react-router-dom';
import {
  BlockLabel, ButtonBlock, ButtonWrapper, EmbeddedExchangeWrap, EmbeddedLayout,
  EmbeddedTradeButtonWrap, InputRow, RightPanel, SwapBlock, SwapCard,
} from '@app/containers/Pools/containers/shared/poolFlowLayout';
import {
  createAmountFieldHandlers, formatPredictAmount, parseAmount, useAmountInputCaret,
} from '@app/containers/Pools/containers/shared/poolAmountInput';

const purpleReadonly = { cursor: 'default' as const, color: 'var(--color-purple)', opacity: 1 };

export const AddLiquidity = () => {
  const data = useSelector(selectCurrentPool());
  const predictData = useSelector(selectPredirect());
  const assets = useSelector(selectAssetsList());
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentLPToken, setCurrentLPToken] = useState(null);
  const [currentToken, setCurrentToken] = useState(data.aid1);
  const [requestData, setRequestData] = useState(null);
  const [isSwap, setIsSwap] = useState(false);
  const [poolIsEmpty, setPoolIsEmpty] = useState(true);
  const amount1 = useInput({ initialValue: 0, validations: { isEmpty: true } });
  const amount2 = useInput({ initialValue: 0, validations: { isEmpty: true } });
  const caret1 = useAmountInputCaret(amount1.value, amount1.onPredict);
  const caret2 = useAmountInputCaret(amount2.value, amount2.onPredict);
  const t1 = truncate(data?.metadata1?.UN || `Token ${data?.aid1 ?? ''}`);
  const t2 = truncate(data?.metadata2?.UN || `Token ${data?.aid2 ?? ''}`);

  useEffect(() => setPoolIsEmpty(!data.tok1 || !data.tok2), [data.tok1, data.tok2]);
  useEffect(() => setCurrentToken(isSwap ? data.aid2 : data.aid1), [isSwap, data.aid1, data.aid2]);
  useEffect(() => setCurrentLPToken(getLPToken(data, assets)), [data, assets]);

  useEffect(() => {
    const v1 = toGroths(parseAmount(amount1.value));
    const v2 = toGroths(parseAmount(amount2.value));
    setRequestData({
      aid1: data.aid1, aid2: data.aid2, kind: data.kind,
      val1: poolIsEmpty ? v1 : (currentToken === data.aid2 ? '0' : v1),
      val2: poolIsEmpty ? v2 : (currentToken === data.aid1 ? '0' : v2),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount1.value, amount2.value, poolIsEmpty, currentToken, data.aid1, data.aid2, data.kind]);

  useEffect(() => {
    if (poolIsEmpty || !predictData) return;
    if (currentToken === data.aid1) {
      if (!emptyPredict(predictData, amount1.value)) {
        amount2.onPredict(formatPredictAmount(fromGroths(predictData.tok2)));
      }
    } else if (!emptyPredict(predictData, amount2.value)) {
      amount1.onPredict(formatPredictAmount(fromGroths(predictData.tok1)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolIsEmpty, predictData, currentToken, data.aid1, amount1.value, amount2.value]);

  const checkOk = poolIsEmpty ? (amount1.isValid && amount2.isValid) : (amount1.isValid || amount2.isValid);
  const hasQuote = poolIsEmpty || (currentToken === data.aid1
    ? !emptyPredict(predictData, amount1.value)
    : !emptyPredict(predictData, amount2.value));
  const canSubmit = checkOk && amount1.value && amount2.value && hasQuote;

  useEffect(() => {
    if (checkOk && requestData) dispatch(mainActions.onAddLiquidity.request(requestData));
  }, [requestData, checkOk, dispatch]);

  const submit = (payload: IAddLiquidity) => dispatch(mainActions.onAddLiquidity.request(setDataRequest(payload)));
  const cur = isSwap ? amount2 : amount1;
  const peer = isSwap ? amount1 : amount2;
  const hEmpty1 = createAmountFieldHandlers(predictData, amount1, amount2.value);
  const hEmpty2 = createAmountFieldHandlers(predictData, amount2, amount1.value);
  const hFirst = createAmountFieldHandlers(predictData, cur, peer.value);
  const hSecond = createAmountFieldHandlers(predictData, peer, cur.value);

  const footer = (
    <EmbeddedTradeButtonWrap>
      <ButtonBlock>
        <ButtonWrapper>
          <Button icon={CancelIcon} variant="cancel" onClick={() => navigate(ROUTES.POOLS.BASE)}>Cancel</Button>
          <Button icon={DoneIcon} variant="approve" disabled={!canSubmit} onClick={() => submit(requestData)}>
            Add liquidity
          </Button>
        </ButtonWrapper>
      </ButtonBlock>
    </EmbeddedTradeButtonWrap>
  );

  const emptyRows = [
    { title: t1, aid: data.aid1, v: amount1, caret: caret1, h: hEmpty1 },
    { title: t2, aid: data.aid2, v: amount2, caret: caret2, h: hEmpty2 },
  ];

  const form = poolIsEmpty ? (
    <SwapCard>
      {emptyRows.map((row) => (
        <SwapBlock key={row.aid}>
          <BlockLabel>{row.title}</BlockLabel>
          <AssetsSection>
            <InputRow>
              <Input
                ref={row.caret.inputRef}
                variant="amount"
                pallete="purple"
                value={row.v.value}
                onChange={row.caret.handleChange}
                onFocus={row.h.onFocus}
                onBlur={row.h.onBlur}
              />
              <AssetLabel title={row.title} assets_id={row.aid} />
            </InputRow>
          </AssetsSection>
        </SwapBlock>
      ))}
      {footer}
    </SwapCard>
  ) : (
    <SwapCard>
      <SwapBlock>
        <BlockLabel>{isSwap ? t2 : t1}</BlockLabel>
        <AssetsSection>
          <InputRow>
            <Input
              ref={isSwap ? caret2.inputRef : caret1.inputRef}
              variant="amount"
              pallete="blue"
              value={cur.value}
              onChange={isSwap ? caret2.handleChange : caret1.handleChange}
              onFocus={hFirst.onFocus}
              onBlur={hFirst.onBlur}
            />
            <AssetLabel title={isSwap ? t2 : t1} assets_id={isSwap ? data.aid2 : data.aid1} />
          </InputRow>
        </AssetsSection>
      </SwapBlock>
      <EmbeddedExchangeWrap>
        <Button
          icon={IconExchange}
          variant="icon"
          onClick={() => { setIsSwap((s) => !s); dispatch(mainActions.setPredict(null)); }}
        />
      </EmbeddedExchangeWrap>
      <SwapBlock>
        <BlockLabel>{isSwap ? t1 : t2}</BlockLabel>
        <AssetsSection>
          <InputRow>
            <Input
              ref={isSwap ? caret1.inputRef : caret2.inputRef}
              pallete="purple"
              variant="amount"
              style={purpleReadonly}
              value={peer.value}
              onChange={isSwap ? caret1.handleChange : caret2.handleChange}
              onFocus={hSecond.onFocus}
              onBlur={hSecond.onBlur}
            />
            <AssetLabel title={isSwap ? t1 : t2} assets_id={isSwap ? data.aid1 : data.aid2} />
          </InputRow>
        </AssetsSection>
      </SwapBlock>
      {footer}
    </SwapCard>
  );

  return (
    <Window hideHeader>
      <Container>
        <EmbeddedLayout>
          <div>{form}</div>
          <RightPanel>
            <PoolStat data={data} lp={currentLPToken} showFavorite plain />
          </RightPanel>
        </EmbeddedLayout>
      </Container>
    </Window>
  );
};
