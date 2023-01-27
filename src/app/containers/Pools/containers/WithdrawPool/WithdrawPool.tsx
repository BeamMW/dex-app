import React, { useMemo, useState } from "react";
import { ITrade } from "@core/types";
import { emptyPredict, fromGroths, setDataRequest, toGroths } from "@core/appUtils";
import { AssetsContainer, AssetsSection, Button, Input, Section, Title, Window, Container } from "@app/shared/components";
import { useInput } from "@app/shared/hooks";
import * as mainActions from "@app/containers/Pools/store/actions";
import { useDispatch, useSelector } from "react-redux";
import "./index.scss";
import {
  selectCurrentPool,
  selectPredirect,
} from "@app/containers/Pools/store/selectors";
import { titleSections } from "@app/shared/constants";


export const WithdrawPool = () => {
  const data = useSelector(selectCurrentPool());
  const predictData = useSelector(selectPredirect());
  const amountInput = useInput(0);
  const [requestData, setRequestData] = useState(null);
  const dispatch = useDispatch();


  useMemo(() => {
    setRequestData({
      aid1: data.aid1,
      aid2: data.aid2,
      kind: data.kind,
      ctl: toGroths(Number(amountInput.value)),
    });
  }, [amountInput.value]);

  useMemo(() => {
    if (amountInput.value !== 0) {
      dispatch(mainActions.onWithdraw.request(requestData));
    }
  }, [requestData, amountInput.value]);

  const onWithdraw = (data: ITrade) => {
    dispatch(mainActions.onWithdraw.request(setDataRequest(data)));
  };
  return (
    <Window title='Withdraw' backButton>
      <Container>
        <AssetsContainer variant='center'>
          <Section title={titleSections.ADD_LIQUIDITY_SEND}>
            <AssetsSection>
              <Input
                type="number"
                value={amountInput.value}
                variant='amount'
                pallete='blue'
                onChange={(e) => amountInput.onChange(e)}
              />
              <h4>{"AMML"}</h4>
            </AssetsSection>
          </Section>
        </AssetsContainer>
        <Section title={titleSections.TRADE_RECEIVE}>
          <AssetsSection>
            <Input
              type="number"
              disabled
              pallete='purple'
              variant='amount'
              style={{cursor: 'default', color: '--var(color-purple)', opacity: 1}}
              value={ emptyPredict(predictData, amountInput.value) ? '0' : fromGroths(predictData.tok1) }
            />
            <h4>{data.metadata1.N}</h4>
          </AssetsSection>
          <AssetsSection>
            <Input
              type="number"
              disabled
              pallete='purple'
              variant='amount'
              style={{cursor: 'default', color: '--var(color-purple)', opacity: 1}}
              value={ emptyPredict(predictData, amountInput.value) ? '0' : fromGroths(predictData.tok2) }
            />
            <h4>{data.metadata2.N}</h4>
          </AssetsSection>
        </Section>

        <div className="button-wrapper">
          <Button onClick={() => onWithdraw(requestData)}>Withdraw</Button>
        </div>
      </Container>
    </Window>
  );
};
