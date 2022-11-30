import { Title, TitleContainer } from "@app/components/PageTitle/PageTitle.style";
import { Pool } from "@app/library/dex/Pool";
import { LinkText } from "@app/views/navTabs/Tabs.style";
import PoolListItem from "@app/views/PoolListItem";
import PoolsFilter from "@app/views/PoolsFilter";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { Button, Container, Flex, Grid } from "theme-ui";
import { CheckShieldIcon, PullStatsIcon } from "../../../../html/app/assets/icons";
import FadeIn from 'react-fade-in';

const PoolsList:React.FC<{}> = observer(() => {
    const [resultPoolsList, setResultPoolsList] = useState<Pool[]>([]);
    const [, rerender] = useReducer(p => !p, false);

    useEffect(() => {
        console.log("resultPoolsList", toJS(resultPoolsList));
        rerender()
    }, [resultPoolsList])

    return <Container>
                <TitleContainer>
                    <Title>
                    Pools
                    </Title>
                </TitleContainer>
                <Flex sx={{
                    justifyContent: "space-between",
                    marginBottom: "2rem"
                }}>
                    <PoolsFilter setResultPoolsList={setResultPoolsList} />
                <Button
                variant='link'
                pallete='opacity'
                sx={{
                    whiteSpace: "nowrap",

                }}
                >
                    <Flex sx={{justifyContent: 'center'}}>
                        <NavLink to={`/create-pool`} style={{textDecoration: "none"}}>
                        <PullStatsIcon/>&nbsp;&nbsp;<LinkText>Create pool</LinkText>
                        </NavLink>
                    </Flex>
                </Button>
                </Flex>
                <FadeIn>
                <Grid gap={2}  sx={{
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gridTemplateRows: "repeat(2, 1fr)",
                    gridColumnGap: "1rem",
                    gridRowGap: "1rem",
                }}>
                    {resultPoolsList.map((pool: Pool, i: number) => <PoolListItem key={`pool-${i}`} pool={pool} />)}
                </Grid>
                </FadeIn>
            </Container>;
});

export default PoolsList;