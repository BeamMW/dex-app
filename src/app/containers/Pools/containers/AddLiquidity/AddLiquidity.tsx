import React, { useEffect, useMemo, useState } from 'react';
import './index.scss';
import { IAddLiquidity } from '@core/types';
import {
  AssetsContainer,
  AssetsSection,
  Button,
  Container,
  Input,
  Section, Title,
  Window,
} from '@app/shared/components';
import {
  emptyPredict, fromGroths, numFormatter, onPredictValue, setDataRequest, toGroths,
} from '@core/appUtils';
import { useDispatch, useSelector } from 'react-redux';
import * as mainActions from '@app/containers/Pools/store/actions';
import {
  selectCurrentPool, selectPredirect,
} from '@app/containers/Pools/store/selectors';
import { useInput } from '@app/shared/hooks';
import { ROUTES, titleSections } from '@app/shared/constants';
import { CancelIcon, DoneIcon, IconExchange } from '@app/shared/icons';
import AssetLabel from '@app/shared/components/AssetLabel';
import { styled } from '@linaria/react';
import { useNavigate } from 'react-router-dom';

const ExchangeWrapper = styled.div`
  position: absolute;
  top: 71px;
  left: 435px;
`;
const SectionWrapper = styled.div`
  margin: 10px 0 40px 0;
  display: flex;
  justify-content: flex-start;
  width: 100%;
`;
const SectionContainer = styled.div`
  display: flex;
  width: 100%;
`;
const SideLeftWrap = styled.div`
  width: 225px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  height: 110px;
`;
const SideRightWrap = styled.div`
  width: 225px;
  margin-left: 20px;
`;
const LeftBlockPredict = styled.div`
display: flex;
  width: 100%;
`;
const TitleBlock = styled.div`
display: flex;
  flex-direction: column;
width: 100%;
`;
const AmountBlock = styled.div`
display: flex;
  flex-direction: column;
  width: 100%;
`;
const TitleSummary = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  color: rgba(255, 255, 255, 0.5);
  //text-transform: uppercase;
  margin-bottom: 14px;
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
const AmountSummary = styled(TitleSummary)`
  color: rgba(255, 255, 255, 1);
`;

const initialState = {
  asset_1: 0,
  asset_2: 0,
  liquid_3: 0,
};

