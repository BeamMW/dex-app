import { useStoreAccessor } from "@app/contexts/Store/StoreAccessorContext";
import { observer, useLocalObservable } from "mobx-react-lite";
import React, { MutableRefObject, useEffect } from "react";
import { Box, Button, Container, Flex, Grid } from "theme-ui";
import FilterSearch from "../FilterSearch";
import _ from "lodash";
import { Pool } from "@app/library/dex/Pool";
import { reaction, toJS, when } from "mobx";
import { createTransformer } from "mobx-utils";

enum Sort {
    All = 0,
    MyPosition = 1,
    AllEmptyPools = 2,
}

const PoolsFilter: React.FC<{setResultPoolsList: React.Dispatch<React.SetStateAction<Pool[]>>}> = observer(({setResultPoolsList}) => {

    const storeAccessor = useStoreAccessor();

    const poolsListFilter = useLocalObservable(() => ({
        currentPoolsList: null,
        filter: {
            filterState: storeAccessor.poolsStore.pools,
            filterPools(multipleOptions) {
                poolsListFilter.filter.filterState = multipleOptions.length ? _.filter(storeAccessor.poolsStore.pools, (pool: Pool) => 
                    _.some(multipleOptions, option => pool.getAssetDataById(option.value.id)) 
                ) : storeAccessor.poolsStore.pools;
            },
            clearFilter(){
                poolsListFilter.currentPoolsList = storeAccessor.poolsStore.pools;
            },
        },
        sort: {
            currentSort: Sort.All,
            sortByCurrentSort() {
                switch(poolsListFilter.sort.currentSort) {
                    case Sort.All: {
                        poolsListFilter.currentPoolsList = _.filter(poolsListFilter.filter.filterState, (pool: Pool) => !pool.isEmpty);
                        break;
                    }
                    case Sort.MyPosition: {
                        poolsListFilter.currentPoolsList = _.filter(poolsListFilter.filter.filterState, (pool: Pool) => pool.isEmpty && pool.isUserCreatorOfPool);
                        break;
                    }
                    case Sort.AllEmptyPools: {
                        poolsListFilter.currentPoolsList = _.filter(poolsListFilter.filter.filterState, (pool: Pool) => pool.isEmpty);
                        break;
                    }
                }
            },
        },
    }));

    const poolsListFilterTransformer = createTransformer((poolsListFilter: any) => ({
        currentPoolsList: poolsListFilter.currentPoolsList,
      }));
 
    useEffect(() => { 
        //initial
        const disposerStart = when(() => poolsListFilter.currentPoolsList === null, () => {
            setResultPoolsList(_.filter(storeAccessor.poolsStore.pools, (pool: Pool) => !pool.isEmpty));
        });
        const disposeFilter = reaction(() => poolsListFilter.filter.filterState, () => {
            console.log("change filter"); poolsListFilter.sort.sortByCurrentSort()
        });
        const disposeSort = reaction(() => poolsListFilter.sort.currentSort, () => {
            console.log("change sort"); poolsListFilter.sort.sortByCurrentSort()
        });
        const disposerCurrentPools = reaction(() => poolsListFilterTransformer(poolsListFilter), () => {
            setResultPoolsList(poolsListFilter.currentPoolsList);
        })

        return () => {
            console.log("dispose all!");
            disposerStart();
            disposeFilter();
            disposeSort();
            disposerCurrentPools();
        }
    }, []);

return <Container>
        <Flex sx={{
            justifyContent: "flex-start"
        }}>
            <Box>
                <FilterSearch handler={poolsListFilter.filter.filterPools} />
            </Box>
            <Flex sx={{

            }}>
                <Button variant={poolsListFilter.sort.currentSort !== Sort.All ? "sortButton" : "sortButtonSelected"} onClick={() => {
                    poolsListFilter.sort.currentSort = Sort.All
                }}>All Valid</Button>
                <Button variant={poolsListFilter.sort.currentSort !== Sort.MyPosition ? "sortButton" : "sortButtonSelected"} onClick={() => {
                    poolsListFilter.sort.currentSort = Sort.MyPosition
                }}>MyPositions</Button>
                <Button variant={poolsListFilter.sort.currentSort !== Sort.AllEmptyPools ? "sortButton" : "sortButtonSelected"} onClick={() => {
                    poolsListFilter.sort.currentSort = Sort.AllEmptyPools
                }}>All Empty Pools</Button>
            </Flex>
        </Flex>
    </Container>

})

export default PoolsFilter;