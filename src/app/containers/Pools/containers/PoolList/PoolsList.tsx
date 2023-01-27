import React, { useCallback, useMemo, useState } from "react";
import "./index.scss";
import { Button, Title, Container, ReactSelect, Window } from "@app/shared/components";
import { PoolCard } from "@app/containers/Pools/components/PoolList";
import { useNavigate } from "react-router-dom";
import { ROUTES_PATH, SORT } from "@app/shared/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAssetsList, selectOptions,
  selectPoolsList
} from "@app/containers/Pools/store/selectors";
import { setFilter } from "@app/containers/Pools/store/actions";
import * as mainActions from "@app/containers/Pools/store/actions";
import { getFilterPools } from "@core/appUtils";
import { styled } from "@linaria/react";
const Sort = styled.div`
  max-width: 450px;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
`

const HeaderContainer = styled.div`
display: flex;
width: 100%;
justify-content: space-between;
`

const PoolList = styled.div`
{
  margin: 16px 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  //grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: repeat(5, 1fr);
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  min-width: 954px;
  width: 100%;
}`

const CreateButton = styled.div`
position: absolute;
  top:0;
  right: 0;
`

const HeaderWrapperSort = styled.div`
  display: flex;
  justify-content: space-between;
`
export const PoolsList = () => {
  const navigate = useNavigate();
  const data = useSelector(selectPoolsList());
  const assetsList = useSelector(selectAssetsList());
  const options = useSelector(selectOptions());
  const [poolsList, setPoolList] = useState(data);
  const [filtered, setFiltered] = useState([]);

  const dispatch = useDispatch();

  const createPoolNavigation = useCallback(() => {
    navigate(ROUTES_PATH.POOLS.CREATE_POOL);
  }, [navigate]);

  const handleSort = (filter) => {
    dispatch(setFilter(filter));
    dispatch(mainActions.loadAppParams.request(null))
  };

  const onFilter = (value) => {
      setFiltered(value)
  }
  useMemo(()=>{
      setPoolList(getFilterPools(filtered,data))
  },[data, filtered])

  console.log({ poolsList })

  // useEffect(()=>{
  //   if(filtered.length === 0){
  //      // setPoolList( data.filter(el, idx=>{
  //      //   el.aid1 || el.aid2 === filtered[idx]
  //      // }))
  //     setPoolList(data)
  //   } else {
  //   }
  // },[filtered, poolsList])

  return (
    <Window title='Pools' createPool>
      <Container>
      <HeaderContainer>
        <HeaderWrapperSort>
          <ReactSelect options={options} onChange={onFilter} isFilter isSearchable></ReactSelect>
          <Sort>
            {SORT.map((el) => <Button variant="link" onClick={() => handleSort(el.value)}>{el.name}
              </Button>
            )}
          </Sort>
        </HeaderWrapperSort>
      </HeaderContainer>

      <PoolList>
        {poolsList.length > 0 ? poolsList.map((item, idx) => (
          <PoolCard data={item} assets={assetsList} key={idx} />
        )) : <Container><div>Empty</div></Container>}
      </PoolList>
    </Container>
    </Window>
  );
};
