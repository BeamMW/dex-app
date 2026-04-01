import React, { useEffect, useState } from 'react';
import { IAddLiquidity } from '@core/types';
import {
  AssetsSection,
  Button,
  Container,
  Input,
  PoolStat,
  Window,
} from '@app/shared/components';
import {
  emptyPredict,
  fromGroths,
  getLPToken,
  setDataRequest,
  toGroths,
  truncate,
} from '@core/appUtils';
import { useDispatch, useSelector } from 'react-redux';
import * as mainActions from '@app/containers/Pools/store/actions';
import { selectAssetsList, selectCurrentPool, selectPredirect } from '@app/containers/Pools/store/selectors';
import { useInput } from '@app/shared/hooks';
import { ROUTES } from '@app/shared/constants';
import { CancelIcon, DoneIcon, IconExchange } from '@app/shared/icons';
import AssetLabel from '@app/shared/components/AssetLabel';
import { useNavigate } from 'react-router-dom';
import {
  BlockLabel,
  ButtonBlock,
  ButtonWrapper,
  EmbeddedExchangeWrap,
  EmbeddedLayout,
  EmbeddedTradeButtonWrap,
  InputRow,
  RightPanel,
  SwapBlock,
  SwapCard,
} from '@app/containers/Pools/containers/shared/poolFlowLayout';

const purpleReadonly = { cursor: 'default' as const, color: 'var(--color-purple)', opacity: 1 };

