import React, { useEffect, useMemo, useState } from "react";
import "./index.scss";
import { IAddLiquidity, IPoolCard, IPredict } from "@core/types";
import {
  AssetsContainer,
  AssetsSection,
  Button,
  Container,
  Input,
  Section,
  Title,
  Window
} from "@app/shared/components";
import { emptyPredict, fromGroths, numFormatter, onPredictValue, setDataRequest, toGroths } from "@core/appUtils";
import { useDispatch, useSelector } from "react-redux";
import * as mainActions from "@app/containers/Pools/store/actions";
import {
  selectCurrentPool, selectPredirect,
} from "@app/containers/Pools/store/selectors";
import {useInput} from "@app/shared/hooks";
import { titleSections } from "@app/shared/constants";
import { IconSwap } from "@app/shared/icons";

export const AddLiquidity = () => {
  const data = useSelector(selectCurrentPool());
  const predictData = useSelector(selectPredirect());
  const [currentToken, setCurrentToken] = useState(data.aid1);
  const amountInput_aid1 = useInput(0)
  const amountInput_aid2 = useInput(0)
  const [requestData, setRequestData] = useState(null);
  const [isSwap, setIsSwap] = useState<boolean>(false);
  const [isEmpty, setIsEmpty] = useState(true)
  const dispatch = useDispatch();
  const tokenName_1 = `${data.aid1} ${data.metadata1.N}`;
  const tokenName_2 = `${data.aid2} ${data.metadata2.N}`;

  useEffect(()=>{
    setIsEmpty(!(data.tok1 || data.tok2 !== 0))
  },[])

  const getValueInput_1 = () => {
    if(isEmpty){
      return toGroths(Number(amountInput_aid1.value))
    }
    return  currentToken === data.aid2 ? '0' : toGroths(Number(amountInput_aid1.value))
  }
  const getValueInput_2 = () => {
    if(isEmpty){
      return toGroths(Number(amountInput_aid2.value))
    }
    return  currentToken === data.aid1 ? '0' : toGroths(Number(amountInput_aid2.value))
  }


  useEffect(()=>{
    setCurrentToken(!isSwap?data.aid1 : data.aid2)
  },[isSwap])

  useEffect(() => {
    setRequestData({
      aid1: data.aid1,
      aid2: data.aid2,
      kind: data.kind,
      val1: getValueInput_1(),
      val2: getValueInput_2(),
    });
  }, [amountInput_aid1.value, amountInput_aid2.value, isSwap]);
  console.log(requestData, isSwap)


  useEffect(()=>{
    if(!isEmpty && predictData){
      if(currentToken === data.aid1){
        !emptyPredict(predictData, amountInput_aid1.value) ? amountInput_aid2.onPredict(fromGroths(predictData.tok2)) : amountInput_aid2.onPredict(0);
      } else {
        !emptyPredict(predictData, amountInput_aid2.value) ? amountInput_aid1.onPredict(fromGroths(predictData.tok1)) : amountInput_aid1.onPredict(0);
      }
    }
  },[isSwap, amountInput_aid1.value, amountInput_aid2.value])

  const handleChange =  () => {
    setIsSwap(!isSwap)
  }

  useMemo(() => {
    if (amountInput_aid1.value !== 0 && amountInput_aid1.value !== 0) {
      dispatch(mainActions.onAddLiquidity.request(requestData));
    }
  }, [requestData]);

  const onAddLiquidity = (data: IAddLiquidity): void => {
    dispatch(mainActions.onAddLiquidity.request(setDataRequest(data)));
  };

  const currentInput = isSwap ? amountInput_aid2 : amountInput_aid1

  const calculated = onPredictValue(currentInput, isSwap, predictData)

  return (
    <Window title='Add liquidity' backButton>
      <Container>
        {isEmpty ?(<AssetsContainer>
          {/*<Title variant="subtitle">Select Pair</Title>*/}
          <Section title={titleSections.ADD_LIQUIDITY}>
            <AssetsSection>
              <Input
                type="number"
                variant="amount"
                pallete="purple"
                value={amountInput_aid1.value}
                onChange={(e) => amountInput_aid1.onChange(e)}
              />
              <div className="select-wrapper">
                <span className="select-content"> {tokenName_1}</span>
              </div>
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
              <div className="select-wrapper">
                <span className="select-content"> {tokenName_2}</span>
              </div>
            </AssetsSection>
          </Section>
        </AssetsContainer>): (
          <AssetsContainer >
            <Section title={titleSections.ADD_LIQUIDITY_SEND}>
              <AssetsSection>
                <Input
                  type="number"
                  value={ currentInput.value }
                  variant='amount'
                  pallete='blue'
                  onChange={(e) => currentInput.onChange(e)}
                />
                <h4>{isSwap ? tokenName_2 : tokenName_1}</h4>
              </AssetsSection>
            </Section>
            <Button variant='icon' type='button' icon={IconSwap} onClick={handleChange}> </Button>
            <Section title={titleSections.TRADE_SEND}>
              <AssetsSection>
                <Input
                  disabled
                  pallete='purple'
                  variant='amount'
                  style={{cursor: 'default', color: '--var(color-purple)', opacity: 1}}
                  value={numFormatter(calculated)}
                />
                <h4>{isSwap ? tokenName_1 : tokenName_2}</h4>
              </AssetsSection>

            </Section>
          </AssetsContainer>
        )}
        {/*// Create components for predirect*/}
        <Section>
          <div className="amount-wrapper">
            <div className="amount-title">{tokenName_1}:</div>
            <div className="amount-value">
              {!predictData || currentInput.value == 0 ? 0 : fromGroths(predictData.tok1)}
            </div>
          </div>
          <div className="amount-wrapper">
            <div className="amount-title">{tokenName_2}:</div>
            <div className="amount-value">
              {!predictData || currentInput.value == 0 ? 0 : fromGroths(predictData.tok2)}
            </div>
          </div>
          <div className="amount-wrapper">
            <div className="amount-title">Ctl:</div>
            <div className="amount-value">
              {!predictData || currentInput.value == 0 ? 0 : fromGroths(predictData.ctl)}
            </div>
          </div>
        </Section>
        <Button onClick={() => onAddLiquidity(requestData)}>
          Add Liquidity
        </Button>
      </Container>
    </Window>
  );
};
