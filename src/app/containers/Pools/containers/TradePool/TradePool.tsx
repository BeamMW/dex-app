import React, { useEffect, useMemo, useState } from "react";
import { ITrade } from "@core/types";
import { emptyPredict, fromGroths, setDataRequest, toGroths } from "@core/appUtils";
import {
  AssetsContainer,
  AssetsSection,
  Button,
  Input,
  Section,
  Title,
  Window,
  Container,
  BackButton
} from "@app/shared/components";
import { useInput } from "@app/shared/hooks";
import * as mainActions from "@app/containers/Pools/store/actions";
import { useDispatch, useSelector } from "react-redux";
import "./index.scss";
import {
  selectCurrentPool,
  selectPredirect,
} from "@app/containers/Pools/store/selectors";
import { IconSwap } from "@app/shared/icons";
import { ROUTES, titleSections } from "@app/shared/constants";
import { useNavigate } from "react-router-dom";


export const TradePool = () => {
  const data = useSelector(selectCurrentPool());
  const predictData = useSelector(selectPredirect());
  const [currentToken, setCurrentToken] = useState(data.aid1);
  const [options, setOptions] = useState([]);
  // const [optionTwo, setOptionsTwo] = useState([]);
  const [isSwap, setIsSwap] = useState<boolean>(false);
  const amountInput = useInput(0);
  const [requestData, setRequestData] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const tokenName_1 = `${data.aid1} ${data.metadata1.N}`;
  const tokenName_2 = `${data.aid2} ${data.metadata2.N}`;

  console.log({ isSwap, currentToken })

  const handleChange =  () => {
    setIsSwap(!isSwap)
  }
  useEffect(()=>{
    setCurrentToken(!isSwap?data.aid1 : data.aid2)
  },[isSwap])

  useMemo(() => {
    setRequestData({
      aid1: currentToken,
      aid2: currentToken === data.aid1 ? data.aid2 : data.aid1,
      kind: data.kind,
      val1_buy: toGroths(Number(amountInput.value)),
    });
  }, [amountInput.value, currentToken]);
  console.log(requestData)

  useMemo(() => {
    if (amountInput.value !== 0) {
      dispatch(mainActions.onTradePool.request(requestData));
    }
  }, [requestData, amountInput.value]);

  const onTrade = (data: ITrade) => {
    dispatch(mainActions.onTradePool.request(setDataRequest(data)));
  };
  const onPreviousClick = () => {
    navigate(ROUTES.POOLS.BASE);
  };
  return (
   <Window title='trade' backButton>
     <Container>
      <AssetsContainer>
        <Section title={titleSections.TRADE_RECEIVE}>
          <AssetsSection>
          <Input
            type="number"
            value={amountInput.value}
            variant='amount'
            pallete='blue'
            onChange={(e) => amountInput.onChange(e)}
          />
            <h4>{isSwap ? tokenName_2 :tokenName_1}</h4>
          </AssetsSection>
        </Section>
        <Button variant='icon' type='button' icon={IconSwap} onClick={handleChange}> </Button>
        <Section title={titleSections.TRADE_SEND}>
          <AssetsSection>
            <Input
              type="number"
              disabled
              pallete='purple'
              variant='amount'
              style={{cursor: 'default', color: '--var(color-purple)', opacity: 1}}
              value={ emptyPredict(predictData, amountInput.value) ? '0' : fromGroths(predictData.pay) }
            />
            <h4>{isSwap ? tokenName_1 :tokenName_2}</h4>
          </AssetsSection>

        </Section>
      </AssetsContainer>
       <Section>
         <div className="amount-wrapper">
           <div className="amount-title">{data.metadata1.N}:</div>
           <div className="amount-value">{data.tok1}</div>
         </div>
         <div className="amount-wrapper">
           <div className="amount-title">{data.metadata2.N}:</div>
           <div className="amount-value">{data.tok2}</div>
         </div>
         <div className="amount-wrapper">
           <div className="amount-title">Buy:</div>
           <div className="amount-value">
             {predictData ? predictData.buy : "0"}
           </div>
         </div>
         <div className="amount-wrapper">
           <div className="amount-title">Fee-dao:</div>
           <div className="amount-value">
             {predictData ? predictData.fee_dao : "0"}
           </div>
         </div>
         <div className="amount-wrapper">
           <div className="amount-title">Fee-pool:</div>
           <div className="amount-value">
             {predictData ? predictData.fee_pool : "0"}
           </div>
         </div>
         <div className="amount-wrapper">
           <div className="amount-title">Pay:</div>
           <div className="amount-value">
             {predictData ? predictData.pay : "0"}
           </div>
         </div>
         <div className="amount-wrapper">
           <div className="amount-title">Pay-raw:</div>
           <div className="amount-value">
             {predictData ? predictData.pay_raw : "0"}
           </div>
         </div>
       </Section>

      <div className="button-wrapper">
        <Button onClick={() => onTrade(requestData)}>Trade</Button>
      </div>
     </Container>
   </Window>
  );
};
