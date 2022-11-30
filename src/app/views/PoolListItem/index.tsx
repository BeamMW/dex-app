import { PoolKindDescText } from "@app/components/PoolKindDesc";
import useGetAssetMetaDataById from "@app/hooks/useGetAssetMetaDataById";
import { Pool } from "@app/library/dex/Pool";
import React from "react";
import { NavLink, useNavigate, useRoutes } from "react-router-dom";
import { Box, Container, Flex, Text } from "theme-ui";
import _ from "lodash";

const PoolListItem: React.FC<{pool: Pool}> = ({pool}) => {
    const navigate = useNavigate();

    const [assetA, assetB] = pool.getAssetsPair;
    const relation = assetB.amountInGroth.div(assetA.amountInGroth);

    return <Container 
        sx={{
            maxWidth: "450px",
        }}
        onClick={() => navigate("/pools/provide-liquidity")}>

            <Flex sx={{
            padding: "20px",
            borderRadius: "10px",
            background: "rgba(255,255,255,0.05)",
            opacity: (pool.isEmpty ? 0.5 : 1),
            flexDirection: "column",
            }}>
            <Flex sx={{
                justifyContent: "space-between"
            }}>
                <Flex sx={{
                    flexDirection: "column",
                    alignItems: "normal"
                }}>
                    <Box>
                       <Text>
                        {assetA.id} {assetA.meta.assetName}/{assetB.id} {assetB.meta.assetName}
                       </Text>
                    </Box>
                    <Box>
                        <PoolKindDescText kind={pool.poolType} />
                    </Box>
                </Flex>
                {/* <Flex>
                    image/image
                </Flex> */}
            </Flex>
            <Flex sx={{
                flexDirection: "column",
            }}>
                <Box>{assetA.amount.prettify(0)} {_.capitalize(assetA.meta.assetName)}</Box>
                <Box>{assetB.amount.prettify(0)} {_.capitalize(assetB.meta.assetName)}</Box>
                <Box>1 {assetA.meta.assetName} = {relation.eq(1) || !Number.isFinite(relation)? 1 : relation.prettify(2)} {assetB.meta.assetName}</Box>
            </Flex>
            {
                pool.isEmpty &&
                <Box>
                    <Text sx={{
                        fontStyle:"italic"
                    }}>This pool needs liquidity!</Text>
                </Box>
            }
            
        </Flex>
    </Container>

}

export default PoolListItem;