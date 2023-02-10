import React, {
  useCallback, useMemo, useState,
} from 'react';
import './index.scss';
import {
  Container, Loader, ReactSelect, Window,
} from '@app/shared/components';
import { PoolCard } from '@app/containers/Pools/components/PoolList';
import { placeHolder, SORT } from '@app/shared/constants';
import { useDispatch, useSelector } from 'react-redux';
import { selectFilter, selectOptions, selectPoolsList } from '@app/containers/Pools/store/selectors';
import { setFilter } from '@app/containers/Pools/store/actions';
import * as mainActions from '@app/containers/Pools/store/actions';
import { getFilterPools } from '@core/appUtils';
import { styled } from '@linaria/react';

const Sort = styled.ul`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HeaderContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const PoolList = styled.div`
  margin: 16px 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(298px, 298px));
  grid-gap: 10px;
  grid-auto-flow: row;
  width: 100%;
  justify-content: center;
  flex-grow: 1;
  @media (max-width: 934px) {
    grid-template-columns: repeat(3, 1fr);
    overflow: hidden;
  }
`;

const HeaderWrapperSort = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`;

const SortItem = styled.li`
  list-style: none;
`;
const SortItemLink = styled.button<{ active: boolean }>`
  background: transparent;
  border: none;
  float: left;
  display: block;
  color: ${({ active }) => (active ? 'white' : 'rgba(255,255,255, 0.3)')};
  font-family: 'SFProDisplay', sans-serif;
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
  padding: 4px 16px;
  cursor: pointer;
  text-transform: uppercase;
  border-bottom: ${({ active }) => (active ? '2px solid var(--color-green)' : 'transparent')};
  //TODO: BOX_SHADOW
  &:hover {
    border-bottom: 2px solid var(--color-green);
  }
`;
const WrapperSelect = styled.div`
width: 350px`;

export const PoolsList = () => {
  const data = useSelector(selectPoolsList());
  const options = useSelector(selectOptions());
  const currentFilter = useSelector(selectFilter());
  const [poolsList, setPoolList] = useState(data);
  const [filtered, setFiltered] = useState(null);

  const dispatch = useDispatch();

  const handleSort = (filter) => {
    dispatch(setFilter(filter));
    dispatch(mainActions.loadAppParams.request(null));
  };

  const onFilter = useCallback(
    (value) => {
      setFiltered(value);
    },
    [data, poolsList],
  );

  useMemo(() => {
    setPoolList(getFilterPools(filtered, data));
  }, [data, filtered]);
  return (
    <Window title="Pools" createPool>
      <Container main jystify="center">
        <HeaderContainer>

          <HeaderWrapperSort>
            <Sort>
              <WrapperSelect>
                <ReactSelect
                  options={options}
                  isClearable
                  onChange={(e) => onFilter(e)}
                  isIcon
                  placeholder={placeHolder.SEARCH}
                  customPrefix="custom-filter"
                />

              </WrapperSelect>

              {SORT.map((el) => (
                <SortItem key={el.value}>
                  <SortItemLink key={el.value} active={currentFilter === el.value} onClick={() => handleSort(el.value)}>
                    {el.name}
                  </SortItemLink>
                </SortItem>
              ))}
            </Sort>
          </HeaderWrapperSort>
        </HeaderContainer>

        {poolsList === null ? (
          <Loader isSearchable />
        ) : poolsList.length > 0 ? (
          <PoolList>
            {poolsList.map((item) => (
              <PoolCard data={item} key={`${item.aid1}_${item.aid2}_${item.kind}`} />
            ))}
          </PoolList>
        ) : (
          <Loader />
        )}
      </Container>
    </Window>
  );
};
