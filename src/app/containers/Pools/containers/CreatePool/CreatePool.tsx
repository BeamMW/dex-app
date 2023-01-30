import React, {
  useEffect, useMemo, useState,
} from 'react';
import './index.scss';
import {
  AssetsContainer, Button, Section, Window, Container, ReactSelect,
} from '@app/shared/components';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectOptions,
} from '@app/containers/Pools/store/selectors';
import { ICreatePool } from '@core/types';
import { kindSelect, titleSections } from '@app/shared/constants';
import * as mainActions from '@app/containers/Pools/store/actions';

// const Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   margin: 50px 0;
//   width: 100%;
//   min-height: 600px;
//   height: 100%;
//   justify-content: space-between;
// `;

export const CreatePool = () => {
  const options = useSelector(selectOptions());
  const [options2pair, setOptions2Pair] = useState([]);
  const [requestData, setRequestData] = useState(null);
  const [currentToken1, setCurrentToken1] = useState(null);
  const [currentToken2, setCurrentToken2] = useState(null);
  const [currentKind, setCurrentKind] = useState(2);
  const [isValidate, setIsValidate] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    setRequestData({
      aid1: currentToken1,
      aid2: currentToken2,
      kind: currentKind,
    });
  }, [currentToken1, currentToken2, currentKind]);

  // useEffect(() => {
  //   if (txStatus && txStatus === TxStatus.Completed) {
  //     let newPool;
  //     poolsList.filter((item) => {
  //       if (
  //         item.aid1 === requestData[0].aid1
  //         && item.aid2 === requestData[0].aid2
  //         && item.kind === requestData[0].kind
  //       ) {
  //         newPool = item;
  //       }
  //     });
  //   }
  // }, [txStatus]);
  const getOptionsSecondPare = (lists, value: number) => {
    if ((lists && value) || value === 0) {
      setOptions2Pair(lists.filter((item) => item.value > value));
    }
    return lists;
  };
  useMemo(() => {
    if (currentToken1 === null) {
      setIsValidate(false);
    } else if (currentToken2 === null) {
      setIsValidate(false);
    } else if (currentKind === null) {
      setIsValidate(false);
    } else setIsValidate(true);
  }, [currentToken1, currentToken2, currentKind]);

  const getKindValue = () => kindSelect.find((elem) => elem.value === currentKind);

  useEffect(() => {
    getOptionsSecondPare(options, currentToken1);
  }, [currentToken1]);

  const onChangeToken1 = (newValue) => {
    setCurrentToken1(newValue.value);
  };
  const onChangeToken2 = (newValue) => {
    setCurrentToken2(newValue.value);
  };
  const onChangeKind = (newValue) => {
    setCurrentKind(newValue.value);
  };

  const onCreatePool = (data: ICreatePool[]) => {
    dispatch(mainActions.onCreatePool.request(data));
  };

  return (
    <Window title="Create pool" backButton>
      <Container>
        <AssetsContainer>
          <Section title={titleSections.CREATE_FIRST}>
            <ReactSelect options={options} onChange={onChangeToken1} isIcon placeholder="Select a token" />
          </Section>
          <Section title={titleSections.CREATE_SECOND}>
            <ReactSelect options={options2pair} onChange={onChangeToken2} isIcon placeholder="Select a token" />
          </Section>
        </AssetsContainer>

        <Section title={titleSections.FEE}>
          <div className="fees-wrapper">
            <div className="information">
              Fee tier indicates the liquidity of the pool assets. It is recommended to use low tier for stable assets
              only.
            </div>
            <ReactSelect options={kindSelect} onChange={onChangeKind} value={getKindValue()} placeholder="Select fee" />
          </div>
        </Section>

        <div className="button-wrapper">
          <Button onClick={() => onCreatePool(requestData)} disabled={!isValidate}>
            Create Pool
          </Button>
        </div>
      </Container>
    </Window>
  );
};
