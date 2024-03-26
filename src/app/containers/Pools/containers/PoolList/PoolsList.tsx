import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import './index.scss';
import {
  Container, Loader, LoadingSkileton, ReactSelect, Window,
} from '@app/shared/components';
import { PoolCard } from '@app/containers/Pools/components/PoolList';
import { placeHolder, SORT } from '@app/shared/constants';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectFavorites, selectFilter, selectIsLoading, selectMyPools, selectOptions, selectPoolsList,
} from '@app/containers/Pools/store/selectors';
import * as mainActions from '@app/containers/Pools/store/actions';
import { getFilterPools, isInArray } from '@core/appUtils';
import { styled } from '@linaria/react';
import { IPoolCard } from '@core/types';
import {selectIsLoaded} from '@app/shared/store/selectors';

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
  justify-content: center;
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
  @media (max-width: 913px) {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    align-items: center;
  }
`;

const HeaderWrapperSort = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  max-width: 914px;
  @media (max-width: 913px) {
  flex-direction: column;
}
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
 @media (max-width: 913px) {
  margin-bottom: 15px;
}
`;
export const PoolsList = () => {
  const data = useSelector(selectPoolsList());
  const options = useSelector(selectOptions());
  const favorites = JSON.parse(localStorage.getItem('favorites'));
  const localFiltered = JSON.parse(sessionStorage.getItem('filtered'));
  const currentFilter = useSelector(selectFilter());
  const isLoading = useSelector(selectIsLoading());
  const [poolsList, setPoolList] = useState(data);
  const [filtered, setFiltered] = useState(null);
  const storage = useSelector(selectFavorites());
  const dispatch = useDispatch();
  const myPools = useSelector(selectMyPools());
  const isLoaded = useSelector(selectIsLoaded);

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
    // console.log(1)
    dispatch(mainActions.loadAppParams.request(null));
    dispatch(mainActions.setIsLoading(true));
  };
  // todo: store
  const onFilter = useCallback(
    (value) => {
      setFiltered(value);
      sessionStorage.setItem('filtered', JSON.stringify(value));
    },
    [data, poolsList],
  );
  // useEffect(() => {
  //   if (favorites.length === 0 || favorites.length === undefined || favorites.length === null) {
  //     handleSort('all');
  //   }
  // }, []);

  useMemo(() => {
    setPoolList(getFilterPools(filtered, data));
  }, [data, filtered]);
  const checkFavorite = (poolCard: IPoolCard) => isInArray(poolCard, storage);

  return (
    <>
      { data.length
        ? (
          <Window title="Pools" createPool>
            <Container main jystify="center">
              <HeaderContainer>
                <HeaderWrapperSort>
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
                  <Sort>

                    {SORT.map((el) => (
                      <SortItem key={el.value}>
                        <SortItemLink
                          key={el.value}
                          active={currentFilter === el.value}
                          onClick={() => handleSort(el.value)}
                          disabled={!!((el.value === 'fav' && !favorites.length) || (el.value === 'created' && !myPools.length))}
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
                  {isLoading
                    ? Array(10).fill(<LoadingSkileton />)
                    : poolsList.map((item) => (
                      <PoolCard isFavorite={checkFavorite(item)} data={item} key={`${item.aid1}_${item.aid2}_${item.kind}`} />
                    ))}
                </PoolList>
              ) : (
                <Loader />
              )}
            </Container>
          </Window>
        ) : <Loader />}
    </>
  );
};