export const AddLiquidity = () => {
  const data = useSelector(selectCurrentPool());
  const predictData = useSelector(selectPredirect());
  const assets = useSelector(selectAssetsList());
  const [currentLPToken, setCurrentLPToken] = useState(null);
  const [currentToken, setCurrentToken] = useState(data.aid1);
  const [requestData, setRequestData] = useState(null);
  const [isSwap, setIsSwap] = useState<boolean>(false);
  const [poolIsEmpty, setPoolIsEmpty] = useState(true);
  const amountInput_aid1 = useInput({
    initialValue: 0,
    validations: { isEmpty: true },
  });
  const amountInput_aid2 = useInput({
    initialValue: 0,
    validations: { isEmpty: true },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tokenName_1 = truncate(data?.metadata1?.UN || `Token ${data?.aid1 ?? ''}`);
  const tokenName_2 = truncate(data?.metadata2?.UN || `Token ${data?.aid2 ?? ''}`);

  useEffect(() => {
    setPoolIsEmpty(!!(!data.tok1 || !data.tok2));
  }, [data.tok1, data.tok2]);

  const getValueInput_1 = () => {
    if (poolIsEmpty) {
      return toGroths(Number(amountInput_aid1.value));
    }
    return currentToken === data.aid2 ? '0' : toGroths(Number(amountInput_aid1.value));
  };
  const getValueInput_2 = () => {
    if (poolIsEmpty) {
      return toGroths(Number(amountInput_aid2.value));
    }
    return currentToken === data.aid1 ? '0' : toGroths(Number(amountInput_aid2.value));
  };

  useEffect(() => {
    setCurrentToken(!isSwap ? data.aid1 : data.aid2);
  }, [isSwap, data.aid1, data.aid2]);

  useEffect(() => {
    setRequestData({
      aid1: data.aid1,
      aid2: data.aid2,
      kind: data.kind,
      val1: getValueInput_1(),
      val2: getValueInput_2(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amountInput_aid1.value, amountInput_aid2.value, isSwap, data.aid1, data.aid2, data.kind]);

  useEffect(() => {
    if (!poolIsEmpty && predictData) {
      if (currentToken === data.aid1) {
        if (!emptyPredict(predictData, amountInput_aid1.value)) {
          amountInput_aid2.onPredict(fromGroths(predictData.tok2));
        }
      } else if (!emptyPredict(predictData, amountInput_aid2.value)) {
        amountInput_aid1.onPredict(fromGroths(predictData.tok1));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolIsEmpty, predictData, currentToken, data.aid1, amountInput_aid1.value, amountInput_aid2.value]);

  useEffect(() => {
    setCurrentLPToken(getLPToken(data, assets));
  }, [data, assets]);

  const handleChange = () => {
    setIsSwap(!isSwap);
    dispatch(mainActions.setPredict(null));
  };

  const checkIsValid = poolIsEmpty
    ? amountInput_aid1.isValid && amountInput_aid2.isValid
    : amountInput_aid1.isValid || amountInput_aid2.isValid;

  const hasLiquidityQuote = poolIsEmpty
    ? true
    : (currentToken === data.aid1
      ? !emptyPredict(predictData, amountInput_aid1.value)
      : !emptyPredict(predictData, amountInput_aid2.value));

  const canSubmitAdd = checkIsValid
    && amountInput_aid1.value
    && amountInput_aid2.value
    && hasLiquidityQuote;

  useEffect(() => {
    if (checkIsValid && requestData) {
      dispatch(mainActions.onAddLiquidity.request(requestData));
    }
  }, [requestData, checkIsValid, dispatch]);

  const onAddLiquidity = (dataLiquid: IAddLiquidity): void => {
    dispatch(mainActions.onAddLiquidity.request(setDataRequest(dataLiquid)));
  };

  const onPreviousClick = () => {
    navigate(ROUTES.POOLS.BASE);
  };

  const currentInput = isSwap ? amountInput_aid2 : amountInput_aid1;
  const currentSecondInput = isSwap ? amountInput_aid1 : amountInput_aid2;

  const emptyPoolForm = (
    <SwapCard>
      <SwapBlock>
        <BlockLabel>{tokenName_1}</BlockLabel>
        <AssetsSection>
          <InputRow>
            <Input
              variant="amount"
              pallete="purple"
              value={amountInput_aid1.value}
              onChange={(e) => amountInput_aid1.onChange(e)}
            />
            <AssetLabel title={tokenName_1} assets_id={data.aid1} />
          </InputRow>
        </AssetsSection>
      </SwapBlock>
      <SwapBlock>
        <BlockLabel>{tokenName_2}</BlockLabel>
        <AssetsSection>
          <InputRow>
            <Input
              variant="amount"
              pallete="purple"
              value={amountInput_aid2.value}
              onChange={(e) => amountInput_aid2.onChange(e)}
            />
            <AssetLabel title={tokenName_2} assets_id={data.aid2} />
          </InputRow>
        </AssetsSection>
      </SwapBlock>
      <EmbeddedTradeButtonWrap>
        <ButtonBlock>
          <ButtonWrapper>
            <Button icon={CancelIcon} variant="cancel" onClick={() => onPreviousClick()}>
              Cancel
            </Button>
            <Button
              icon={DoneIcon}
              variant="approve"
              onClick={() => onAddLiquidity(requestData)}
              disabled={!canSubmitAdd}
            >
              Add liquidity
            </Button>
          </ButtonWrapper>
        </ButtonBlock>
      </EmbeddedTradeButtonWrap>
    </SwapCard>
  );

  const nonEmptyForm = (
    <SwapCard>
      <SwapBlock>
        <BlockLabel>{isSwap ? tokenName_2 : tokenName_1}</BlockLabel>
        <AssetsSection>
          <InputRow>
            <Input
              value={currentInput.value}
              variant="amount"
              pallete="blue"
              onChange={(e) => currentInput.onChange(e)}
              onFocus={() => {
                if (
                  emptyPredict(predictData, currentSecondInput.value)
                  && (currentInput.value === 0 || currentInput.value === '0')
                ) {
                  currentInput.onPredict('');
                }
              }}
            />
            <AssetLabel title={isSwap ? tokenName_2 : tokenName_1} assets_id={isSwap ? data.aid2 : data.aid1} />
          </InputRow>
        </AssetsSection>
      </SwapBlock>
      <EmbeddedExchangeWrap>
        <Button icon={IconExchange} variant="icon" onClick={() => handleChange()} />
      </EmbeddedExchangeWrap>
      <SwapBlock>
        <BlockLabel>{isSwap ? tokenName_1 : tokenName_2}</BlockLabel>
        <AssetsSection>
          <InputRow>
            <Input
              pallete="purple"
              variant="amount"
              style={purpleReadonly}
              value={currentSecondInput.value}
              onChange={(e) => currentSecondInput.onChange(e)}
              onFocus={() => {
                if (
                  emptyPredict(predictData, currentInput.value)
                  && (currentSecondInput.value === 0 || currentSecondInput.value === '0')
                ) {
                  currentSecondInput.onPredict('');
                }
              }}
            />
            <AssetLabel title={isSwap ? tokenName_1 : tokenName_2} assets_id={isSwap ? data.aid1 : data.aid2} />
          </InputRow>
        </AssetsSection>
      </SwapBlock>
      <EmbeddedTradeButtonWrap>
        <ButtonBlock>
          <ButtonWrapper>
            <Button icon={CancelIcon} variant="cancel" onClick={() => onPreviousClick()}>
              Cancel
            </Button>
            <Button
              icon={DoneIcon}
              variant="approve"
              onClick={() => onAddLiquidity(requestData)}
              disabled={!canSubmitAdd}
            >
              Add liquidity
            </Button>
          </ButtonWrapper>
        </ButtonBlock>
      </EmbeddedTradeButtonWrap>
    </SwapCard>
  );

  return (
    <Window hideHeader>
      <Container>
        <EmbeddedLayout>
          <div>
            {poolIsEmpty ? emptyPoolForm : nonEmptyForm}
          </div>
          <RightPanel>
            <PoolStat data={data} lp={currentLPToken} showFavorite plain />
          </RightPanel>
        </EmbeddedLayout>
      </Container>
    </Window>
  );
};
