import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import './index.scss';
import {
  Container, Loader, ReactSelect, Window,
} from '@app/shared/components';
import { PoolCard } from '@app/containers/Pools/components/PoolList';
import { placeHolder, SORT } from '@app/shared/constants';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectFavorites, selectFilter, selectOptions, selectPoolsList,
} from '@app/containers/Pools/store/selectors';
import * as mainActions from '@app/containers/Pools/store/actions';
import { getFilterPools, isInArray } from '@core/appUtils';
import { styled } from '@linaria/react';
import { IPoolCard } from '@core/types';

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
  grid-template-columns: repeat(3, minmax(430px, 430px));
  grid-gap: 10px;
  grid-auto-flow: row;
  width: 100%;
  justify-content: center;
  flex-grow: 1;
  @media (max-width: 1330px) {
    grid-template-columns: repeat(2, minmax(430px, 430px));
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
  &:disabled {
    border-bottom: none;
    color: rgba(255, 255, 255, 0.1);
  }
`;
const WrapperSelect = styled.div`
  width: 350px;
`;

export const PoolsList = () => {
  const data = useSelector(selectPoolsList());
  const options = useSelector(selectOptions());
  const favorites = JSON.parse(localStorage.getItem('favorites'));
  const localFiltered = JSON.parse(sessionStorage.getItem('filtered'));
  const currentFilter = useSelector(selectFilter());
  const [poolsList, setPoolList] = useState(data);
  const [filtered, setFiltered] = useState(null);
  const storage = useSelector(selectFavorites());
  const dispatch = useDispatch();

  useEffect(() => {
    if (!favorites.length) {
      dispatch(mainActions.setFilter('all'));
    }
    if (localFiltered) {
      setFiltered(localFiltered);
    }
  }, []);

  const handleSort = (filter) => {
    dispatch(mainActions.setFilter(filter));
    dispatch(mainActions.loadAppParams.request(null));
  };
  // todo: store
  const onFilter = useCallback(
    (value) => {
      setFiltered(value);
      sessionStorage.setItem('filtered', JSON.stringify(value));
    },
    [data, poolsList],
  );
  useMemo(() => {
    if (favorites.length === 0) {
      handleSort('all');
    }
  }, [favorites.length]);

  useMemo(() => {
    setPoolList(getFilterPools(filtered, data));
  }, [data, filtered]);
  const checkFavorite = (poolCard: IPoolCard) => isInArray(poolCard, storage);

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
                  defaultValue={() => localFiltered}
                  isIcon
                  placeholder={placeHolder.SEARCH}
                  customPrefix="custom-filter"
                />
              </WrapperSelect>

              {SORT.map((el) => (
                <SortItem key={el.value}>
                  <SortItemLink
                    key={el.value}
                    active={currentFilter === el.value}
                    onClick={() => handleSort(el.value)}
                    disabled={!!(el.value === 'fav' && !favorites.length)}
                  >
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
              <PoolCard isFavorite={checkFavorite(item)} data={item} key={`${item.aid1}_${item.aid2}_${item.kind}`} />
            ))}
          </PoolList>
        ) : (
          <Loader />
        )}
      </Container>
    </Window>
  );
};
