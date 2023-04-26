import React, { useMemo, useState } from 'react';
import './index.scss';
import {
  AssetsContainer, Button, Section, Window, Container, ReactSelect,
} from '@app/shared/components';
import { useDispatch, useSelector } from 'react-redux';
import { selectOptions } from '@app/containers/Pools/store/selectors';
import { ICreatePool, IOptions, Kind } from '@core/types';
import {
  kindSelect, placeHolder, ROUTES, titleSections,
} from '@app/shared/constants';
import * as mainActions from '@app/containers/Pools/store/actions';
import { styled } from '@linaria/react';
import { CancelIcon, DoneIcon } from '@app/shared/icons';
import { useNavigate } from 'react-router-dom';

const SectionWrapper = styled.div`
  margin: 10px 0 40px 0;
  display: flex;
  justify-content: flex-start;
  width: 100%;
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

export const CreatePool = () => {
  const options = useSelector(selectOptions());
  const [options2pair, setOptions2Pair] = useState([]);
  const [requestData, setRequestData] = useState(null);
  const [currentToken1, setCurrentToken1] = useState<IOptions>(null);
  const [currentToken2, setCurrentToken2] = useState<IOptions>(null);
  const [currentKind, setCurrentKind] = useState<IOptions>({ value: Kind.High, label: '1%' });
  const [isValidate, setIsValidate] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useMemo(() => {
    setRequestData([
      {
        aid1: currentToken1 && currentToken1.value,
        aid2: currentToken2 && currentToken2.value,
        kind: currentKind && currentKind.value,
      },
    ]);
  }, [currentToken1, currentToken2, currentKind]);
  const getOptionsSecondPare = (lists, value: IOptions) => {
    if (value) {
      if ((lists && value) || value.value === 0) {
        setOptions2Pair(lists.filter((item) => item.value > value.value));
      }
      return lists;
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


  useMemo(() => {
    getOptionsSecondPare(options, currentToken1);
  }, [currentToken1]);

  // const onChangeToken1 = useCallback((newValue) => {
  //   setCurrentToken1(newValue);
  // }, []);
  // const onChangeToken2 = (newValue) => {
  //   setCurrentToken2(newValue);
  // };
  // const onChangeKind = (newValue) => {
  //   setCurrentKind(newValue);
  // };
  const onPreviousClick = () => {
    navigate(ROUTES.POOLS.BASE);
  };

  const createPool = (dataReq: ICreatePool[]) => {
    dispatch(mainActions.onCreatePool.request(dataReq));
  };

  return (
    <Window title="Create pool" backButton>
      <Container variant="center">
        <AssetsContainer variant="space-between">
          <Section title={titleSections.CREATE_FIRST}>
            <ReactSelect
              options={options}
              onChange={(e) => setCurrentToken1(e)}
              isIcon
              placeholder={placeHolder.ASSETS}
            />
          </Section>
          <Section title={titleSections.CREATE_SECOND}>
            <ReactSelect
              options={options}
              onChange={(e) => setCurrentToken2(e)}
              isIcon
              placeholder={placeHolder.ASSETS}
            />
          </Section>
        </AssetsContainer>
        <SectionWrapper>
          <Section title={titleSections.FEE}>
            <div className="fees-wrapper">
              <ReactSelect
                options={kindSelect}
                onChange={(e) => setCurrentKind(e)}
                defaultValue={{ value: Kind.High, label: '1%' }}
                placeholder={placeHolder.FEE}
                customPrefix="custom-kind"
                isSearchable={false}
              />
            </div>
          </Section>
        </SectionWrapper>

        <ButtonBlock>
          <ButtonWrapper>
            <Button icon={CancelIcon} variant="cancel" onClick={onPreviousClick}>
              Cancel
            </Button>
            <Button icon={DoneIcon} variant="approve" onClick={() => createPool(requestData)} disabled={!isValidate}>
              Create Pool
            </Button>
          </ButtonWrapper>
        </ButtonBlock>
      </Container>
    </Window>
  );
};