export const AddLiquidity = () => {
  const data = useSelector(selectCurrentPool());
  const predictData = useSelector(selectPredirect());
  const [currentToken, setCurrentToken] = useState(data.aid1);
  const amountInput_aid1 = useInput(0);
  const amountInput_aid2 = useInput(0);
  const [requestData, setRequestData] = useState(null);
  const [isSwap, setIsSwap] = useState<boolean>(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [percent, setPercent] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tokenName_1 = `${data.metadata1.UN}`;
  const tokenName_2 = `${data.metadata2.UN}`;
  useEffect(() => {
    setIsEmpty(
      !!(!data.tok1 || !data.tok2),

    );
  }, []);

  const getValueInput_1 = () => {
    if (isEmpty) {
      return toGroths(Number(amountInput_aid1.value));
    }
    return currentToken === data.aid2 ? '0' : toGroths(Number(amountInput_aid1.value));
  };
  const getValueInput_2 = () => {
    if (isEmpty) {
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
    if (!isEmpty && predictData) {
      if (currentToken === data.aid1) {
        !emptyPredict(predictData, amountInput_aid1.value) ? amountInput_aid2.onPredict(fromGroths(predictData.tok2)) : amountInput_aid2.onPredict(0);
      } else {
        !emptyPredict(predictData, amountInput_aid2.value) ? amountInput_aid1.onPredict(fromGroths(predictData.tok1)) : amountInput_aid1.onPredict(0);
      }
    }
  }, [isSwap, amountInput_aid1.value, amountInput_aid2.value]);

  const handleChange = () => {
    setIsSwap(!isSwap);
  };

  useMemo(() => {
    if (amountInput_aid1.value !== 0 && amountInput_aid1.value !== 0) {
      dispatch(mainActions.onAddLiquidity.request(requestData));
    }
  }, [requestData]);

  const onAddLiquidity = (dataLiquid: IAddLiquidity): void => {
    dispatch(mainActions.onAddLiquidity.request(setDataRequest(dataLiquid)));
  };

  const currentInput = isSwap ? amountInput_aid2 : amountInput_aid1;

  const calculated = onPredictValue(currentInput, isSwap, predictData);

  const onPreviousClick = () => {
    navigate(ROUTES.POOLS.BASE);
  };

  return (
    <Window title="Add liquidity" backButton>
      <Container>
        {isEmpty ? (
          <AssetsContainer>
            {/* <Title variant="subtitle">Select Pair</Title> */}
            <Section title={titleSections.ADD_LIQUIDITY}>
              <AssetsSection>
                <Input
                  type="number"
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
                  type="number"
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
                  type="number"
                  value={currentInput.value}
                  variant="amount"
                  pallete="blue"
                  onChange={(e) => currentInput.onChange(e)}
                />
                <AssetLabel title={isSwap ? tokenName_2 : tokenName_1} assets_id={isSwap ? data.aid2 : data.aid1} />
              </AssetsSection>
            </Section>
            <ExchangeWrapper>
              <Button icon={IconExchange} variant="icon" onClick={() => handleChange()} />
            </ExchangeWrapper>
            <Section title={titleSections.ADD_LIQUIDITY}>
              <AssetsSection>
                <Input
                  disabled
                  pallete="purple"
                  variant="amount"
                  style={{ cursor: 'default', color: '--var(color-purple)', opacity: 1 }}
                  value={numFormatter(calculated)}
                />
                <AssetLabel title={isSwap ? tokenName_1 : tokenName_2} assets_id={isSwap ? data.aid1 : data.aid2} />
              </AssetsSection>

            </Section>
          </AssetsContainer>
        )}
        {/* // Create components for predirect */}
        <SectionWrapper>
          <Section>
            <SectionContainer>
              <SideLeftWrap>
                <Title>pool summary</Title>
                <LeftBlockPredict>
                  <TitleBlock>
                    <TitleSummary>{data.metadata1.UN}</TitleSummary>
                    <TitleSummary>{data.metadata2.UN}</TitleSummary>
                    <TitleSummary>Liquidity</TitleSummary>
                  </TitleBlock>
                  <AmountBlock>
                    <AmountSummary>{predictData ? fromGroths(predictData.tok1) : 0}</AmountSummary>
                    <AmountSummary>{predictData ? fromGroths(predictData.tok2) : 0}</AmountSummary>
                    <AmountSummary>{predictData ? fromGroths(predictData.ctl) : 0}</AmountSummary>
                  </AmountBlock>
                </LeftBlockPredict>
              </SideLeftWrap>
              <SideRightWrap>
                <Title>pool changes</Title>
                <LeftBlockPredict>
                  {/* <AmountBlock> */}
                  {/*  <AmountSummary>{predictData ? percent.asset_1 : 0}</AmountSummary> */}
                  {/*  <AmountSummary>{predictData ? percent.asset_2 : 0}</AmountSummary> */}
                  {/*  <AmountSummary>{predictData ? percent.liquid_3 : 0}</AmountSummary> */}
                  {/* </AmountBlock> */}
                </LeftBlockPredict>
              </SideRightWrap>
            </SectionContainer>
          </Section>
        </SectionWrapper>
        <ButtonBlock>
          <ButtonWrapper>
            <Button icon={CancelIcon} variant="cancel" onClick={() => onPreviousClick()}>
              Cancel
            </Button>
            <Button icon={DoneIcon} variant="approve" onClick={() => onAddLiquidity(requestData)}>
              Add liquidity
            </Button>
          </ButtonWrapper>
        </ButtonBlock>
      </Container>
    </Window>
  );
};
