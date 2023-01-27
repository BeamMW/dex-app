import React, { useEffect, useMemo, useState } from 'react';
import './index.scss';
import { IAddLiquidity } from '@core/types';
import { Button, Input, Title } from '@app/shared/components';
import { fromGroths, setDataRequest, toGroths } from '@core/appUtils';
import { useDispatch, useSelector } from 'react-redux';
import * as mainActions from '@app/containers/Pools/store/actions';
import { toast } from 'react-toastify';
import { selectCurrentPool, selectPredirect } from '@app/containers/Pools/store/selectors';
import { useInput } from '@app/shared/hooks';

export const AddLiquidity = () => {
  const data = useSelector(selectCurrentPool());
  const predictData = useSelector(selectPredirect());
  const amountInput_aid1 = useInput(0);
  const amountInput_aid2 = useInput(0);
  const [requestData, setRequestData] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    setRequestData({
      aid1: data.aid1,
      aid2: data.aid2,
      kind: data.kind,
      val1: toGroths(Number(amountInput_aid1.value)),
      val2: toGroths(Number(amountInput_aid2.value)),
    });
  }, [amountInput_aid2.value, amountInput_aid2.value]);

  useMemo(() => {
    if (amountInput_aid1.value !== 0 && amountInput_aid1.value !== 0) {
      dispatch(mainActions.onAddLiquidity.request(requestData));
    }
  }, [requestData]);
  const onAddLiquidity = (data: IAddLiquidity): void => {
    dispatch(mainActions.onAddLiquidity.request(setDataRequest(data)));
  };

  return (
    <div className="create-pool-wrapper">
      <Title variant="heading">Add Liquidity</Title>
      <div className="create-pool-assets-container">
        <Title variant="subtitle">Select Pair</Title>
        <div className="assets-selector-wrapper">
          <div className="asset-selector">
            <Input type="number" value={amountInput_aid1.value} onChange={(e) => amountInput_aid1.onChange(e)} />
            <div className="select-wrapper">
              <span className="select-content">
                {' '}
                {data.metadata1.N}
              </span>
            </div>
          </div>
          <div className="asset-selector">
            <Input type="number" value={amountInput_aid2.value} onChange={(e) => amountInput_aid2.onChange(e)} />
            <div className="select-wrapper">
              <span className="select-content">
                {' '}
                {data.metadata2.N}
              </span>
            </div>
          </div>
        </div>
        <div className="amount-wrapper">
          <div className="amount-title">
            {data.metadata1.N}
            :
          </div>
          <div className="amount-value">{predictData ? fromGroths(predictData.tok1) : '0'}</div>
        </div>
        <div className="amount-wrapper">
          <div className="amount-title">
            {data.metadata2.N}
            :
          </div>
          <div className="amount-value">{predictData ? fromGroths(predictData.tok2) : '0'}</div>
        </div>
        <div className="amount-wrapper">
          <div className="amount-title">Ctl:</div>
          <div className="amount-value">{predictData ? predictData.ctl : '0'}</div>
        </div>

        <div className="button-wrapper">
          <Button onClick={() => onAddLiquidity(requestData)}>Add Liquidity</Button>
        </div>
      </div>
    </div>
  );
};
