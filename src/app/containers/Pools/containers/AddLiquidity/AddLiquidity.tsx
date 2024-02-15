import React, { useEffect, useMemo, useState } from 'react';
import { IAddLiquidity } from '@core/types';
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
import {
  emptyPredict,
  fromGroths,
  getLPToken,
  onPredictValue,
  setDataRequest,
  toGroths,
  truncate,
} from '@core/appUtils';
import { useDispatch, useSelector } from 'react-redux';
import * as mainActions from '@app/containers/Pools/store/actions';
import { selectAssetsList, selectCurrentPool, selectPredirect } from '@app/containers/Pools/store/selectors';
import { useInput } from '@app/shared/hooks';
import { ROUTES, titleSections } from '@app/shared/constants';
import { CancelIcon, DoneIcon, IconExchange } from '@app/shared/icons';
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
  justify-content: flex-start;
  width: 100%;
  @media (max-width: 913px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
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
  const tokenName_1 = truncate(data.metadata1.UN);
  const tokenName_2 = truncate(data.metadata2.UN);
  const [lastChangedInput, setLastChangedInput] = useState<number>(1);

  useEffect(() => {
    setPoolIsEmpty(!!(!data.tok1 || !data.tok2));
  }, []);

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
  }, [isSwap]);

  useEffect(() => {
    setRequestData({
      aid1: data.aid1,
      aid2: data.aid2,
      kind: data.kind,
      val1: getValueInput_1(),
      val2: getValueInput_2(),
    });
  }, [amountInput_aid1.value, amountInput_aid2.value, isSwap]);

  useEffect(() => {
    setRequestData({
      aid1: data.aid1,
      aid2: data.aid2,
      kind: data.kind,
      val1: getValueInput_1(),
      val2: getValueInput_2(),
    });
  }, [amountInput_aid1.value, amountInput_aid2.value, isSwap, lastChangedInput]);

  useEffect(() => {
    if (!poolIsEmpty && predictData) {
      if (currentToken === data.aid1) {
        !emptyPredict(predictData, amountInput_aid1.value)
          ? amountInput_aid2.onPredict(fromGroths(predictData.tok2))
          : 0;
      } else {
        !emptyPredict(predictData, amountInput_aid2.value)
          ? amountInput_aid1.onPredict(fromGroths(predictData.tok1))
          : 0;
      }
    }
  }, [isSwap, amountInput_aid1.value, amountInput_aid2.value]);

  useEffect(() => {
    setCurrentLPToken(getLPToken(data, assets));
  }, [data, assets]);
  const handleChange = () => {
    setIsSwap(!isSwap);
  };
  const currentSecondInput = isSwap ? amountInput_aid1 : amountInput_aid2;

  const checkIsValid = poolIsEmpty
    ? amountInput_aid1.isValid && amountInput_aid2.isValid
    : amountInput_aid1.isValid || amountInput_aid2.isValid;

  useMemo(() => {
    if (checkIsValid) {
      dispatch(mainActions.onAddLiquidity.request(requestData));
    }
  }, [requestData, amountInput_aid1.isValid, amountInput_aid2.isValid, currentSecondInput.value]);
  const onAddLiquidity = (dataLiquid: IAddLiquidity): void => {
    dispatch(mainActions.onAddLiquidity.request(setDataRequest(dataLiquid)));

  };
  const currentInput = isSwap ? amountInput_aid2 : amountInput_aid1;


  const calculated = onPredictValue(currentSecondInput, isSwap, predictData);
  const calculatedSecond = onPredictValue(currentInput, isSwap, predictData);

  const onPreviousClick = () => {
    navigate(ROUTES.POOLS.BASE);
  };

  return (
    <Window title="Add liquidity" backButton>
      <Container>
        {poolIsEmpty ? (
          <AssetsContainer>
            {/* <Title variant="subtitle">Select Pair</Title> */}
            <Section title={titleSections.ADD_LIQUIDITY}>
              <AssetsSection>
                <Input
                  variant="amount"
                  pallete="purple"
                  value={amountInput_aid1.value}
                  onChange={(e) => amountInput_aid1.onChange(e)}
                />
                <AssetLabel title={tokenName_1} assets_id={data.aid1} />
              </AssetsSection>
            </Section>
            <Section title={titleSections.ADD_LIQUIDITY}>
              <AssetsSection>
                <Input
                  variant="amount"
                  pallete="purple"
                  value={amountInput_aid2.value}
                  onChange={(e) => amountInput_aid2.onChange(e)}
                />
                <AssetLabel title={tokenName_2} assets_id={data.aid2} />
              </AssetsSection>
            </Section>
          </AssetsContainer>
        ) : (
          <AssetsContainer>
            <Section title={titleSections.ADD_LIQUIDITY}>
              <AssetsSection>
                <Input
                  value={calculated || currentInput.value}
                  variant="amount"
                  pallete="blue"
                  onChange={(e) => {
                    currentInput.onChange(e)
                    setLastChangedInput(1)
                  }}
                />
                <AssetLabel title={isSwap ? tokenName_2 : tokenName_1} assets_id={isSwap ? data.aid2 : data.aid1} />
              </AssetsSection>
              <ExchangeWrapper>
                <Button icon={IconExchange} variant="icon" onClick={() => handleChange()} />
              </ExchangeWrapper>
            </Section>
            <Section title={titleSections.ADD_LIQUIDITY}>
              <AssetsSection>
                <Input
                  pallete="purple"
                  variant="amount"
                  style={{
                    cursor: 'default',
                    color: '--var(color-purple)',
                    opacity: 1,
                  }}
                  value={calculatedSecond || currentSecondInput.value}
                  onChange={(e) => {
                    currentSecondInput.onChange(e)
                    setLastChangedInput(2)
                  }}
                />
                <AssetLabel title={isSwap ? tokenName_1 : tokenName_2} assets_id={isSwap ? data.aid1 : data.aid2} />
              </AssetsSection>
            </Section>
          </AssetsContainer>
        )}
        <SectionWrapper>
          <PoolStat data={data} lp={currentLPToken} />
        </SectionWrapper>
        <ButtonBlock>
          <ButtonWrapper>
            <Button icon={CancelIcon} variant="cancel" onClick={() => onPreviousClick()}>
              Cancel
            </Button>
            <Button
              icon={DoneIcon}
              variant="approve"
              onClick={() => onAddLiquidity(requestData)}
              disabled={!checkIsValid || !amountInput_aid2.value || !amountInput_aid1.value || !calculated}
            >
              Add liquidity
            </Button>
          </ButtonWrapper>
        </ButtonBlock>
      </Container>
    </Window>
  );
};
