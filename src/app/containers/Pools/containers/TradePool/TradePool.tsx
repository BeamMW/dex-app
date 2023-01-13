import React, { useEffect, useMemo, useState } from "react";
import { ITrade } from "@core/types";
import { setDataRequest, toGroths } from "@core/appUtils";
import { Button, Input, Title } from "@app/shared/components";
import Select from "react-select";
import { useInput } from "@app/shared/hooks";
import * as mainActions from "@app/containers/Pools/store/actions";
import { useDispatch, useSelector } from "react-redux";
import "./index.scss";
import { toast } from "react-toastify";
import {
  selectCurrentPool,
  selectErrorMessage,
  selectPredirect,
} from "@app/containers/Pools/store/selectors";

export const TradePool = () => {
  const data = useSelector(selectCurrentPool());
  const predictData = useSelector(selectPredirect());
  const [currentToken, setCurrentToken] = useState(data.aid1);
  const [options, setOptions] = useState([]);
  const error = useSelector(selectErrorMessage());
  const amountInput = useInput(0);
  const [requestData, setRequestData] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setOptions([
      { label: data.metadata1.N, value: data.aid1 },
      { label: data.metadata2.N, value: data.aid2 },
    ]);
  }, []);
  const onChangeToken = (newValue) => {
    setCurrentToken(newValue.value);
  };
  const getValue = () => {
    return options.find((elem) => elem.value === currentToken);
  };

  useMemo(() => {
    setRequestData({
      aid1: currentToken,
      aid2: currentToken === data.aid1 ? data.aid2 : data.aid1,
      kind: data.kind,
      val1_buy: toGroths(Number(amountInput.value)),
    });
  }, [amountInput.value, currentToken]);

  useMemo(() => {
    if (amountInput.value !== 0) {
      dispatch(mainActions.onTradePool.request(requestData));
    }
  }, [requestData]);

  useMemo(() => {
    if (error) {
      toast(error);
    }
  }, [!error]);
  const onTrade = (data: ITrade) => {
    dispatch(mainActions.onTradePool.request(setDataRequest(data)));
  };
  return (
    <div className="create-pool-wrapper">
      <Title variant="heading">Trade</Title>
      <div className="create-pool-assets-container">
        <Title variant="subtitle">Select token</Title>
        <div className="assets-selector-wrapper">
          <div className="asset-selector">
            <Input
              type="number"
              value={amountInput.value}
              onChange={(e) => amountInput.onChange(e)}
            />
            <div className="select-wrapper">
              <Select
                classNamePrefix="custom-select"
                options={options}
                value={getValue()}
                onChange={onChangeToken}
              />
              {/*<span className="select-content"> {data.metadata1.N}</span>*/}
            </div>
          </div>
        </div>
      </div>
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
      <div className="button-wrapper">
        <Button onClick={() => onTrade(requestData)}>Trade</Button>
      </div>
    </div>
  );
};
